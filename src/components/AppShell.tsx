import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

type AppShellProps = {
  email?: string;
  role?: string;
  plan?: string;
  credits?: string | number;
  onSignOut?: () => void;
};

function NavItem({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={to} className={`cs-nav-item ${active ? "active" : ""}`}>
      <span className="cs-nav-dot" />
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({
  email = "you@example.com",
  role = "admin",
  plan = "admin_unlimited",
  credits = "Unlimited",
  onSignOut,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  return (
    <div className="cs-app-shell">
      <aside className="cs-sidebar">
        <div className="cs-brand">
          <div className="cs-brand-mark">C</div>
          <div>
            <h1>CreatorStudio</h1>
            <p>Business Creator Platform</p>
          </div>
        </div>

        <nav className="cs-nav">
          <NavItem to="/dashboard" label="Dashboard" active={pathname.startsWith("/dashboard")} />
          <NavItem to="/editor?mode=create" label="Create" active={pathname.startsWith("/editor")} />
          <NavItem to="/pricing" label="Plans" active={pathname.startsWith("/pricing")} />
          <NavItem to="/admin" label="Admin" active={pathname.startsWith("/admin")} />
        </nav>

        <div className="cs-sidebar-section">
          <div className="cs-sidebar-kicker">Workspace</div>
          <div className="cs-side-card">
            <div className="cs-side-stat">
              <span>Role</span>
              <strong>{role}</strong>
            </div>
            <div className="cs-side-stat">
              <span>Plan</span>
              <strong>{plan}</strong>
            </div>
            <div className="cs-side-stat">
              <span>Credits</span>
              <strong>{credits}</strong>
            </div>
          </div>
        </div>

        <div className="cs-profile-card">
          <div className="cs-avatar">
            {(email?.[0] || "U").toUpperCase()}
          </div>
          <div className="cs-profile-copy">
            <strong>{email}</strong>
            <span>{plan}</span>
          </div>
          <button
            className="cs-signout-btn"
            onClick={() => {
              if (onSignOut) {
                onSignOut();
                return;
              }
              navigate("/auth");
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="cs-main">
        <header className="cs-topbar">
          <div>
            <div className="cs-topbar-kicker">Creator Business App</div>
            <h2>Your working studio</h2>
          </div>

          <div className="cs-topbar-actions">
            <Link className="cs-btn cs-btn-secondary" to="/editor?mode=create">
              Open Editor
            </Link>
            <Link className="cs-btn cs-btn-primary" to="/pricing">
              Upgrade Plan
            </Link>
          </div>
        </header>

        <div className="cs-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
