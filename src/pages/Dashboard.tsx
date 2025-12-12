import { Brain, Ghost, LogOut, Play, Star, Swords, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";

// Mock dos jogos (depois virão do banco)
const GAMES = [
  {
    id: "snake",
    name: "Neon Snake",
    description: "O clássico da cobrinha com visual Cyberpunk.",
    color: "from-emerald-500 to-teal-900",
    icon: Ghost,
  },
  {
    id: "memory",
    name: "Memory Matrix",
    description: "Desafie seu cérebro neste jogo de memória.",
    color: "from-blue-500 to-indigo-900",
    icon: Brain,
  },
  {
    id: "clicker",
    name: "Clicker Hero",
    description: "Teste sua velocidade de clique e ganhe XP rápido.",
    color: "from-orange-500 to-red-900",
    icon: Swords,
  },
];

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ level: 1, xp: 0 });

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/users/${user.id}`)
        .then((res) => {
          setStats({ level: res.data.level, xp: res.data.xp });
        })
        .catch((err) => console.error("Erro ao buscar dados do usuário", err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-emerald-400 to-blue-500 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ArcadeRank</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/leaderboard"
              className="hidden md:flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors mr-2"
              title="Ver Ranking"
            >
              <Trophy className="w-5 h-5" />
            </Link>

            {/* User Stats Widget */}
            <div className="hidden md:flex items-center gap-4 bg-slate-800/50 py-1.5 px-4 rounded-full border border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  {stats.level}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase font-bold">
                    Level
                  </span>
                  <div className="w-24 h-1.5 bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${Math.min(stats.xp, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-700 mx-2"></div>
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span className="font-bold">
                  {stats.xp}{" "}
                  <span className="text-xs text-yellow-400/60 font-normal">
                    XP
                  </span>
                </span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-300">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Play className="fill-white" /> Jogos Disponíveis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-emerald-900/20"
            >
              {/* Card Header / Banner */}
              <div
                className={`h-32 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}
              >
                <game.icon className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                <p className="text-slate-400 text-sm mb-6 h-10">
                  {game.description}
                </p>

                <Link
                  to={`/game/${game.id}`}
                  className="w-full py-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Jogar Agora
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
