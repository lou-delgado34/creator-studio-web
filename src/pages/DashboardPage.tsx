import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SavedEditorItem = {
  id: string;
  title: string;
  type: string;
  status: "draft" | "queued";
  updatedAt: string;
};

function loadItems(): SavedEditorItem[] {
  try {
    const raw = localStorage.getItem("creatorstudio_items");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [items, setItems] = useState<SavedEditorItem[]>([]);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const stats = useMemo(() => {
    const drafts = items.filter((item) => item.status === "draft").length;
    const queued = items.filter((item) => item.status === "queued").length;
    const total = items.length;
    return { drafts, queued, total };
  }, [items]);

  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4);

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div>
          <div style={badgeStyle}>Business Dashboard</div>
          <h1 style={titleStyle}>Welcome back{profile?.name ? `, ${profile.name}` : ""}</h1>
          <p style={subtitleStyle}>
            This is now your real working hub. From here you can create drafts,
            start projects, and move into the editor fast.
          </p>
        </div>

        <div style={heroButtonsWrap}>
          <button style={secondaryButton} onClick={() => navigate("/editor?mode=project")}>
            New Project
          </button>
          <button style={primaryButton} onClick={() => navigate("/editor?mode=draft")}>
            New Draft
          </button>
        </div>
      </div>

      <div style={grid3}>
        <div style={cardStyle}>
          <div style={smallLabel}>Plan</div>
          <div style={bigValue}>{profile?.plan ?? "free"}</div>
        </div>

        <div style={cardStyle}>
          <div style={smallLabel}>Role</div>
          <div style={bigValue}>{profile?.role ?? "user"}</div>
        </div>

        <div style={cardStyle}>
          <div style={smallLabel}>Saved Items</div>
          <div style={bigValue}>{stats.total}</div>
        </div>
      </div>

      <div style={grid2}>
        <div style={cardStyle}>
          <div style={sectionTitle}>Quick Actions</div>

          <div style={actionGrid}>
            <button style={actionButton} onClick={() => navigate("/editor?mode=project")}>
              Start New Project
            </button>

            <button style={actionButton} onClick={() => navigate("/editor?mode=draft")}>
              Create Draft
            </button>

            <button style={actionButton} onClick={() => navigate("/editor?view=drafts")}>
              View Drafts
            </button>

            <button style={actionButton} onClick={() => navigate("/editor?view=all")}>
              Open Full Editor
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitle}>Business Snapshot</div>
          <div style={miniStatRow}>
            <span>Drafts</span>
            <strong>{stats.drafts}</strong>
          </div>
          <div style={miniStatRow}>
            <span>Queued</span>
            <strong>{stats.queued}</strong>
          </div>
          <div style={miniStatRow}>
            <span>Total items</span>
            <strong>{stats.total}</strong>
          </div>
          <div style={miniStatRow}>
            <span>Admin access</span>
            <strong>{profile?.role === "admin" ? "Enabled" : "Not enabled"}</strong>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>Recent Work</div>

        {recentItems.length === 0 ? (
          <div style={emptyState}>
            You do not have any saved work yet. Click <strong>New Project</strong> or{" "}
            <strong>New Draft</strong> to start creating.
          </div>
        ) : (
          <div style={recentList}>
            {recentItems.map((item) => (
              <div key={item.id} style={recentRow}>
                <div>
                  <div style={recentTitle}>{item.title}</div>
                  <div style={recentMeta}>
                    {item.type} • {item.status} • {new Date(item.updatedAt).toLocaleString()}
                  </div>
                </div>

                <button
                  style={smallActionButton}
                  onClick={() => navigate(`/editor?edit=${item.id}`)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(3,7,18,0.96))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 28,
  padding: 28,
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  alignItems: "center",
  flexWrap: "wrap",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(192,132,252,0.4)",
  color: "#e9d5ff",
  fontWeight: 700,
  fontSize: 14,
  marginBottom: 14,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 52,
  lineHeight: 1,
  fontWeight: 800,
  color: "white",
};

const subtitleStyle: React.CSSProperties = {
  margin: "16px 0 0 0",
  fontSize: 20,
  lineHeight: 1.5,
  color: "#cbd5e1",
  maxWidth: 820,
};

const heroButtonsWrap: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 18,
  padding: "16px 24px",
  fontSize: 18,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
  minWidth: 180,
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: "16px 24px",
  fontSize: 18,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "#1e293b",
  minWidth: 180,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 20,
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: 20,
};

const cardStyle: React.CSSProperties = {
  background: "rgba(15,23,42,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 24,
  color: "white",
};

const smallLabel: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 16,
  marginBottom: 14,
};

const bigValue: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 18,
};

const actionGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const actionButton: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: "18px 16px",
  background: "#111827",
  color: "white",
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
};

const miniStatRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontSize: 18,
  color: "#e2e8f0",
};

const emptyState: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: "#0f172a",
  color: "#cbd5e1",
  fontSize: 17,
};

const recentList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const recentRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: 18,
  borderRadius: 18,
  background: "#0f172a",
};

const recentTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 6,
};

const recentMeta: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 15,
};

const smallActionButton: React.CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "12px 16px",
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
  color: "white",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
};
