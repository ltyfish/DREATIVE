import http from "node:http";

const port = 4181;
const shell = (body, script = "", links = "") => `<!doctype html><html><head><title>Smoke fixture</title><style>html,body{margin:0}main>section{min-height:70vh;padding:32px}.box{width:120px;height:120px;background:#f60;transition:transform .01s,opacity .01s}.product-b,.product-d,.product-f{background-color:#06c}.product-c,.product-e{background-color:#6a4}.changed .box{transform:translateX(80px);opacity:.55}.reveal{opacity:.2;transition:opacity .01s,transform .01s}.reveal.shown{opacity:1;transform:translateY(-12px)}</style></head><body><main>${links}${body}</main><script>${script}</script></body></html>`;
const mechanisms = `<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after"><button>After</button><div class="box product-a" data-product="a" style="background-color:#f60"></div><div class="box product-b" data-product="b" style="background-color:#06c"></div></section>`;
const sharedStateScript = `for(const section of document.querySelectorAll('section:not(#before)'))section.onclick=()=>{const stage=(Number(section.dataset.localStage||0)+1)%3;section.dataset.localStage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'};document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const section of document.querySelectorAll('section')){section.dataset.sharedStage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'}}`;
// An ordinary scroll reveal: the minimum a Recommended route needs to clear the motion floor.
const revealScript = `for(const section of document.querySelectorAll('section')){const mark=document.createElement('div');mark.className='reveal';mark.textContent='revealed';section.append(mark);new IntersectionObserver((entries)=>entries.forEach((entry)=>entry.target.classList.toggle('shown',entry.isIntersecting)),{threshold:.4}).observe(mark)}`;

const healthy = shell(mechanisms, `${sharedStateScript};${revealScript}`, `<a href="/about">About</a>`);
const staticRoute = shell(`<section><h1>Static opening</h1><p>Nothing on this route moves.</p></section><section><h2>Static middle</h2><p>Still nothing.</p></section><section><h2>Static close</h2><p>Nothing again.</p></section><section><h2>Static footer</h2><p>Nothing at all.</p></section>`);
const proseWall = shell(`<section id="wall"><h1>Wall of prose</h1><p>${"The origin story continues without a single scannable break for the reader to land on. ".repeat(14)}</p></section><section><h2>Second</h2><ul><li>One</li><li>Two</li><li>Three</li></ul></section>`, revealScript);
const collision = shell(`<section style="position:relative"><h1 style="position:absolute;top:40px;left:40px">Overlapping title</h1><p style="position:absolute;top:40px;left:40px">Overlapping paragraph</p></section>`);
const decorativePrimary = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg aria-hidden="true" viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `${sharedStateScript};${revealScript}`);
const lyingMedia = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="lying-peak"><button>Peak</button><div class="box"></div></section><section id="after"><button>After</button><div class="box product-a" data-product="a"></div><div class="box product-b" data-product="b"></div></section>`, `for(const section of document.querySelectorAll('section'))section.onclick=()=>section.classList.toggle('changed');${revealScript}`);
const isolatedWidgets = shell(mechanisms, `for(const section of document.querySelectorAll('section'))section.onclick=()=>{const stage=(Number(section.dataset.stage||0)+1)%3;section.dataset.stage=stage;for(const box of section.querySelectorAll('.box'))box.style.transform='translateX('+(stage*40)+'px)'};${revealScript}`);
const dataOnlyContinuity = shell(mechanisms, `document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const section of document.querySelectorAll('section'))section.dataset.sharedStage=stage};${revealScript}`);
const hiddenTextContinuity = shell(`<section id="before"><button>Before</button><div class="box"></div><span hidden>state 0</span></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg><span hidden>state 0</span></section><section id="after"><button>After</button><div class="box product-a" data-product="a"></div><div class="box product-b" data-product="b"></div><span hidden>state 0</span></section>`, `document.querySelector('#before').onclick=()=>{const stage=(Number(document.body.dataset.stage||0)+1)%3;document.body.dataset.stage=stage;for(const hidden of document.querySelectorAll('span[hidden]'))hidden.textContent='state '+stage};${revealScript}`);
const comparisonGrid = (identical = false) => shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after" class="comparison-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,120px));grid-auto-rows:120px;gap:24px">${["a", "b", "c", "d", "e", "f"].map((id) => `<div class="box${identical ? "" : ` product-${id}`}" data-product="${id}"></div>`).join("")}</section>`, `${sharedStateScript};${revealScript}`);

const scrollScene = (script) => shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Scroll story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box product-a" data-product="a"></div><div class="box product-b" data-product="b"></div></section>`, script);
const scrollProgress = `addEventListener('scroll',()=>{const scene=document.querySelector('#scroll-story');const box=scene.querySelector('.box');const progress=Math.max(0,Math.min(1,(scrollY-scene.offsetTop)/(scene.offsetHeight-innerHeight)));const stage=Math.min(3,Math.floor(progress*4));box.dataset.scrollStage=stage;box.style.transform='translateX('+(stage*50)+'px)'})`;
const scrollMechanism = scrollScene(`${sharedStateScript};${scrollProgress}`);
const staticScrollMechanism = scrollScene(sharedStateScript);
const desktopOnlyScrollMechanism = `<!doctype html><html><head><title>Smoke fixture</title><style>html,body{margin:0}main>section{min-height:70vh;padding:32px}.box{width:120px;height:120px;background:#f60}@media(max-width:600px){#scroll-story .box{position:static!important}#scroll-story .box{transform:none!important}}</style></head><body><main><section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Desktop-only story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section></main><script>${sharedStateScript};${scrollProgress}</script></body></html>`;

const pages = {
  "/": healthy,
  "/about": shell(`<section><h1>About this fixture</h1><p>This is a distinct route.</p></section>`),
  "/static-route": staticRoute,
  "/prose-wall": proseWall,
  "/sticky": shell(`<section style="overflow:hidden;height:300vh"><div style="position:sticky;top:0"><h1>Sticky risk</h1></div></section>`),
  "/empty": shell(`<section><h1>Opening</h1></section><section style="height:3200px"></section><section><h2>Ending</h2></section>`),
  "/broken": shell(`<section><h1>Broken route fixture</h1></section>`, "", `<a href="/missing">Missing</a>`),
  "/fallback": shell(`<section><h1>Fallback home</h1><p>Same page for every route.</p></section>`, "", `<a href="/ghost">Ghost</a>`),
  "/ghost": shell(`<section><h1>Fallback home</h1><p>Same page for every route.</p></section>`, "", `<a href="/ghost">Ghost</a>`),
  "/no-id-transform": shell(`<section class="scroll-scene" style="height:300vh"><div class="box" style="position:sticky;top:100px"></div><h1>Transform scene</h1></section>`, `addEventListener('scroll',()=>document.querySelector('.box').style.transform='translateX('+Math.round(scrollY/8)+'px)')`),
  "/scroll-mechanism": scrollMechanism,
  "/static-scroll-mechanism": staticScrollMechanism,
  "/desktop-only-scroll-mechanism": desktopOnlyScrollMechanism,
  "/collision": collision,
  "/decorative-primary": decorativePrimary,
  "/lying-media": lyingMedia,
  "/isolated-widgets": isolatedWidgets,
  "/data-only-continuity": dataOnlyContinuity,
  "/hidden-text-continuity": hiddenTextContinuity,
  "/regular-comparison-grid": comparisonGrid(),
  "/identical-comparison-grid": comparisonGrid(true),
  "/console": shell(`<section><h1>Runtime failure</h1></section>`, `console.error('fixture exploded')`),
  "/asset": shell(`<section><h1>Missing asset</h1><img src="/missing.png" alt="missing"></section>`),
  "/reduced-overflow": `<!doctype html><html><head><title>Smoke fixture</title><style>main{min-height:100vh}@media(prefers-reduced-motion:reduce){.wide{width:700px}}</style></head><body><main><h1>Reduced motion</h1><div class="wide">fallback</div></main></body></html>`,
};

http.createServer((request, response) => {
  if (request.url === "/missing" || request.url === "/missing.png") { response.writeHead(404, { "content-type": "text/html" }); response.end("missing"); return; }
  const page = pages[request.url] ?? pages["/"];
  response.writeHead(200, { "content-type": "text/html" }); response.end(page);
}).listen(port, "127.0.0.1");
