import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { ClickerGame } from "./pages/games/ClickerGame";
import { SnakeGame } from "./pages/games/SnakeGame";
import { Leaderboard } from "./pages/Leaderboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/game/snake" element={<SnakeGame />} />
        <Route path="/game/clicker" element={<ClickerGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
