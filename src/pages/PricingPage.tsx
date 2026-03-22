export default function PricingPage() {
  return (
    <div className="cs-screen">
      <section className="cs-hero-strip">
        <div className="cs-hero-left">
          <div className="cs-chip">Plans</div>
          <h1>Choose the plan that fits your creator business</h1>
          <p>
            Start simple, then upgrade when you want more credits, faster creation,
            and stronger business tools.
          </p>
        </div>

        <div className="cs-hero-right">
          <div className="cs-floating-card">
            <span>Current Plan</span>
            <strong>admin_unlimited</strong>
          </div>
          <div className="cs-floating-card">
            <span>Credits</span>
            <strong>Unlimited</strong>
          </div>
          <div className="cs-floating-card">
            <span>Status</span>
            <strong>Active</strong>
          </div>
          <div className="cs-floating-card">
            <span>Billing</span>
            <strong>Internal</strong>
          </div>
        </div>
      </section>

      <section className="cs-library-grid">
        <div className="cs-panel">
          <div className="cs-panel-head">
            <h3>Starter</h3>
          </div>
          <div className="cs-note-card">
            <strong>$0</strong>
            <p>
              Good for learning, testing, and building your first workflow.
            </p>
          </div>
          <div className="cs-stat-stack">
            <div className="cs-stat-line">
              <span>Credits</span>
              <strong>25</strong>
            </div>
            <div className="cs-stat-line">
              <span>Drafts</span>
              <strong>Yes</strong>
            </div>
            <div className="cs-stat-line">
              <span>Queue</span>
              <strong>Yes</strong>
            </div>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-head">
            <h3>Pro</h3>
          </div>
          <div className="cs-note-card">
            <strong>$29</strong>
            <p>
              Better for creators who want more generation, more saved work, and
              a stronger content system.
            </p>
          </div>
          <div className="cs-stat-stack">
            <div className="cs-stat-line">
              <span>Credits</span>
              <strong>500</strong>
            </div>
            <div className="cs-stat-line">
              <span>Drafts</span>
              <strong>Unlimited</strong>
            </div>
            <div className="cs-stat-line">
              <span>Queue</span>
              <strong>Priority</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
