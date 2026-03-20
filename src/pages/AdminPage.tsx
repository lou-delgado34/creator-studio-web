import { useAuth } from "../context/AuthContext";
import { getDisplayCredits, isAdminUnlimited } from "../lib/appTypes";

export default function AdminPage() {
  const { profile } = useAuth();

  return (
    <div className="page-grid">
      <section className="hero-card">
        <span className="badge">Admin Only</span>
        <h1>Admin Control Panel</h1>
        <p>
          This is where your business controls will live: user management, plan changes,
          feature flags, billing overrides, and revenue tracking.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Admin Role</h3>
          <strong>{profile?.role}</strong>
        </div>
        <div className="stat-card">
          <h3>Plan</h3>
          <strong>{profile?.plan}</strong>
        </div>
        <div className="stat-card">
          <h3>Credits</h3>
          <strong>{getDisplayCredits(profile)}</strong>
        </div>
      </section>

      <section className="two-col">
        <div className="panel">
          <h2>Unlimited Access</h2>
          <p>
            Status:{" "}
            <span className={isAdminUnlimited(profile) ? "limit-admin" : "limit-warn"}>
              {isAdminUnlimited(profile) ? "Enabled" : "Disabled"}
            </span>
          </p>
          <br />
          <p>Admin rules in this starter pack:</p>
          <p>• unlimited AI credits</p>
          <p>• all premium pages unlocked</p>
          <p>• pricing restrictions bypassed</p>
        </div>

        <div className="panel">
          <h2>Next Admin Upgrades</h2>
          <p>• user table viewer</p>
          <p>• plan editor</p>
          <p>• manual pro grants</p>
          <p>• revenue dashboard</p>
          <p>• support ticket controls</p>
        </div>
      </section>
    </div>
  );
}
