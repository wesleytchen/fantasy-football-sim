
import type { Team, SimulationResult } from '../types';
import { NUM_TEAMS, NUM_WEEKS, SIMULATION_RUNS } from '../constants';

// Fisher-Yates shuffle algorithm
const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generates a single, random, valid schedule for the season
const generateRandomSchedule = (): number[][][] => {
  const schedule: number[][][] = Array(NUM_WEEKS).fill(0).map(() => []);
  const teamIds = Array.from({ length: NUM_TEAMS }, (_, i) => i);

  for (let week = 0; week < NUM_WEEKS; week++) {
    const shuffledTeams = shuffle(teamIds);
    const weeklyMatchups: number[][] = [];
    const teamsInWeek = [...shuffledTeams];

    while (teamsInWeek.length >= 2) {
      const team1 = teamsInWeek.pop()!;
      const team2 = teamsInWeek.pop()!;
      weeklyMatchups.push([team1, team2]);
    }
    schedule[week] = weeklyMatchups;
  }
  return schedule;
};

// Calculates wins for all teams based on a given schedule and scores
const calculateResultsForSchedule = (schedule: number[][][], scores: number[][]): number[] => {
  const wins = Array(NUM_TEAMS).fill(0);
  
  schedule.forEach((weeklyMatchups, weekIndex) => {
    weeklyMatchups.forEach(([team1Id, team2Id]) => {
      const score1 = scores[team1Id][weekIndex];
      const score2 = scores[team2Id][weekIndex];
      if (score1 > score2) {
        wins[team1Id]++;
      } else if (score2 > score1) {
        wins[team2Id]++;
      }
      // Ties are not counted as wins
    });
  });

  return wins;
};


export const runSimulation = (scores: number[][], teams: Team[]): SimulationResult[] => {
  const allSimulatedWins: number[][] = Array(NUM_TEAMS).fill(0).map(() => []);

  // Generate a base schedule for "Base Wins" comparison
  const baseSchedule = generateRandomSchedule();
  const baseWins = calculateResultsForSchedule(baseSchedule, scores);

  // Run Monte Carlo simulations
  for (let i = 0; i < SIMULATION_RUNS; i++) {
    const randomSchedule = generateRandomSchedule();
    const weeklyWins = calculateResultsForSchedule(randomSchedule, scores);
    weeklyWins.forEach((winCount, teamId) => {
      allSimulatedWins[teamId].push(winCount);
    });
  }

  // Aggregate results
  const results: SimulationResult[] = teams.map((team, teamId) => {
    const winsArray = allSimulatedWins[teamId];
    const sumWins = winsArray.reduce((acc, w) => acc + w, 0);
    const avgWins = sumWins / SIMULATION_RUNS;
    const minWins = Math.min(...winsArray);
    const maxWins = Math.max(...winsArray);

    const winDistributionMap = new Map<number, number>();
    for (const win of winsArray) {
      winDistributionMap.set(win, (winDistributionMap.get(win) || 0) + 1);
    }
    
    const winDistribution = Array.from({ length: NUM_WEEKS + 1 }, (_, i) => ({
      wins: i,
      count: winDistributionMap.get(i) || 0,
    }));

    return {
      teamId: team.id,
      teamName: team.name,
      baseWins: baseWins[teamId],
      avgWins: parseFloat(avgWins.toFixed(2)),
      minWins,
      maxWins,
      winDistribution,
    };
  });

  // Sort results by average wins descending
  results.sort((a, b) => b.avgWins - a.avgWins);

  return results;
};
