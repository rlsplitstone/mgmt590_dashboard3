import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Value vs Age Chart Component
 * Shows a scatter plot of player age vs value efficiency (PS/$M) with potential visualization
 */
export function ValueAgeChart({ data = [], loading = false }) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const player = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border rounded shadow p-3">
          <p className="font-bold">{player.player}</p>
          <p className="text-sm">{player.team} | {player.position}</p>
          <div className="grid grid-cols-2 gap-x-4 mt-1">
            <p className="text-sm">Age: {player.age}</p>
            <p className="text-sm">PS/$M: {player.ps_per_million?.toFixed(2)}</p>
            <p className="text-sm">Potential: {player.potential_score}</p>
            <p className="text-sm">Risk: {player.risk_level}</p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Risk color mapping
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return '#10b981'; // green
      case 'Medium': return '#f59e0b'; // amber
      case 'High': return '#ef4444'; // red
      default: return '#3b82f6'; // blue
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Value vs Age Analysis</CardTitle>
        <CardDescription>Identifying future stars and value contracts</CardDescription>
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
                  dataKey="age" 
                  name="Age" 
                  domain={[18, 'dataMax']} 
                >
                  <Label 
                    value="Age (years)" 
                    position="bottom" 
                    offset={-10} 
                  />
                </XAxis>
                
                <YAxis 
                  type="number" 
                  dataKey="ps_per_million" 
                  name="Value Efficiency" 
                >
                  <Label 
                    value="Value Efficiency (PS/$M)" 
                    position="left" 
                    angle={-90} 
                    offset={-10} 
                  />
                </YAxis>
                
                <ZAxis 
                  type="number" 
                  dataKey="potential_score" 
                  range={[60, 400]} 
                  name="Potential" 
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Players with risk-based coloring */}
                <Scatter 
                  name="Players" 
                  data={data} 
                  fillOpacity={0.7}
                >
                  {data.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={getRiskColor(entry.risk_level)} />
                  ))}
                </Scatter>
                
                {/* Create separate legend entries for risk levels */}
                <Scatter 
                  name="Low Risk" 
                  data={[]} 
                  fill="#10b981" 
                  legendType="square" 
                />
                <Scatter 
                  name="Medium Risk" 
                  data={[]} 
                  fill="#f59e0b" 
                  legendType="square" 
                />
                <Scatter 
                  name="High Risk" 
                  data={[]} 
                  fill="#ef4444" 
                  legendType="square" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
