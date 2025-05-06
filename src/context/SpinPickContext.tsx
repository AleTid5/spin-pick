import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type PropsWithChildren,
} from "react";
import type { Player } from "../types/player";
import type { Team } from "../types/team";

interface SpinPickContextType {
  // Players state
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  addPlayer: (name: string, score: number) => void;
  removePlayer: (index: number) => void;

  // Team state
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  numberOfTeams: number;
  setNumberOfTeams: React.Dispatch<React.SetStateAction<number>>;

  // UI state
  newPlayerName: string;
  setNewPlayerName: React.Dispatch<React.SetStateAction<string>>;
  newPlayerScore: number;
  setNewPlayerScore: React.Dispatch<React.SetStateAction<number>>;
  spinning: boolean;
  setSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bulkPlayersText: string;
  setBulkPlayersText: React.Dispatch<React.SetStateAction<string>>;

  // Functions
  addBulkPlayers: () => void;
  addPlayerToTeam: (playerIndex: number) => void;
  resetGame: () => void;
  copyToBulk: () => void;
  validatePlayerScore: (score: number) => number;
}

const SpinPickContext = createContext<SpinPickContextType | undefined>(
  undefined,
);

export const SpinPickProvider: FC<PropsWithChildren> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState<number>(2);

  // UI state
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [newPlayerScore, setNewPlayerScore] = useState<number>(1);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bulkPlayersText, setBulkPlayersText] = useState<string>("");

  // Initialize teams whenever numberOfTeams changes
  useEffect(() => {
    // Create empty teams based on numberOfTeams
    const initialTeams: Team[] = Array(numberOfTeams)
      .fill(null)
      .map(() => ({
        members: [],
        totalScore: 0,
      }));
    setTeams(initialTeams);
  }, [numberOfTeams]);

  // Add a new player
  const addPlayer = (name: string, score: number): void => {
    if (name.trim()) {
      setPlayers([...players, { name: name.trim(), score }]);
    }
  };

  // Remove a player
  const removePlayer = (index: number): void => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  // Parse bulk text and add players
  const addBulkPlayers = (): void => {
    if (!bulkPlayersText.trim()) return;

    const lines = bulkPlayersText.split("\n");
    const newPlayers: Player[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const parts = trimmedLine.split("-").map((part) => part.trim());

        if (parts.length >= 2) {
          const name = parts[0];
          const scoreStr = parts[1];
          const score = parseInt(scoreStr) || 1;

          if (name) {
            newPlayers.push({ name, score });
          }
        }
      }
    });

    if (newPlayers.length > 0) {
      setPlayers([...players, ...newPlayers]);
      setBulkPlayersText("");
      setIsModalOpen(false);
    }
  };

  // Add player to team with lowest score
  const addPlayerToTeam = (playerIndex: number): void => {
    const player = players[playerIndex];

    // First check if we need to balance team sizes
    const teamSizes = teams.map((team) => team.members.length);
    const minTeamSize = Math.min(...teamSizes);
    const teamsWithMinSize = teams
      .map((team, index) => (team.members.length === minTeamSize ? index : -1))
      .filter((index) => index !== -1);

    // If some teams have fewer players, prioritize those teams
    if (teamsWithMinSize.length < teams.length) {
      // Find the team with minimum size AND minimum score
      const teamIndex = teamsWithMinSize.reduce(
        (minIndex, currentIndex) =>
          teams[currentIndex].totalScore < teams[minIndex].totalScore
            ? currentIndex
            : minIndex,
        teamsWithMinSize[0],
      );

      // Add player to that team
      const updatedTeams = [...teams];
      updatedTeams[teamIndex].members.push(player);
      updatedTeams[teamIndex].totalScore += player.score;

      setTeams(updatedTeams);
    } else {
      // All teams have the same number of players, so add to the team with lowest score
      const teamIndex = teams.reduce(
        (minIndex, team, index, allTeams) =>
          team.totalScore < allTeams[minIndex].totalScore ? index : minIndex,
        0,
      );

      // Add player to that team
      const updatedTeams = [...teams];
      updatedTeams[teamIndex].members.push(player);
      updatedTeams[teamIndex].totalScore += player.score;

      setTeams(updatedTeams);
    }

    // Remove player from the wheel
    setPlayers(players.filter((_, i) => i !== playerIndex));
  };

  // Reset the game
  const resetGame = (): void => {
    // Reset the teams
    const initialTeams: Team[] = Array(numberOfTeams)
      .fill(null)
      .map(() => ({
        members: [],
        totalScore: 0,
      }));
    setTeams(initialTeams);

    // Reset player list
    setPlayers([]);
  };

  const validatePlayerScore = (score: number) => (score <= 1 ? 1 : score);

  const copyToBulk = () => {
    const playersToCopy = players.reduce(
      (acc, { name, score }) => acc + `${name} - ${score}\n`,
      "",
    );
    navigator.clipboard.writeText(playersToCopy);
  };

  const value = {
    players,
    setPlayers,
    addPlayer,
    removePlayer,
    teams,
    setTeams,
    numberOfTeams,
    setNumberOfTeams,
    newPlayerName,
    setNewPlayerName,
    newPlayerScore,
    setNewPlayerScore,
    spinning,
    setSpinning,
    isModalOpen,
    setIsModalOpen,
    bulkPlayersText,
    setBulkPlayersText,
    addBulkPlayers,
    addPlayerToTeam,
    resetGame,
    copyToBulk,
    validatePlayerScore,
  };

  return (
    <SpinPickContext.Provider value={value}>
      {children}
    </SpinPickContext.Provider>
  );
};

export const useSpinPick = () => {
  const context = useContext(SpinPickContext);
  if (context === undefined) {
    throw new Error("useSpinPick must be used within a SpinPickProvider");
  }
  return context;
};
