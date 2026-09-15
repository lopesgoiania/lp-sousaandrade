import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BorderBeam } from 'border-beam';

const options = [
  { interest: 'Morar', label: 'Para morar', title: <>Menos distâncias.<br />Mais cidade.</>, description: 'Um compacto conectado ao seu ritmo e às possibilidades do entorno.', cta: 'Quero morar aqui' },
  { interest: 'Investir', label: 'Para investir', title: <>Um olhar atento.<br />Um novo endereço.</>, description: 'Conheça o projeto e receba as informações para avaliar sua próxima decisão.', cta: 'Tenho interesse em investir' },
];

function Choice({ item }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => setActive(visible && !preference.matches && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .15 });
    observer.observe(ref.current);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); preference.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div className="choice-beam-cell" ref={ref}>
    <BorderBeam size="md" colorVariant="colorful" strength={0.7} theme="dark" active={active} className="choice-beam" borderRadius={14}>
      <a href="#cadastro" className="choice" data-interest={item.interest}>
        <span>{item.label}</span><h3>{item.title}</h3><p>{item.description}</p>
        <span className="choice-action">{item.cta}<svg aria-hidden="true"><use href="#diagonal" /></svg></span>
      </a>
    </BorderBeam>
  </div>;
}

const element = document.getElementById('choices-beam');
if (element) createRoot(element).render(options.map(item => <Choice key={item.interest} item={item} />));
