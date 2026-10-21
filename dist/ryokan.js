(() => {
  const header=document.querySelector('.site-header');
  const menu=document.getElementById('primary-menu');
  const toggle=document.querySelector('.menu-toggle');
  const compactMenu=matchMedia('(max-width:980px)');
  const links=[...menu.querySelectorAll('a[href^="#"]')];
  const sections=links.map(link=>document.getElementById(link.hash.slice(1)));
  function closeMenu(restoreFocus=false){
    header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');
    if(restoreFocus)toggle.focus();
  }
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';header.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    if(open)links[0].focus();
  });
  header.addEventListener('click',event=>{if(event.target.closest('a[href^="#"]'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')closeMenu(true);});
  document.addEventListener('click',event=>{if(!header.contains(event.target)&&toggle.getAttribute('aria-expanded')==='true')closeMenu();});
  compactMenu.addEventListener('change',()=>closeMenu());
  let frame=false;
  function updateActive(){
    frame=false;let active=-1;
    sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=160)active=i;});
    if(document.getElementById('cadastro').getBoundingClientRect().top<=160)active=-1;
    links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(updateActive);}},{passive:true});
  addEventListener('resize',updateActive,{passive:true});updateActive();
  const tabs=[...document.querySelectorAll('[data-plan]')];
  function select(size,focus=false){
    tabs.forEach(tab=>{const active=tab.dataset.plan===size;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById('panel-'+tab.dataset.plan).hidden=!active;if(active&&focus)tab.focus();});
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(tab.dataset.plan));
    tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(tabs[next].dataset.plan,true);}});
  });
  document.querySelectorAll('[data-select-plan]').forEach(link=>link.addEventListener('click',()=>select(link.dataset.selectPlan)));
})();
