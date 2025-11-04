
import React from 'react';
import type { SimulationResult } from '../types';
import TeamResultCard from './TeamResultCard';

interface ResultsDisplayProps {
  results: SimulationResult[] | null;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-highlight"></div>
      <p className="mt-4 text-text-secondary text-lg">Running 10,000 simulations...</p>
      <p className="text-text-secondary text-sm">This might take a moment.</p>
    </div>
);

const InitialMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full bg-secondary p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4 text-text-primary">3. View Simulation Results</h2>
        <p className="text-text-secondary max-w-md">
            Once you've entered your league's scores (or loaded the sample data), click "Run Simulation".
            The results, including average wins and win distribution charts for each team, will appear here.
        </p>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
        <div className="bg-secondary p-6 rounded-lg shadow-2xl h-96">
            <LoadingSpinner />
        </div>
    );
  }

  if (!results) {
    return <InitialMessage />;
  }

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-text-primary text-center">Simulation Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((result) => (
                <TeamResultCard key={result.teamId} result={result} />
            ))}
        </div>
    </div>
  );
};

export default ResultsDisplay;
