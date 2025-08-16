import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Position Efficiency Chart Component
 * Shows a bar chart comparing player efficiency across different positions
 */
export function PositionEfficiencyChart({ data = [], loading = false }) {
  // Process the player data into position-aggregated data
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Standard position mapping for consistency
    const standardizePosition = (pos) => {
      pos = pos ? pos.toUpperCase() : '';
      if (pos.includes('POINT') || pos === 'PG') return 'PG';
      if (pos.includes('SHOOTING') || pos === 'SG') return 'SG';
      if (pos.includes('SMALL') || pos === 'SF') return 'SF';
      if (pos.includes('POWER') || pos === 'PF') return 'PF';
      if (pos === 'C' || pos.includes('CENTER')) return 'C';
      if (pos === 'G') return 'G'; // Guard (generic)
      if (pos === 'F') return 'F'; // Forward (generic)
      if (pos === 'W') return 'W'; // Wing (generic)
      return pos || 'Unknown';
    };
    
    // Group players by position and calculate averages
    const positionGroups = {};
    data.forEach(player => {
      const position = standardizePosition(player.position);
      if (!positionGroups[position]) {
        positionGroups[position] = {
          position,
          players: [],
          efficiency_sum: 0,
          player_count: 0
        };
      }
      
      // Get the efficiency score from any available field
      const efficiency = player.efficiency_score || 
                         player.performance_score || 
                         player.efficiency_rating || 0;
      
      if (efficiency > 0) {
        positionGroups[position].players.push(player);
        positionGroups[position].efficiency_sum += efficiency;
        positionGroups[position].player_count += 1;
      }
    });
    
    // Calculate averages and format for chart
    return Object.values(positionGroups).map(group => ({
      position: group.position,
      avg_efficiency: group.player_count > 0 ? group.efficiency_sum / group.player_count : 0,
      player_count: group.player_count
    })).filter(group => group.avg_efficiency > 0).sort((a, b) => a.position.localeCompare(b.position));
  }, [data]);
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const position = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border rounded shadow p-3">
          <p className="font-bold">{position.position}</p>
          <p className="text-sm">Avg Efficiency: {position.avg_efficiency.toFixed(1)}</p>
          <p className="text-sm">Player Count: {position.player_count}</p>
        </div>
      );
    }
    return null;
  };
  
  // Position color mapping
  const positionColors = {
    PG: '#3b82f6', // blue
    SG: '#10b981', // green
    SF: '#8b5cf6', // purple
    PF: '#f59e0b', // amber
    C: '#ef4444'   // red
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Player Efficiency by Position</CardTitle>
        <CardDescription>Performance ratings across positions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="avg_efficiency" 
                  name="Efficiency Rating" 
                  radius={[4, 4, 0, 0]}
                  // Use dynamic colors based on position
                  fill={(entry) => positionColors[entry.position] || '#3b82f6'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
