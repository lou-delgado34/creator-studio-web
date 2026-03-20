import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppShell from "./components/AppShell";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";
import PricingPage from "./pages/PricingPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { loading, session } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading your app...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { loading, session, profile } = useAuth();

  if (loading) {
    return <div className="screen-center">Checking admin access...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={session ? "/dashboard" : "/auth"} replace />}
      />
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <AppShell>
              <EditorPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pricing"
        element={
          <ProtectedRoute>
            <AppShell>
              <PricingPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppShell>
              <AdminPage />
            </AppShell>
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
