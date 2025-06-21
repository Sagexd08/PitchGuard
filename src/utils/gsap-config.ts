import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.config({
  force3D: false,
  nullTargetWarn: false,
  autoSleep: 60,
  units: {
    left: "px",
    top: "px",
    rotation: "deg"
  }
});

ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  ignoreMobileResize: true
});

export const createSafeAnimation = (target: any, vars: any) => {
  
  const safeVars = { ...vars };

  delete safeVars.onComplete;
  delete safeVars.onUpdate;
  delete safeVars.onStart;

  if (vars.onComplete && typeof vars.onComplete === 'function') {
    safeVars.onComplete = vars.onComplete;
  }
  if (vars.onUpdate && typeof vars.onUpdate === 'function') {
    safeVars.onUpdate = vars.onUpdate;
  }
  if (vars.onStart && typeof vars.onStart === 'function') {
    safeVars.onStart = vars.onStart;
  }
  
  return gsap.to(target, safeVars);
};

export const createSafeTimeline = (vars?: any) => {
  const safeVars = vars ? { ...vars } : {};

  delete safeVars.onComplete;
  delete safeVars.onUpdate;
  delete safeVars.onStart;
  
  const timeline = gsap.timeline(safeVars);

  if (vars?.onComplete && typeof vars.onComplete === 'function') {
    timeline.eventCallback('onComplete', vars.onComplete);
  }
  if (vars?.onUpdate && typeof vars.onUpdate === 'function') {
    timeline.eventCallback('onUpdate', vars.onUpdate);
  }
  if (vars?.onStart && typeof vars.onStart === 'function') {
    timeline.eventCallback('onStart', vars.onStart);
  }
  
  return timeline;
};

export const createSafeScrollTrigger = (vars: any) => {
  const safeVars = { ...vars };

  safeVars.invalidateOnRefresh = true;
  safeVars.refreshPriority = 0;

  if (vars.onEnter && typeof vars.onEnter === 'function') {
    safeVars.onEnter = vars.onEnter;
  }
  if (vars.onLeave && typeof vars.onLeave === 'function') {
    safeVars.onLeave = vars.onLeave;
  }
  if (vars.onEnterBack && typeof vars.onEnterBack === 'function') {
    safeVars.onEnterBack = vars.onEnterBack;
  }
  if (vars.onLeaveBack && typeof vars.onLeaveBack === 'function') {
    safeVars.onLeaveBack = vars.onLeaveBack;
  }
  
  return ScrollTrigger.create(safeVars);
};

export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  ScrollTrigger.refresh();
};

export const animationPresets = {
  fadeIn: {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  },
  slideUp: {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },
  slideDown: {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  },
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)"
  },
  rotateIn: {
    rotation: 180,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  }
};

export { gsap, ScrollTrigger };
export default gsap;
