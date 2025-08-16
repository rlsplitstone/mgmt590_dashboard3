/**
 * Utility for loading and parsing CSV data files
 */

/**
 * Loads a CSV file and parses it into an array of objects
 * @param {string} filename - The name of the CSV file to load
 * @returns {Promise<Array>} - A promise that resolves to an array of data objects
 */
export const loadCSVData = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Try to parse as number if it looks like one
        if (!isNaN(value) && value !== '') {
          row[header] = parseFloat(value);
        } else {
          row[header] = value;
        }
      });
      
      return row;
    });
    
    return data;
  } catch (error) {
    console.warn(`Could not load ${filename}:`, error);
    return [];
  }
};

/**
 * Loads multiple CSV files in parallel
 * @param {Array<string>} filenames - Array of CSV filenames to load
 * @returns {Promise<Object>} - Object with data from each file keyed by filename
 */
export const loadMultipleCSVFiles = async (filenames) => {
  const filePromises = filenames.map(filename => loadCSVData(filename));
  const results = await Promise.all(filePromises);
  
  const data = {};
  filenames.forEach((filename, index) => {
    // Extract the base name without extension and use as key
    const key = filename.replace('.csv', '');
    data[key] = results[index];
  });
  
  return data;
};

/**
 * Generate fallback data for when CSV files are not available
 */
export const getFallbackData = () => {
  return {
    financialPlayerData: [
      { player: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF', age: 31, salary_millions: 45.6, performance_score: 95, ps_per_million: 2.08 },
      { player: 'Jayson Tatum', team: 'BOS', position: 'SF', age: 27, salary_millions: 32.6, performance_score: 88, ps_per_million: 2.70 },
      { player: 'Joel Embiid', team: 'PHI', position: 'C', age: 31, salary_millions: 47.6, performance_score: 85, ps_per_million: 1.79 },
      { player: 'Luka Doncic', team: 'DAL', position: 'PG', age: 26, salary_millions: 40.1, performance_score: 92, ps_per_million: 2.29 },
      { player: 'Ja Morant', team: 'MEM', position: 'PG', age: 26, salary_millions: 12.1, performance_score: 78, ps_per_million: 6.45 },
      { player: 'LeBron James', team: 'LAL', position: 'SF', age: 40, salary_millions: 47.6, performance_score: 82, ps_per_million: 1.72 },
      { player: 'Kevin Durant', team: 'PHX', position: 'SF', age: 36, salary_millions: 47.6, performance_score: 84, ps_per_million: 1.76 },
      { player: 'Stephen Curry', team: 'GSW', position: 'PG', age: 37, salary_millions: 51.9, performance_score: 86, ps_per_million: 1.66 },
      { player: 'Nikola Jokic', team: 'DEN', position: 'C', age: 30, salary_millions: 48.5, performance_score: 96, ps_per_million: 1.98 },
      { player: 'Anthony Edwards', team: 'MIN', position: 'SG', age: 24, salary_millions: 13.5, performance_score: 83, ps_per_million: 6.15 },
      { player: 'Paolo Banchero', team: 'ORL', position: 'PF', age: 22, salary_millions: 11.6, performance_score: 79, ps_per_million: 6.81 },
      { player: 'Victor Wembanyama', team: 'SAS', position: 'C', age: 21, salary_millions: 12.2, performance_score: 80, ps_per_million: 6.56 },
      { player: 'Chet Holmgren', team: 'OKC', position: 'PF', age: 23, salary_millions: 10.9, performance_score: 77, ps_per_million: 7.06 },
      { player: 'Jalen Brunson', team: 'NYK', position: 'PG', age: 28, salary_millions: 24.9, performance_score: 85, ps_per_million: 3.41 }
    ],
    financialTeamData: [
      { team: 'MIL', total_salary: 179.2, total_performance: 458, avg_ps_per_million: 2.55 },
      { team: 'BOS', total_salary: 181.5, total_performance: 492, avg_ps_per_million: 2.71 },
      { team: 'PHI', total_salary: 178.3, total_performance: 438, avg_ps_per_million: 2.46 },
      { team: 'DAL', total_salary: 175.6, total_performance: 452, avg_ps_per_million: 2.57 },
      { team: 'MEM', total_salary: 159.8, total_performance: 421, avg_ps_per_million: 2.63 },
      { team: 'LAL', total_salary: 184.2, total_performance: 436, avg_ps_per_million: 2.37 },
      { team: 'PHX', total_salary: 189.6, total_performance: 451, avg_ps_per_million: 2.38 },
      { team: 'GSW', total_salary: 192.5, total_performance: 462, avg_ps_per_million: 2.40 },
      { team: 'DEN', total_salary: 186.4, total_performance: 485, avg_ps_per_million: 2.60 },
      { team: 'MIN', total_salary: 171.2, total_performance: 446, avg_ps_per_million: 2.61 }
    ],
    operationsPlayerData: [
      { player: 'Giannis Antetokounmpo', minutes_per_game: 33.2, efficiency_score: 92, status: 'Starter', load_risk: 'Medium' },
      { player: 'Jayson Tatum', minutes_per_game: 36.5, efficiency_score: 87, status: 'Starter', load_risk: 'High' },
      { player: 'Joel Embiid', minutes_per_game: 34.1, efficiency_score: 89, status: 'Starter', load_risk: 'High' },
      { player: 'Luka Doncic', minutes_per_game: 35.8, efficiency_score: 91, status: 'Starter', load_risk: 'Medium' },
      { player: 'Ja Morant', minutes_per_game: 32.5, efficiency_score: 84, status: 'Starter', load_risk: 'Medium' },
      { player: 'LeBron James', minutes_per_game: 35.1, efficiency_score: 85, status: 'Starter', load_risk: 'High' }
    ],
    operationsPositionData: [
      { position: 'PG', avg_efficiency: 86, player_count: 42 },
      { position: 'SG', avg_efficiency: 81, player_count: 38 },
      { position: 'SF', avg_efficiency: 83, player_count: 35 },
      { position: 'PF', avg_efficiency: 85, player_count: 32 },
      { position: 'C', avg_efficiency: 79, player_count: 28 }
    ],
    riskFuturePillars: [
      { player: 'Anthony Edwards', age: 24, ps_per_million: 6.15, potential_score: 94, risk_level: 'Low' },
      { player: 'Paolo Banchero', age: 22, ps_per_million: 6.81, potential_score: 91, risk_level: 'Low' },
      { player: 'Victor Wembanyama', age: 21, ps_per_million: 6.56, potential_score: 98, risk_level: 'Medium' },
      { player: 'Chet Holmgren', age: 23, ps_per_million: 7.06, potential_score: 92, risk_level: 'Medium' },
      { player: 'Scottie Barnes', age: 23, ps_per_million: 6.42, potential_score: 89, risk_level: 'Low' },
      { player: 'Cade Cunningham', age: 23, ps_per_million: 5.98, potential_score: 90, risk_level: 'Medium' }
    ],
    customerMarketSize: [
      { value_tier: 'Elite', percentage: 15, player_count: 12 },
      { value_tier: 'High Value', percentage: 22, player_count: 18 },
      { value_tier: 'Fair Value', percentage: 36, player_count: 28 },
      { value_tier: 'Overpaid', percentage: 27, player_count: 22 }
    ]
  };
};
