
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import type { SimulationResult } from '../types';
import { SIMULATION_RUNS } from '../constants';

interface TeamResultCardProps {
  result: SimulationResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / SIMULATION_RUNS) * 100).toFixed(1);
      return (
        <div className="bg-accent p-2 border border-gray-600 rounded shadow-lg text-sm">
          <p className="label text-text-primary">{`Wins: ${label}`}</p>
          <p className="intro text-text-secondary">{`Count: ${payload[0].value} (${percentage}%)`}</p>
        </div>
      );
    }
  
    return null;
  };

const TeamResultCard: React.FC<TeamResultCardProps> = ({ result }) => {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-xl flex flex-col h-full transition-transform transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-highlight mb-2 truncate">{result.teamName}</h3>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 flex-grow">
          <div className="text-text-secondary">Avg Wins: <span className="font-bold text-text-primary float-right">{result.avgWins}</span></div>
          <div className="text-text-secondary">Base Wins: <span className="font-bold text-text-primary float-right">{result.baseWins}</span></div>
          <div className="text-text-secondary">Best Case: <span className="font-bold text-green-400 float-right">{result.maxWins}</span></div>
          <div className="text-text-secondary">Worst Case: <span className="font-bold text-red-400 float-right">{result.minWins}</span></div>
      </div>
      
      <div className="w-full h-48 mt-auto">
        <p className="text-xs text-text-secondary text-center mb-1">Distribution of Win Totals</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={result.winDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="wins" tick={{ fill: '#a0aec0', fontSize: 12 }} />
            <YAxis tick={{ fill: '#a0aec0', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(160, 174, 192, 0.1)'}}/>
            <Bar dataKey="count" name="Count" fill="#38b2ac">
                {
                    result.winDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.wins === result.baseWins ? "#f56565" : "#38b2ac"} />
                    ))
                }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Dependency: recharts. Add this to your package.json if it's not there.
// We are assuming it's available globally in this environment, as per instructions.
// If it were a real project: `npm install recharts`
// To use it without a build step, you would need a UMD build, e.g., from unpkg.
// For this single-file setup, we rely on the environment providing it. If not, this component would fail.
// A more robust index.html would include:
// <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
// <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
// <script src="https://unpkg.com/recharts/umd/Recharts.min.js"></script>
// Then use `window.Recharts`
// For this project, we assume a build step exists that handles this.

export default TeamResultCard;
