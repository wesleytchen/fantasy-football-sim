
import React from 'react';
import type { Team } from '../types';
import { NUM_WEEKS } from '../constants';

interface ScoreGridProps {
  teams: Team[];
  scores: number[][];
  onTeamNameChange: (teamIndex: number, newName: string) => void;
  onScoreChange: (teamIndex: number, weekIndex: number, score: number) => void;
}

const ScoreGrid: React.FC<ScoreGridProps> = ({ teams, scores, onTeamNameChange, onScoreChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-accent">
            <th className="p-2 border border-gray-600 text-left">Team</th>
            {Array.from({ length: NUM_WEEKS }, (_, i) => (
              <th key={i} className="p-2 border border-gray-600 text-center w-16">Wk {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team, teamIndex) => (
            <tr key={team.id} className="even:bg-primary odd:bg-secondary/50">
              <td className="p-1 border border-gray-600">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => onTeamNameChange(teamIndex, e.target.value)}
                  className="w-full bg-transparent p-1 focus:outline-none focus:bg-accent rounded"
                />
              </td>
              {Array.from({ length: NUM_WEEKS }, (_, weekIndex) => (
                <td key={weekIndex} className="p-1 border border-gray-600">
                  <input
                    type="number"
                    value={scores[teamIndex]?.[weekIndex] || ''}
                    onChange={(e) => onScoreChange(teamIndex, weekIndex, parseFloat(e.target.value))}
                    className="w-full bg-transparent p-1 text-center focus:outline-none focus:bg-accent rounded"
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreGrid;
