'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function PremiumCursor() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // We MUST use useMotionValue instead of useState to prevent massive React render lag
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-snappy, buttery spring physics for the trail to remove any slow/laggy feeling
  const springConfig = { damping: 35, stiffness: 800, mass: 0.05 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Dynamic hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.getAttribute('data-cursor') === 'hover'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />

      {/* Sleek core Arrow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-10000 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-2px',
          translateY: '-2px',
          willChange: 'transform',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 3L21 11.5L12 13L10 22L4.5 3Z"
            fill="currentColor"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Premium glowing aura trailing behind */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full transition-all duration-300 ease-out"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? '70px' : '44px',
          height: isHovered ? '70px' : '44px',
          backgroundColor: isHovered ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.12)',
          border: isHovered ? '1.5px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isHovered ? '0 0 25px rgba(139, 92, 246, 0.4)' : '0 0 10px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(3px)',
          // When hovered, drop the z-index to 0 (behind links/buttons) and elevate regular z-index to 9999
          zIndex: isHovered ? 0 : 9999,
          willChange: 'transform, width, height',
        }}
      />
    </>
  );
}
