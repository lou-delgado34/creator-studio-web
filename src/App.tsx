import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";
import PricingPage from "./pages/PricingPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const email = localStorage.getItem("creatorstudio-email") || "you@example.com";
  const role = localStorage.getItem("creatorstudio-role") || "admin";
  const plan = localStorage.getItem("creatorstudio-plan") || "admin_unlimited";
  const credits = localStorage.getItem("creatorstudio-credits") || "Unlimited";

  const handleSignOut = () => {
    localStorage.removeItem("creatorstudio-auth");
    window.location.href = "/auth";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <AppShell
              email={email}
              role={role}
              plan={plan}
              credits={credits}
              onSignOut={handleSignOut}
            />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
