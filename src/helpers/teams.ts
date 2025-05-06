import type { Player } from "../types/player.ts";
import type { Team } from "../types/team.ts";

export const createBalancedTeams = (
  allPlayers: Player[],
  numTeams: number,
): Team[] => {
  const sortedPlayers = [...allPlayers].sort((a, b) => b.score - a.score);

  const balancedTeams: Team[] = Array(numTeams)
    .fill(null)
    .map(() => ({
      members: [],
      totalScore: 0,
    }));

  sortedPlayers.forEach((player) => {
    const teamIndex = balancedTeams.reduce(
      (minIndex, team, index, allTeams) =>
        team.totalScore < allTeams[minIndex].totalScore ? index : minIndex,
      0,
    );

    balancedTeams[teamIndex].members.push(player);
    balancedTeams[teamIndex].totalScore += player.score;
  });

  return balancedTeams;
};
