import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGame() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStartedUI, setGameStartedUI] = useState(false);

  const runningRef = useRef(false);
  const scoreRef = useRef(0);

  const snake = useRef([{ x: 10, y: 10 }]);
  const food = useRef({ x: 15, y: 15 });
  const direction = useRef({ x: 0, y: 0 });
  const nextDirection = useRef({ x: 0, y: 0 });
  const speed = useRef(INITIAL_SPEED);
  const lastRenderTime = useRef(0);
  const gameLoopId = useRef<number>(0);

  const startGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    food.current = generateFood();
    direction.current = { x: 1, y: 0 };
    nextDirection.current = { x: 1, y: 0 };
    speed.current = INITIAL_SPEED;
    lastRenderTime.current = 0;

    scoreRef.current = 0;
    setScore(0);

    setGameOver(false);
    setGameStartedUI(true);

    runningRef.current = true;

    if (gameLoopId.current) cancelAnimationFrame(gameLoopId.current);
    gameLoopId.current = requestAnimationFrame(gameLoop);
  };

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    };
  };

  const gameLoop = (timestamp: number) => {
    if (!runningRef.current) return;

    gameLoopId.current = requestAnimationFrame(gameLoop);

    const secondsSinceLastRender = (timestamp - lastRenderTime.current) / 1000;
    if (secondsSinceLastRender < speed.current / 1000) return;

    lastRenderTime.current = timestamp;
    update();
    draw();
  };

  const update = () => {
    direction.current = nextDirection.current;
    const head = { ...snake.current[0] };
    head.x += direction.current.x;
    head.y += direction.current.y;

    if (
      head.x < 0 ||
      head.x >= CANVAS_SIZE / GRID_SIZE ||
      head.y < 0 ||
      head.y >= CANVAS_SIZE / GRID_SIZE
    ) {
      handleGameOver();
      return;
    }

    for (const part of snake.current) {
      if (head.x === part.x && head.y === part.y) {
        handleGameOver();
        return;
      }
    }

    snake.current.unshift(head);

    if (head.x === food.current.x && head.y === food.current.y) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);

      food.current = generateFood();
      if (newScore > 0 && newScore % 50 === 0) speed.current *= 0.95;
    } else {
      snake.current.pop();
    }
  };

  const draw = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f43f5e";
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(
      food.current.x * GRID_SIZE,
      food.current.y * GRID_SIZE,
      GRID_SIZE - 2,
      GRID_SIZE - 2
    );

    ctx.shadowBlur = 0;
    snake.current.forEach((part, index) => {
      if (index === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#10b981";
        ctx.fillStyle = "#34d399";
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#059669";
      }
      ctx.fillRect(
        part.x * GRID_SIZE,
        part.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
    ctx.shadowBlur = 0;
  };

  const handleGameOver = () => {
    runningRef.current = false;
    setGameOver(true);
    setGameStartedUI(false);
    cancelAnimationFrame(gameLoopId.current);

    if (scoreRef.current > 0) {
      console.log("Enviando pontuação:", scoreRef.current);
      api
        .post("/users/score", {
          gameId: "snake",
          score: scoreRef.current,
        })
        .then((res) => {
          console.log("XP Atualizado!", res.data);
        })
        .catch((err) => {
          console.error("Erro ao salvar pontuação", err);
        });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
          if (direction.current.y === 0)
            nextDirection.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (direction.current.y === 0) nextDirection.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (direction.current.x === 0)
            nextDirection.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (direction.current.x === 0) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(gameLoopId.current);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-6 text-white">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-lg">{score}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-slate-900 rounded-xl border-2 border-slate-700 shadow-2xl block"
        />

        {(!gameStartedUI || gameOver) && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
            {gameOver ? (
              <>
                <h2 className="text-3xl font-bold text-red-500 mb-2">
                  Game Over
                </h2>
                <p className="text-slate-300 mb-6">Pontuação Final: {score}</p>
              </>
            ) : (
              <h2 className="text-3xl font-bold text-emerald-400 mb-6">
                Neon Snake
              </h2>
            )}

            <button
              onClick={startGame}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              {gameOver ? <RefreshCw className="w-5 h-5" /> : null}
              {gameOver ? "Tentar Novamente" : "Começar Jogo"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-slate-500 text-sm">
        Use as setas do teclado para mover
      </p>
    </div>
  );
}
