import { useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Reaches the sections named by the nav links, as in /?section=story.
export const useScrollToSection = () => {
  const { key, search } = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const sectionId = new URLSearchParams(search).get('section');
    if (!sectionId) return;
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [key, search, prefersReducedMotion]);
};
