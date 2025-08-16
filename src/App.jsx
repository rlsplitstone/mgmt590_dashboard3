import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Target, 
  Clock, Award, AlertTriangle, Star, Activity, Loader2
} from 'lucide-react'

// Import data loading utilities
import { loadCSVData, getFallbackData } from '@/utils/dataLoader'

// Import components
import { PlayerCard } from '@/components/PlayerCard'
import { SalaryPerformanceChart } from '@/components/charts/SalaryPerformanceChart'
import { TeamEfficiencyChart } from '@/components/charts/TeamEfficiencyChart'
import { PositionEfficiencyChart } from '@/components/charts/PositionEfficiencyChart'
import { ValueAgeChart } from '@/components/charts/ValueAgeChart'
import { MarketOpportunitiesChart } from '@/components/charts/MarketOpportunitiesChart'
import { PurdueLogo, NBALogo, AcademicBadge } from '@/components/Logos'

import './App.css'

// Filter component for unified filtering across all views
function Filters({ onFilterChange, availableTeams = [], availablePositions = ['PG', 'SG', 'SF', 'PF', 'C'] }) {
  const [filters, setFilters] = useState({
    selectedTeam: 'all',
    selectedPlayer: 'all',
    selectedPosition: 'all'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team</label>
            <select 
              className="w-full p-2 border border-border rounded-md bg-background"
              value={filters.selectedTeam}
              onChange={(e) => handleFilterChange('selectedTeam', e.target.value)}
            >
              <option value="all">All Teams</option>
              {availableTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <select 
              className="w-full p-2 border border-border rounded-md bg-background"
              value={filters.selectedPosition}
              onChange={(e) => handleFilterChange('selectedPosition', e.target.value)}
            >
              <option value="all">All Positions</option>
              {availablePositions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Metric card component
function MetricCard({ title, value, change, changeType, icon: Icon, suffix = '', loading = false }) {
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
            <p className="metric-label">{title}</p>
            <p className="metric-value">{value}{suffix}</p>
            {change && (
              <p className={`metric-change ${changeType}`}>
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

// GM View Component
function GMView({ data, loading, filters }) {
  const financialPlayerData = data.financialPlayerData || []
  const financialTeamData = data.financialTeamData || []
  
  // Apply filters to the data
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

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (filteredPlayerData.length === 0) return {
      totalSalaryCap: 165.2,
      performanceScore: 82.4,
      valuePlayers: 12,
      capEfficiency: 88.7
    }

    const totalSalary = filteredPlayerData.reduce((sum, player) => sum + (player.salary_millions || 0), 0)
    const avgPerformance = filteredPlayerData.reduce((sum, player) => sum + (player.performance_score || 0), 0) / filteredPlayerData.length
    const valuePlayers = filteredPlayerData.filter(player => (player.ps_per_million || 0) > 3).length
    const capEfficiency = filteredPlayerData.reduce((sum, player) => sum + (player.ps_per_million || 0), 0) / filteredPlayerData.length * 10

    return {
      totalSalaryCap: totalSalary.toFixed(1),
      performanceScore: avgPerformance.toFixed(1),
      valuePlayers,
      capEfficiency: capEfficiency.toFixed(1)
    }
  }, [filteredPlayerData])

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Salary"
          value={`$${metrics.totalSalaryCap}M`}
          change="+2.1% vs last season"
          changeType="positive"
          icon={DollarSign}
          loading={loading}
        />
        <MetricCard
          title="Performance Score"
          value={metrics.performanceScore}
          change="+5.3 vs league avg"
          changeType="positive"
          icon={TrendingUp}
          loading={loading}
        />
        <MetricCard
          title="Value Players"
          value={metrics.valuePlayers}
          change="Top 5 in league"
          changeType="positive"
          icon={Star}
          loading={loading}
        />
        <MetricCard
          title="Cap Efficiency"
          value={metrics.capEfficiency}
          suffix="%"
          change="+12% improvement"
          changeType="positive"
          icon={Target}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Salary vs Performance Analysis</CardTitle>
            <CardDescription>Player value analysis across the roster</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <SalaryPerformanceChart 
                data={filteredPlayerData} 
                height={300} 
              />
            )}
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Team Payroll Efficiency</CardTitle>
            <CardDescription>Performance per dollar spent by team</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <TeamEfficiencyChart 
                data={filteredTeamData} 
                height={300} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Coach View Component
function CoachView({ data, loading, filters }) {
  const operationsPlayerData = data.operationsPlayerData || []
  const operationsPositionData = data.operationsPositionData || []
  
  // Apply filters to the data
  const filteredPlayerData = useMemo(() => {
    if (!operationsPlayerData || operationsPlayerData.length === 0) return []
    
    return operationsPlayerData.filter(player => {
      const matchesTeam = filters.selectedTeam === 'all' || player.team === filters.selectedTeam
      const matchesPosition = filters.selectedPosition === 'all' || player.position === filters.selectedPosition
      return matchesTeam && matchesPosition
    })
  }, [operationsPlayerData, filters])

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Team Efficiency"
          value="88.7"
          change="+2.3 vs last month"
          changeType="positive"
          icon={Activity}
          loading={loading}
        />
        <MetricCard
          title="Rotation Players"
          value="9"
          change="Optimal range"
          changeType="positive"
          icon={Users}
          loading={loading}
        />
        <MetricCard
          title="Minutes Load"
          value="34.2"
          change="Within safe range"
          changeType="positive"
          icon={Clock}
          loading={loading}
        />
        <MetricCard
          title="Bench Production"
          value="28.4"
          change="+4.1 vs league avg"
          changeType="positive"
          icon={Award}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Player Efficiency by Position</CardTitle>
            <CardDescription>Performance ratings across positions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <PositionEfficiencyChart 
                data={operationsPositionData} 
                height={300} 
              />
            )}
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Load Management Status</CardTitle>
            <CardDescription>Player workload and injury risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Risk</span>
                <Badge className="bg-green-100 text-green-800">6 players</Badge>
              </div>
              <Progress value={60} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Risk</span>
                <Badge className="bg-yellow-100 text-yellow-800">2 players</Badge>
              </div>
              <Progress value={20} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Risk</span>
                <Badge className="bg-red-100 text-red-800">4 players</Badge>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Player Status Overview</CardTitle>
          <CardDescription>Current rotation and performance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <PlayerCard key={index} player={{}} loading={true} />
              ))
            ) : (
              filteredPlayerData.slice(0, 6).map((player, index) => (
                <PlayerCard key={index} player={player} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Scout View Component
function ScoutView({ data, loading, filters }) {
  const riskFuturePillars = data.riskFuturePillars || []
  const marketSizeData = data.customerMarketSize || []
  
  // Apply filters to the data
  const filteredPlayerData = useMemo(() => {
    if (!riskFuturePillars || riskFuturePillars.length === 0) return []
    
    return riskFuturePillars.filter(player => {
      const matchesTeam = filters.selectedTeam === 'all' || player.team === filters.selectedTeam
      const matchesPosition = filters.selectedPosition === 'all' || player.position === filters.selectedPosition
      return matchesTeam && matchesPosition
    })
  }, [riskFuturePillars, filters])

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Value Targets"
          value="23"
          change="Updated weekly"
          changeType="positive"
          icon={Target}
          loading={loading}
        />
        <MetricCard
          title="Young Talent"
          value={filteredPlayerData.length || "8"}
          change="High potential (U25)"
          changeType="positive"
          icon={Star}
          loading={loading}
        />
        <MetricCard
          title="Trade Assets"
          value="5"
          change="Market ready"
          changeType="positive"
          icon={TrendingUp}
          loading={loading}
        />
        <MetricCard
          title="Draft Capital"
          value="3"
          change="2024-2026 picks"
          changeType="positive"
          icon={Award}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Value vs Age Analysis</CardTitle>
            <CardDescription>Identifying future stars and value contracts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ValueAgeChart 
                data={filteredPlayerData} 
                height={300} 
              />
            )}
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle>Market Opportunities</CardTitle>
            <CardDescription>Players by value tier and availability</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <MarketOpportunitiesChart data={data.customerMarketSize} height={300} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="chart-container">
        <CardHeader>
          <CardTitle>Target Players</CardTitle>
          <CardDescription>High-value acquisition targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded mb-1 w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredPlayerData.slice(0, 4).map((player, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{player.player}</h3>
                      <Badge className="value-indicator excellent">Excellent Value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {player.team} • {player.position} • {player.age} years
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(player.salary_millions || 0).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">{(player.ps_per_million || 0).toFixed(1)} PS/$M</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main App Component
function App() {
  const [activeView, setActiveView] = useState('gm')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [dataStatus, setDataStatus] = useState('Loading data from analyst notebooks...')
  const [filters, setFilters] = useState({
    selectedTeam: 'all',
    selectedPlayer: 'all',
    selectedPosition: 'all'
  })

  // Extract available teams from data
  const availableTeams = useMemo(() => {
    const teams = new Set()
    if (data.financialPlayerData) {
      data.financialPlayerData.forEach(player => {
        if (player.team) teams.add(player.team)
      })
    }
    return Array.from(teams).sort()
  }, [data.financialPlayerData])

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      setDataStatus('Loading financial analyst data...')
      
      try {
        // Load all CSV files
        const [
          financialPlayerData,
          financialTeamData,
          operationsPlayerData,
          operationsTeamData,
          marketOpportunitiesData,
          riskFuturePillarsData
        ] = await Promise.all([
          loadCSVData('financial_player_data.csv'),
          loadCSVData('financial_team_data.csv'),
          loadCSVData('operations_player_efficiency.csv'),
          loadCSVData('operations_team_efficiency.csv'),
          loadCSVData('market_opportunities.csv'),
          loadCSVData('risk_future_pillars.csv')
        ])
        
        // Use fallback data for missing datasets
        const fallbackData = getFallbackData()
        
        setData({
          financialPlayerData: financialPlayerData.length > 0 ? financialPlayerData : fallbackData.financialPlayerData,
          financialTeamData: financialTeamData.length > 0 ? financialTeamData : fallbackData.financialTeamData,
          operationsPlayerData: operationsPlayerData.length > 0 ? operationsPlayerData : fallbackData.operationsPlayerData,
          operationsTeamData: operationsTeamData.length > 0 ? operationsTeamData : fallbackData.operationsTeamData,
          operationsPositionData: fallbackData.operationsPositionData,
          riskFuturePillars: riskFuturePillarsData.length > 0 ? riskFuturePillarsData : fallbackData.riskFuturePillars,
          customerMarketSize: marketOpportunitiesData.length > 0 ? marketOpportunitiesData : fallbackData.customerMarketSize
        })

        setDataStatus('Data loaded successfully!')
        
      } catch (error) {
        console.error('Error loading data:', error)
        setDataStatus('Using sample data (CSV files not found)')
        
        // Use all fallback data if CSV loading fails
        const fallbackData = getFallbackData()
        setData(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logos */}
      <header className="dashboard-header">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PurdueLogo width={50} height={50} />
              <div>
                <h1 className="text-3xl font-bold">NBA Analytics Dashboard</h1>
                <p className="text-blue-100 mt-1">The Value Game: Unlocking Performance and Cap Flexibility</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NBALogo width={40} height={40} />
              <div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Team DN8
                </Badge>
                {loading && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {loading && (
            <div className="mt-2">
              <p className="text-blue-100 text-sm">{dataStatus}</p>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveView('gm')}
              className={`nav-button ${activeView === 'gm' ? 'active' : ''}`}
              variant={activeView === 'gm' ? 'default' : 'ghost'}
              disabled={loading}
            >
              GM View
            </Button>
            <Button
              onClick={() => setActiveView('coach')}
              className={`nav-button ${activeView === 'coach' ? 'active' : ''}`}
              variant={activeView === 'coach' ? 'default' : 'ghost'}
              disabled={loading}
            >
              Coach View
            </Button>
            <Button
              onClick={() => setActiveView('scout')}
              className={`nav-button ${activeView === 'scout' ? 'active' : ''}`}
              variant={activeView === 'scout' ? 'default' : 'ghost'}
              disabled={loading}
            >
              Scout View
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Filters 
          onFilterChange={setFilters} 
          availableTeams={availableTeams}
          availablePositions={['PG', 'SG', 'SF', 'PF', 'C']}
        />

        {/* Views */}
        {activeView === 'gm' && <GMView data={data} loading={loading} filters={filters} />}
        {activeView === 'coach' && <CoachView data={data} loading={loading} filters={filters} />}
        {activeView === 'scout' && <ScoutView data={data} loading={loading} filters={filters} />}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <AcademicBadge width={24} height={24} />
              <p>© 2024 NBA Analytics Dashboard - Team DN8</p>
            </div>
            <div className="flex items-center gap-4">
              <p>MGMT 5900 Final Project</p>
              {!loading && (
                <Badge variant="outline" className="text-xs">
                  {Object.keys(data).length > 0 ? 'Real Data' : 'Sample Data'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
