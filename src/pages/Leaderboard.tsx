import clsx from "clsx"; // Utilitário para condicionais de classe
import { ArrowLeft, Crown, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";

interface UserRank {
  id: string;
  username: string;
  level: number;
  xp: number;
}

export function Leaderboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [leaders, setLeaders] = useState<UserRank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/leaderboard")
      .then((res) => setLeaders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
      default:
        return <span className="font-bold text-slate-500">#{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-8 mt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Ranking Global</h1>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar o título */}
      </div>

      {/* Lista */}
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between text-sm font-medium text-slate-400">
          <span>Jogador</span>
          <span>Nível & XP</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">
            Carregando ranking...
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {leaders.map((user, index) => (
              <div
                key={user.id}
                className={clsx(
                  "flex items-center justify-between p-4 transition-colors hover:bg-slate-800/50",
                  user.id === currentUser?.id &&
                    "bg-emerald-500/10 border-l-4 border-emerald-500" // Highlight se for você
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p
                      className={clsx(
                        "font-bold",
                        index === 0 ? "text-yellow-400" : "text-white"
                      )}
                    >
                      {user.username}
                    </p>
                    {user.id === currentUser?.id && (
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                        Você
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white text-lg">
                    Lvl {user.level}
                  </div>
                  <div className="text-xs text-slate-500">{user.xp} XP</div>
                </div>
              </div>
            ))}

            {leaders.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                Nenhum jogador encontrado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
