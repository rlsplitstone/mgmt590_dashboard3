import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Salary vs Performance Chart Component
 * Shows a scatter plot of player salary vs performance with efficiency visualization
 */
export function SalaryPerformanceChart({ data = [], loading = false }) {
  // The data should already be filtered by the parent component
  const chartData = data.map(player => ({
    ...player,
    // Ensure all necessary fields are available with fallbacks
    player: player.player || player.player_name || player.name || 'Unknown',
    salary_millions: player.salary_millions || 
                     (player.salary ? (player.salary > 1000 ? player.salary / 1000000 : player.salary) : 0),
    performance_score: player.performance_score || player.efficiency_rating || player.efficiency_score || 0,
    ps_per_million: player.ps_per_million || 
                    player.value_ratio || 
                    (player.performance_score && player.salary_millions ? 
                      player.performance_score / player.salary_millions : 0)
  }));

  // Calculate fair value line points
  const fairValueLine = [
    { salary_millions: 0, performance_score: 0 },
    { salary_millions: 50, performance_score: 100 }
  ];

  // Create custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const player = payload[0].payload;
      const position = player.position || 'N/A';
      const team = player.team || 'N/A';
      const age = player.age || 'N/A';
      const salary = player.salary_millions || 0;
      const performance = player.performance_score || 0;
      const efficiency = player.ps_per_million || 0;
      
      return (
        <div className="custom-tooltip bg-background border rounded shadow p-3">
          <p className="font-bold">{player.player}</p>
          <p className="text-sm">{team} | {position}</p>
          <div className="grid grid-cols-2 gap-x-4 mt-1">
            <p className="text-sm">Salary: ${salary.toFixed(1)}M</p>
            <p className="text-sm">Age: {age}</p>
            <p className="text-sm">PS: {performance.toFixed(1)}</p>
            <p className="text-sm">PS/$M: {efficiency.toFixed(2)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Salary vs Performance Analysis</CardTitle>
        <CardDescription>Player value analysis across the roster</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                
                <XAxis 
                  type="number" 
                  dataKey="salary_millions" 
                  name="Salary" 
                  domain={[0, 'dataMax']} 
                >
                  <Label 
                    value="Salary ($ Millions)" 
                    position="bottom" 
                    offset={-10} 
                  />
                </XAxis>
                
                <YAxis 
                  type="number" 
                  dataKey="performance_score" 
                  name="Performance" 
                  domain={[0, 'dataMax']} 
                >
                  <Label 
                    value="Performance Score" 
                    position="left" 
                    angle={-90} 
                    offset={-10} 
                  />
                </YAxis>
                
                <ZAxis 
                  type="number" 
                  dataKey="ps_per_million" 
                  range={[60, 400]} 
                  name="PS/$M" 
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Fair Value Reference Line */}
                <Scatter 
                  name="Fair Value Line" 
                  data={fairValueLine} 
                  line={{ stroke: '#9ca3af', strokeDasharray: '5 5' }} 
                  shape={() => null} 
                  legendType="line" 
                />
                
                {/* Players */}
                <Scatter 
                  name="Players" 
                  data={chartData} 
                  fill="#3b82f6" 
                  fillOpacity={0.7} 
                  stroke="#1d4ed8" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
