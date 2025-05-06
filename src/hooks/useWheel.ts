import { useRef, useEffect } from "react";
import type { Player } from "../types/player";
import type { Team } from "../types/team";
import { createBalancedTeams } from "../helpers/teams.ts";

interface UseWheelProps {
  players: Player[];
  spinning: boolean;
  setSpinning: (spinning: boolean) => void;
  teams: Team[];
  numberOfTeams: number;
  setTeams: (teams: Team[]) => void;
  setPlayers: (players: Player[]) => void;
}

export const useWheel = ({
  players,
  spinning,
  setSpinning,
  numberOfTeams,
  teams,
  setTeams,
  setPlayers,
}: UseWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  const balancedTeams = useRef<Team[] | null>(null);

  // Map to track which team each player belongs to
  const playerTeamMap = useRef<
    Map<string, { teamIndex: number; player: Player }>
  >(new Map());

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
      ctx.fillStyle = index % 2 === 0 ? "#203359" : "#2c3a5a";
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

  // Spin the wheel
  const spinWheel = (): void => {
    if (spinning || players.length < 1) return;

    // Calculate balanced teams if not already done
    if (!balancedTeams.current) {
      // Generate optimally balanced teams
      balancedTeams.current = createBalancedTeams(players, numberOfTeams);
      console.log(balancedTeams.current);

      // Create a map of player name to their assigned team
      playerTeamMap.current.clear();

      // Map each player to their assigned team
      balancedTeams.current.forEach((team, teamIndex) => {
        team.members.forEach((player) => {
          playerTeamMap.current.set(player.name, {
            teamIndex,
            player,
          });
        });
      });
    }

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
        // Determine selected player for visual effect
        const anglePerSegment = (Math.PI * 2) / players.length;
        const normalizedRotation = rotationRef.current % (Math.PI * 2);
        const selectedIndex =
          players.length -
          (Math.floor(normalizedRotation / anglePerSegment) % players.length) -
          1;

        const selectedPlayer = players[selectedIndex];

        // Look up which team this player is assigned to
        const playerAssignment = playerTeamMap.current.get(selectedPlayer.name);

        if (!playerAssignment) {
          // Should never happen, but fallback to lowest score team if it does
          const teamIndex = teams.reduce(
            (minIndex, team, index, allTeams) =>
              team.totalScore < allTeams[minIndex].totalScore
                ? index
                : minIndex,
            0,
          );

          // Add player to team
          const updatedTeams = [...teams];
          updatedTeams[teamIndex].members.push(selectedPlayer);
          updatedTeams[teamIndex].totalScore += selectedPlayer.score;

          setTeams(updatedTeams);
          setPlayers(players.filter((p) => p.name !== selectedPlayer.name));
          setSpinning(false);
          return;
        }

        const { teamIndex } = playerAssignment;

        // Handle last players specially for smooth visual transition
        if (players.length <= 2) {
          if (players.length === 2) {
            // For 2 players, show transition
            const otherPlayerIndex = selectedIndex === 0 ? 1 : 0;
            const otherPlayer = players[otherPlayerIndex];

            // Add first player to their assigned team
            const updatedTeams = [...teams];
            updatedTeams[teamIndex].members.push(selectedPlayer);
            updatedTeams[teamIndex].totalScore += selectedPlayer.score;

            setTeams(updatedTeams);
            setPlayers([otherPlayer]);

            // After delay, update to final teams
            setTimeout(() => {
              // For the last player, find their team assignment
              const lastPlayerAssignment = playerTeamMap.current.get(
                otherPlayer.name,
              );

              if (lastPlayerAssignment) {
                const finalTeams = [...updatedTeams];
                finalTeams[lastPlayerAssignment.teamIndex].members.push(
                  otherPlayer,
                );
                finalTeams[lastPlayerAssignment.teamIndex].totalScore +=
                  otherPlayer.score;

                setTeams(finalTeams);
                setPlayers([]);
              } else {
                // Fallback for last player if something goes wrong
                const finalTeams = [...updatedTeams];
                const lastTeamIndex = finalTeams.reduce(
                  (minIndex, team, index, allTeams) =>
                    team.totalScore < allTeams[minIndex].totalScore
                      ? index
                      : minIndex,
                  0,
                );

                finalTeams[lastTeamIndex].members.push(otherPlayer);
                finalTeams[lastTeamIndex].totalScore += otherPlayer.score;

                setTeams(finalTeams);
                setPlayers([]);
              }

              setSpinning(false);
            }, 2000);
          } else {
            // Last player - just assign them
            setTimeout(() => {
              const finalTeams = [...teams];
              finalTeams[teamIndex].members.push(selectedPlayer);
              finalTeams[teamIndex].totalScore += selectedPlayer.score;

              setTeams(finalTeams);
              setPlayers([]);
              setSpinning(false);
            }, 1000);
          }
        } else {
          // Regular case (more than 2 players left)
          const updatedTeams = [...teams];
          updatedTeams[teamIndex].members.push(selectedPlayer);
          updatedTeams[teamIndex].totalScore += selectedPlayer.score;

          setTeams(updatedTeams);
          setPlayers(players.filter((p) => p.name !== selectedPlayer.name));
          setSpinning(false);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Draw wheel when players change
  useEffect(() => {
    drawWheel();
  }, [players]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    didSpin: !!balancedTeams.current,
    spinWheel,
  };
};
