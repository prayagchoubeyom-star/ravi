import type { FC, SVGProps } from 'react';

type CryptoIconProps = {
  ticker: string;
  className?: string;
};

const iconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  BTC: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path d="M21.73 18.29c.63-1.02.9-2.22.8-3.46a4.58 4.58 0 00-4.8-4.32h-3.3v-2.8h-2.13v2.8h-1.6v2.12h1.6v7.35h-1.6v2.13h1.6v2.86h2.14v-2.86h.88c2.4 0 4.4-1.9 4.4-4.29 0-.6-.12-1.18-.35-1.73zm-5.43 3.5V17h3.33c1.1 0 2 .85 2 1.9 0 1.04-.9 1.9-2 1.9h-3.33zm0-4.63v-2.12h2.97c1.1 0 2 .85 2 1.9s-.9 1.9-2 1.9h-2.97l.01-1.68z" fill="#fff"/>
    </svg>
  ),
  ETH: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <path d="M16 3.42L15.75 4v13.5l7.5-4.5L16 3.42z" fill="#fff" fillOpacity=".6"/>
      <path d="M16 3.42L8.5 16.5l7.5 4.5V3.42z" fill="#fff"/>
      <path d="M16 22.75v5.83l.25.17 7.25-10.5-7.5 4.5z" fill="#fff" fillOpacity=".6"/>
      <path d="M16 28.75v-6l-7.5-4.5L16 28.75z" fill="#fff"/>
      <path d="M16 21l7.5-4.5-7.5-4.5v9z" fill="#fff" fillOpacity=".2"/>
      <path d="M8.5 16.5L16 21v-9L8.5 16.5z" fill="#fff" fillOpacity=".6"/>
    </svg>
  ),
  SOL: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="url(#sol-gradient)"/>
      <path d="M8 11h16v2H8v-2zm0 8h16v2H8v-2z" fill="url(#sol-lines)"/>
      <defs>
        <linearGradient id="sol-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9945FF"/>
          <stop offset="1" stopColor="#14F195"/>
        </linearGradient>
        <linearGradient id="sol-lines" x1="8" y1="11" x2="24" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14F195"/>
          <stop offset="1" stopColor="#9945FF"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Default: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="hsl(var(--muted))"/>
    </svg>
  ),
};

export const CryptoIcon = ({ ticker, className }: CryptoIconProps) => {
  const IconComponent = iconMap[ticker] || iconMap['Default'];
  return <IconComponent className={className} />;
};
