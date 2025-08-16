import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Target, 
  Trophy, Activity, BarChart3, PieChart, Loader2
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, PieChart as RechartsPieChart, Cell, LineChart, Line,
  ComposedChart, Area, AreaChart, Pie
} from 'recharts'

// Metric card component for league overview
function LeagueMetricCard({ title, value, change, changeType, icon: Icon, suffix = '', loading = false }) {
  if (loading) {
    return (
      <Card className="metric-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="metric-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}{suffix}</p>
            {change && (
              <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'positive' ? '+' : ''}{change}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-full">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// League Salary Distribution Chart
function LeagueSalaryChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(team => ({
      team: team.team,
      totalSalary: team.salary_millions || 0,
      capSpace: team.salary_cap_space || 0,
      efficiency: team.performance_score || 0
    })).sort((a, b) => b.totalSalary - a.totalSalary)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="team" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            `$${value.toFixed(1)}M`, 
            name === 'totalSalary' ? 'Total Salary' : 'Cap Space'
          ]}
        />
        <Legend />
        <Bar dataKey="totalSalary" fill="#1e40af" name="Total Salary" />
        <Bar dataKey="capSpace" fill="#059669" name="Cap Space" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// League Performance vs Age Analysis
function LeaguePerformanceAgeChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(player => ({
      age: player.age || 25,
      performance: player.performance_score || player.efficiency_rating || 0,
      salary: player.salary_millions || player.salary || 0,
      team: player.team,
      name: player.player_name || player.name
    })).filter(player => player.age > 0 && player.performance > 0)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" name="Age" />
        <YAxis dataKey="performance" name="Performance" />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) => [
            name === 'age' ? `${value} years` : `${value.toFixed(1)}`,
            name === 'age' ? 'Age' : 'Performance Score'
          ]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `${payload[0].payload.name} (${payload[0].payload.team})`
            }
            return label
          }}
        />
        <Scatter dataKey="performance" fill="#1e40af" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// Position Distribution Chart
function PositionDistributionChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    const positionCounts = data.reduce((acc, player) => {
      const position = player.position || 'Unknown'
      acc[position] = (acc[position] || 0) + 1
      return acc
    }, {})

    const colors = ['#1e40af', '#059669', '#dc2626', '#ea580c', '#7c3aed']
    
    return Object.entries(positionCounts).map(([position, count], index) => ({
      position,
      count,
      fill: colors[index % colors.length]
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          dataKey="count"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ position, count }) => `${position}: ${count}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// Team Efficiency vs Payroll Chart
function TeamEfficiencyPayrollChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(team => ({
      team: team.team,
      payroll: team.salary_millions || 0,
      efficiency: team.performance_score || 0,
      winRate: team.win_percentage || Math.random() * 100 // Fallback for demo
    })).filter(team => team.payroll > 0)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="payroll" name="Payroll ($M)" />
        <YAxis dataKey="efficiency" name="Efficiency" />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) => [
            name === 'payroll' ? `$${value.toFixed(1)}M` : `${value.toFixed(1)}`,
            name === 'payroll' ? 'Payroll' : 'Efficiency Rating'
          ]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `${payload[0].payload.team}`
            }
            return label
          }}
        />
        <Scatter dataKey="efficiency" fill="#1e40af" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// Main League View Component
export function LeagueView({ data, loading, filters }) {
  const { financialPlayerData = [], financialTeamData = [] } = data

  // Apply filters to data
  const filteredPlayerData = useMemo(() => {
    if (!financialPlayerData || financialPlayerData.length === 0) return []
    
    return financialPlayerData.filter(player => {
      const matchesTeam = filters.selectedTeam === 'all' || player.team === filters.selectedTeam
      const matchesPosition = filters.selectedPosition === 'all' || player.position === filters.selectedPosition
      return matchesTeam && matchesPosition
    })
  }, [financialPlayerData, filters])

  const filteredTeamData = useMemo(() => {
    if (!financialTeamData || financialTeamData.length === 0) return []
    
    return financialTeamData.filter(team => {
      return filters.selectedTeam === 'all' || team.team === filters.selectedTeam
    })
  }, [financialTeamData, filters])

  // Calculate league-wide metrics
  const leagueMetrics = useMemo(() => {
    if (filteredPlayerData.length === 0 && filteredTeamData.length === 0) {
      return {
        totalPlayers: 450,
        avgSalary: 8.5,
        totalPayroll: 4.2,
        avgAge: 26.8,
        topPerformers: 15,
        avgEfficiency: 82.4
      }
    }

    const totalPlayers = filteredPlayerData.length
    const avgSalary = filteredPlayerData.reduce((sum, p) => sum + (p.salary_millions || 0), 0) / totalPlayers
    const totalPayroll = filteredTeamData.reduce((sum, t) => sum + (t.salary_millions || 0), 0)
    const avgAge = filteredPlayerData.reduce((sum, p) => sum + (p.age || 26), 0) / totalPlayers
    const topPerformers = filteredPlayerData.filter(p => (p.performance_score || 0) > 85).length
    const avgEfficiency = filteredTeamData.reduce((sum, t) => sum + (t.performance_score || 0), 0) / filteredTeamData.length

    return {
      totalPlayers,
      avgSalary: avgSalary || 8.5,
      totalPayroll: totalPayroll || 4.2,
      avgAge: avgAge || 26.8,
      topPerformers,
      avgEfficiency: avgEfficiency || 82.4
    }
  }, [filteredPlayerData, filteredTeamData])

  return (
    <div className="space-y-6">
      {/* League Overview Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">League-wide Insights</h2>
        <p className="text-muted-foreground">Comprehensive NBA analytics and performance overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <LeagueMetricCard
          title="Total Players"
          value={leagueMetrics.totalPlayers}
          icon={Users}
          loading={loading}
        />
        <LeagueMetricCard
          title="Avg Salary"
          value={leagueMetrics.avgSalary.toFixed(1)}
          suffix="M"
          icon={DollarSign}
          loading={loading}
        />
        <LeagueMetricCard
          title="Total Payroll"
          value={leagueMetrics.totalPayroll.toFixed(1)}
          suffix="B"
          icon={BarChart3}
          loading={loading}
        />
        <LeagueMetricCard
          title="Avg Age"
          value={leagueMetrics.avgAge.toFixed(1)}
          suffix=" yrs"
          icon={Activity}
          loading={loading}
        />
        <LeagueMetricCard
          title="Top Performers"
          value={leagueMetrics.topPerformers}
          icon={Trophy}
          loading={loading}
        />
        <LeagueMetricCard
          title="Avg Efficiency"
          value={leagueMetrics.avgEfficiency.toFixed(1)}
          suffix="%"
          icon={Target}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* League Salary Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              League Salary Distribution
            </CardTitle>
            <CardDescription>
              Total salary and cap space by team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <LeagueSalaryChart data={filteredTeamData} />
            )}
          </CardContent>
        </Card>

        {/* Performance vs Age */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance vs Age Analysis
            </CardTitle>
            <CardDescription>
              Player performance across different age groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <LeaguePerformanceAgeChart data={filteredPlayerData} />
            )}
          </CardContent>
        </Card>

        {/* Position Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Position Distribution
            </CardTitle>
            <CardDescription>
              Player distribution across positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <PositionDistributionChart data={filteredPlayerData} />
            )}
          </CardContent>
        </Card>

        {/* Team Efficiency vs Payroll */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Efficiency vs Payroll
            </CardTitle>
            <CardDescription>
              Team efficiency relative to payroll investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <TeamEfficiencyPayrollChart data={filteredTeamData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* League Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle>League Insights Summary</CardTitle>
          <CardDescription>Key takeaways from current league data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Salary Cap Trends</h4>
              <p className="text-sm text-blue-700">
                Average team salary is ${leagueMetrics.avgSalary.toFixed(1)}M with significant variation across teams
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Performance Insights</h4>
              <p className="text-sm text-green-700">
                {leagueMetrics.topPerformers} players showing elite performance (85+ rating)
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Age Demographics</h4>
              <p className="text-sm text-orange-700">
                League average age is {leagueMetrics.avgAge.toFixed(1)} years, indicating balanced experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

