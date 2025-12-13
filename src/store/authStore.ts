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

interface TokenPayload {
  sub: string;
  username: string;
  exp: number;
}

const getInitialState = () => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_token");
        return { token: null, user: null, isAuthenticated: false };
      }

      return {
        token,
        isAuthenticated: true,
        user: {
          id: decoded.sub,
          username: decoded.username,
          email: "",
          level: 1,
          xp: 0,
        },
      };
    } catch {
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
