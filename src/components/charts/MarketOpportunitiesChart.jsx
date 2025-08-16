import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Market Opportunities Chart Component
 * Shows a pie chart displaying the distribution of player value tiers
 */
export function MarketOpportunitiesChart({ data = [], loading = false }) {
  // Value tier color mapping
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border rounded shadow p-3">
          <p className="font-bold">{item.value_tier}</p>
          <p className="text-sm">{item.percentage}% of players ({item.player_count} players)</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend rendering to include percentages
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.value}: {entry.payload.percentage}%
            </span>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Market Opportunities</CardTitle>
        <CardDescription>Player value distribution by tier</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="percentage"
                  nameKey="value_tier"
                  label={({ value_tier, percentage }) => `${percentage}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
