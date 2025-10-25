import React, { useRef, useState, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard = ({ 
  children, 
  className,
  spotlightColor = 'rgba(255, 127, 80, 0.18)' // Faint coral
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative rounded-lg overflow-hidden', className)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `
              radial-gradient(
                400px circle at ${mousePosition.x}px ${mousePosition.y}px,
                ${spotlightColor},
                transparent 60%
              )
            `,
          }}
        />
      )}
      {children}
    </div>
  );
};
