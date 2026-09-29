(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const nome = (params.get('nome') || '').trim().slice(0,100);
  const email = (params.get('email') || '').trim().slice(0,254);
  // Treat URL values as untrusted text, never HTML. No analytics on this page.
  document.querySelector('#vip-greeting').textContent = nome ? `Olá, ${nome}.` : 'Olá.';
  const button = document.querySelector('#vip-confirm');
  const feedback = document.querySelector('#vip-feedback');
  const URL_WEBHOOK_CLICKUP = window.SITE_CONFIG?.vipWebhookUrl;
  let endpoint;
  try { const url = new URL(URL_WEBHOOK_CLICKUP); if(url.protocol === 'https:') endpoint=url.href; } catch {}
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    button.disabled=true;feedback.textContent='Seu link está incompleto. Abra novamente o link recebido por e-mail ou cadastre-se na página do empreendimento.';return;
  }
  if (!endpoint) {button.disabled=true;feedback.textContent='A confirmação prioritária será disponibilizada em breve.';return;}
  let pending=false, completed=false;
  button.addEventListener('click',async()=>{
    if(pending || completed)return;
    pending=true;button.disabled=true;button.textContent='Processando...';feedback.textContent='';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nome,email}),signal:controller.signal});
      const data=await response.json().catch(()=>null);
      if(!response.ok || data?.success!==true)throw new Error('Not confirmed');
      completed=true;document.querySelector('#vip-action').hidden=true;
      const success=document.querySelector('#vip-success');success.hidden=false;success.focus();
    }catch{feedback.textContent='Não foi possível confirmar agora. Tente novamente.';}
    finally{clearTimeout(timeout);pending=false;if(!completed){button.disabled=false;button.textContent='Confirmar Interesse Prioritário';}}
  });
})();
