import { useSpinPick } from "../context/SpinPickContext";
import PlayerForm from "./PlayerForm";
import PlayerList from "./PlayerList";
import Wheel from "./Wheel";
import TeamList from "./TeamList";
import BulkAddModal from "./BulkAddModal";
import logo from "../assets/logo.svg";

export default function SpinPickApp() {
  const { isModalOpen } = useSpinPick();

  return (
    <div className="flex flex-col items-center w-full mx-auto p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen">
      <div className="flex items-center gap-1 mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_1.2px_1.2px_rgba(150,150,255,0.7)]">
          SpinPick
        </h1>
        <img src={logo} className="logo w-10" alt="SpinPick logo" />
      </div>

      {isModalOpen && <BulkAddModal />}

      <div className="w-full backdrop-blur-sm bg-gray-800/70 rounded-xl shadow-[0_0_15px_rgba(100,80,230,0.25)] p-5 mb-6 border border-gray-700/50">
        <PlayerForm />
        <PlayerList />
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        <Wheel />
        <TeamList />
      </div>

      <div className="mt-8 text-center text-indigo-300/50 text-sm">
        <p>Create balanced teams randomly with style</p>
      </div>
    </div>
  );
}
