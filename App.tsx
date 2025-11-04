
import React, { useState, useCallback } from 'react';
import { INITIAL_TEAMS, SAMPLE_SCORES, NUM_TEAMS, NUM_WEEKS } from './constants';
import type { Team, SimulationResult } from './types';
import { runSimulation } from './services/simulationService';
import ScoreGrid from './components/ScoreGrid';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [scores, setScores] = useState<number[][]>(() => Array(NUM_TEAMS).fill(0).map(() => Array(NUM_WEEKS).fill(0)));
  const [simulationResults, setSimulationResults] = useState<SimulationResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTeamNameChange = (teamIndex: number, newName: string) => {
    setTeams(prevTeams =>
      prevTeams.map((team, index) =>
        index === teamIndex ? { ...team, name: newName } : team
      )
    );
  };

  const handleScoreChange = (teamIndex: number, weekIndex: number, score: number) => {
    setScores(prevScores => {
      const newScores = prevScores.map(row => [...row]);
      newScores[teamIndex][weekIndex] = isNaN(score) ? 0 : score;
      return newScores;
    });
  };

  const handleLoadSampleData = () => {
    setScores(SAMPLE_SCORES);
    setTeams(INITIAL_TEAMS.map((team, i) => ({ ...team, name: `Team ${i + 1}` })));
    setSimulationResults(null);
  };

  const handleSimulate = useCallback(() => {
    setIsLoading(true);
    setSimulationResults(null);
    // Use setTimeout to allow the UI to update to the loading state before the heavy computation starts
    setTimeout(() => {
        try {
            const results = runSimulation(scores, teams);
            setSimulationResults(results);
        } catch (error) {
            console.error("Simulation failed:", error);
            alert("An error occurred during the simulation. Please check the console for details.");
        } finally {
            setIsLoading(false);
        }
    }, 50);
  }, [scores, teams]);

  return (
    <div className="min-h-screen bg-primary font-sans">
      <header className="bg-secondary p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-highlight">Fantasy Football Schedule Simulator</h1>
        <p className="text-center text-text-secondary mt-1">How much did luck and scheduling affect your season?</p>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-secondary p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">1. Input Scores</h2>
            <p className="text-text-secondary mb-4">Enter each team's score for all 9 weeks of the season.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleLoadSampleData}
                className="w-full bg-accent hover:bg-gray-600 text-text-primary font-bold py-2 px-4 rounded transition duration-300"
              >
                Load Sample Data
              </button>
              <button
                onClick={handleSimulate}
                disabled={isLoading}
                className="w-full bg-highlight hover:bg-teal-500 text-primary font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Simulating...' : '2. Run Simulation'}
              </button>
            </div>
            <ScoreGrid
              teams={teams}
              scores={scores}
              onTeamNameChange={handleTeamNameChange}
              onScoreChange={handleScoreChange}
            />
          </div>

          <div className="lg:col-span-2">
            <ResultsDisplay results={simulationResults} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-text-secondary mt-8">
        <p>&copy; {new Date().getFullYear()} Schedule Simulator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
