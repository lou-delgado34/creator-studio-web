import { useEffect, useMemo, useState } from "react";

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

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
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
      totalProjects: items.length,
      drafts,
      queued,
      generatedImages: queued,
      credits: "Unlimited",
      activePlan: "admin_unlimited",
    };
  }, [items]);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const quickIdeas = [
    "Turn one idea into 5 short-form posts",
    "Create a weekly content batch for Instagram",
    "Write hooks for a TikTok carousel post",
    "Build a product promo image set",
  ];

  return (
    <div className="cs-page">
      <section className="cs-hero">
        <div>
          <div className="cs-badge">Creator Business Hub</div>
          <h1 className="cs-hero-title">Build, organize, and grow your creator business</h1>
          <p className="cs-hero-text">
            This dashboard is your command center. Create content, save drafts,
            manage queue items, and keep your work moving.
          </p>

          <div className="cs-hero-actions">
            <a className="cs-btn cs-btn-primary" href="/editor?mode=create">
              Generate Image
            </a>
            <a className="cs-btn cs-btn-secondary" href="/editor?mode=draft">
              Save Draft
            </a>
            <a className="cs-btn cs-btn-secondary" href="/pricing">
              View Plans
            </a>
          </div>
        </div>

        <div className="cs-hero-panel">
          <div className="cs-panel-kicker">Today’s Focus</div>
          <h3>Stay consistent, not random</h3>
          <p>
            Your app should feel like a place where content actually gets created,
            saved, organized, and turned into business.
          </p>

          <div className="cs-mini-grid">
            <div className="cs-mini-card">
              <span>Drafts</span>
              <strong>{stats.drafts}</strong>
            </div>
            <div className="cs-mini-card">
              <span>Queued</span>
              <strong>{stats.queued}</strong>
            </div>
            <div className="cs-mini-card">
              <span>Credits</span>
              <strong>{stats.credits}</strong>
            </div>
            <div className="cs-mini-card">
              <span>Plan</span>
              <strong>{stats.activePlan}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-stats-grid">
        <div className="cs-stat-card">
          <span>Total Projects</span>
          <strong>{stats.totalProjects}</strong>
        </div>
        <div className="cs-stat-card">
          <span>Drafts</span>
          <strong>{stats.drafts}</strong>
        </div>
        <div className="cs-stat-card">
          <span>Queue</span>
          <strong>{stats.queued}</strong>
        </div>
        <div className="cs-stat-card">
          <span>Generated Images</span>
          <strong>{stats.generatedImages}</strong>
        </div>
        <div className="cs-stat-card">
          <span>Credits</span>
          <strong>{stats.credits}</strong>
        </div>
        <div className="cs-stat-card">
          <span>Active Plan</span>
          <strong>{stats.activePlan}</strong>
        </div>
      </section>

      <section className="cs-two-col">
        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Recent Projects</h2>
            <a href="/editor?mode=create">Open Editor</a>
          </div>

          {recentItems.length === 0 ? (
            <div className="cs-empty-state">
              Nothing here yet. Create your first draft or queue item in the editor.
            </div>
          ) : (
            <div className="cs-list">
              {recentItems.map((item) => (
                <div key={item.id} className="cs-list-row">
                  <div className="cs-list-thumb" />
                  <div className="cs-list-content">
                    <strong>{item.title}</strong>
                    <span>
                      {item.type} • {item.status} • {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className={`cs-pill ${item.status === "queued" ? "queued" : "draft"}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Ideas for Today</h2>
          </div>

          <div className="cs-idea-list">
            {quickIdeas.map((idea) => (
              <div key={idea} className="cs-idea-item">
                <div className="cs-dot" />
                <span>{idea}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-three-col">
        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Queue Snapshot</h2>
          </div>
          <div className="cs-card-big-number">{stats.queued}</div>
          <p className="cs-muted">
            Items waiting to be used, published, or turned into the next step.
          </p>
        </div>

        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Business Status</h2>
          </div>
          <div className="cs-status-stack">
            <div className="cs-status-line">
              <span>Workspace</span>
              <strong>Live</strong>
            </div>
            <div className="cs-status-line">
              <span>Supabase Auth</span>
              <strong>Connected</strong>
            </div>
            <div className="cs-status-line">
              <span>Draft Saving</span>
              <strong>Working</strong>
            </div>
          </div>
        </div>

        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Next Build Goals</h2>
          </div>
          <ul className="cs-goal-list">
            <li>Real image generation</li>
            <li>Content library filters</li>
            <li>Queue saved to database</li>
            <li>Analytics upgrade</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
