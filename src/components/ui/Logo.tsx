import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({ size = 'md', showText = true, className = '', href = '/' }: LogoProps) {
  const badgeSizes = {
    sm: 'w-9 h-9 p-1.5 rounded-xl',
    md: 'w-11 h-11 p-2 rounded-2xl',
    lg: 'w-14 h-14 p-2.5 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* 3D Neumorphic Purple Badge Container for 100% Logo Visibility */}
      <div className={`${badgeSizes[size]} bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 shadow-[5px_5px_14px_rgba(147,51,234,0.35),-4px_-4px_12px_#ffffff] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-purple-400/30`}>
        <img 
          src="/logo.png" 
          alt="Open Engineering Logo" 
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSizes[size]} text-text`}>
          Open <span className="gradient-text-primary">Engineering</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
