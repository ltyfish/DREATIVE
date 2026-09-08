import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export interface MediaInspectOptions {
  input: string; out: string; samples?: number; start?: number; duration?: number;
}
interface Probe {
  width: number; height: number; duration: number | null; codec: string;
}
interface Frame extends Probe { file: string; source: string; requestedSeconds: number | null; bytes: number }
const IMAGE = /\.(png|jpe?g|webp|avif|bmp)$/i;

function execute(binary: string, args: string[]): string {
  const result = spawnSync(binary, args, { encoding: "utf8", timeout: 30_000,
    maxBuffer: 2 * 1024 * 1024, windowsHide: true, shell: false });
  if (result.error) throw new Error(`${binary}: ${result.error.message}. Install FFmpeg/ffprobe or put them on PATH.`);
  if (result.status !== 0) throw new Error(`${binary} failed: ${result.stderr.slice(-1800)}`);
  return result.stdout;
}

function probe(file: string): Probe {
  const data = JSON.parse(execute("ffprobe", ["-v", "error", "-protocol_whitelist", "file,pipe",
    "-select_streams", "v:0", "-show_entries", "stream=width,height,codec_name,duration:format=duration",
    "-of", "json", file]));
  const stream = data.streams?.[0];
  if (!stream || !(stream.width > 0) || !(stream.height > 0)) throw new Error(`No decodable visual stream: ${file}`);
  const duration = Number(stream.duration ?? data.format?.duration);
  return { width: stream.width, height: stream.height, codec: stream.codec_name,
    duration: Number.isFinite(duration) && duration > 0 ? duration : null };
}

/** Local, bounded production aid. No download, license inference, or quality score. */
export function inspectMedia(options: MediaInspectOptions) {
  const input = path.resolve(options.input), out = path.resolve(options.out);
  const count = options.samples ?? 9, start = options.start ?? 0;
  if (!Number.isInteger(count) || count < 2 || count > 24) throw new Error("samples must be an integer from 2 to 24");
  if (!Number.isFinite(start) || start < 0) throw new Error("start must be a finite nonnegative number");
  if (options.duration !== undefined && (!Number.isFinite(options.duration) || options.duration <= 0 || options.duration > 60))
    throw new Error("duration must be greater than 0 and at most 60 seconds");
  if (!fs.existsSync(input)) throw new Error(`Input does not exist: ${input}`);
  // Always use a fresh destination, including after a failed attempt; originals
  // and prior inspection evidence cannot be overwritten by this command.
  if (fs.existsSync(out)) throw new Error(`Output already exists; choose a new directory: ${out}`);
  const directory = fs.statSync(input).isDirectory();
  if (directory && (start !== 0 || options.duration !== undefined)) throw new Error("start/duration apply to a video file, not an image directory");
  let selected: Array<{ source: string; seconds: number | null; info: Probe }>;
  let selection: string;
  if (directory) {
    const files = fs.readdirSync(input, { withFileTypes: true })
      .filter((entry) => entry.isFile() && IMAGE.test(entry.name))
      .map((entry) => path.join(input, entry.name))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    if (!files.length) throw new Error("No supported still images in the input directory");
    const n = Math.min(count, files.length);
    const picked = Array.from({ length: n }, (_, i) => files[n === 1 ? 0 : Math.round(i * (files.length - 1) / (n - 1))]);
    selected = picked.map((source) => ({ source, seconds: null, info: probe(source) }));
    selection = `${n} of ${files.length} images, evenly selected in numeric filename order; this is not a runtime sequence manifest`;
  } else {
    if (!fs.statSync(input).isFile()) throw new Error("Input must be a regular file or image directory");
    const info = probe(input);
    if (IMAGE.test(input)) {
      if (start !== 0 || options.duration !== undefined) throw new Error("start/duration require a video");
      selected = [{ source: input, seconds: null, info }];
      selection = "Single still image";
    } else {
      if (info.duration === null) throw new Error("Video duration is unknown; remux or trim the source before inspection");
      if (start >= info.duration) throw new Error("start must be before the end of the video");
      const span = Math.min(options.duration ?? 10, info.duration - start);
      // Sample bin centers: avoid seeking beyond the final decodable frame.
      selected = Array.from({ length: count }, (_, i) => ({ source: input,
        seconds: start + span * (i + .5) / count, info }));
      selection = `${count} requested seek positions in ${start.toFixed(3)}–${(start + span).toFixed(3)} seconds; inspect endpoints and adjacent frames separately when continuity matters`;
    }
  }
  fs.mkdirSync(out, { recursive: true });
  const frames: Frame[] = [];
  for (const [index, item] of selected.entries()) {
    const file = `frame-${String(index + 1).padStart(2, "0")}.jpg`;
    execute("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-n",
      "-protocol_whitelist", "file,pipe", ...(item.seconds === null ? [] : ["-ss", String(item.seconds)]),
      "-i", item.source, "-map", "0:v:0", "-frames:v", "1", "-an",
      "-vf", "scale=480:360:force_original_aspect_ratio=decrease,pad=480:360:(ow-iw)/2:(oh-ih)/2,setsar=1",
      "-q:v", "2", path.join(out, file)]);
    if (!fs.existsSync(path.join(out, file)) || fs.statSync(path.join(out, file)).size === 0)
      throw new Error(`No frame decoded at ${item.seconds}: ${item.source}`);
    frames.push({ file, source: item.source, requestedSeconds: item.seconds,
      bytes: fs.statSync(item.source).size, ...item.info });
  }
  const columns = Math.min(3, frames.length), rows = Math.ceil(frames.length / columns);
  execute("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-n",
    "-protocol_whitelist", "file,pipe", "-start_number", "1", "-i", path.join(out, "frame-%02d.jpg"),
    "-vf", `tile=${columns}x${rows}:nb_frames=${frames.length}:padding=8:margin=8`,
    "-frames:v", "1", "-q:v", "2", path.join(out, "contact-sheet.jpg")]);
  const report = { input, selection, frames, contactSheet: "contact-sheet.jpg",
    limits: "Requested seek positions are not exact frame timestamps. Stills cannot prove pacing, seek latency, seamless loops, rights, or visual quality. Preview is letterboxed; inspect the actual layout crop separately." };
  fs.writeFileSync(path.join(out, "inspection.json"), `${JSON.stringify(report, null, 2)}\n`);
  const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  fs.writeFileSync(path.join(out, "index.html"), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Media inspection</title>
<style>body{font:16px system-ui;margin:24px;background:#171717;color:#eee}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{overflow-wrap:anywhere;padding:8px 0}small{display:block;color:#bbb}</style>
<h1>Media inspection</h1><p>${escape(selection)}</p><main>${frames.map((frame, i) => `<figure><a href="${frame.file}"><img src="${frame.file}" alt="Inspection frame ${i + 1}"></a><figcaption>${i + 1}. ${escape(path.basename(frame.source))}<small>${frame.requestedSeconds === null ? "Still" : `Requested ${frame.requestedSeconds.toFixed(3)}s`} · ${frame.width} × ${frame.height} · ${(frame.bytes / 1048576).toFixed(2)} MiB source</small></figcaption></figure>`).join("")}</main><p>${escape(report.limits)}</p>`);
  return { ...report, out };
}
