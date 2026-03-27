
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function createStars(el, n) {
  const f = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const z = Math.random() * 2.5 + 0.4;
    s.style.cssText = `width:${z}px;height:${z}px;`
      + `left:${Math.random()*100}%;top:${Math.random()*100}%;`
      + `--dur:${2+Math.random()*4}s;--delay:${Math.random()*5}s;--op:${0.35+Math.random()*0.65}`;
    f.appendChild(s);
  }
  el.appendChild(f);
}

[['#heroStars',150],['#launchStars',110],['#spaceStars',200],['#marsStars',80],['#completeStars',170]]
  .forEach(([s,n]) => { const el=$(s); if(el) createStars(el,n); });

function spawnShoot(c) {
  const s = document.createElement('div');
  s.className = 'shooting-star';
  s.style.cssText = `top:${Math.random()*45}%;left:${Math.random()*55}%;`
    + `transform:rotate(${15+Math.random()*35}deg)`;
  c.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}
setInterval(() => spawnShoot($('#spaceStars')), 3200);
setInterval(() => spawnShoot($('#heroStars')),  6500);

const progressBar = $('#progressBar');
const sectionEls  = ['hero','launchpad','space','mars-landing','mars-surface','mission-complete']
                      .map(id => document.getElementById(id));
const dots = $$('.nav-dot');

function updateProgress() {
  const t = document.documentElement.scrollHeight - window.innerHeight;
  if (t > 0) progressBar.style.width = (window.scrollY / t * 100) + '%';
}

function updateDots() {
  const mid = window.scrollY + window.innerHeight / 2;
  let active = 0;
  sectionEls.forEach((s, i) => {
    if (s && s.getBoundingClientRect().top + window.scrollY <= mid) active = i;
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === active));
}

dots.forEach(d => {
  const go = () => {
    const sec = sectionEls[+d.dataset.section];
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  };
  d.addEventListener('click', go);
  d.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); go(); } });
});

/* Section 1 */
const heroRocket = $('#heroRocket');
const beginBtn   = $('#beginBtn');

beginBtn.addEventListener('click', () => {
  heroRocket.classList.add('launching');
  beginBtn.disabled = true;
  setTimeout(() => {
    $('#launchpad').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { heroRocket.classList.remove('launching'); beginBtn.disabled = false; }, 800);
  }, 750);
});

/* Section 2 */
const launchBtn = $('#launchBtn');
const cdEl      = $('#countdownDisplay');
const lpRocket  = $('#launchpadRocket');
let   cdRunning = false;

launchBtn.addEventListener('click', () => {
  if (cdRunning) return;
  cdRunning = true;
  launchBtn.disabled = true;
  let c = 5;
  cdEl.textContent = '0' + c;

  const iv = setInterval(() => {
    c--;
    cdEl.textContent = c < 10 ? '0' + c : '' + c;
    if (c <= 0) {
      clearInterval(iv);
      cdEl.textContent = '🚀';
      lpRocket.classList.add('launching');
      setTimeout(() => {
        $('#space').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          lpRocket.classList.remove('launching');
          cdEl.textContent = '05';
          cdRunning = false;
          launchBtn.disabled = false;
        }, 1200);
      }, 700);
    }
  }, 1000);
});

/* Section 3 */
const MAX_DISTANCE    = 225; 
const distValEl       = $('#distVal');
let   spaceScrollDone = false;

const PLANETS = [
  { name:'Moon',    x:'12%', y:'20%', size:55,
    bg:'radial-gradient(circle at 35% 35%,#e0e0e0,#9e9e9e,#616161)',
    sh:'rgba(200,200,200,.35)',
    info:"Earth's only natural satellite, 384,400 km away. No atmosphere; covered in craters. Its gravity creates ocean tides on Earth." },
  { name:'Venus',   x:'62%', y:'14%', size:68,
    bg:'radial-gradient(circle at 35% 35%,#b9f6ca,#43a047,#1b5e20)',
    sh:'rgba(67,160,71,.45)',
    info:'Hottest planet at 465 °C average. Thick CO₂ atmosphere with sulfuric acid clouds. Similar in size to Earth — called its twin.' },
  { name:'Earth',   x:'22%', y:'52%', size:72,
    bg:'radial-gradient(circle at 35% 35%,#4fc3f7,#1565c0,#0d47a1)',
    sh:'rgba(79,195,247,.45)',
    info:"Our home — the only known world with life. 71 % water surface. Perfect nitrogen-oxygen atmosphere inside the Sun's habitable zone." },
  { name:'Jupiter', x:'68%', y:'55%', size:96,
    bg:'radial-gradient(circle at 40% 40%,#ffe0b2,#ff8f00,#e65100)',
    sh:'rgba(255,143,0,.45)',
    info:'Largest planet: 1,300 Earths fit inside. Great Red Spot storm has raged 350 + years. Has 95 known moons including Europa.' },
  { name:'Mars',    x:'44%', y:'78%', size:63,
    bg:'radial-gradient(circle at 35% 35%,#ef9a9a,#c62828,#8b1a0d)',
    sh:'rgba(198,40,40,.55)',
    info:'Our destination — the Red Planet! Olympus Mons (21 km tall) & Valles Marineris (4,000 km canyon). Martian day = 24 h 37 min.' },
];

const pCont = $('#planetsContainer');
PLANETS.forEach(p => {
  const el = document.createElement('div');
  el.className = 'planet';
  el.style.cssText = `width:${p.size}px;height:${p.size}px;left:${p.x};top:${p.y};`
    + `background:${p.bg};`
    + `box-shadow:0 0 28px ${p.sh},inset -8px -4px 15px rgba(0,0,0,.5);`
    + `transform:translate(-50%,-50%)`;
  el.innerHTML = `<div class="planet-label">${p.name}</div>`
    + `<div class="planet-tooltip"><div class="tt-name">${p.name}</div><div class="tt-info">${p.info}</div></div>`;
  pCont.appendChild(el);
});

function updateSpace() {
  const sp = $('#space');
  if (!sp) return;
  const rect    = sp.getBoundingClientRect();
  const totalH  = sp.offsetHeight - window.innerHeight;
  const scrolled = Math.max(0, -rect.top);
  const progress = Math.min(1, scrolled / totalH);

  if (distValEl) distValEl.textContent = (progress * MAX_DISTANCE).toFixed(1);

  if (progress >= 0.99 && !spaceScrollDone) {
    spaceScrollDone = true;
    setTimeout(() => $('#mars-landing').scrollIntoView({ behavior: 'smooth' }), 350);
  }
}

/* Section 4 */
let landingTriggered = false;
const landingStatus  = $('#landingStatus');
const descentWrap    = $('#descentWrap');
const exploreBtn     = $('#exploreBtn');

function triggerLanding() {
  if (landingTriggered) return;
  landingTriggered = true;
  descentWrap.classList.add('descent-anim');

  [
    { t:'🔴 Rover is finding the best surface to land…', d:400,  cls:'' },
    { t:'⬇️  Surface found, rover is landing…',           d:3000, cls:'phase2' },
    { t:'✅ Rover landed successfully!',                  d:5600, cls:'phase3' },
  ].forEach(({ t, d, cls }) => {
    setTimeout(() => {
      if (landingStatus) { landingStatus.textContent = t; landingStatus.className = 'landing-status ' + cls; }
    }, d);
  });

  setTimeout(() => { if (exploreBtn) exploreBtn.classList.add('visible'); }, 6200);
}

if (exploreBtn) exploreBtn.addEventListener('click', () => $('#mars-surface').scrollIntoView({ behavior: 'smooth' }));

new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) triggerLanding(); });
}, { threshold: 0.35 }).observe($('#mars-landing'));

/* Section 5 */
const BADGE_DATA = {
  olympus: {
    title:'△ Olympus Mons', color:'#ff7043',
    body:"The tallest volcano in the solar system — 21 km high and 600 km wide. Nearly three times the height of Mount Everest. Its summit caldera is large enough to swallow the entire state of Arizona."
  },
  valles: {
    title:'≋ Valles Marineris', color:'#ffb300',
    body:"A canyon system stretching over 4,000 km — long enough to span the entire United States. Up to 7 km deep and 200 km wide, it dwarfs Earth's Grand Canyon in every dimension."
  },
  water: {
    title:'💧 Water Ice', color:'#4fc3f7',
    body:"Vast deposits of water ice lie beneath Mars' polar caps and just under the surface. Up to 5 million km³ of frozen water — enough to cover the planet in a 35-metre deep ocean if melted."
  },
  moons: {
    title:'🌙 Two Moons', color:'#ce93d8',
    body:"Phobos and Deimos — Mars' two small, potato-shaped moons. Phobos orbits so close it will eventually crash into Mars in ~50 million years. Deimos is so small it looks like a bright star from the surface."
  },
  atmosphere: {
    title:'🌀 Atmosphere', color:'#80cbc4',
    body:"Mars' thin atmosphere is 95% CO₂ and just 1% as dense as Earth's. Perseverance's MOXIE experiment successfully produced oxygen from CO₂ — a breakthrough for future human missions."
  },
};

const bcOverlay = $('#bcOverlay');
const bcCard    = $('#bcCard');
const bcClose   = $('#bcClose');
const bcTitle   = $('#bcTitle');
const bcBody    = $('#bcBody');
const roverSvg  = $('#surfaceRoverSvg');
let   roverPaused = false;

function openBadge(type) {
  const d = BADGE_DATA[type];
  if (!d) return;
  bcTitle.textContent = d.title;
  bcTitle.style.color = d.color;
  bcBody.textContent  = d.body;
  bcOverlay.classList.add('open');
  bcCard.classList.add('open');
  roverPaused = true;
  if (roverSvg) roverSvg.classList.add('paused');
  bcClose.focus();
}

function closeBadge() {
  bcOverlay.classList.remove('open');
  bcCard.classList.remove('open');
  roverPaused = false;
  if (roverSvg) roverSvg.classList.remove('paused');
}

if (bcClose)   bcClose.addEventListener('click',  closeBadge);
if (bcOverlay) bcOverlay.addEventListener('click', closeBadge);

$$('[data-badge]').forEach(btn => {
  btn.addEventListener('click', () => openBadge(btn.dataset.badge));
  btn.addEventListener('keydown', e => {
    if (e.key==='Enter'||e.key===' ') { e.preventDefault(); openBadge(btn.dataset.badge); }
  });
});

let roverOffset = 0;
let roverDir    = 1;

(function animRover() {
  if (!roverPaused) {
    const maxTravel = window.innerWidth / 2 - 80;
    roverOffset += roverDir * 0.8;
    if (roverOffset >  maxTravel) roverDir = -1;
    if (roverOffset < -maxTravel) roverDir =  1;
    const track = $('.surface-rover-track');
    if (track) track.style.transform = `translateX(${roverOffset}px)`;
  }
  requestAnimationFrame(animRover);
})();

(function createDust() {
  const c = $('#dustParticles');
  if (!c) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'dust-particle';
    const z = 2 + Math.random() * 5;
    p.style.cssText = `width:${z}px;height:${z}px;`
      + `left:${Math.random()*100}%;top:${40+Math.random()*40}%;`
      + `animation:floatP ${4+Math.random()*6}s ease-in-out infinite ${Math.random()*4}s;`
      + `--dx:${(Math.random()-.5)*50}px;--dy:${(Math.random()-.5)*25}px`;
    c.appendChild(p);
  }
})();

/* Section 6 */
const returnBtn = $('#returnBtn');
if (returnBtn) {
  returnBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      spaceScrollDone  = false;
      landingTriggered = false;
      if (landingStatus) { landingStatus.textContent = '🔴 Entering Mars atmosphere…'; landingStatus.className = 'landing-status'; }
      if (exploreBtn)    exploreBtn.classList.remove('visible');
      if (descentWrap)   descentWrap.classList.remove('descent-anim');
    }, 1000);
  });
}

(function createGold() {
  const c = $('#completeParticles');
  if (!c) return;
  const cols = ['#ffd700','#ff8c00','#fff176','#69f0ae','#00e5ff'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'gold-particle';
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;`
      + `background:${cols[i%cols.length]};`
      + `--dur:${4+Math.random()*6}s;--delay:${Math.random()*4}s;`
      + `--dx:${(Math.random()-.5)*90}px;--dy:${(Math.random()-.5)*70}px`;
    c.appendChild(p);
  }
})();

function onScroll() {
  updateProgress();
  updateDots();
  updateSpace();
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBadge(); });
