import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Position Efficiency Chart Component
 * Shows a bar chart comparing player efficiency across different positions
 */
export function PositionEfficiencyChart({ data = [], loading = false }) {
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
                data={data}
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
