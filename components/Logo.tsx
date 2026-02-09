
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Hlavné písmeno D */}
      <path 
        d="M15 20V80H45C65 80 75 70 75 50C75 30 65 20 45 20H15Z" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Vnútorné Š */}
      <path 
        d="M25 45H40C40 45 42 45 42 48C42 51 40 51 40 51H28C28 51 26 51 26 54C26 57 28 57 28 57H42" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M31 40L34 43L37 40" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Glóbus */}
      <circle cx="65" cy="55" r="22" stroke="currentColor" strokeWidth="3" />
      <path d="M43 55H87" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
      <path d="M65 33V77" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
      <ellipse cx="65" cy="55" rx="10" ry="22" stroke="currentColor" strokeWidth="2" />

      {/* Dynamická šípka */}
      <path 
        d="M45 75C45 75 55 85 75 75C95 65 85 35 85 35" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M80 42L85 35L92 40" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
