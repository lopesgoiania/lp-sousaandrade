import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { TextEffect } from '@/components/ui/text-effect';

function OpportunityTitle() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) {
      setTrigger(true);
      return;
    }

    const section = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrigger(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -60px 0px' }
    );

    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={ref} style={{ margin: 0, minHeight: '1.2em' }}>
      {reduced ? <>Novos espaços.<br /><em>Grandes possibilidades.</em></> : trigger ? (
        <>
          <TextEffect per="word" preset="slide" trigger={trigger} as="span">
            Novos espaços.
          </TextEffect>
          <br />
          <em>
            <TextEffect per="word" preset="slide" delay={0.2} trigger={trigger} as="span">
              Grandes possibilidades.
            </TextEffect>
          </em>
        </>
      ) : (
        <span style={{ opacity: 0 }}>
          Novos espaços.<br /><em>Grandes possibilidades.</em>
        </span>
      )}
    </h2>
  );
}

const element = document.getElementById('opportunity-title');
if (element) {
  createRoot(element).render(<OpportunityTitle />);
}
