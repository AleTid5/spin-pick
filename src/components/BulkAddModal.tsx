import { useSpinPick } from "../context/SpinPickContext";
import { UserPlus, X } from "lucide-react";

export default function BulkAddModal() {
  const {
    bulkPlayersText,
    setBulkPlayersText,
    addBulkPlayers,
    setIsModalOpen,
  } = useSpinPick();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-indigo-900/50 shadow-[0_0_30px_rgba(100,80,230,0.35)] w-full max-w-md p-5 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-200 flex items-center">
            <UserPlus size={18} className="mr-2 text-indigo-300" />
            Bulk Add Players
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-700/80 text-gray-400 hover:text-gray-200 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            Add multiple players (one per line) with format:{" "}
            <span className="text-pink-300">Name - Score</span>
          </p>
          <textarea
            value={bulkPlayersText}
            onChange={(e) => setBulkPlayersText(e.target.value)}
            placeholder="John Doe - 3&#10;Lalo - 4&#10;Elmas Gorreado - 1"
            className="w-full h-40 p-3 border rounded-lg bg-gray-700/50 text-white border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:outline-none transition-all duration-300"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={addBulkPlayers}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg hover:shadow-indigo-600/20 transition-all duration-300"
          >
            Add Players
          </button>
        </div>
      </div>
    </div>
  );
}
