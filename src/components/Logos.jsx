import { Card, CardContent } from '@/components/ui/card';

/**
 * Purdue University Logo Component
 * Displays the professional Purdue University logo with proper styling
 */
export function PurdueLogo({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/Purdue-University-Logo.jpg" 
        alt="Purdue University" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}

/**
 * NBA Logo Component
 * Displays the professional NBA logo with proper styling
 */
export function NBALogo({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/nba-logo-png_seeklogo-247736.png" 
        alt="NBA" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}

/**
 * Academic Badge Component
 * Displays the academic course and team information
 */
export function AcademicBadge({ className = '' }) {
  return (
    <div className={`text-xs text-white/80 ${className}`}>
      <div>MGMT 5900 • Team DN8 • Advanced Analytics</div>
    </div>
  );
}
