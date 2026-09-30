(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const journey = $('.journey');
  const hero = $('.hero-content');
  const arrival = $('.arrival-copy');
  const satellite = $('.satellite-layer');
  const film = $('.film-layer');
  const video = $('#earth-video');
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let targetTime = 0;
  let videoReady = false;
  if (config.earthPoster) {
    video.poster = config.earthPoster;
    film.style.backgroundImage = `url("${config.earthPoster}")`;
  }
  if (config.earthVideo && !reduced.matches) {
    video.src = config.earthVideo;
    video.addEventListener('loadedmetadata', () => { videoReady = true; update(); });
    video.addEventListener('error', () => { video.style.visibility = 'hidden'; });
    video.addEventListener('seeked', () => {
      if (Math.abs(video.currentTime - targetTime) > .05 && !video.seeking) video.currentTime = targetTime;
    });
  }
  let ticking = false;
  function update() {
    ticking = false;
    const h = innerHeight;
    const progress = reduced.matches ? 0 : clamp(-journey.getBoundingClientRect().top / Math.max(1, journey.offsetHeight - h));
    const crossfade = clamp((progress - .54) / .3);
    const heroOpacity = 1 - clamp((progress - .15) / .23);
    hero.style.opacity = heroOpacity;
    hero.style.transform = `translateY(${-progress * 100}px)`;
    hero.inert = heroOpacity < .08;
    satellite.style.opacity = crossfade;
    satellite.style.transform = `scale(${1.16 - crossfade * .16})`;
    const arrivalOpacity = clamp((progress - .62) / .22);
    arrival.style.opacity = arrivalOpacity;
    arrival.style.transform = `translateY(${-35 - arrivalOpacity * 15}%)`;
    arrival.setAttribute('aria-hidden', String(arrivalOpacity < .5));
    $('.journey-track b').style.width = `${5 + progress * 95}%`;
    $('.site-header').classList.toggle('scrolled', journey.getBoundingClientRect().bottom < 110);
    if (videoReady && Number.isFinite(video.duration)) {
      targetTime = Math.min(Math.max(0, video.duration - .08), clamp(progress / .8) * video.duration);
      if (!video.seeking && Math.abs(video.currentTime - targetTime) > .045) video.currentTime = targetTime;
    }
    const formRect = $('#cadastro').getBoundingClientRect();
    const vslRect = $('#vsl-player').getBoundingClientRect();
    const blocked = (formRect.top < h && formRect.bottom > 0) || (vslRect.top < h && vslRect.bottom > 0);
    const showCTA = scrollY > h && !blocked;
    $('.mobile-cta').classList.toggle('visible', showCTA);
    $('.mobile-cta').inert = !showCTA;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { update(); drawBuilding(); }, { passive: true });
  reduced.addEventListener('change', () => { if (reduced.matches) { video.pause(); video.removeAttribute('src'); video.load(); } else if (config.earthVideo) { video.src = config.earthVideo; } update(); });
  update();

  // Silent ambient films: lazy load in view, pause invisibly outside it.
  const ambientStates = [];
  for (const [id, source] of [['shopping-loop', config.shoppingLoop], ['park-loop', config.parkLoop]]) {
    const element = $('#'+id);
    if (!source) continue;
    const state = { element, visible:false, failed:false };
    state.sync = () => {
      if (state.failed) return;
      if (state.visible && !reduced.matches && !document.hidden) {
        if (!element.getAttribute('src')) element.src = source;
        element.muted = true;
        element.play().catch(() => { /* Poster remains if autoplay is blocked. */ });
      } else element.pause();
    };
    element.addEventListener('error', () => {state.failed=true;element.pause();element.removeAttribute('src');element.load();});
    new IntersectionObserver(([entry]) => {state.visible=entry.isIntersecting;state.sync();}).observe(element);
    ambientStates.push(state);
  }
  const syncAmbient = () => ambientStates.forEach(state => state.sync());
  document.addEventListener('visibilitychange', syncAmbient);
  reduced.addEventListener('change', syncAmbient);

  // One-shot editorial entrances; page content remains visible without JS.
  const runningMotions = new Set();
  const getMotionAnimation = (element) => {
    if (element.classList.contains('vsl-player')) {
      return {
        keyframes: [
          { transform: 'translateY(36px) scale(0.96)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 }
        ],
        options: { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('feature-shopping')) {
      return {
        keyframes: [
          { transform: 'translateX(-36px)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 }
        ],
        options: { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('feature-park')) {
      return {
        keyframes: [
          { transform: 'translateX(36px)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 }
        ],
        options: { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.id === 'map-canvas') {
      return {
        keyframes: [
          { clipPath: 'inset(4% round 12px)', transform: 'scale(1.03)', opacity: 0.6 },
          { clipPath: 'inset(0% round 12px)', transform: 'scale(1)', opacity: 1 }
        ],
        options: { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('building-art')) {
      return {
        keyframes: [
          { transform: 'scale(0.88) translateY(24px)', opacity: 0 },
          { transform: 'scale(1) translateY(0)', opacity: 1 }
        ],
        options: { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('choice-beam-cell') || element.classList.contains('choice')) {
      return {
        keyframes: [
          { transform: 'translateY(32px) rotateX(6deg)', opacity: 0 },
          { transform: 'translateY(0) rotateX(0deg)', opacity: 1 }
        ],
        options: { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('partner-logos')) {
      return {
        keyframes: [
          { transform: 'scale(0.85)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 }
        ],
        options: { duration: 700, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
      };
    }
    if (element.id === 'form-contato') {
      return {
        keyframes: [
          { transform: 'translateX(28px) translateY(12px)', opacity: 0 },
          { transform: 'translateX(0) translateY(0)', opacity: 1 }
        ],
        options: { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('contact-copy')) {
      return {
        keyframes: [
          { transform: 'translateX(-28px)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 }
        ],
        options: { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      };
    }
    if (element.classList.contains('motion-frame')) {
      return {
        keyframes: [
          { clipPath: 'inset(3% 0 3% 0 round 10px)', opacity: .7 },
          { clipPath: 'inset(0% 0 0% 0 round 10px)', opacity: 1 }
        ],
        options: { duration: 850, easing: 'cubic-bezier(0.16,1,0.3,1)' }
      };
    }
    return {
      keyframes: [
        { transform: 'translateY(24px)', opacity: .4 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      options: { duration: 650, easing: 'cubic-bezier(0.16,1,0.3,1)' }
    };
  };

  const motionObserver = new IntersectionObserver(entries=>{
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element=entry.target; motionObserver.unobserve(element);
      if(reduced.matches)continue;
      const spec = getMotionAnimation(element);
      const animation=element.animate(spec.keyframes, spec.options);
      runningMotions.add(animation); animation.finished.then(()=>runningMotions.delete(animation)).catch(()=>{});
    }
  },{threshold:.15, rootMargin: '0px 0px -40px 0px'});

  $$('.motion-heading, .vsl-heading, .vsl-player, .feature-shopping, .feature-park, #map-canvas, .opportunity-copy, .building-art, .choices h2, .choice-beam-cell, .partnership, .partner-logos, .contact-copy, #form-contato').forEach(element=>motionObserver.observe(element));

  let countFrame=0;
  const countNodes=$$('[data-count]');
  const finishCounts=()=>{cancelAnimationFrame(countFrame);countNodes.forEach(node=>node.textContent=node.dataset.count);};
  if(!reduced.matches) {
    countNodes.forEach(node=>node.textContent='0');
  }
  const countObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    countObserver.disconnect();
    if(reduced.matches){finishCounts();return;}
    const started=performance.now();
    function tick(now){const p=clamp((now-started)/1450);const eased=1-Math.pow(1-p,3);countNodes.forEach(node=>node.textContent=String(Math.round(Number(node.dataset.count)*eased)));if(p<1)countFrame=requestAnimationFrame(tick);}
    countFrame=requestAnimationFrame(tick);
  },{threshold:.3, rootMargin:'0px 0px -50px 0px'});
  const targetSec = $('.typologies');
  if(targetSec) countObserver.observe(targetSec);
  reduced.addEventListener('change',()=>{if(reduced.matches){runningMotions.forEach(animation=>animation.cancel());runningMotions.clear();finishCounts();}});

  $$('.places details').forEach(detail => detail.addEventListener('toggle', () => { if (detail.open) $$('.places details').forEach(other => { if (other !== detail) other.open = false; }); }));

  // An explicit wireframe volume, never a claimed architectural rendering.
  function drawBuilding() {
    const canvas = $('#building');
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    context.scale(dpr, dpr);
    const scale = Math.min(width / 520, height / 440);
    const point = (x, y, z) => [width / 2 + (x - y) * .86 * scale, height * .81 + (x + y) * .4 * scale - z * scale];
    function path(points, stroke, fill) { context.beginPath(); points.forEach((p, i) => { const q = point(...p); i ? context.lineTo(...q) : context.moveTo(...q); }); if (fill) { context.closePath(); context.fillStyle = fill; context.fill(); } if (stroke) { context.strokeStyle = stroke; context.lineWidth = 1; context.stroke(); } }
    for (let i = -150; i <= 150; i += 30) {
      path([[i,-150,0],[i,150,0]], '#242424'); path([[-150,i,0],[150,i,0]], '#242424');
    }
    const x=65,y=48,z=275;
    path([[-x,-y,0],[-x,y,0],[-x,y,z],[-x,-y,z]], '#e8232a99', '#e8232a09');
    path([[-x,y,0],[x,y,0],[x,y,z],[-x,y,z]], '#e8232ab0', '#e8232a14');
    path([[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z],[-x,-y,z]], '#ed555a');
    for (let k=0;k<=z;k+=17.1875) path([[-x,-y,k],[-x,y,k],[x,y,k],[x,-y,k]], '#a835395c');
    for (let k=-x;k<=x;k+=26) path([[k,y,0],[k,y,z]], '#db494d77');
    for (let k=-y;k<=y;k+=24) path([[-x,k,0],[-x,k,z]], '#db494d66');
    path([[-95,-75,1],[95,-75,1],[95,75,1],[-95,75,1],[-95,-75,1]], '#e8232a88');
    path([[x,-y,0],[x,-y,z]], '#e8232a77');
    const dot=point(-95,75,1); context.fillStyle='#e8232a';context.beginPath();context.arc(dot[0],dot[1],3,0,Math.PI*2);context.fill();
  }
  drawBuilding();

  const form = $('#form-contato');
  const submit = $('button[type="submit"]', form);
  const phone = $('#phone');
  const feedback = $('#form-feedback');
  const endpoint = '/api/leads';
  submit.disabled = false;
  $('#availability').hidden = true;

  function fieldError(id, message) { const el=$(`#${id}`); el.setAttribute('aria-invalid',String(!!message)); $(`#${id}-error`).textContent=message; }
  ['name','phone','email','consent'].forEach(id => $(`#${id}`).addEventListener('input', () => fieldError(id,'')));
  let pending=false;
  let delivery = null;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    window.LeadContext.track('form_submit');
    if (!endpoint) { feedback.className='form-feedback';feedback.textContent='O cadastro será aberto em breve.';return; }
    const email=$('#email').value.trim();
    const name=$('#name').value.trim(); const international=window.PhoneField?.getNumber() || ''; const digits=international.replace(/\D/g,''); const consent=$('#consent').checked;
    const errors={email:!email || !$('#email').validity.valid?'Informe um e-mail válido.':'',name:name.length<2?'Informe seu nome para continuar.':'',phone:!window.PhoneField?.isValid()?'Confira o número e o DDD/código do país.':'',consent:!consent?'Concorde com a politica de privacidade para enviar seu cadastro.':''};
    Object.entries(errors).forEach(([id,message])=>fieldError(id,message));
    const invalid=Object.keys(errors).find(id=>errors[id]); if(invalid){$(`#${invalid}`).focus();return;}
    if ($('#company').value) return;
    pending=true; submit.disabled=true; $('span',submit).textContent='Enviando…'; feedback.textContent='';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      // Independent delivery: CRM handles sales; n8n handles relationship workflows.
      const payload = {
        nome: name,
        email,
        telefone: international,
        form_id: form.id,
        phone_country: window.PhoneField.getCountry(),
        empreendimento: config.empreendimento,
        consent: true,
        consentText: $('.consent span').textContent,
        source: 'sousa-andrade-flamboyant',
        ...window.LeadContext.payload()
      };
      const identity = JSON.stringify([name,email,digits,payload.lead_intent]);
      if (!delivery || delivery.identity !== identity) delivery = {identity,payload,accepted:new Set()};
      const results = await Promise.allSettled(['crm','n8n'].map(async destination => {
        if (delivery.accepted.has(destination)) return;
        const response = await fetch(endpoint, {
          method:'POST', headers:{'Content-Type':'application/json'}, signal:controller.signal,
          body:JSON.stringify({destination,payload:delivery.payload})
        });
        const data = await response.json().catch(()=>null);
        if (!response.ok || data?.success !== true) throw new Error('Not accepted');
        delivery.accepted.add(destination);
      }));
      if (results.some(result=>result.status==='rejected')) throw new Error('Incomplete delivery');
      feedback.className='form-feedback success';feedback.textContent='Cadastro recebido. Um especialista Lopes entrará em contato com você.';
      window.LeadContext.track('generate_lead');
      delivery=null;form.reset();window.dispatchEvent(new CustomEvent('lead:accepted',{detail:{source:'sousa-andrade-flamboyant'}}));
    } catch {feedback.className='form-feedback error';feedback.textContent='Não foi possível enviar agora. Seus dados continuam aqui. Tente novamente.';}
    finally{clearTimeout(timeout);pending=false;submit.disabled=false;$('span',submit).textContent='Quero receber em primeira mão';}
  });
})();
