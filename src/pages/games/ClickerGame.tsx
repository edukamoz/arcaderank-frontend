import { ArrowLeft, MousePointer2, Timer, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export function ClickerGame() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef<number>();

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(true);
    setGameOver(false);
  };

  const handleClick = () => {
    if (isPlaying) {
      setScore((s) => s + 1);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      handleGameOver();
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, timeLeft]);

  const handleGameOver = () => {
    if (score > 0) {
      api
        .post("/users/score", {
          gameId: "clicker",
          score: score,
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-white flex gap-2 transition-colors"
        >
          <ArrowLeft /> Voltar
        </button>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-yellow-400">
            <Trophy className="w-4 h-4" />{" "}
            <span className="font-bold">{score}</span>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 font-bold ${
              timeLeft <= 3
                ? "bg-red-500/20 text-red-400"
                : "bg-slate-800 text-emerald-400"
            }`}
          >
            <Timer className="w-4 h-4" /> <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Área de Jogo */}
      <div className="text-center">
        {!isPlaying && !gameOver && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-32 h-32 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MousePointer2 className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Clicker Hero</h1>
            <p className="text-slate-400 mb-8">
              Clique o mais rápido que puder em 10 segundos!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
            >
              COMEÇAR
            </button>
          </div>
        )}

        {isPlaying && (
          <button
            onClick={handleClick}
            className="w-64 h-64 rounded-full bg-gradient-to-b from-orange-400 to-red-600 active:scale-95 transition-transform flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.5)] border-4 border-orange-300"
          >
            <span className="text-6xl font-black text-white drop-shadow-lg">
              CLIQUE!
            </span>
          </button>
        )}

        {gameOver && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-bold text-white mb-2">
              Tempo Esgotado!
            </h2>
            <div className="text-5xl font-black text-orange-500 my-6">
              {score}{" "}
              <span className="text-lg text-slate-500 font-normal">pontos</span>
            </div>
            <button
              onClick={startGame}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
