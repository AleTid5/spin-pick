import { useSpinPick } from "../context/SpinPickContext";
import { Award } from "lucide-react";

export default function TeamList() {
  const { teams } = useSpinPick();

  return (
    <div className="lg:w-1/2 backdrop-blur-sm bg-gray-800/70 rounded-xl shadow-[0_0_15px_rgba(100,80,230,0.25)] p-5 border border-gray-700/50">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 drop-shadow-[0_1px_1px_rgba(150,150,255,0.5)]">
        <Award size={20} className="mr-2 text-indigo-300" /> Teams
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div
            key={index}
            className="border border-indigo-900/40 rounded-lg p-4 bg-gradient-to-br from-gray-900 to-indigo-900/30 shadow-md hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300"
          >
            <h3 className="font-bold text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              Team {index + 1}
            </h3>
            <p className="text-sm mb-3 text-indigo-200 font-medium">
              Total Score:{" "}
              <span className="text-pink-300">{team.totalScore}</span>
            </p>
            {team.members.length > 0 ? (
              <ul className="space-y-1.5 text-indigo-100">
                {team.members.map((player, playerIndex) => (
                  <li
                    key={playerIndex}
                    className="flex items-center pl-2 border-l-2 border-indigo-500/50"
                  >
                    <span className="font-medium">{player.name}</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-900/50 rounded text-xs text-pink-300">
                      {player.score}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No players yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
