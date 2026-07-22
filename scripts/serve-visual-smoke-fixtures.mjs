import http from "node:http";

const port = 4181;
const shell = (body, script = "", links = "") => `<!doctype html><html><head><title>Smoke fixture</title><style>html,body{margin:0}main>section{min-height:70vh;padding:32px}.box{width:120px;height:120px;background:#f60;transition:transform .01s,opacity .01s}.changed .box{transform:translateX(80px);opacity:.55}</style></head><body><main>${links}${body}</main><script>${script}</script></body></html>`;
const mechanisms = `<section id="before"><button>Before</button><div class="box"></div></section><section id="peak"><button>Peak</button><svg viewBox="0 0 120 120" width="120" height="120"><rect class="box" width="120" height="120" fill="#f60"/></svg></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`;
const healthy = shell(mechanisms, `for(const section of document.querySelectorAll('section'))section.onclick=()=>section.classList.toggle('changed')`, `<a href="/about">About</a>`);
const scrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1 style="position:sticky;top:32px">Scroll story</h1><div class="box" style="position:sticky;top:100px"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('#before,#after'))section.onclick=()=>section.classList.toggle('changed');addEventListener('scroll',()=>{const scene=document.querySelector('#scroll-story');const box=scene.querySelector('.box');const progress=Math.max(0,Math.min(1,(scrollY-scene.offsetTop)/(scene.offsetHeight-innerHeight)));const stage=Math.min(3,Math.floor(progress*4));box.dataset.stage=stage;box.style.transform='translateX('+(stage*50)+'px)'})`);
const staticScrollMechanism = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="scroll-story" style="height:320vh"><h1>Static scroll story</h1><div class="box"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('#before,#after'))section.onclick=()=>section.classList.toggle('changed')`);
const lyingMedia = shell(`<section id="before"><button>Before</button><div class="box"></div></section><section id="lying-peak"><button>Peak</button><div class="box"></div></section><section id="after"><button>After</button><div class="box"></div><div class="box"></div></section>`, `for(const section of document.querySelectorAll('section'))section.onclick=()=>section.classList.toggle('changed')`);
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
  "/lying-media": lyingMedia,
  "/console": shell(`<section><h1>Runtime failure</h1></section>`, `console.error('fixture exploded')`),
  "/asset": shell(`<section><h1>Missing asset</h1><img src="/missing.png" alt="missing"></section>`),
  "/reduced-overflow": `<!doctype html><html><head><title>Smoke fixture</title><style>main{min-height:100vh}@media(prefers-reduced-motion:reduce){.wide{width:700px}}</style></head><body><main><h1>Reduced motion</h1><div class="wide">fallback</div></main></body></html>`,
};
http.createServer((request, response) => {
  if (request.url === "/missing" || request.url === "/missing.png") { response.writeHead(404, { "content-type": "text/html" }); response.end("missing"); return; }
  const page = pages[request.url] ?? pages["/"];
  response.writeHead(200, { "content-type": "text/html" }); response.end(page);
}).listen(port, "127.0.0.1");
