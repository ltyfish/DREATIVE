import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("section")).toHaveCount(12);
});

test("pin progress preserves entry and release compositions on desktop and mobile", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const chapter = page.locator("#pinned-chapter");
    for (const [progress, state] of [[0, "0"], [.5, "1"], [1, "2"], [0, "0"]] as const) {
      await chapter.evaluate((element, p) => {
        const start = element.getBoundingClientRect().top + scrollY;
        scrollTo(0, start + (element.getBoundingClientRect().height - innerHeight) * p);
      }, progress);
      await expect(chapter).toHaveAttribute("data-active-state", state);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(chapter).toHaveAttribute("data-active-state", "all");
    for (const state of await chapter.locator("[data-chapter-state]").all()) {
      await expect(state).toBeVisible();
      await expect(state).not.toHaveAttribute("aria-hidden", "true");
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(chapter).not.toHaveAttribute("data-active-state", "all");
  }
});

test("kinetic text waits for its viewport and responds to a live motion preference", async ({ page }) => {
  const heading = page.locator("#kinetic-type h2");
  await expect(heading).toHaveAttribute("data-state", "pending");
  await page.waitForTimeout(850); // An offscreen mount animation would already have ended.
  await expect(heading).toHaveAttribute("data-state", "pending");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute("data-state", "active");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(heading).toHaveAttribute("data-state", "resolved");
  await page.evaluate(() => globalThis.dreativeFixture.destroy());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(heading).not.toHaveAttribute("data-state", /.+/);
  await expect(heading).toHaveText("Language remains the interface");
});

test("authored tracks hold, overlap and reverse without accumulating state", async ({ page }) => {
  const result = await page.evaluate(() => {
    const { motionTrack } = globalThis.dreativeFixture.systems;
    const stops = [{ at: 0, value: 0 }, { at: .2, value: 0 },
      { at: .6, value: 100, ease: (t) => t * t }, { at: 1, value: 100 }];
    const image = motionTrack(stops);
    const type = motionTrack([{ at: .4, value: 0 }, { at: .8, value: -80 }]);
    stops[0].value = 999; // Caller mutations must not corrupt a compiled track.
    const frames = [0, .1, .4, .6, 1, .4, -1, 2].map((p) => [image(p), type(p)]);
    const invalid = [[], [{ at: 0, value: 0 }], [{ at: .5, value: 1 }, { at: .5, value: 2 }],
      [{ at: 0, value: 0 }, { at: 2, value: 1 }], [{ at: 0, value: NaN }, { at: 1, value: 1 }]];
    return { frames, rejects: invalid.map((stops) => { try { motionTrack(stops); return false; } catch { return true; } }) };
  });
  expect(result.rejects.every(Boolean)).toBeTruthy();
  expect(result.frames[0]).toEqual([0, 0]);
  expect(result.frames[1]).toEqual([0, 0]);
  expect(result.frames[2][0]).toBeCloseTo(25);
  expect(result.frames[3][1]).toBeCloseTo(-40);
  expect(result.frames[4]).toEqual([100, -80]);
  expect(result.frames[5]).toEqual(result.frames[2]);
  expect(result.frames[6]).toEqual([0, 0]);
  expect(result.frames[7]).toEqual([100, -80]);
});

test("native foundations render without runtime errors and expose meaningful primary states", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  await expect(page.locator("#persistent-object")).toBeHidden();
  await page.locator("#persistent-stage").scrollIntoViewIfNeeded();
  await expect(page.locator("#persistent-object")).toBeVisible();

  await page.locator("#scroll-progress").scrollIntoViewIfNeeded();
  await expect(page.locator("#scroll-progress output")).not.toHaveText("0%");

  const rail = page.locator("#drag-rail .rail");
  await rail.scrollIntoViewIfNeeded();
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  const spatial = page.locator("#spatial-gallery .field");
  await spatial.scrollIntoViewIfNeeded();
  await spatial.locator("[data-spatial-item]").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(spatial.locator("[data-spatial-item]").nth(1)).toHaveAttribute("data-selected", "true");

  const visualBaseline = await page.screenshot({
    type: "jpeg",
    quality: 78,
    clip: { x: 0, y: 0, width: 720, height: 360 },
  });
  expect(visualBaseline).toMatchSnapshot("native-foundations-header.jpeg", { maxDiffPixelRatio: 0.01 });
  expect(errors).toEqual([]);
});

test("pinned, shared-element, and frame foundations exercise forward, reverse, fallback, and focus behavior", async ({ page }) => {
  const chapter = page.locator("#pinned-chapter");
  await chapter.scrollIntoViewIfNeeded();
  const firstState = await chapter.getAttribute("data-active-state");
  await chapter.evaluate((element) => scrollTo(0, element.offsetTop + (element.offsetHeight - innerHeight) * .8));
  await expect.poll(() => chapter.getAttribute("data-active-state")).not.toBe(firstState);
  const forwardState = await chapter.getAttribute("data-active-state");
  await chapter.evaluate((element) => scrollTo(0, element.offsetTop - innerHeight + 1));
  await expect.poll(() => chapter.getAttribute("data-active-state")).not.toBe(forwardState);
  await page.locator("#shared-element-handoff").evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect.poll(async () => {
    const box = await chapter.locator(".sticky").boundingBox();
    return box?.y ?? 0;
  }).toBeLessThan(0);

  const handoff = page.locator("#shared-element-handoff button");
  await handoff.focus();
  await handoff.click();
  await expect(handoff).toBeFocused();
  await expect(page.locator("[data-shared]")).toHaveCSS("view-transition-name", "dreative-subject");

  const canvas = page.locator("#frame-sequence canvas");
  await page.evaluate(() => globalThis.dreativeFixture.sequence.setProgress(0.5));
  await expect(canvas).toHaveAttribute("data-frame", "1");
  await page.evaluate(() => globalThis.dreativeFixture.sequence.setProgress(1));
  await expect(canvas).toHaveAttribute("data-frame", "2");
  await page.evaluate(async () => {
    const probe = document.createElement("canvas");
    probe.style.cssText = "width:100px;height:100px";
    document.body.appendChild(probe);
    globalThis.dreativeFixture.systems.mountFrameSequence(probe, {
      frames: ["data:image/png;base64,broken"],
      onMissing: () => { probe.dataset.missingCallback = "called"; },
    });
  });
  await expect(page.locator("canvas[data-missing-callback]")).toHaveAttribute("data-state", "missing");
});

test("adaptive canvas, video handoff, and media trail suspend, resolve, fail safely, and stay bounded", async ({ page }) => {
  const adaptive = page.locator("#adaptive-canvas canvas");
  await adaptive.scrollIntoViewIfNeeded();
  await expect(adaptive).toHaveAttribute("data-suspended", "false");
  await page.locator("header").scrollIntoViewIfNeeded();
  await expect(adaptive).toHaveAttribute("data-suspended", "true");

  const video = page.locator("#video-handoff video");
  const destination = page.locator("#video-handoff [data-destination]");
  await page.evaluate(() => {
    const element = document.querySelector("#video-handoff video");
    Object.defineProperty(element, "duration", { configurable: true, value: 1 });
    element.currentTime = 0.9;
    element.dispatchEvent(new Event("timeupdate"));
  });
  await expect(destination).toHaveAttribute("data-state", "visible");
  await page.evaluate(() => document.querySelector("#video-handoff video").dispatchEvent(new Event("error")));
  await expect(video).toHaveAttribute("data-state", "failed");
  await expect(destination).toHaveAttribute("data-state", "visible");

  const trail = page.locator("#media-trail");
  await trail.scrollIntoViewIfNeeded();
  const box = await trail.boundingBox();
  if (!box) throw new Error("media trail fixture has no bounds");
  for (let index = 0; index < 9; index += 1)
    await page.mouse.move(box.x + 15 + index * 85, box.y + 80);
  await expect(page.locator(".dreative-media-trail")).toHaveCount(6);
  await expect.poll(() => page.locator(".dreative-media-trail").count(), { timeout: 2_000 }).toBe(0);
});

test("mobile reduced-motion form is in-flow, readable, static, and cleanly disposable", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#kinetic-type h2")).toHaveAttribute("data-state", "resolved");
  await expect(page.locator("[data-observe]")).toHaveAttribute("data-state", "visible");
  await expect(page.locator("#pinned-chapter")).toHaveAttribute("data-active-state", "all");
  await expect(page.locator("#pinned-chapter [data-chapter-state]")).toHaveCount(3);
  await expect(page.locator("#persistent-object")).toBeHidden();
  await expect(page.locator("#persistent-stage [data-stage-fallback='visible']")).toHaveCount(3);
  await expect(page.locator("#spatial-gallery [data-spatial-item]").first()).toHaveCSS("position", "relative");
  await expect(page.locator("#spatial-gallery .field")).toHaveCSS("overflow-x", "auto");

  await page.locator("#media-trail").dispatchEvent("pointermove", { clientX: 100, clientY: 100 });
  await expect(page.locator(".dreative-media-trail")).toHaveCount(0);

  await page.evaluate(() => globalThis.dreativeFixture.destroy());
  await expect(page.locator("#kinetic-type h2")).toHaveText("Language remains the interface");
  await expect(page.locator("#persistent-stage [data-stage-fallback]")).toHaveCount(0);
  await expect(page.locator("#pinned-chapter")).not.toHaveAttribute("data-active-state", /.+/);
  await context.close();
});

test("foundation cleanup restores pre-existing DOM state and stale frame loads cannot win", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const systems = globalThis.dreativeFixture.systems;
    const kinetic = document.createElement("h2");
    kinetic.setAttribute("aria-label", "original label");
    kinetic.dataset.state = "original";
    kinetic.innerHTML = "Hello <em>nested world</em>";
    document.body.appendChild(kinetic);
    const kineticMarkup = kinetic.innerHTML;
    const destroyKinetic = systems.mountKineticType(kinetic);
    destroyKinetic();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const gallery = document.createElement("div");
    gallery.innerHTML = '<button data-spatial-item style="color:red" tabindex="4" data-selected="prior">A</button><button data-spatial-item>B</button>';
    document.body.appendChild(gallery);
    const first = gallery.firstElementChild;
    const destroyGallery = systems.mountSpatialGallery(gallery);
    destroyGallery();

    const rail = document.createElement("div");
    rail.dataset.dragging = "prior";
    const destroyRail = systems.mountDragRail(rail);
    destroyRail();

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:10px;height:10px";
    canvas.getContext = () => ({ clearRect() {}, drawImage() {} });
    document.body.appendChild(canvas);
    const NativeImage = globalThis.Image;
    const pending = [];
    globalThis.Image = class {
      width = 10; height = 10;
      set src(value) { this.value = value; pending.push(this); }
    };
    const sequence = systems.mountFrameSequence(canvas, { frames: ["slow", "fast"] });
    sequence.setProgress(1);
    pending.find((image) => image.value === "fast").onload();
    await Promise.resolve();
    pending.find((image) => image.value === "slow").onload();
    await Promise.resolve();
    globalThis.Image = NativeImage;
    const frame = canvas.dataset.frame;
    sequence.destroy();

    const unavailableCanvas = document.createElement("canvas");
    unavailableCanvas.getContext = () => null;
    const unavailableSequence = systems.mountFrameSequence(unavailableCanvas, { frames: ["frame"] });
    unavailableSequence.setProgress(1);
    unavailableSequence.destroy();
    const emptySequence = systems.mountFrameSequence(canvas, { frames: [] });
    emptySequence.setProgress(1);
    emptySequence.destroy();

    return {
      kineticMarkup: kinetic.innerHTML, expectedMarkup: kineticMarkup,
      kineticAria: kinetic.getAttribute("aria-label"), kineticState: kinetic.dataset.state,
      galleryStyle: first.getAttribute("style"), galleryTabindex: first.getAttribute("tabindex"), gallerySelected: first.dataset.selected,
      railDragging: rail.dataset.dragging, frame,
      fallbackControllers: [unavailableSequence, emptySequence].every((controller) => typeof controller.setProgress === "function" && typeof controller.destroy === "function"),
    };
  });
  expect(result).toEqual({
    kineticMarkup: result.expectedMarkup, expectedMarkup: result.expectedMarkup,
    kineticAria: "original label", kineticState: "original",
    galleryStyle: "color:red", galleryTabindex: "4", gallerySelected: "prior",
    railDragging: "prior", frame: "1", fallbackControllers: true,
  });
});

test("sequence reuses recent frames, evicts old frames, and stops loading after disposal", async ({ page }) => {
  const loads = await page.evaluate(async () => {
    const NativeImage = globalThis.Image;
    const requested = [];
    globalThis.Image = class {
      width = 10; height = 10;
      set src(value) { requested.push(value); queueMicrotask(() => this.onload()); }
    };
    const canvas = document.createElement("canvas");
    canvas.getContext = () => ({ clearRect() {}, drawImage() {} });
    const sequence = globalThis.dreativeFixture.systems.mountFrameSequence(canvas, {
      frames: ["a", "b", "c"], maxCachedFrames: 2,
    });
    try {
      await Promise.resolve();
      sequence.setProgress(.5); await Promise.resolve();
      sequence.setProgress(.5); await Promise.resolve();
      sequence.setProgress(1); await Promise.resolve();
      sequence.setProgress(0); await Promise.resolve();
      sequence.destroy();
      sequence.setProgress(.5); await Promise.resolve();
      return requested;
    } finally { sequence.destroy(); globalThis.Image = NativeImage; }
  });
  expect(loads).toEqual(["a", "b", "c", "a"]);
});

test("media placement preserves aspect and frame coverage and rejects invalid geometry", async ({ page }) => {
  const result = await page.evaluate(() => {
    const place = globalThis.dreativeFixture.systems.mediaPlacement;
    const failures = [];
    for (const [sw, sh] of [[1600, 900], [900, 1600], [100, 100]]) {
      for (const [fw, fh] of [[390, 844], [1440, 900], [73.5, 201.25]]) {
        for (const fit of ["cover", "contain"]) {
          for (const position of [[0, 0], [.58, .42], [1, 1], [-2, 3]]) {
            const p = place(sw, sh, fw, fh, { fit, position });
            const epsilon = 1e-8;
            if (Math.abs(p.width / p.height - sw / sh) > epsilon) failures.push("aspect");
            if (fit === "cover" && (p.x > epsilon || p.y > epsilon || p.x + p.width < fw - epsilon || p.y + p.height < fh - epsilon)) failures.push("hole");
            if (fit === "contain" && (p.x < -epsilon || p.y < -epsilon || p.x + p.width > fw + epsilon || p.y + p.height > fh + epsilon)) failures.push("clip");
          }
        }
      }
    }
    let rejected = 0;
    for (const args of [[0, 100, 100, 100], [100, NaN, 100, 100], [100, 100, Infinity, 100], [100, 100, 100, 100, { fit: "stretch" }], [100, 100, 100, 100, { position: [NaN, .5] }]]) {
      try { place(...args); } catch (error) { if (error instanceof RangeError) rejected++; }
    }
    return { failures, rejected, centered: place(200, 100, 100, 100) };
  });
  expect(result).toEqual({ failures: [], rejected: 5, centered: { x: -50, y: 0, width: 200, height: 100 } });
});

test("sequence canvas matches CSS image framing through responsive resize", async ({ page }) => {
  await page.evaluate(() => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80"><path fill="red" d="M0 0h40v80H0z"/><path fill="lime" d="M40 0h40v80H40z"/><path fill="blue" d="M80 0h40v80H80z"/><path fill="yellow" d="M120 0h40v80H120z"/><path fill="black" d="M0 0h160v10H0z"/></svg>';
    const source = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    const host = document.createElement("div");
    host.id = "crop-probe";
    host.style.cssText = "position:fixed;inset:0 auto auto 0;z-index:99999;background:white";
    host.innerHTML = '<canvas></canvas><img alt="framing comparison">';
    document.body.append(host);
    const canvas = host.querySelector("canvas");
    const img = host.querySelector("img");
    for (const node of [canvas, img]) node.style.cssText = "display:block;width:120px;height:80px;border:0;padding:0;background:white;object-fit:cover;object-position:75% 25%";
    img.src = source;
    globalThis.cropProbe = globalThis.dreativeFixture.systems.mountFrameSequence(canvas, {
      frames: [source], maxDpr: 1,
      framing: ({ width }) => ({ fit: width < 100 ? "contain" : "cover", position: [.75, .25] }),
    });
  });
  const canvas = page.locator("#crop-probe canvas");
  const img = page.locator("#crop-probe img");
  await expect(canvas).toHaveAttribute("data-state", "ready");
  await expect.poll(async () => (await canvas.screenshot()).equals(await img.screenshot())).toBe(true);
  await page.evaluate(() => {
    for (const node of document.querySelectorAll("#crop-probe canvas, #crop-probe img")) {
      node.style.width = "80px"; node.style.height = "120px"; node.style.objectFit = "contain";
    }
  });
  await expect.poll(() => canvas.evaluate((node) => node.width)).toBe(80);
  await expect.poll(async () => (await canvas.screenshot()).equals(await img.screenshot())).toBe(true);
  await page.evaluate(() => { globalThis.cropProbe.destroy(); document.querySelector("#crop-probe").remove(); });
});
