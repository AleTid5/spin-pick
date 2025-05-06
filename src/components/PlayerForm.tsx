import { useSpinPick } from "../context/SpinPickContext";
import { Plus, UserPlus, RefreshCw, Users } from "lucide-react";

export default function PlayerForm() {
  const {
    addPlayer,
    newPlayerName,
    setNewPlayerName,
    newPlayerScore,
    setNewPlayerScore,
    numberOfTeams,
    setNumberOfTeams,
    resetGame,
    validatePlayerScore,
    setIsModalOpen,
    players,
    teams,
  } = useSpinPick();

  const handleAddPlayer = () => {
    addPlayer(newPlayerName, newPlayerScore);
    setNewPlayerName("");
    setNewPlayerScore(1);
  };

  return (
    <div className="bg-gray-900/70 rounded-lg p-3 mb-4 border border-indigo-900/30 shadow-inner">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center bg-gray-900/80 rounded-lg border border-indigo-900/30 px-3 py-1">
          <Users size={16} className="text-indigo-300 mr-2" />
          <span className="text-sm font-medium text-indigo-200 mr-2">
            Teams:
          </span>
          <input
            type="number"
            min="2"
            max={Math.max(
              2,
              Math.floor(
                (players.length +
                  teams.reduce((sum, team) => sum + team.members.length, 0)) /
                  2,
              ),
            )}
            value={numberOfTeams}
            onChange={(e) =>
              setNumberOfTeams(Math.max(2, parseInt(e.target.value) || 2))
            }
            className="w-12 p-1 text-center border rounded bg-gray-800/80 text-white border-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-500/40 focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="flex-grow">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={({ key }) => {
              if (key === "Enter") return handleAddPlayer();

              if (key === "ArrowUp")
                return setNewPlayerScore((p) => validatePlayerScore(p + 1));

              if (key === "ArrowDown")
                return setNewPlayerScore((p) => validatePlayerScore(p - 1));
            }}
            placeholder="Enter player name..."
            className="w-full p-2.5 border rounded-lg bg-gray-800/80 text-white border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="w-16">
          <input
            type="number"
            min="1"
            max="10"
            value={newPlayerScore}
            onChange={(e) => setNewPlayerScore(parseInt(e.target.value) || 1)}
            className="w-full p-2.5 text-center border rounded-lg bg-gray-800/80 text-white border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:outline-none transition-all duration-300"
            placeholder="Score"
          />
        </div>

        <button
          onClick={handleAddPlayer}
          disabled={!newPlayerName.trim()}
          className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add player"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300"
          aria-label="Bulk add players"
        >
          <UserPlus size={20} />
        </button>
        <button
          onClick={resetGame}
          className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg flex items-center justify-center hover:from-red-500 hover:to-pink-500 shadow-md hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300"
          aria-label="Reset Game"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
}
