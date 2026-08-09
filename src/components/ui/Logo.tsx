import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
  suffix?: string;
}

export default function Logo({ size = 'md', showText = true, className = '', href = '/', suffix }: LogoProps) {
  const badgeSizes = {
    sm: 'w-10 h-10 p-1.5 rounded-xl',
    md: 'w-12 h-12 p-2 rounded-2xl',
    lg: 'w-16 h-16 p-2.5 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Glow-Border Transparent Logo Container */}
      <div className={`${badgeSizes[size]} bg-transparent border-2 border-purple-600/80 shadow-[0_0_8px_rgba(147,51,234,0.15)] group-hover:shadow-[0_0_16px_rgba(147,51,234,0.45)] group-active:shadow-[0_0_24px_rgba(147,51,234,0.65)] group-hover:scale-105 group-hover:border-purple-500 transition-all duration-300 flex items-center justify-center shrink-0`}>
        <img 
          src="/logo.png" 
          alt="Open Engineering Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight select-none">
          <span className={`font-extrabold tracking-tight whitespace-nowrap ${textSizes[size]} text-slate-950 group-hover:text-purple-700 transition-colors`}>
            Open <span className="gradient-text-primary">Engineering</span>
          </span>
          {suffix && (
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-purple-700 uppercase -mt-0.5">
              {suffix}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
