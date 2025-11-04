
export interface Team {
  id: number;
  name: string;
}

export interface SimulationResult {
  teamId: number;
  teamName: string;
  baseWins: number;
  avgWins: number;
  minWins: number;
  maxWins: number;
  winDistribution: {
    wins: number;
    count: number;
  }[];
}
