import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

/**
 * Player Card Component
 * Displays a player's key metrics and status in a compact card
 */
export function PlayerCard({ player, viewType = 'coach' }) {
  if (!player) return null;
  
  // Position color mapping
  const positionColors = {
    PG: 'bg-blue-100 text-blue-800',
    SG: 'bg-green-100 text-green-800',
    SF: 'bg-purple-100 text-purple-800',
    PF: 'bg-orange-100 text-orange-800',
    C: 'bg-red-100 text-red-800'
  };
  
  // Status color mapping
  const statusColors = {
    Starter: 'bg-green-100 text-green-800',
    Rotation: 'bg-blue-100 text-blue-800',
    Bench: 'bg-purple-100 text-purple-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Injured: 'bg-red-100 text-red-800'
  };
  
  // Risk level color mapping
  const riskColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-amber-100 text-amber-800',
    High: 'bg-red-100 text-red-800'
  };
  
  // Render different card content based on view type
  const renderCoachContent = () => (
    <>
      <div className="flex justify-between items-center mb-2">
        <Badge className={positionColors[player.position] || ''}>
          {player.position}
        </Badge>
        <Badge className={statusColors[player.status] || ''}>
          {player.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" /> Minutes
          </span>
          <span>{player.minutes_per_game || '0'} MPG</span>
        </div>
        <Progress value={player.minutes_per_game || 0} max={40} />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> Efficiency
          </span>
          <span>{player.efficiency_score || '0'}</span>
        </div>
        <Progress value={player.efficiency_score || 0} max={100} className="bg-muted" />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" /> Load Risk
          </span>
          <Badge variant="outline" className={riskColors[player.load_risk] || ''}>
            {player.load_risk || 'N/A'}
          </Badge>
        </div>
      </div>
    </>
  );
  
  const renderScoutContent = () => (
    <>
      <div className="flex justify-between items-center mb-2">
        <Badge className={positionColors[player.position] || ''}>
          {player.position}
        </Badge>
        <Badge variant="outline">Age: {player.age}</Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <Award className="h-3 w-3 mr-1" /> Potential
          </span>
          <span>{player.potential_score || '0'}</span>
        </div>
        <Progress value={player.potential_score || 0} max={100} />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> PS/$M
          </span>
          <span>{player.ps_per_million?.toFixed(2) || '0'}</span>
        </div>
        <Progress value={Math.min((player.ps_per_million || 0) * 10, 100)} max={100} className="bg-muted" />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" /> Risk Level
          </span>
          <Badge variant="outline" className={riskColors[player.risk_level] || ''}>
            {player.risk_level || 'N/A'}
          </Badge>
        </div>
      </div>
    </>
  );
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold truncate">{player.player}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {viewType === 'coach' ? renderCoachContent() : renderScoutContent()}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-xs text-muted-foreground flex justify-between">
          <span>{player.team || ''}</span>
          <span>${player.salary_millions?.toFixed(1)}M</span>
        </div>
      </CardFooter>
    </Card>
  );
}
