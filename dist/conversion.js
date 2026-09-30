(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const save = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional. */ } };
  const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
  const query = new URLSearchParams(location.search);
  const attribution = read('sa_attribution') || {};
  keys.forEach(key => { if (query.has(key)) attribution[key] = query.get(key).slice(0,500); });
  save('sa_attribution', attribution);
  const landing = read('sa_landing') || {landing_page:location.origin + location.pathname, arrived_at:new Date().toISOString()};
  save('sa_landing', landing);
  let intent = read('sa_intent');
  if (!['morar','investir'].includes(intent)) intent = 'nao_informado';
  function track(event, extra = {}) {
    window.dataLayer = window.dataLayer || [];
    // No contact data or query strings are sent to analytics.
    window.dataLayer.push({event,form_id:"form-contato",lead_intent:intent,page_location:location.origin + location.pathname,...extra});
  }
  window.LeadContext = Object.freeze({track,payload:()=>({lead_intent:intent,attribution:{...attribution},...landing,submitted_at:new Date().toISOString()})});
  document.addEventListener('click', event => {
    const card = event.target.closest?.('a[data-interest]');
    if (card) { intent=card.dataset.interest.toLowerCase();save('sa_intent',intent);track('lead_intent_'+intent); }
    if (event.target.closest?.('[data-hero-cta], .hero-copy a[href="#cadastro"]')) track('hero_cta_click');
    if (event.target.closest?.('#location-map-link[href]')) track('maps_click',{source:'location_section'});
    const map = event.target.closest?.('[data-view]');
    const summary = event.target.closest?.('.places summary');
    if (map || summary) track('location_interaction',{interaction_type:map?'map_view':'accordion',location_item:map?.dataset.view || summary.textContent.trim()});
  });
  let started=false;
  const form=document.querySelector('#form-contato');
  const start=event=>{if(!started && event.isTrusted && event.target.matches('input:not([name="company"]),button[type="submit"]')){started=true;track('form_start');}};
  form.addEventListener('input',start);form.addEventListener('click',start);form.addEventListener('focusin',start);

  const box=document.querySelector('#vsl-player');
  const cover=box.querySelector('button');
  const thumbnail=box.querySelector('img');
  const feedback=document.querySelector('#vsl-feedback');
  const media=matchMedia('(max-width: 760px), (max-width: 1024px) and (orientation: portrait)');
  let selected, activated=false, player, timer, apiPromise;
  const milestones=new Set();
  function select(){
    if(activated)return;
    const vertical=media.matches;
    selected={video_id:vertical?'iPDSv4ugkNQ':'UowYhUXAkWg',video_orientation:vertical?'mobile_vertical':'desktop_horizontal'};
    box.classList.toggle('vertical',vertical);
    // Supplied custom artwork can replace the corresponding video's preview.
    thumbnail.src=(vertical?config.vslThumbnailVertical:config.vslThumbnailHorizontal) || `https://i.ytimg.com/vi/${selected.video_id}/hqdefault.jpg`;
    thumbnail.width=vertical?540:1280;thumbnail.height=vertical?960:720;
  }
  select();media.addEventListener('change',select);
  function loadAPI(){
    if(window.YT?.Player)return Promise.resolve();
    if(apiPromise)return apiPromise;
    apiPromise=new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(new Error('YouTube timeout')),15000);
      const previous=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=()=>{clearTimeout(timeout);previous?.();resolve();};
      const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';
      script.onerror=()=>{clearTimeout(timeout);reject(new Error('YouTube unavailable'));};document.head.append(script);
    }).catch(error=>{apiPromise=null;throw error;});
    return apiPromise;
  }
  function sample(){
    if(!player || player.getPlayerState?.()!==1)return;
    const duration=player.getDuration();const progress=duration>0?player.getCurrentTime()/duration:0;
    for(const mark of [25,50,75]) if(progress>=mark/100 && !milestones.has(mark)){milestones.add(mark);track('vsl_'+mark,selected);}
  }
  cover.addEventListener('click',async()=>{
    if(activated)return;
    activated=true;cover.disabled=true;feedback.textContent='Carregando apresentação…';
    if(!milestones.has('play')){milestones.add('play');track('vsl_play',selected);}
    try{
      await loadAPI();
      const mount=document.createElement('div');box.append(mount);
      player=new YT.Player(mount,{host:'https://www.youtube-nocookie.com',videoId:selected.video_id,width:'100%',height:'100%',playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin},events:{
        onReady:event=>{cover.hidden=true;feedback.textContent='';event.target.getIframe().title='Apresentação Sousa Andrade';event.target.getIframe().focus();event.target.playVideo();},
        onStateChange:event=>{clearInterval(timer);if(event.data===1){feedback.textContent='';timer=setInterval(sample,500);}if(event.data===0&&!milestones.has('complete')){milestones.add('complete');track('vsl_complete',selected);}},
        onAutoplayBlocked:()=>{feedback.textContent='Toque no play do vídeo para começar.';},
        onError:()=>{clearInterval(timer);feedback.textContent='Não foi possível reproduzir. Tente novamente.';player?.destroy();activated=false;cover.hidden=false;cover.disabled=false;}
      }});
    }catch{activated=false;cover.disabled=false;feedback.textContent='Não foi possível carregar. Toque no play para tentar novamente.';}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)player?.pauseVideo?.();});
  window.addEventListener('pagehide',()=>clearInterval(timer));
})();
