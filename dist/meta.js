(() => {
 'use strict';
 const pixel='3195858410596854';let enabled=false,external='',pageSent=false,videoSeen=false,videoSent=false;
 const read=key=>{try{return localStorage.getItem(key);}catch{return null;}};
 const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
 const id=()=>crypto.randomUUID();
 const cookie=name=>document.cookie.split('; ').find(s=>s.startsWith(name+'='))?.slice(name.length+1)||'';
 const setCookie=(name,value)=>{document.cookie=`${name}=${value}; Path=/; Max-Age=7776000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;};
 const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(n=>n.toString(16).padStart(2,'0')).join('');
 function context(event_id=id()){
  if(!enabled)return null;
  const c={consent:true,event_id,external_id:external};for(const k of ['fbp','fbc']){const v=cookie('_'+k);if(v)c[k]=v;}return c;
 }
 async function boot(){
  if(enabled)return;enabled=true;external=read('sa_meta_external_id')||id();save('sa_meta_external_id',external);
  if(!cookie('_fbp'))setCookie('_fbp',`fb.1.${Date.now()}.${Math.floor(Math.random()*1e10)}`);
  const click=new URLSearchParams(location.search).get('fbclid');if(click&&/^[a-zA-Z0-9_-]{1,500}$/.test(click))setCookie('_fbc',`fb.1.${Date.now()}.${click}`);
  if(!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments);};if(!window._fbq)window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[];const s=document.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.append(s);}
  window.fbq('consent','grant');window.fbq('init',pixel,{external_id:await sha(external)});
  if(!pageSent){pageSent=true;event('PageView');}if(videoSeen&&!videoSent){videoSent=true;event('ViewContent');}
 }
 function event(name){if(!enabled)return;const c=context();window.fbq('trackSingle',pixel,name,{content_name:'Sousa Andrade — Flamboyant'},{eventID:c.event_id});fetch('/api/meta-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_name:name,context:c}),keepalive:true}).catch(()=>{});}
 window.MetaTracking={context,lead:async(p,c)=>{
  if(!enabled||!c)return;
  try{const names=p.nome.trim().toLowerCase().split(/\s+/);const values={em:p.email.trim().toLowerCase(),ph:p.telefone.replace(/\D/g,''),fn:names[0],external_id:c.external_id};if(names.length>1)values.ln=names.slice(1).join(' ');if(/^[a-z]{2}$/i.test(p.phone_country||''))values.country=p.phone_country.toLowerCase();
   const hashed={};for(const [k,v]of Object.entries(values))hashed[k]=await sha(v);
   window.fbq('set','userData',pixel,hashed);window.fbq('trackSingle',pixel,'Lead',{content_name:'Sousa Andrade — Flamboyant'},{eventID:c.event_id});
  }catch{/* Measurement must never block registration. */}
 }};
 window.addEventListener('sa:video-playing',()=>{videoSeen=true;if(enabled&&!videoSent){videoSent=true;event('ViewContent');}});
 const banner=document.getElementById('advertising-consent');
 const choose=value=>{save('sa_ad_consent_v1',value);banner.hidden=true;if(value==='granted')boot();else{enabled=false;window.fbq?.('consent','revoke');for(const k of ['_fbp','_fbc'])document.cookie=`${k}=; Path=/; Max-Age=0; SameSite=Lax`;}};
 document.getElementById('advertising-accept').addEventListener('click',()=>choose('granted'));
 document.getElementById('advertising-reject').addEventListener('click',()=>choose('denied'));
 document.querySelectorAll('[data-ad-preferences]').forEach(el=>el.addEventListener('click',()=>{banner.hidden=false;}));
 const choice=read('sa_ad_consent_v1');if(choice==='granted')boot();else if(choice!=='denied')banner.hidden=false;
})();
