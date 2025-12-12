import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Helper para restaurar sessão ao dar F5
const getInitialState = () => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    try {
      // Tenta decodificar o token salvo para recuperar ID e Username
      const decoded: any = jwtDecode(token);

      // Verifica se o token não expirou (timestamp em segundos)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_token");
        return { token: null, user: null, isAuthenticated: false };
      }

      return {
        token,
        isAuthenticated: true,
        user: {
          id: decoded.sub, // Recupera o ID crítico para a Dashboard funcionar
          username: decoded.username,
          email: "", // Backend preencherá depois
          level: 1, // Dashboard atualizará
          xp: 0, // Dashboard atualizará
        },
      };
    } catch (error) {
      localStorage.removeItem("auth_token");
    }
  }

  return { token: null, user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  login: (token, user) => {
    localStorage.setItem("auth_token", token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
