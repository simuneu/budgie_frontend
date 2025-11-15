import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
  );
}
