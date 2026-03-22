import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ItemRecord = {
  id: string;
  title: string;
  type: string;
  prompt: string;
  status: "draft" | "queued";
  createdAt: string;
};

function readItems(): ItemRecord[] {
  try {
    const raw = localStorage.getItem("creatorstudio-items");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [items, setItems] = useState<ItemRecord[]>([]);

  useEffect(() => {
    const load = () => setItems(readItems());
    load();

    window.addEventListener("storage", load);
    window.addEventListener("creatorstudio-items-updated", load as EventListener);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("creatorstudio-items-updated", load as EventListener);
    };
  }, []);

  const stats = useMemo(() => {
    const drafts = items.filter((item) => item.status === "draft").length;
    const queued = items.filter((item) => item.status === "queued").length;

    return {
      total: items.length,
      drafts,
      queued,
      credits: "Unlimited",
      plan: "admin_unlimited",
    };
  }, [items]);

  const recent = [...items].slice(0, 5);

  return (
    <div className="cs-screen">
      <section className="cs-hero-strip">
        <div className="cs-hero-left">
          <div className="cs-chip">Business Dashboard</div>
          <h1>Run your content business from one place</h1>
          <p>
            Organize ideas, create content, manage your queue, and move faster with
            a cleaner studio-style workspace.
          </p>

          <div className="cs-hero-buttons">
            <Link to="/editor?mode=create" className="cs-btn cs-btn-primary">
              Create Content
            </Link>
            <Link to="/editor?mode=draft" className="cs-btn cs-btn-secondary">
              Open Drafts
            </Link>
          </div>
        </div>

        <div className="cs-hero-right">
          <div className="cs-floating-card">
            <span>Projects</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="cs-floating-card">
            <span>Drafts</span>
            <strong>{stats.drafts}</strong>
          </div>
          <div className="cs-floating-card">
            <span>Queue</span>
            <strong>{stats.queued}</strong>
          </div>
          <div className="cs-floating-card">
            <span>Plan</span>
            <strong>{stats.plan}</strong>
          </div>
        </div>
      </section>

      <section className="cs-dashboard-grid">
        <div className="cs-panel cs-panel-large">
          <div className="cs-panel-head">
            <h3>Quick Actions</h3>
          </div>

          <div className="cs-action-grid">
            <Link to="/editor?mode=create" className="cs-action-card">
              <strong>Create image idea</strong>
              <span>Start a new content project fast</span>
            </Link>

            <Link to="/editor?mode=draft" className="cs-action-card">
              <strong>Save a draft</strong>
              <span>Keep rough ideas without losing them</span>
            </Link>

            <Link to="/pricing" className="cs-action-card">
              <strong>View plans</strong>
              <span>Compare upgrades and usage tools</span>
            </Link>

            <Link to="/admin" className="cs-action-card">
              <strong>Admin tools</strong>
              <span>Manage higher-level account controls</span>
            </Link>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-head">
            <h3>Overview</h3>
          </div>

          <div className="cs-stat-stack">
            <div className="cs-stat-line">
              <span>Total Projects</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="cs-stat-line">
              <span>Drafts</span>
              <strong>{stats.drafts}</strong>
            </div>
            <div className="cs-stat-line">
              <span>Queue</span>
              <strong>{stats.queued}</strong>
            </div>
            <div className="cs-stat-line">
              <span>Credits</span>
              <strong>{stats.credits}</strong>
            </div>
          </div>
        </div>

        <div className="cs-panel cs-panel-large">
          <div className="cs-panel-head">
            <h3>Recent Projects</h3>
            <Link to="/editor?mode=create">Go to editor</Link>
          </div>

          {recent.length === 0 ? (
            <div className="cs-empty">
              Nothing created yet. Start in the Create page.
            </div>
          ) : (
            <div className="cs-project-list">
              {recent.map((item) => (
                <div className="cs-project-row" key={item.id}>
                  <div className="cs-project-art" />
                  <div className="cs-project-copy">
                    <strong>{item.title}</strong>
                    <span>
                      {item.type} • {item.status}
                    </span>
                  </div>
                  <div className={`cs-status-pill ${item.status}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cs-panel">
          <div className="cs-panel-head">
            <h3>Today</h3>
          </div>

          <div className="cs-note-card">
            <strong>Stay consistent</strong>
            <p>
              Build drafts, turn them into queue items, then move into real
              generation and delivery.
            </p>
          </div>

          <div className="cs-note-card">
            <strong>Next step</strong>
            <p>
              We are about to connect your editor to real image creation and make
              this feel like a real creator workspace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
