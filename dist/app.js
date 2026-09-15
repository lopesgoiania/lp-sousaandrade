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
    $('.mobile-cta').classList.toggle('visible', scrollY > h * .5 && formRect.top > h * .7);
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => { update(); drawBuilding(); }, { passive: true });
  reduced.addEventListener('change', () => { if (reduced.matches) { video.pause(); video.removeAttribute('src'); video.load(); } else if (config.earthVideo) { video.src = config.earthVideo; } update(); });
  update();

  // Delegation also covers React-rendered Beam cards.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-interest]');
    if (link) {
      const radio = $$('input[name="interest"]').find(input => input.value === link.dataset.interest);
      if (radio) radio.checked = true;
    }
  });

  const presentation = $('#presentation-video');
  const presentationPlaceholder = $('.vsl-placeholder');
  if (config.presentationVideo) {
    presentation.src = config.presentationVideo;
    presentation.hidden = false;
    presentationPlaceholder.hidden = true;
    if (config.presentationCaptions) {
      const track = document.createElement('track');
      track.kind = 'captions'; track.label = 'Português'; track.srclang = 'pt-BR';
      track.src = config.presentationCaptions; track.default = true;
      presentation.append(track);
    }
    presentation.addEventListener('error', () => {
      presentation.hidden = true; presentationPlaceholder.hidden = false;
      $('.vsl-status').textContent = 'Não foi possível carregar o vídeo. Tente recarregar a página.';
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) presentation.pause(); });

  // Ambient films load/play only in view, and preserve the user's pause choice.
  const ambientStates = [];
  for (const [id,source,noun] of [['shopping-loop',config.shoppingLoop,'shopping'],['park-loop',config.parkLoop,'parque']]) {
    const element = $('#'+id), button = element.parentElement.querySelector('.loop-toggle');
    if (!source) continue;
    const state = { element, source, visible:false, paused:false, failed:false };
    ambientStates.push(state);
    const label = () => {
      const paused = state.paused || reduced.matches;
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', `${paused?'Reproduzir':'Pausar'} animação do ${noun}`);
      $('span',button).textContent = paused?'Reproduzir':'Pausar';
      $('svg',button).innerHTML = paused ? '<path d="m8 5 11 7-11 7Z"/>' : '<path d="M8 5v14M16 5v14"/>';
    };
    state.sync = () => {
      if (state.failed) return;
      button.hidden = reduced.matches;
      label();
      if (state.visible && !state.paused && !reduced.matches && !document.hidden) {
        if (!element.getAttribute('src')) element.src=source;
        element.play().catch(() => { state.paused=true; label(); });
      } else element.pause();
    };
    button.addEventListener('click',()=>{state.paused=!state.paused;state.sync();});
    element.addEventListener('error',()=>{state.failed=true;element.pause();element.removeAttribute('src');element.load();button.hidden=true;});
    new IntersectionObserver(([entry])=>{state.visible=entry.isIntersecting;state.sync();},{threshold:.18}).observe(element);
    state.sync();
  }
  const syncAmbient=()=>ambientStates.forEach(state=>state.sync());
  document.addEventListener('visibilitychange',syncAmbient);
  reduced.addEventListener('change',syncAmbient);

  // One-shot editorial entrances; page content remains visible without JS.
  const runningMotions = new Set();
  const motionObserver = new IntersectionObserver(entries=>{
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element=entry.target;motionObserver.unobserve(element);
      if(reduced.matches)continue;
      const frame=element.classList.contains('motion-frame');
      const animation=element.animate(frame
        ? [{clipPath:'inset(3% 0 3% 0 round 10px)',opacity:.7},{clipPath:'inset(0% 0 0% 0 round 10px)',opacity:1}]
        : [{transform:'translateY(22px)',opacity:.45},{transform:'translateY(0)',opacity:1}],
        {duration:frame?850:650,easing:'cubic-bezier(0.16,1,0.3,1)'});
      runningMotions.add(animation);animation.finished.then(()=>runningMotions.delete(animation)).catch(()=>{});
    }
  },{threshold:.12});
  $$('.motion-heading,.motion-frame,.opportunity-copy,.choices h2,.partnership,.contact-copy').forEach(element=>motionObserver.observe(element));
  let countFrame=0;
  const countNodes=$$('[data-count]');
  const finishCounts=()=>{cancelAnimationFrame(countFrame);countNodes.forEach(node=>node.textContent=node.dataset.count);};
  const countObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    countObserver.disconnect();
    if(reduced.matches){finishCounts();return;}
    const started=performance.now();
    function tick(now){const p=clamp((now-started)/1450);const eased=1-Math.pow(1-p,3);countNodes.forEach(node=>node.textContent=String(Math.round(Number(node.dataset.count)*eased)));if(p<1)countFrame=requestAnimationFrame(tick);}
    countFrame=requestAnimationFrame(tick);
  },{threshold:.35});
  countObserver.observe($('.typologies'));
  reduced.addEventListener('change',()=>{if(reduced.matches){runningMotions.forEach(animation=>animation.cancel());runningMotions.clear();finishCounts();}});

  const map = $('#territory-map');
  const mapBox = $('#map-canvas');
  if (config.illustratedMap) {
    $('[data-view="illustration"]').hidden = false;
    setMap('illustration');
  }
  function setMap(view) {
    const illustration = view === 'illustration' && !!config.illustratedMap;
    map.src = illustration ? config.illustratedMap : 'assets/satellite.webp';
    map.alt = illustration ? 'Ilustração conceitual isométrica do entorno, baseada na referência de satélite. Não é um mapa cadastral.' : 'Vista de satélite da região do Flamboyant, com marcador de referência fornecido para o empreendimento.';
    mapBox.classList.toggle('is-illustrated', illustration);
    $$('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === (illustration ? 'illustration' : 'satellite'))));
    $('.map-note').textContent = illustration ? 'Ilustração conceitual do entorno. Consulte a vista de satélite para referência da localização.' : 'Representação do entorno. A posição indicada é uma referência de localização.';
  }
  $$('[data-view]').forEach(button => button.addEventListener('click', () => setMap(button.dataset.view)));
  map.addEventListener('error', () => { if (mapBox.classList.contains('is-illustrated')) { setMap('satellite'); $('[data-view="illustration"]').hidden = true; } });
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

  const form = $('#lead-form');
  const submit = $('button[type="submit"]', form);
  const phone = $('#phone');
  const feedback = $('#form-feedback');
  let endpoint = null;
  try { if (config.leadEndpoint) { const url = new URL(config.leadEndpoint, location.origin); if (url.protocol === 'https:' || (url.origin === location.origin && location.hostname === 'localhost')) endpoint = url.href; } } catch { /* Keep unavailable if configuration is invalid. */ }
  submit.disabled = !endpoint;
  $('#availability').hidden = !!endpoint;
  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '');
    if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
    digits = digits.slice(0,11);
    phone.value = digits.length <= 2 ? digits : `(${digits.slice(0,2)}) ${digits.slice(2).replace(/^(\d{4,5})(\d{4})$/, '$1-$2')}`;
  });
  function fieldError(id, message) { const el=$(`#${id}`); el.setAttribute('aria-invalid',String(!!message)); $(`#${id}-error`).textContent=message; }
  ['name','phone','consent'].forEach(id => $(`#${id}`).addEventListener('input', () => fieldError(id,'')));
  let pending=false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    if (!endpoint) { feedback.className='form-feedback';feedback.textContent='O cadastro será aberto em breve.';return; }
    const name=$('#name').value.trim(); const digits=phone.value.replace(/\D/g,''); const consent=$('#consent').checked;
    const errors={name:name.length<2?'Informe seu nome para continuar.':'',phone:!/^\d{10,11}$/.test(digits)?'Informe um telefone válido com DDD.':'',consent:!consent?'Autorize o contato para enviar seu cadastro.':''};
    Object.entries(errors).forEach(([id,message])=>fieldError(id,message));
    const invalid=Object.keys(errors).find(id=>errors[id]); if(invalid){$(`#${invalid}`).focus();return;}
    if ($('#company').value) return;
    pending=true; submit.disabled=true; $('span',submit).textContent='Enviando…'; feedback.textContent='';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const query=new URLSearchParams(location.search);const attribution={}; ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(key=>{if(query.has(key))attribution[key]=query.get(key).slice(0,200);});
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({name,phone:`+55${digits}`,interest:$('input[name="interest"]:checked')?.value||null,consent:true,consentText:$('.consent span').textContent,source:'sousa-andrade-flamboyant',attribution})});
      const data=await response.json().catch(()=>null);
      if(!response.ok||data?.success!==true)throw new Error('Not accepted');
      feedback.className='form-feedback success';feedback.textContent='Cadastro recebido. Um especialista entrará em contato com você.';
      form.reset();window.dispatchEvent(new CustomEvent('lead:accepted',{detail:{source:'sousa-andrade-flamboyant'}}));
    } catch {feedback.className='form-feedback error';feedback.textContent='Não foi possível enviar agora. Seus dados continuam aqui. Tente novamente.';}
    finally{clearTimeout(timeout);pending=false;submit.disabled=false;$('span',submit).textContent='Receber informações';}
  });
})();
