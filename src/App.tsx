import { useMemo, useState } from "react";

type Tab = "dashboard" | "create" | "plans" | "admin";
type ContentType = "Image" | "Video" | "Post";
type ItemStatus = "draft" | "queued";

type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  prompt: string;
  status: ItemStatus;
  createdAt: string;
};

export default function App() {
  const [isAuthed, setIsAuthed] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [email] = useState("lou.delgado.pfs@gmail.com");
  const [name] = useState("Luis Delgado");
  const [role] = useState("admin");
  const [plan] = useState("admin_unlimited");
  const credits = "Unlimited";

  const drafts = items.filter((item) => item.status === "draft");
  const queued = items.filter((item) => item.status === "queued");

  if (!isAuthed) {
    return (
      <div className="cs-auth-wrap">
        <div className="cs-auth-card">
          <h1>CreatorStudio</h1>
          <p>Test shell is working. Click below to enter the app.</p>
          <button className="cs-btn cs-btn-primary cs-btn-full" onClick={() => setIsAuthed(true)}>
            Enter App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-app">
      <aside className="cs-sidebar">
        <div className="cs-brand">
          <div className="cs-brand-badge">C</div>
          <div>
            <div className="cs-brand-title">CreatorStudio</div>
            <div className="cs-brand-subtitle">Business Creator Platform</div>
          </div>
        </div>

        <nav className="cs-nav">
          <SidebarButton label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
          <SidebarButton label="Create" active={tab === "create"} onClick={() => setTab("create")} />
          <SidebarButton label="Plans" active={tab === "plans"} onClick={() => setTab("plans")} />
          <SidebarButton label="Admin" active={tab === "admin"} onClick={() => setTab("admin")} />
        </nav>

        <div className="cs-side-card">
          <div className="cs-side-label">WORKSPACE</div>
          <div className="cs-side-row">
            <span>Role</span>
            <strong>{role}</strong>
          </div>
          <div className="cs-side-row">
            <span>Plan</span>
            <strong>{plan}</strong>
          </div>
          <div className="cs-side-row">
            <span>Credits</span>
            <strong>{credits}</strong>
          </div>
        </div>

        <div className="cs-user-card">
          <div className="cs-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="cs-user-email">{email}</div>
          <div className="cs-user-plan">{plan}</div>
          <button className="cs-btn cs-btn-dark cs-btn-full" onClick={() => setIsAuthed(false)}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="cs-main">
        <TopBar
          title={tabTitle(tab)}
          onOpenEditor={() => setTab("create")}
          onOpenPlans={() => setTab("plans")}
        />

        {tab === "dashboard" && (
          <DashboardPage
            draftsCount={drafts.length}
            queuedCount={queued.length}
            totalCount={items.length}
            credits={credits}
            plan={plan}
            onGoCreate={() => setTab("create")}
            onGoPlans={() => setTab("plans")}
          />
        )}

        {tab === "create" && <CreatePage items={items} setItems={setItems} />}

        {tab === "plans" && <PlansPage />}

        {tab === "admin" && (
          <AdminPage
            email={email}
            name={name}
            role={role}
            plan={plan}
            totalCount={items.length}
          />
        )}
      </main>
    </div>
  );
}

function SidebarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={active ? "cs-nav-link cs-nav-link-active" : "cs-nav-link"} onClick={onClick}>
      <span className="cs-nav-dot" />
      <span>{label}</span>
    </button>
  );
}

function TopBar({
  title,
  onOpenEditor,
  onOpenPlans,
}: {
  title: string;
  onOpenEditor: () => void;
  onOpenPlans: () => void;
}) {
  return (
    <div className="cs-topbar">
      <div>
        <div className="cs-topbar-label">CREATOR BUSINESS APP</div>
        <h1 className="cs-topbar-title">{title}</h1>
      </div>

      <div className="cs-topbar-actions">
        <button className="cs-btn cs-btn-dark" onClick={onOpenEditor}>
          Open Editor
        </button>
        <button className="cs-btn cs-btn-primary" onClick={onOpenPlans}>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}

function DashboardPage({
  draftsCount,
  queuedCount,
  totalCount,
  credits,
  plan,
  onGoCreate,
  onGoPlans,
}: {
  draftsCount: number;
  queuedCount: number;
  totalCount: number;
  credits: string;
  plan: string;
  onGoCreate: () => void;
  onGoPlans: () => void;
}) {
  return (
    <div className="cs-page">
      <section className="cs-hero">
        <div className="cs-hero-main">
          <div className="cs-chip">CREATOR BUSINESS APP</div>
          <h1>Build, organize, and grow your creator business</h1>
          <p>
            This dashboard is your command center. Create content, save drafts,
            manage queue items, and keep your work moving.
          </p>

          <div className="cs-button-row">
            <button className="cs-btn cs-btn-primary" onClick={onGoCreate}>
              Generate Image
            </button>
            <button className="cs-btn cs-btn-dark" onClick={onGoCreate}>
              Save Draft
            </button>
            <button className="cs-btn cs-btn-dark" onClick={onGoPlans}>
              View Plans
            </button>
          </div>
        </div>

        <div className="cs-hero-side">
          <div className="cs-hero-side-label">TOD
