import { mountScrollProgress, motionTrack } from './runtime.js';

const preference = matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector('#type-scene');
const slider = document.querySelector('#type-progress');
const aperture = motionTrack([{at:0,value:0},{at:.12,value:0},{at:.62,value:1},{at:1,value:1}]);
const travel = motionTrack([{at:0,value:0},{at:.55,value:26},{at:1,value:26}]);
function paint(progress) {
  const p = preference.matches ? 1 : progress;
  scene.style.setProperty('--open', aperture(p));
  scene.style.setProperty('--travel', travel(p));
  slider.value = String(Math.round(p * 100));
}
mountScrollProgress(scene, ({progress}) => paint(progress), {range:'pin'});
slider.addEventListener('input', () => paint(Number(slider.value) / 100));

const destination = document.querySelector('#cover-destination');
const content = document.querySelector('#reading-content');
const empty = document.querySelector('#empty-reading');
const back = document.querySelector('#return-edition');
const editions = {
  signal: ['Signal', 'An imagined collection of public lettering: messages that find their reader across a street.'],
  field: ['Field', 'An imagined notebook of marks, textures and the spaces between them.'],
  interval: ['Interval', 'An imagined study of rhythm: what a page gains when it leaves room to pause.'],
};
const origins = new Map([...document.querySelectorAll('[data-edition]')].map(el => [el, el.parentElement]));
let selected = null;
let flight = null;
function stopFlight() { flight?.cancel(); flight = null; }
function move(element, mutate) {
  // Read the visible interpolated rectangle before interrupting a previous flight.
  const from = element.getBoundingClientRect();
  stopFlight();
  mutate();
  const to = element.getBoundingClientRect();
  if (!preference.matches && from.width && to.width) {
    flight = element.animate([
      {transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},
      {transform:'none'},
    ], {duration:550,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
}
function close() {
  if (!selected) return;
  const element = selected;
  move(element, () => {
    origins.get(element).append(element);
    element.removeAttribute('tabindex');
    content.hidden = true; empty.hidden = false; selected = null;
  });
  element.focus({preventScroll:true});
}
for (const element of origins.keys()) element.addEventListener('click', () => {
  if (selected === element) return;
  move(element, () => {
    if (selected) { origins.get(selected).append(selected); selected.removeAttribute('tabindex'); }
    selected = element; content.hidden = false; empty.hidden = true;
    destination.append(element); element.tabIndex = -1;
    const [title, copy] = editions[element.dataset.edition];
    document.querySelector('#edition-title').textContent = title;
    document.querySelector('#edition-copy').textContent = copy;
  });
  back.focus({preventScroll:true});
});
back.addEventListener('click', close);
document.querySelector('.library').addEventListener('keydown', event => {
  if (event.key === 'Escape' && selected) { event.preventDefault(); close(); }
});
addEventListener('resize', stopFlight);
preference.addEventListener('change', stopFlight);

const stages = {
  red: ['First, the red plate.', 'Isolate one ink to see its shape. The faint second plate supplies orientation.'],
  blue: ['Then, the blue plate.', 'Inspect the second ink independently. Each plate contributes its own shape to the composition.'],
  registered: ['Bring the plates into register.', 'The shapes overlap in a shared frame. Their multiplied colors make the intersecting area visible.'],
};
for (const button of document.querySelectorAll('[data-print]')) button.addEventListener('click', () => {
  document.querySelector('.process').dataset.step = button.dataset.print;
  for (const other of document.querySelectorAll('[data-print]')) other.setAttribute('aria-pressed', String(other === button));
  const [title, copy] = stages[button.dataset.print];
  document.querySelector('#process-title').textContent = title;
  document.querySelector('#process-copy').textContent = copy;
});
document.documentElement.dataset.ready = 'true';
