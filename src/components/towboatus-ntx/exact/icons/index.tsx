// SVG Icons used throughout the site

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function PhoneIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

export function StarIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function LocationIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export function ShieldIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}

export function CheckIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

export function AnchorIcon({ className = "w-6 h-6", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} {...props}>
      <circle cx="20" cy="9" r="3.5" stroke="currentColor" strokeWidth="2.5" />
      <line x1="20" y1="12.5" x2="20" y2="32" stroke="currentColor" strokeWidth="2.5" />
      <path d="M10 21 Q20 29 30 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="10" y1="21" x2="10" y2="27" stroke="currentColor" strokeWidth="2.5" />
      <line x1="30" y1="21" x2="30" y2="27" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

// Service icons - Towing (boat with rope)
export function TowingIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
    </svg>
  );
}

// Degrounding (boat lifted with up arrow)
export function DegroundingIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 4l-4 4h3v4h2V8h3l-4-4z" />
      <path d="M4 14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1H4v1z" />
      <path d="M2 18h20v2H2z" opacity="0.5" />
    </svg>
  );
}

// Fuel (gas pump)
export function FuelIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
    </svg>
  );
}

// Battery (battery with lightning bolt)
export function BatteryIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
      <path d="M11 20v-5.5H9L13 7v5.5h2L11 20z" fill="white" />
    </svg>
  );
}

// Salvage (life ring)
export function SalvageIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L7.1 8.51c-.66.9-1.1 1.97-1.1 3.49 0 3.31 2.69 6 6 6 1.52 0 2.59-.44 3.49-1.1l1.41 1.41C15.55 19.37 13.85 20 12 20zm6.31-3.1l-1.41-1.41c.66-.9 1.1-1.97 1.1-3.49 0-3.31-2.69-6-6-6-1.52 0-2.59.44-3.49 1.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
    </svg>
  );
}

// Regional Support (map with locations)
export function RegionalIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
    </svg>
  );
}

// Dive (scuba mask with snorkel)
export function DiveIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      {/* Scuba mask */}
      <path d="M4 9c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V9z" />
      {/* Mask glass/visor */}
      <path d="M6 9.5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v3c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-3z" fill="white" opacity="0.3" />
      {/* Snorkel tube */}
      <path d="M20 7V3c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1h-1" />
      {/* Center bridge */}
      <rect x="11" y="9" width="2" height="4" fill="white" opacity="0.2" />
      {/* Bubbles */}
      <circle cx="19" cy="19" r="1.5" opacity="0.5" />
      <circle cx="21" cy="21" r="1" opacity="0.3" />
    </svg>
  );
}

// Dispatch (headset operator)
export function DispatchIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
    </svg>
  );
}

// Chevron Down (for accordions)
export function ChevronDownIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Map service IDs to icons
export const serviceIcons: Record<string, React.FC<IconProps>> = {
  towing: TowingIcon,
  degrounding: DegroundingIcon,
  fuel: FuelIcon,
  battery: BatteryIcon,
  salvage: SalvageIcon,
  regional: RegionalIcon,
  dive: DiveIcon,
  dispatch: DispatchIcon,
};
