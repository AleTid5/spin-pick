import { useSpinPick } from "../context/SpinPickContext";
import { Copy, Trash2, Users } from "lucide-react";

export default function PlayerList() {
  const { players, removePlayer, copyToBulk } = useSpinPick();

  return (
    <div className="bg-gray-900/70 rounded-lg border border-indigo-900/40 shadow-inner overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-indigo-900/40 border-b border-indigo-900/30">
        <h3 className="text-md font-medium text-indigo-200">Current Players</h3>
        <div className="flex items-center">
          <span className="px-2.5 py-1 bg-indigo-800/50 rounded-full text-xs font-medium text-indigo-200">
            {players.length} {players.length === 1 ? "Player" : "Players"}
          </span>
          <button
            onClick={copyToBulk}
            className="text-gray-400 hover:text-purple-400 p-1.5 rounded-full hover:bg-red-900/20 transition-all duration-200"
            aria-label="Copy to bulk"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800">
        {players.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mb-3">
              <Users size={20} className="text-indigo-300/70" />
            </div>
            <p className="text-gray-400">No players added yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Add players to get started
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800/80">
            {players.map((player, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 hover:bg-indigo-900/20 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-700 to-purple-700 flex items-center justify-center mr-3 text-white font-medium text-sm">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-purple-100 font-medium">
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 px-2.5 py-1 bg-indigo-900/50 rounded-full text-xs font-medium text-pink-300">
                    Score: {player.score}
                  </span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="text-gray-400 hover:text-red-400 p-1.5 rounded-full hover:bg-red-900/20 transition-all duration-200"
                    aria-label="Remove player"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
