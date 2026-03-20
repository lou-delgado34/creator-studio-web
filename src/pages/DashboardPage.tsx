import { useAuth } from "../context/AuthContext";
import { getDisplayCredits, isAdminUnlimited } from "../lib/appTypes";

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="page-grid">
      <section className="hero-card">
        <span className="badge">Business App Starter</span>
        <h1>Dashboard</h1>
        <p>
          This is your real business foundation. Next, you will connect live projects,
          saved drafts, uploads, customer plans, and revenue tools.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Plan</h3>
          <strong>{profile?.plan || "free"}</strong>
        </div>
        <div className="stat-card">
          <h3>AI Credits</h3>
          <strong>{getDisplayCredits(profile)}</strong>
        </div>
        <div className="stat-card">
          <h3>Role</h3>
          <strong>{profile?.role || "user"}</strong>
        </div>
      </section>

      <section className="two-col">
        <div className="panel">
          <h2>Business Status</h2>
          <p>
            Your app is now live and structured for business growth. Next upgrades will add
            saved projects, billing, uploads, and real customer usage tracking.
          </p>
          <br />
          <p>
            Admin unlimited access:{" "}
            <span className={isAdminUnlimited(profile) ? "limit-admin" : "limit-warn"}>
              {isAdminUnlimited(profile) ? "Enabled" : "Not Enabled"}
            </span>
          </p>
        </div>

        <div className="panel">
          <h2>Next Build Goals</h2>
          <p>• Save projects to database</p>
          <p>• Store drafts</p>
          <p>• Upload media</p>
          <p>• Connect payments</p>
          <p>• Track usage by plan</p>
        </div>
      </section>
    </div>
  );
}
