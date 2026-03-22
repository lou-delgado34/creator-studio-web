export default function AdminPage() {
  return (
    <div className="cs-screen">
      <section className="cs-hero-strip">
        <div className="cs-hero-left">
          <div className="cs-chip">Admin</div>
          <h1>Manage your creator business system</h1>
          <p>
            This area is for higher-level controls like users, business settings,
            future billing tools, and content operations.
          </p>
        </div>

        <div className="cs-hero-right">
          <div className="cs-floating-card">
            <span>Role</span>
            <strong>admin</strong>
          </div>
          <div className="cs-floating-card">
            <span>Access</span>
            <strong>Full</strong>
          </div>
          <div className="cs-floating-card">
            <span>Workspace</span>
            <strong>Live</strong>
          </div>
          <div className="cs-floating-card">
            <span>Auth</span>
            <strong>Connected</strong>
          </div>
        </div>
      </section>

      <section className="cs-dashboard-grid">
        <div className="cs-panel cs-panel-large">
          <div className="cs-panel-head">
            <h3>Admin Controls</h3>
          </div>

          <div className="cs-action-grid">
            <div className="cs-action-card">
              <strong>User roles</strong>
              <span>Control who is admin, team member, or client later.</span>
            </div>

            <div className="cs-action-card">
              <strong>Platform settings</strong>
              <span>Manage global business settings for the workspace.</span>
            </div>

            <div className="cs-action-card">
              <strong>Billing tools</strong>
              <span>Future place for plan rules, subscriptions, and upgrades.</span>
            </div>

            <div className="cs-action-card">
              <strong>Content operations</strong>
              <span>Review drafts, queued content, and published assets later.</span>
            </div>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-head">
            <h3>Status</h3>
          </div>

          <div className="cs-stat-stack">
            <div className="cs-stat-line">
              <span>Supabase Auth</span>
              <strong>Connected</strong>
            </div>
            <div className="cs-stat-line">
              <span>Dashboard UI</span>
              <strong>Working</strong>
            </div>
            <div className="cs-stat-line">
              <span>Editor Save</span>
              <strong>Working</strong>
            </div>
            <div className="cs-stat-line">
              <span>Real Image Generation</span>
              <strong>Next</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
