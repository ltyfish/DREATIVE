/* Executable versions of references/MOTION_RECIPES.md. Globals come from the UMD builds of
   gsap, ScrollTrigger, SplitText, Flip and Lenis; in an app, import them from "gsap/*" and "lenis". */
/* global gsap, ScrollTrigger, SplitText, Flip, Lenis */
gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const params = new URLSearchParams(location.search);
const EASE = { out: "expo.out", soft: "power3.out", inOut: "power2.inOut", scrub: "none" };
const DUR = { reveal: 1.1, quick: 0.45, hold: 0.6 };

// R0 — one scroll owner: Lenis driven by the GSAP ticker, ScrollTrigger updated from Lenis.
let lenis = null;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && params.get("lenis") !== "0") {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const mm = gsap.matchMedia();
mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 761px)", fine: "(pointer: fine)" }, (ctx) => {
  const { motion, desktop, fine } = ctx.conditions;
  if (!motion) return; // reduced motion: the CSS layout is already the resolved composition.
  const cleanups = []; // non-GSAP listeners; GSAP objects created here are reverted by matchMedia automatically.

  // R1 — masked line reveal. autoSplit re-splits on resize/font load; onSplit returns the tween so it is reverted with the split.
  document.querySelectorAll("[data-split]").forEach((el) => {
    SplitText.create(el, { type: "lines", mask: "lines", autoSplit: true, linesClass: "line",
      onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: DUR.reveal, ease: EASE.out, stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%", once: true } }) });
  });

  // R2 — clip-path reveal while the image counter-scales, so the crop settles rather than slides.
  document.querySelectorAll("[data-clip]").forEach((frame) => {
    gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 75%", once: true } })
      .fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
      .fromTo(frame.firstElementChild, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: EASE.out }, 0);
  });

  // R3 — parallax inside a fixed frame. The image is 124% tall, so ±12% travel never exposes an edge.
  document.querySelectorAll("[data-parallax]").forEach((frame) => {
    gsap.fromTo(frame.firstElementChild, { yPercent: -10 }, { yPercent: 10, ease: EASE.scrub,
      scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // R4 — pinned scene authored as a timeline with labelled intervals; scrub maps scroll to it.
  const scene = document.querySelector("[data-pin-scene]");
  if (scene) {
    const tl = gsap.timeline({ defaults: { ease: EASE.inOut },
      scrollTrigger: { trigger: scene, start: "top top", end: desktop ? "+=180%" : "+=120%", pin: true, scrub: 0.6, anticipatePin: 1 } });
    tl.addLabel("establish")
      .to(scene.querySelector(".left"), { xPercent: -60, duration: 1 }, "establish")
      .to(scene.querySelector(".right"), { xPercent: 60, duration: 1 }, "establish")
      .fromTo(scene.querySelector(".aperture"), { clipPath: "inset(32% 36% 32% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }, "establish+=0.2")
      .addLabel("hold")
      .from(scene.querySelector(".caption"), { autoAlpha: 0, y: 24, duration: 0.4, ease: EASE.soft }, "hold-=0.2")
      .to({}, { duration: DUR.hold }); // readable hold before release
    scene.__timeline = tl;
  }

  // R5 — horizontal gallery. Desktop pins and translates; mobile keeps native scroll-snap (no pin).
  const rail = document.querySelector("[data-horizontal]");
  if (rail && desktop) {
    const track = rail.querySelector(".track");
    const distance = () => track.scrollWidth - innerWidth;
    const move = gsap.to(track, { x: () => -distance(), ease: EASE.scrub,
      scrollTrigger: { trigger: rail, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    // Inner reveals follow the horizontal motion through containerAnimation.
    track.querySelectorAll(".panel span").forEach((label) => gsap.from(label, { yPercent: 60, autoAlpha: 0, ease: EASE.soft,
      scrollTrigger: { trigger: label, containerAnimation: move, start: "left 85%", end: "left 55%", scrub: true } }));
  }

  // R7 — marquee that speeds up and skews with scroll velocity, settling back to its idle speed.
  const marquee = document.querySelector("[data-marquee] .inner");
  if (marquee) {
    const loop = gsap.to(marquee, { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
    const skew = gsap.quickTo(marquee, "skewX", { duration: 0.5, ease: EASE.soft });
    let velocity = 0;
    ScrollTrigger.create({ trigger: marquee, start: "top bottom", end: "bottom top",
      onUpdate: (self) => { velocity = gsap.utils.clamp(-1500, 1500, self.getVelocity()); } });
    const decay = () => { velocity *= 0.9; loop.timeScale(1 + Math.abs(velocity) / 250); skew(velocity / -150); };
    gsap.ticker.add(decay);
    cleanups.push(() => gsap.ticker.remove(decay));
  }

  // R9 — stacked sticky sheets: each sheet recedes as the next one covers it.
  const sheets = gsap.utils.toArray("#r9 .sheet");
  sheets.slice(0, -1).forEach((sheet, i) => {
    gsap.to(sheet, { scale: 0.9, filter: "brightness(0.55)", ease: EASE.scrub,
      scrollTrigger: { trigger: sheets[i + 1], start: "top bottom", end: "top top", scrub: true } });
  });

  // R10 — magnetic control with quickTo; pointer-fine only, the button is an ordinary button everywhere else.
  if (fine) document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.35); y((e.clientY - r.top - r.height / 2) * 0.35); };
    const leave = () => { x(0); y(0); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
  });
  return () => cleanups.forEach((fn) => fn());
});

// R6 — shared-element handoff with Flip. Works in every motion mode; reduced motion gets duration 0.
const detail = document.querySelector(".detail");
let origin = null;
function openDetail(card) {
  const plate = card.querySelector(".plate");
  const state = Flip.getState(plate);
  origin = { card, plate };
  detail.querySelector("#detail-title").textContent = card.innerText.trim();
  detail.hidden = false;
  detail.querySelector(".slot").appendChild(plate);
  lenis?.stop();
  Flip.from(state, { duration: reduce ? 0 : 0.9, ease: "expo.inOut", absolute: true, zIndex: 30,
    onComplete: () => detail.querySelector("[data-close]").focus() });
  gsap.from(detail.querySelectorAll(".info > *"), { autoAlpha: 0, y: 20, stagger: 0.06, delay: reduce ? 0 : 0.35, duration: reduce ? 0 : 0.5, ease: EASE.soft });
}
function closeDetail() {
  if (!origin) return;
  const { card, plate } = origin;
  const state = Flip.getState(plate);
  card.prepend(plate);
  Flip.from(state, { duration: reduce ? 0 : 0.8, ease: "expo.inOut", absolute: true, zIndex: 30,
    onStart: () => { detail.hidden = true; } });
  lenis?.start();
  origin = null;
  card.focus();
}
document.querySelectorAll(".card").forEach((card) => card.addEventListener("click", () => openDetail(card)));
detail.querySelector("[data-close]").addEventListener("click", closeDetail);
addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

// R8 — readiness: release only after fonts (and, in a real page, critical images) are usable, then refresh measurements.
Promise.all([document.fonts.ready]).then(() => {
  ScrollTrigger.refresh();
  document.getElementById("ready").textContent = "ready";
  document.documentElement.dataset.ready = "true";
});

window.__recipes = { lenis, mm, reduce };
