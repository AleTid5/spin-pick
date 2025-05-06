import { useSpinPick } from "../context/SpinPickContext";
import { useWheel } from "../hooks/useWheel";

export default function Wheel() {
  const {
    players,
    spinning,
    setSpinning,
    teams,
    setTeams,
    setPlayers,
    numberOfTeams,
    resetGame,
  } = useSpinPick();

  const { canvasRef, didSpin, spinWheel } = useWheel({
    players,
    spinning,
    setSpinning,
    numberOfTeams,
    teams,
    setTeams,
    setPlayers,
  });

  return (
    <div className="relative lg:w-1/2 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-md opacity-30 animate-pulse" />
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="border-4 border-gray-800/80 rounded-full shadow-xl bg-gray-800 relative z-10"
        />
      </div>

      {players.length === 0 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 backdrop-blur-md bg-gray-800/90 rounded-xl shadow-xl text-white border border-gray-700/50 z-30">
          <p className="text-indigo-200">
            {didSpin
              ? "All players have been assigned to teams"
              : "Add players to start spinning"}
          </p>
          {didSpin && (
            <button
              onClick={resetGame}
              className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-600/20"
            >
              Reset Game
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={spinWheel}
          disabled={spinning || players.length < 1}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg z-20 animate-[pulse_1.5s_ease-in-out_infinite] hover:animate-none ${spinning && "hidden"}`}
        >
          SPIN
        </button>
      )}
    </div>
  );
}
