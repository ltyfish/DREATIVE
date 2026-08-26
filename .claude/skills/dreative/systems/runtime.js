const noop = () => {};
const reduced = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function mountSectionObserver(elements, options = {}) {
  const nodes = [...elements];
  if (reduced() || !globalThis.IntersectionObserver) {
    nodes.forEach((node) => { node.dataset.state = "visible"; });
    return noop;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.dataset.state = "visible";
      else if (options.reversible) entry.target.dataset.state = "idle";
    }
  }, { threshold: options.threshold ?? 0.25 });
  nodes.forEach((node) => { node.dataset.state ||= "idle"; observer.observe(node); });
  return () => observer.disconnect();
}

export function mountScrollProgress(subject, onFrame, options = {}) {
  let raf = 0;
  let lastY = globalThis.scrollY ?? 0;
  let lastTime = performance.now();
  let active = true;
  const update = (time) => {
    raf = 0;
    if (!active) return;
    const rect = subject.getBoundingClientRect();
    const travel = Math.max(1, rect.height + innerHeight);
    const progress = clamp((innerHeight - rect.top) / travel);
    const y = globalThis.scrollY ?? 0;
    const elapsed = Math.max(16, time - lastTime);
    const rawVelocity = (y - lastY) / elapsed;
    const maxVelocity = options.maxVelocity ?? 2;
    onFrame({ progress, direction: Math.sign(y - lastY), velocity: reduced() ? 0 : clamp(rawVelocity, -maxVelocity, maxVelocity) });
    lastY = y;
    lastTime = time;
  };
  const request = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  request();
  return () => {
    active = false;
    removeEventListener("scroll", request);
    removeEventListener("resize", request);
    if (raf) cancelAnimationFrame(raf);
  };
}

export function mountPinnedChapter(root, options = {}) {
  const states = [...root.querySelectorAll("[data-chapter-state]")];
  if (!states.length) return noop;
  const originalState = root.dataset.activeState;
  const originals = states.map((state) => ({ hidden: state.hidden, aria: state.getAttribute("aria-hidden") }));
  const restore = () => {
    if (originalState === undefined) delete root.dataset.activeState;
    else root.dataset.activeState = originalState;
    states.forEach((state, index) => {
      state.hidden = originals[index].hidden;
      if (originals[index].aria === null) state.removeAttribute("aria-hidden");
      else state.setAttribute("aria-hidden", originals[index].aria);
    });
  };
  if (reduced()) {
    root.dataset.activeState = "all";
    states.forEach((state) => { state.hidden = false; });
    return restore;
  }
  const destroyProgress = mountScrollProgress(root, ({ progress }) => {
    const index = Math.min(states.length - 1, Math.floor(progress * states.length));
    root.dataset.activeState = String(index);
    states.forEach((state, current) => {
      state.hidden = current !== index;
      state.setAttribute("aria-hidden", String(current !== index));
    });
    options.onState?.(index, progress);
  });
  return () => { destroyProgress(); restore(); };
}

export async function runSharedElementHandoff(mutate, options = {}) {
  const active = document.activeElement;
  if (reduced() || !document.startViewTransition) {
    await mutate();
  } else {
    await document.startViewTransition(() => mutate()).finished;
  }
  if (options.restoreFocus !== false && active instanceof HTMLElement && document.contains(active)) active.focus();
}

export function mountFrameSequence(canvas, options) {
  const context = canvas.getContext("2d");
  if (!context || !options.frames?.length) return { setProgress: noop, destroy: noop };
  const images = new Map();
  let destroyed = false;
  let current = -1;
  let requestVersion = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, options.maxDpr ?? 1.5);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    if (current >= 0) draw(current);
  };
  const load = (index) => {
    if (images.has(index)) return images.get(index);
    const image = new Image();
    const promise = new Promise((resolve) => {
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
    });
    image.src = options.frames[index];
    images.set(index, promise);
    return promise;
  };
  const draw = async (index) => {
    current = clamp(index, 0, options.frames.length - 1);
    const requested = current;
    const version = ++requestVersion;
    const image = await load(requested);
    if (destroyed || version !== requestVersion || requested !== current) return;
    canvas.dataset.frame = String(requested);
    if (!image) {
      canvas.dataset.state = "missing";
      return options.onMissing?.(requested);
    }
    canvas.dataset.state = "ready";
    const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  draw(reduced() ? (options.reducedFrame ?? options.frames.length - 1) : 0);
  return {
    setProgress(progress) { draw(Math.round(clamp(progress) * (options.frames.length - 1))); },
    destroy() { destroyed = true; observer.disconnect(); images.clear(); delete canvas.dataset.frame; delete canvas.dataset.state; },
  };
}

export function mountPersistentStage(stage, berths) {
  const entries = [...berths];
  if (!entries.length) return noop;
  const visible = new Set();
  const originalHidden = stage.hidden;
  const originalBerth = stage.dataset.berth;
  const originalVars = ["--stage-x", "--stage-y", "--stage-w", "--stage-h"].map((name) => [name, stage.style.getPropertyValue(name)]);
  const originalFallbacks = entries.map((entry) => entry.dataset.stageFallback);
  if (reduced()) {
    stage.hidden = true;
    entries.forEach((entry) => { entry.dataset.stageFallback = "visible"; });
    return () => {
      stage.hidden = originalHidden;
      entries.forEach((entry, index) => {
        if (originalFallbacks[index] === undefined) delete entry.dataset.stageFallback;
        else entry.dataset.stageFallback = originalFallbacks[index];
      });
    };
  }
  stage.hidden = true;
  const update = () => {
    const center = innerHeight / 2;
    const candidates = entries.filter((entry) => visible.has(entry));
    if (!candidates.length) {
      stage.hidden = true;
      return;
    }
    const active = candidates.reduce((best, berth) => {
      const rect = berth.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      return !best || distance < best.distance ? { berth, distance } : best;
    }, null)?.berth;
    if (!active) return;
    stage.hidden = false;
    const rect = active.getBoundingClientRect();
    stage.dataset.berth = active.id;
    stage.style.setProperty("--stage-x", `${rect.left}px`);
    stage.style.setProperty("--stage-y", `${rect.top}px`);
    stage.style.setProperty("--stage-w", `${rect.width}px`);
    stage.style.setProperty("--stage-h", `${rect.height}px`);
  };
  const observer = new IntersectionObserver((changes) => {
    changes.forEach((change) => change.isIntersecting ? visible.add(change.target) : visible.delete(change.target));
    update();
  }, { rootMargin: "-10% 0px", threshold: 0.01 });
  entries.forEach((entry) => observer.observe(entry));
  addEventListener("resize", update);
  update();
  return () => {
    observer.disconnect();
    removeEventListener("resize", update);
    stage.hidden = originalHidden;
    if (originalBerth === undefined) delete stage.dataset.berth;
    else stage.dataset.berth = originalBerth;
    originalVars.forEach(([name, value]) => value ? stage.style.setProperty(name, value) : stage.style.removeProperty(name));
  };
}

export function mountDragRail(rail, options = {}) {
  const originalDragging = rail.dataset.dragging;
  let pointer = null;
  let startX = 0;
  let startScroll = 0;
  const down = (event) => {
    if (event.button !== 0) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.setPointerCapture(pointer);
    rail.dataset.dragging = "true";
  };
  const move = (event) => {
    if (event.pointerId !== pointer) return;
    rail.scrollLeft = startScroll - (event.clientX - startX);
  };
  const up = (event) => {
    if (event.pointerId !== pointer) return;
    pointer = null;
    rail.dataset.dragging = "false";
    if (options.snap !== false) rail.scrollTo({ left: rail.scrollLeft, behavior: reduced() ? "auto" : "smooth" });
  };
  const key = (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    rail.scrollBy({ left: (event.key === "ArrowRight" ? 1 : -1) * (options.step ?? rail.clientWidth * 0.8), behavior: reduced() ? "auto" : "smooth" });
  };
  rail.addEventListener("pointerdown", down);
  rail.addEventListener("pointermove", move);
  rail.addEventListener("pointerup", up);
  rail.addEventListener("pointercancel", up);
  rail.addEventListener("keydown", key);
  return () => {
    if (pointer !== null && rail.hasPointerCapture?.(pointer)) rail.releasePointerCapture(pointer);
    pointer = null;
    rail.removeEventListener("pointerdown", down);
    rail.removeEventListener("pointermove", move);
    rail.removeEventListener("pointerup", up);
    rail.removeEventListener("pointercancel", up);
    rail.removeEventListener("keydown", key);
    if (originalDragging === undefined) delete rail.dataset.dragging;
    else rail.dataset.dragging = originalDragging;
  };
}

export function mountKineticType(element, options = {}) {
  const text = element.textContent ?? "";
  const originalNodes = [...element.childNodes];
  const originalAria = element.getAttribute("aria-label");
  const originalState = element.dataset.state;
  element.setAttribute("aria-label", text);
  const words = text.trim().split(/\s+/);
  element.replaceChildren(...words.flatMap((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--word-index", String(index));
    return index < words.length - 1 ? [span, document.createTextNode(" ")] : [span];
  }));
  let raf = 0;
  if (reduced()) element.dataset.state = "resolved";
  else raf = requestAnimationFrame(() => { element.dataset.state = options.initialState ?? "active"; });
  return () => {
    if (raf) cancelAnimationFrame(raf);
    element.replaceChildren(...originalNodes);
    if (originalAria === null) element.removeAttribute("aria-label");
    else element.setAttribute("aria-label", originalAria);
    if (originalState === undefined) delete element.dataset.state;
    else element.dataset.state = originalState;
  };
}

export function mountAdaptiveCanvas(canvas, draw, options = {}) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return noop;
  let raf = 0;
  let documentVisible = !document.hidden;
  let inViewport = true;
  let size = { width: 1, height: 1, dpr: 1 };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, options.maxDpr ?? 1.5);
    size = { width: rect.width, height: rect.height, dpr };
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const frame = (time) => {
    if (!documentVisible || !inViewport) return;
    draw(context, { ...size, time, reducedMotion: reduced() });
    if (!reduced()) raf = requestAnimationFrame(frame);
  };
  const sync = () => {
    const shouldRun = documentVisible && inViewport;
    if (shouldRun && !raf) raf = requestAnimationFrame(frame);
    else if (!shouldRun && raf) { cancelAnimationFrame(raf); raf = 0; }
    canvas.dataset.suspended = String(!shouldRun);
  };
  const visibility = () => {
    documentVisible = !document.hidden;
    sync();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const viewportObserver = new IntersectionObserver(([entry]) => {
    inViewport = entry?.isIntersecting ?? false;
    sync();
  }, { rootMargin: options.rootMargin ?? "120px 0px" });
  viewportObserver.observe(canvas);
  document.addEventListener("visibilitychange", visibility);
  resize();
  raf = requestAnimationFrame(frame);
  return () => {
    resizeObserver.disconnect();
    viewportObserver.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    if (raf) cancelAnimationFrame(raf);
    context.clearRect(0, 0, canvas.width, canvas.height);
    delete canvas.dataset.suspended;
  };
}

export function mountVideoHandoff(video, destination, options = {}) {
  const originalVideoState = video.dataset.state;
  const originalDestinationState = destination.dataset.state;
  const wasPaused = video.paused;
  const restore = () => {
    if (originalVideoState === undefined) delete video.dataset.state;
    else video.dataset.state = originalVideoState;
    if (originalDestinationState === undefined) delete destination.dataset.state;
    else destination.dataset.state = originalDestinationState;
    if (!wasPaused) void video.play().catch(() => {});
  };
  const update = () => {
    const threshold = options.at ?? Math.max(0, video.duration - 0.35);
    const resolved = Number.isFinite(threshold) && video.currentTime >= threshold;
    video.dataset.state = resolved ? "resolved" : "playing";
    destination.dataset.state = resolved ? "visible" : "waiting";
  };
  const fail = () => {
    video.dataset.state = "failed";
    destination.dataset.state = "visible";
  };
  if (reduced()) {
    video.pause();
    destination.dataset.state = "visible";
    return restore;
  }
  video.addEventListener("timeupdate", update);
  video.addEventListener("loadeddata", update);
  video.addEventListener("ended", update);
  video.addEventListener("error", fail);
  update();
  return () => { video.removeEventListener("timeupdate", update); video.removeEventListener("loadeddata", update); video.removeEventListener("ended", update); video.removeEventListener("error", fail); restore(); };
}

export function mountSpatialGallery(root, options = {}) {
  const items = [...root.querySelectorAll("[data-spatial-item]")];
  const originals = items.map((item) => ({ style: item.getAttribute("style"), tabindex: item.getAttribute("tabindex"), selected: item.dataset.selected }));
  const clicks = new Map();
  let selected = 0;
  const render = () => {
    const shallow = reduced() || innerWidth < (options.mobileBreakpoint ?? 640);
    items.forEach((item, index) => {
      const offset = index - selected;
      item.tabIndex = index === selected ? 0 : -1;
      item.dataset.selected = String(index === selected);
      item.style.setProperty("--spatial-x", `${offset * (shallow ? 78 : 58)}%`);
      item.style.setProperty("--spatial-z", `${shallow ? 0 : -Math.abs(offset) * 120}px`);
      item.style.setProperty("--spatial-r", `${shallow ? 0 : offset * -7}deg`);
    });
  };
  const select = (index) => {
    selected = (index + items.length) % items.length;
    render();
    items[selected]?.focus({ preventScroll: true });
  };
  const key = (event) => {
    if (event.key === "ArrowRight") select(selected + 1);
    else if (event.key === "ArrowLeft") select(selected - 1);
    else return;
    event.preventDefault();
  };
  items.forEach((item, index) => {
    const click = () => select(index);
    clicks.set(item, click);
    item.addEventListener("click", click);
  });
  root.addEventListener("keydown", key);
  addEventListener("resize", render);
  render();
  return () => {
    root.removeEventListener("keydown", key);
    removeEventListener("resize", render);
    items.forEach((item, index) => {
      item.removeEventListener("click", clicks.get(item));
      if (originals[index].style === null) item.removeAttribute("style");
      else item.setAttribute("style", originals[index].style);
      if (originals[index].tabindex === null) item.removeAttribute("tabindex");
      else item.setAttribute("tabindex", originals[index].tabindex);
      if (originals[index].selected === undefined) delete item.dataset.selected;
      else item.dataset.selected = originals[index].selected;
    });
  };
}

export function mountMediaTrail(surface, sources, options = {}) {
  const nodes = [];
  const timers = new Set();
  let last = { x: -Infinity, y: -Infinity };
  const move = (event) => {
    if (reduced() || (!event.buttons && matchMedia("(pointer: coarse)").matches)) return;
    if (Math.hypot(event.clientX - last.x, event.clientY - last.y) < (options.distance ?? 72)) return;
    last = { x: event.clientX, y: event.clientY };
    const image = document.createElement("img");
    image.alt = "";
    image.src = sources[nodes.length % sources.length];
    image.className = options.className ?? "dreative-media-trail";
    image.style.left = `${event.clientX}px`;
    image.style.top = `${event.clientY}px`;
    surface.appendChild(image);
    nodes.push(image);
    while (nodes.length > (options.maxItems ?? 6)) nodes.shift()?.remove();
    const timer = setTimeout(() => {
      timers.delete(timer);
      image.remove();
      const index = nodes.indexOf(image);
      if (index >= 0) nodes.splice(index, 1);
    }, options.life ?? 700);
    timers.add(timer);
  };
  if (!sources.length) return noop;
  surface.addEventListener("pointermove", move);
  return () => {
    surface.removeEventListener("pointermove", move);
    timers.forEach(clearTimeout);
    timers.clear();
    nodes.splice(0).forEach((node) => node.remove());
  };
}
