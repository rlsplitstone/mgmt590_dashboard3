import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Team Efficiency Chart Component
 * Shows a bar chart comparing team payroll efficiency metrics
 */
export function TeamEfficiencyChart({ data = [], loading = false }) {
  // Sort data by efficiency (PS/$M)
  const sortedData = [...data].sort((a, b) => b.avg_ps_per_million - a.avg_ps_per_million);
  
  // Calculate league average for reference line
  const leagueAverage = data.length 
    ? data.reduce((sum, team) => sum + team.avg_ps_per_million, 0) / data.length 
    : 0;
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const team = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border rounded shadow p-3">
          <p className="font-bold">{team.team}</p>
          <p className="text-sm">Efficiency: {team.avg_ps_per_million.toFixed(2)} PS/$M</p>
          <p className="text-sm">Total Salary: ${team.total_salary?.toFixed(1)}M</p>
          <p className="text-sm">Total Performance: {team.total_performance?.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Team Payroll Efficiency</CardTitle>
        <CardDescription>Performance score per million dollars (PS/$M)</CardDescription>
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
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax']} />
                <YAxis dataKey="team" type="category" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="avg_ps_per_million" 
                  name="Efficiency (PS/$M)" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList 
                    dataKey="avg_ps_per_million" 
                    position="right" 
                    formatter={(value) => value.toFixed(2)} 
                  />
                </Bar>
                
                {/* Reference line for league average */}
                {/* Note: Reference lines aren't available in vertical BarCharts in Recharts */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Display league average as a note */}
        <div className="mt-2 text-center text-sm text-muted-foreground">
          League Average: {leagueAverage.toFixed(2)} PS/$M
        </div>
      </CardContent>
    </Card>
  );
}
