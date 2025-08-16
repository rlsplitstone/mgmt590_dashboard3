import { Card, CardContent } from '@/components/ui/card';

/**
 * Purdue University Logo Component
 * Displays the Purdue University logo with proper styling
 */
export function PurdueLogo({ className = '' }) {
  return (
    <Card className={`p-2 bg-white shadow-sm ${className}`}>
      <CardContent className="p-1 flex items-center justify-center">
        <div className="text-center">
          <div className="font-bold text-[#9D9182] text-xs">PURDUE</div>
          <div className="font-bold text-[#9D9182] text-[10px]">UNIVERSITY</div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * NBA Logo Component
 * Displays the NBA logo with proper styling
 */
export function NBALogo({ className = '' }) {
  return (
    <Card className={`p-2 bg-white shadow-sm ${className}`}>
      <CardContent className="p-1 flex items-center justify-center">
        <div className="font-bold text-xl text-[#17408B]">NBA</div>
      </CardContent>
    </Card>
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
