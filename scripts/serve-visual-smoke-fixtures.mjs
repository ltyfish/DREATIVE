import http from "node:http";

const port = 4181;
const shell = (body, script = "", links = "") => `<!doctype html><html><head><title>Smoke fixture</title><style>html,body{margin:0}main>section{min-height:70vh;padding:32px}.box{width:120px;height:120px;background:#f60;transition:transform .01s,opacity .01s}.changed .box{transform:translateX(80px);opacity:.55}</style></head><body><main>${links}${body}</main><script>${script}</script></body></html>`;
const mechanisms = `<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after"><button>After</button><div class="box" data-product="a"></div><div class="box" data-product="b"></div></section>`;
const sharedStateScript = `for(const section of document.querySelectorAll('section:not(#before)'))section.onclick=()=>{const stage=(Number(section.dataset.localStage||0)+1)%3;section.dataset.localStage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'};document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const section of document.querySelectorAll('section')){section.dataset.sharedStage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'}}`;
const healthy = shell(mechanisms, sharedStateScript, `<a href="/about">About</a>`);
const scrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Scroll story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box" data-product="a"></div><div class="box" data-product="b"></div></section>`, `${sharedStateScript};addEventListener('scroll',()=>{const scene=document.querySelector('#scroll-story');const box=scene.querySelector('.box');const progress=Math.max(0,Math.min(1,(scrollY-scene.offsetTop)/(scene.offsetHeight-innerHeight)));const stage=Math.min(3,Math.floor(progress*4));box.dataset.scrollStage=stage;box.style.transform='translateX('+(stage*50)+'px)'})`);
const staticScrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1>Static scroll story</h1><div class="box"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('#before,#after'))section.onclick=()=>section.classList.toggle('changed')`);
const staticStickyScrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Static sticky story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('#before,#after'))section.onclick=()=>section.classList.toggle('changed')`);
const scaleOnlyScrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Scale-only story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `${sharedStateScript};addEventListener('scroll',()=>{const scene=document.querySelector('#scroll-story');const box=scene.querySelector('.box');const progress=Math.max(0,Math.min(1,(scrollY-scene.offsetTop)/(scene.offsetHeight-innerHeight)));const stage=Math.min(3,Math.floor(progress*4));box.dataset.scrollStage=stage;box.style.transform='scale('+(1+stage*.04)+')';box.style.opacity=String(1-stage*.1)})`);
const desktopOnlyScrollMechanism = `<!doctype html><html><head><title>Smoke fixture</title><style>html,body{margin:0}main>section{min-height:70vh;padding:32px}.box{width:120px;height:120px;background:#f60}@media(max-width:600px){#scroll-story{height:80vh!important}#scroll-story .box{position:static!important}}</style></head><body><main><section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Desktop-only story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section></main><script>${sharedStateScript};addEventListener('scroll',()=>{const scene=document.querySelector('#scroll-story');const box=scene.querySelector('.box');const progress=Math.max(0,Math.min(1,(scrollY-scene.offsetTop)/(scene.offsetHeight-innerHeight)));const stage=Math.min(3,Math.floor(progress*4));box.dataset.scrollStage=stage;box.style.transform='translateX('+(stage*50)+'px)'})</script></body></html>`;
const collision = shell(`<section style="position:relative"><h1 style="position:absolute;top:40px;left:40px">Overlapping title</h1><p style="position:absolute;top:40px;left:40px">Overlapping paragraph</p></section>`);
const decorativePrimary = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg aria-hidden="true" viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, sharedStateScript);
const lyingMedia = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="lying-peak"><button>Peak</button><div class="box"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('section'))section.onclick=()=>section.classList.toggle('changed')`);
const isolatedWidgets = shell(mechanisms, `for(const section of document.querySelectorAll('section'))section.onclick=()=>{const stage=(Number(section.dataset.stage||0)+1)%3;section.dataset.stage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'}`);
const dataOnlyContinuity = shell(mechanisms, `document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const section of document.querySelectorAll('section'))section.dataset.sharedStage=stage}`);
const scrollOnlyContinuity = shell(`<div style="height:120vh"><h1>Intro spacer</h1></div>${mechanisms}`);
const hiddenTextContinuity = shell(`<section id="before"><button>Before</button><div class="box"></div><span hidden>state 0</span></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg><span hidden>state 0</span></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div><span hidden>state 0</span></section>`, `document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const hidden of document.querySelectorAll('span[hidden]'))hidden.textContent='state '+stage}`);
const unstableComparison = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after" style="display:flex;align-items:flex-start"><button>After</button><div class="box" data-product="a"></div><div class="box" data-product="b" style="margin-left:10px"></div><div class="box" data-product="c" style="margin-left:50px;margin-top:18px"></div></section>`, sharedStateScript);
const prototypeBounded = shell(`<section id="story-hero"><h1>Bounded hero</h1></section><section id="story-peak"><h2>Bounded peak</h2><div class="box"></div></section><section id="story-post"><h2>Bounded consequence</h2></section>`);
const prototypeHighCeiling = shell(`<section id="story-hero"><h1>Spatial hero</h1></section><section id="story-peak"><h2>Spatial peak</h2><svg viewBox="0 0 200 100"><circle cx="50" cy="50" r="40"/></svg></section><section id="story-post"><h2>Spatial consequence</h2></section>`);
const pages = {
  "/": healthy,
  "/about": shell(`<section><h1>About this fixture</h1><p>This is a distinct route.</p></section>`),
  "/sticky": shell(`<section style="overflow:hidden;height:300vh"><div style="position:sticky;top:0"><h1>Sticky risk</h1></div></section>`),
  "/empty": shell(`<section><h1>Opening</h1></section><section style="height:3200px"></section><section><h2>Ending</h2></section>`),
  "/broken": shell(`<section><h1>Broken route fixture</h1></section>`, "", `<a href="/missing">Missing</a>`),
  "/fallback": shell(`<section><h1>Fallback home</h1><p>Same page for every route.</p></section>`, "", `<a href="/ghost">Ghost</a>`),
  "/ghost": shell(`<section><h1>Fallback home</h1><p>Same page for every route.</p></section>`, "", `<a href="/ghost">Ghost</a>`),
  "/no-id-transform": shell(`<section class="scroll-scene" style="height:300vh"><div class="box" style="position:sticky;top:100px"></div><h1>Transform scene</h1></section>`, `addEventListener('scroll',()=>document.querySelector('.box').style.transform='translateX('+Math.round(scrollY/8)+'px)')`),
  "/scroll-mechanism": scrollMechanism,
  "/static-scroll-mechanism": staticScrollMechanism,
  "/static-sticky-scroll-mechanism": staticStickyScrollMechanism,
  "/scale-only-scroll-mechanism": scaleOnlyScrollMechanism,
  "/desktop-only-scroll-mechanism": desktopOnlyScrollMechanism,
  "/collision": collision,
  "/decorative-primary": decorativePrimary,
  "/lying-media": lyingMedia,
  "/isolated-widgets": isolatedWidgets,
  "/data-only-continuity": dataOnlyContinuity,
  "/scroll-only-continuity": scrollOnlyContinuity,
  "/hidden-text-continuity": hiddenTextContinuity,
  "/unstable-comparison": unstableComparison,
  "/prototype/bounded": prototypeBounded,
  "/prototype/high-ceiling": prototypeHighCeiling,
  "/console": shell(`<section><h1>Runtime failure</h1></section>`, `console.error('fixture exploded')`),
  "/asset": shell(`<section><h1>Missing asset</h1><img src="/missing.png" alt="missing"></section>`),
  "/reduced-overflow": `<!doctype html><html><head><title>Smoke fixture</title><style>main{min-height:100vh}@media(prefers-reduced-motion:reduce){.wide{width:700px}}</style></head><body><main><h1>Reduced motion</h1><div class="wide">fallback</div></main></body></html>`,
};
http.createServer((request, response) => {
  if (request.url?.startsWith("/recording/")) {
    const marker = request.url.includes("high-ceiling") ? 2 : 1;
    const device = request.url.includes("mobile") ? 4 : 3;
    const bytes = Buffer.alloc(2048, marker + device);
    bytes.writeUInt32BE(24, 0);
    bytes.write("ftyp", 4, "ascii");
    bytes.write("isom", 8, "ascii");
    response.writeHead(200, { "content-type": "video/mp4" }); response.end(bytes); return;
  }
  if (request.url?.startsWith("/capture/")) {
    if (request.url.includes("tiny")) { response.writeHead(200, { "content-type": "image/svg+xml" }); response.end(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20"/></svg>`); return; }
    const mobile = request.url.includes("mobile");
    const width = mobile ? 390 : 1440;
    const height = mobile ? 844 : 900;
    response.writeHead(200, { "content-type": "image/svg+xml" });
    response.end(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${request.url.includes("high-ceiling") ? "blue" : "orange"}"/><text x="20" y="40">${request.url}</text></svg>`);
    return;
  }
  if (request.url === "/missing" || request.url === "/missing.png" || request.url === "/missing-prototype" || request.url === "/missing-capture.webp") { response.writeHead(404, { "content-type": "text/html" }); response.end("missing"); return; }
  const page = pages[request.url] ?? pages["/"];
  response.writeHead(200, { "content-type": "text/html" }); response.end(page);
}).listen(port, "127.0.0.1");
