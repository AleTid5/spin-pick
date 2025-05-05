import { useEffect, useRef, useState } from "react";
import {
  Award,
  Copy,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import logo from "./assets/logo.svg";

type Player = { name: string; score: number };
type Team = { members: Player[]; totalScore: number };

export default function SpinPick() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [newPlayerScore, setNewPlayerScore] = useState<number>(1);
  const [numberOfTeams, setNumberOfTeams] = useState<number>(2);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bulkPlayersText, setBulkPlayersText] = useState<string>("");

  const hasSpinned = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);

  // Initialize teams
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
  const addPlayer = (): void => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        { name: newPlayerName.trim(), score: newPlayerScore },
      ]);
      setNewPlayerName("");
      setNewPlayerScore(1);
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

  // Draw the wheel
  const drawWheel = (): void => {
    const canvas = canvasRef.current;
    if (!canvas || players.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1e1e2f";
    ctx.fill();

    // Draw wheel segments
    const anglePerSegment = (Math.PI * 2) / players.length;
    const rotation = rotationRef.current;

    players.forEach((player, index) => {
      const startAngle = rotation + index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill with alternating dark colors
      ctx.fillStyle = index % 2 === 0 ? "#2d3748" : "#4a5568";
      ctx.fill();

      // Add player name
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(player.name, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle with gradient
    const centerGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      25,
    );
    centerGradient.addColorStop(0, "#9f7aea"); // Purple
    centerGradient.addColorStop(0.5, "#4c1d95"); // Deep purple
    centerGradient.addColorStop(1, "#312e81"); // Indigo

    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.fill();

    // Add inner circle with gradient
    const innerGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      10,
    );
    innerGradient.addColorStop(0, "#c4b5fd"); // Light purple
    innerGradient.addColorStop(1, "#8b5cf6"); // Medium purple

    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = innerGradient;
    ctx.fill();

    // Draw fancy arrow pointer
    ctx.save();

    // Position arrow at right side of wheel
    const arrowX = centerX + radius + 10;
    const arrowY = centerY;
    const arrowWidth = 60;
    const arrowHeight = 30;

    // Create arrow shape
    ctx.beginPath();

    // Arrow point
    ctx.moveTo(arrowX - arrowWidth, arrowY);

    // Top side with curve
    ctx.lineTo(arrowX - arrowWidth + 15, arrowY - arrowHeight / 2);
    ctx.quadraticCurveTo(
      arrowX - arrowWidth / 2,
      arrowY - arrowHeight / 2 - 5,
      arrowX,
      arrowY - arrowHeight / 3,
    );

    // Bottom side with curve
    ctx.quadraticCurveTo(
      arrowX - arrowWidth / 2,
      arrowY + arrowHeight / 2 + 5,
      arrowX - arrowWidth + 15,
      arrowY + arrowHeight / 2,
    );

    ctx.closePath();

    // Create fancy gradient for arrow
    const arrowGradient = ctx.createLinearGradient(
      arrowX - arrowWidth,
      arrowY,
      arrowX,
      arrowY,
    );

    // Vibrant gradient with multiple color stops
    arrowGradient.addColorStop(0, "#3b82f6"); // Blue
    arrowGradient.addColorStop(0.25, "#8b5cf6"); // Purple
    arrowGradient.addColorStop(0.5, "#10b981"); // Green
    arrowGradient.addColorStop(0.75, "#f59e0b"); // Amber
    arrowGradient.addColorStop(1, "#ef4444"); // Red

    ctx.fillStyle = arrowGradient;
    ctx.fill();

    // Add arrow border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add arrow highlight
    ctx.beginPath();
    ctx.moveTo(arrowX - arrowWidth + 10, arrowY - arrowHeight / 3);
    ctx.quadraticCurveTo(
      arrowX - arrowWidth / 1.8,
      arrowY - arrowHeight / 4,
      arrowX - arrowWidth / 4,
      arrowY - arrowHeight / 5,
    );
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  };

  // Add player to team with lowest score
  const addPlayerToTeam = (playerIndex: number): void => {
    const player = players[playerIndex];

    // Find team with lowest current score
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

    // Remove player from the wheel
    setPlayers(players.filter((_, i) => i !== playerIndex));
  };

  // Spin the wheel
  const spinWheel = (): void => {
    if (spinning || players.length < 1) return;
    if (!hasSpinned.current) hasSpinned.current = true;

    setSpinning(true);

    // Random final rotation (5-10 full rotations + random segment)
    const spinDuration = 5000; // 5 seconds
    const minRotations = 5;
    const maxRotations = 10;
    const totalRotation =
      (Math.random() * (maxRotations - minRotations) + minRotations) *
        Math.PI *
        2 +
      rotationRef.current;

    const startTime = Date.now();
    const initialRotation = rotationRef.current;

    const animate = (): void => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      rotationRef.current = initialRotation + totalRotation * easeOut;

      drawWheel();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Determine selected player
        const anglePerSegment = (Math.PI * 2) / players.length;
        const normalizedRotation = rotationRef.current % (Math.PI * 2);
        const selectedIndex =
          players.length -
          (Math.floor(normalizedRotation / anglePerSegment) % players.length) -
          1;

        // If we have exactly 2 players left, assign both with a delay
        if (players.length === 2) {
          // First assign the selected player
          const firstPlayer = players[selectedIndex];
          const secondPlayer = players[selectedIndex === 0 ? 1 : 0];

          // Find team with lowest current score for first player
          const firstTeamIndex = teams.reduce(
            (minIndex, team, index, allTeams) =>
              team.totalScore < allTeams[minIndex].totalScore
                ? index
                : minIndex,
            0,
          );

          // Add first player to team
          const updatedTeams = [...teams];
          updatedTeams[firstTeamIndex].members.push(firstPlayer);
          updatedTeams[firstTeamIndex].totalScore += firstPlayer.score;

          // Update UI to show first player selected
          setTeams(updatedTeams);
          setPlayers([secondPlayer]); // Keep only second player for visual indication

          // After 2 seconds, assign second player
          setTimeout(() => {
            // Find team with lowest score for second player (after first assignment)
            const secondTeamIndex = updatedTeams.reduce(
              (minIndex, team, index, allTeams) =>
                team.totalScore < allTeams[minIndex].totalScore
                  ? index
                  : minIndex,
              0,
            );

            // Add second player to team
            updatedTeams[secondTeamIndex].members.push(secondPlayer);
            updatedTeams[secondTeamIndex].totalScore += secondPlayer.score;

            // Update UI to show both players assigned
            setTeams(updatedTeams);
            setPlayers([]); // Empty the wheel
            setSpinning(false);
          }, 2000);
        }
        // For the last player, just assign directly (we'll add a timer for visual effect)
        else if (players.length === 1) {
          setTimeout(() => {
            addPlayerToTeam(0);
            setSpinning(false);
          }, 1000);
        }
        // Normal case - more than 2 players
        else {
          addPlayerToTeam(selectedIndex);
          setSpinning(false);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const validatePlayerScore = (score: number) => (score <= 1 ? 1 : score);

  const copyToBulk = () => {
    const playersToCopy = players.reduce(
      (acc, { name, score }) => acc + `${name} - ${score}\n`,
      "",
    );
    navigator.clipboard.writeText(playersToCopy);
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

    // Reset player list with initial players
    setPlayers([]);
  };

  // Draw wheel when players change
  useEffect(() => {
    drawWheel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen">
      <div className="flex items-center gap-1 mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_1.2px_1.2px_rgba(150,150,255,0.7)]">
          SpinPick
        </h1>
        <img src={logo} className="logo w-10" alt="SpinPick logo" />
      </div>

      {isModalOpen && (
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
      )}

      <div className="w-full backdrop-blur-sm bg-gray-800/70 rounded-xl shadow-[0_0_15px_rgba(100,80,230,0.25)] p-5 mb-6 border border-gray-700/50">
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
                      teams.reduce(
                        (sum, team) => sum + team.members.length,
                        0,
                      )) /
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
                  if (key === "Enter") return addPlayer();

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
                onChange={(e) =>
                  setNewPlayerScore(parseInt(e.target.value) || 1)
                }
                className="w-full p-2.5 text-center border rounded-lg bg-gray-800/80 text-white border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 focus:outline-none transition-all duration-300"
                placeholder="Score"
              />
            </div>

            <button
              onClick={addPlayer}
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

        <div className="bg-gray-900/70 rounded-lg border border-indigo-900/40 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-indigo-900/40 border-b border-indigo-900/30">
            <h3 className="text-md font-medium text-indigo-200">
              Current Players
            </h3>
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
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6">
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
                {hasSpinned.current
                  ? "All players have been assigned to teams"
                  : "Add players to start spinning"}
              </p>
              {hasSpinned.current && (
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
      </div>

      <div className="mt-8 text-center text-indigo-300/50 text-sm">
        <p>Create balanced teams randomly with style</p>
      </div>
    </div>
  );
}
