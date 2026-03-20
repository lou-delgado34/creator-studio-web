import { NavLink, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { getDisplayCredits, isAdminUnlimited } from "../lib/appTypes";

export default function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/auth");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">CreatorStudio</div>
          <div className="brand-subtitle">Business Creator Platform</div>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Editor
          </NavLink>
          <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Pricing
          </NavLink>
          {profile?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="sidebar-card">
          <h4>{profile?.full_name || profile?.email || "Creator"}</h4>
          <p>Plan: {profile?.plan || "free"}</p>
          <p>
            Credits:{" "}
            <span className={isAdminUnlimited(profile) ? "limit-admin" : "limit-ok"}>
              {getDisplayCredits(profile)}
            </span>
          </p>
          <button className="secondary-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <div className="topbar">
          <div className="topbar-title">My Creator Business</div>
          <div className="topbar-actions">
            <button className="secondary-btn" onClick={() => navigate("/editor")}>
              Open Editor
            </button>
            <button className="primary-btn" onClick={() => navigate("/pricing")}>
              View Plans
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
