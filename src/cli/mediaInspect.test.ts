import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { inspectMedia } from "./mediaInspect.js";

const ffmpegAvailable = ["ffmpeg", "ffprobe"].every((name) => spawnSync(name, ["-version"], { windowsHide: true }).status === 0);
const fixture = () => fs.mkdtempSync(path.join(os.tmpdir(), "dreative-media-"));
function ffmpeg(args: string[]) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", ...args], { encoding: "utf8", windowsHide: true, timeout: 30_000 });
  assert.equal(result.status, 0, result.stderr);
}

test("media inspection rejects invalid ranges and protects existing output", () => {
  const dir = fixture();
  try {
    for (const samples of [0, 1, 25, 2.5, NaN])
      assert.throws(() => inspectMedia({ input: dir, out: path.join(dir, "out"), samples }), /samples/);
    assert.throws(() => inspectMedia({ input: dir, out: dir }), /already exists/);
    for (const duration of [0, -1, 61, Infinity])
      assert.throws(() => inspectMedia({ input: dir, out: path.join(dir, "out"), duration }), /duration/);
    assert.throws(() => inspectMedia({ input: dir, out: path.join(dir, "out"), start: NaN }), /start/);
    assert.throws(() => inspectMedia({ input: dir, out: path.join(dir, "out"), start: 1 }), /video/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("actual video decoding produces bounded frames, contact sheet and metadata without changing source", { skip: !ffmpegAvailable }, () => {
  const dir = fixture();
  try {
    const input = path.join(dir, "source with spaces.mp4"), out = path.join(dir, "review");
    ffmpeg(["-f", "lavfi", "-i", "testsrc2=size=320x180:rate=10:duration=2", "-c:v", "mpeg4", input]);
    const original = fs.readFileSync(input);
    const report = inspectMedia({ input, out, samples: 3, start: .5, duration: 1 });
    assert.equal(report.frames.length, 3);
    assert.ok(report.frames.every((f) => f.width === 320 && f.height === 180 && f.requestedSeconds! > .5 && f.requestedSeconds! < 1.5));
    assert.deepEqual(fs.readFileSync(input), original);
    for (const frame of [...report.frames.map((f) => f.file), report.contactSheet]) {
      const bytes = fs.readFileSync(path.join(out, frame));
      assert.equal(bytes.readUInt16BE(0), 0xffd8);
      assert.ok(bytes.length > 1000);
    }
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, "inspection.json"), "utf8")).frames, report.frames);
    assert.throws(() => inspectMedia({ input, out: path.join(dir, "beyond"), start: 3 }), /end/);
    const invalid = path.join(dir, "fake.mp4"); fs.writeFileSync(invalid, "<html>Access denied</html>");
    assert.throws(() => inspectMedia({ input: invalid, out: path.join(dir, "bad") }), /ffprobe failed/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("image sets preserve numeric ordering and literal filenames without shell interpretation", { skip: !ffmpegAvailable }, () => {
  const dir = fixture();
  try {
    const images = path.join(dir, "images"); fs.mkdirSync(images);
    const seed = path.join(dir, "seed.jpg");
    ffmpeg(["-f", "lavfi", "-i", "color=red:size=160x120", "-frames:v", "1", seed]);
    for (const name of ["item-10.jpg", "item-2.jpg", "item-1.jpg", "x & echo $literal.jpg"])
      fs.copyFileSync(seed, path.join(images, name));
    const report = inspectMedia({ input: images, out: path.join(dir, "review"), samples: 4 });
    assert.deepEqual(report.frames.map((f) => path.basename(f.source)), ["item-1.jpg", "item-2.jpg", "item-10.jpg", "x & echo $literal.jpg"]);
    assert.ok(fs.readFileSync(path.join(report.out, "index.html"), "utf8").includes("x &amp; echo $literal.jpg"));
    const still = inspectMedia({ input: seed, out: path.join(dir, "single") });
    assert.equal(still.frames.length, 1);
    assert.equal(still.frames[0].requestedSeconds, null);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
