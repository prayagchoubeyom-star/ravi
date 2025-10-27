
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
  ADA: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#0033AD"/>
        <path d="M16 6.5C10.75 6.5 6.5 10.75 6.5 16s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5S21.25 6.5 16 6.5zm0 17C11.86 23.5 8.5 20.14 8.5 16S11.86 8.5 16 8.5 23.5 11.86 23.5 16s-3.36 7.5-7.5 7.5z" fill="#fff"/>
        <path d="M12.29 16.69l3.71 3.71 3.71-3.71-1.2-1.2-1.85 1.85v-5.65h-1.33v5.65l-1.85-1.85-1.19 1.2z" fill="#fff"/>
        <circle cx="16" cy="11" r="1" fill="#fff"/>
        <circle cx="12.5" cy="13.5" r="1" fill="#fff"/>
        <circle cx="19.5" cy="13.5" r="1" fill="#fff"/>
        <circle cx="10" cy="17" r="1" fill="#fff"/>
        <circle cx="22" cy="17" r="1" fill="#fff"/>
    </svg>
  ),
  XRP: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#000"/>
        <path d="M14.54 13.59l2.83-2.83-1.42-1.42-2.83 2.83-1.41 1.41 1.41 1.42 2.83-2.83-1.42-1.41zM17.46 18.41l-2.83 2.83 1.42 1.42 2.83-2.83 1.41-1.41-1.41-1.42-2.83 2.83 1.42 1.41zM9.3 16l2.83 2.83-1.42 1.41L7.88 17.4l-1.41-1.41 1.41-1.41 2.83 2.83L9.3 16zm13.4-1.41l-1.41 1.41L18.47 13.17l1.41-1.42 2.83 2.83 1.41 1.41-1.42 1.41-2.82-2.83z" fill="#fff"/>
    </svg>
  ),
  DOGE: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#C2A633"/>
        <path d="M16.14 13.92c-1.12.3-2.6.08-3.52-.73-.9-.8-1.04-2.1-.4-3.18.63-1.08 1.9-1.63 3.02-1.33 1.12-.3 2.6-.08 3.52.73.9.8 1.04 2.1.4 3.18-.63 1.08-1.9 1.63-3.02 1.33zm5.02-3.8c.84.4 1.3 1.25 1.22 2.15-.08.9-.66 1.68-1.5 2.08l.25 3.32h-1.5l-.3-3.56c-.92.56-2.07.75-3.15.5-.83-.17-1.6-.68-2.05-1.38l-1.5-2.58 2.2-1.27.76 1.3c.7.48 1.6.62 2.4.3l.3-3.57 2.6-.07zm-9.3 9.4s-1.02-1.2-2.1-1.47c-1.06-.27-2.1.3-2.1.3s1.2-.68 2.04-.44c.83.23 2.16 1.6 2.16 1.6z" fill="#fff"/>
    </svg>
  ),
  AVAX: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#E84142"/>
        <path d="M22.06 19.12l-6.06 4.38-6.06-4.38 2.38-8.62h7.36l2.38 8.62zM9 18.25l7 5.25 7-5.25-3-11.25h-8L9 18.25z" fill="#fff"/>
    </svg>
  ),
  LINK: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#375BD2"/>
        <path d="M12.9 19.1h-3.4c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5h3.4v-1.7h-3.4c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2h3.4v-1.7zm6.2-7.5h-5.9v1.7h5.9v4.1h-5.9v1.7h5.9c1.4 0 2.5-1.1 2.5-2.5v-2.5c0-1.4-1.1-2.5-2.5-2.5zm2.9 2.5c0-2.3-1.9-4.2-4.2-4.2h-5.9v1.7h5.9c1.4 0 2.5 1.1 2.5 2.5v2.5c0 1.4-1.1 2.5-2.5 2.5h-5.9v1.7h5.9c2.3 0 4.2-1.9 4.2-4.2v-2.5z" fill="#fff"/>
    </svg>
  ),
  MATIC: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#8247E5"/>
        <path d="M16 6.5l-6 3.8v7.4l6 3.8 6-3.8v-7.4L16 6.5zm-4.3 4.8l4.3-2.7 4.3 2.7v5.4l-4.3 2.7-4.3-2.7v-5.4z" fill="#fff"/>
    </svg>
  ),
  LTC: (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
        <path d="M14.5 22.5l2.8-10.4-1.4-.4-2.8 10.4 1.4.4zm3.9-12.3l-1.4-.4-5.6 20.8 1.4.4 5.6-20.8z" fill="#fff"/>
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


    