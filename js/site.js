(() => {
  const html = document.documentElement;

  // English first; Persian on request (remembered). Text lives in the markup in English, Persian in data-fa.
  const nodes = [...document.querySelectorAll('[data-fa]')].map(el => ({ el, en: el.innerHTML }));
  const btn = document.querySelector('.lang');
  const set = lang => {
    const fa = lang === 'fa';
    html.lang = fa ? 'fa' : 'en'; html.dir = fa ? 'rtl' : 'ltr';
    nodes.forEach(n => n.el.innerHTML = fa ? n.el.dataset.fa : n.en);
    if (btn) btn.textContent = fa ? 'EN' : 'FA';
    document.querySelectorAll('.pill b').forEach(b => b.textContent = fa ? '←' : '→');
    try { localStorage.setItem('lang', lang); } catch (e) {}
  };
  if (btn) btn.addEventListener('click', () => set(html.lang === 'fa' ? 'en' : 'fa'));
  try { if (localStorage.getItem('lang') === 'fa') set('fa'); } catch (e) {}

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // intro: his end-card eyes, once per visit, then the page opens
  const intro = document.querySelector('.intro');
  if (intro) {
    let seen = /nointro/.test(location.search); try { seen = seen || sessionStorage.getItem('intro') === '1'; } catch (e) {}
    if (seen || still) intro.remove();
    else {
      const v = intro.querySelector('video'), done = () => { intro.classList.add('out'); setTimeout(() => intro.remove(), 900); try { sessionStorage.setItem('intro', '1'); } catch (e) {} };
      v.addEventListener('ended', done); setTimeout(done, 3500); // fallback if autoplay is blocked
    }
  }

  // every click: when the finger lifts, the eyes blink there, like the end of every clip
  if (!still) {
    const b = document.createElement('video');
    b.className = 'blinker'; b.src = (document.body.dataset.root || '') + 'media/eyes.mp4';
    b.muted = true; b.playsInline = true; b.preload = 'auto'; b.setAttribute('aria-hidden', 'true');
    document.body.appendChild(b);
    addEventListener('pointerup', e => {
      b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
      b.currentTime = 0; b.classList.add('on'); b.play().catch(() => {});
    });
    b.addEventListener('ended', () => b.classList.remove('on'));
  }
})();
