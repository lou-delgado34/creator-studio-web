import { useMemo, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <CreatorStudioApp />
    </BrowserRouter>
  );
}

function CreatorStudioApp() {
  const [items, setItems] = useState<ContentItem[]>([]);

  const savedAuth = localStorage.getItem("creatorstudio-auth") === "true";
  const savedEmail =
    localStorage.getItem("creatorstudio-email") || "you@example.com";
  const savedName = localStorage.getItem("creatorstudio-name") || "Creator";
  const savedRole = localStorage.getItem("creatorstudio-role") || "admin";
  const savedPlan =
    localStorage.getItem("creatorstudio-plan") || "admin_unlimited";

  const [isAuthed, setIsAuthed] = useState(savedAuth);
  const [email, setEmail] = useState(savedEmail);
  const [name, setName] = useState(savedName);
  const [role] = useState(savedRole);
  const [plan] = useState(savedPlan);

  const credits = plan === "admin_unlimited" ? "Unlimited" : "0";

  const handleAuthSuccess = (nextName: string, nextEmail: string) => {
    localStorage.setItem("creatorstudio-auth", "true");
    localStorage.setItem("creatorstudio-name", nextName);
    localStorage.setItem("creatorstudio-email", nextEmail);
    localStorage.setItem("creatorstudio-role", "admin");
    localStorage.setItem("creatorstudio-plan", "admin_unlimited");

    setName(nextName);
    setEmail(nextEmail);
    setIsAuthed(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("creatorstudio-auth");
    setIsAuthed(false);
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isAuthed ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )
        }
      />

      <Route
        path="*"
        element={
          isAuthed ? (
            <StudioShell
              name={name}
              email={email}
              role={role}
              plan={plan}
              credits={credits}
              items={items}
              setItems={setItems}
              onSignOut={handleSignOut}
            />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
}

function StudioShell({
  name,
  email,
  role,
  plan,
  credits,
  items,
  setItems,
  onSignOut,
}: {
  name: string;
  email: string;
  role: string;
  plan: string;
  credits: string;
  items: ContentItem[];
  setItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  onSignOut: () => void;
}) {
  const drafts = items.filter((item) => item.status === "draft");
  const queued = items.filter((item) => item.status === "queued");

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
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/create" label="Create" />
          <NavItem to="/plans" label="Plans" />
          <NavItem to="/admin" label="Admin" />
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
          <button className="cs-btn cs-btn-dark cs-btn-full" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="cs-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                draftsCount={drafts.length}
                queuedCount={queued.length}
                totalCount={items.length}
                credits={credits}
                plan={plan}
              />
            }
          />
          <Route
            path="/create"
            element={<CreatePage items={items} setItems={setItems} />}
          />
          <Route path="/plans" element={<PlansPage />} />
          <Route
            path="/admin"
            element={
              <AdminPage
                email={email}
                name={name}
                role={role}
                plan={plan}
                totalCount={items.length}
              />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "cs-nav-link cs-nav-link-active" : "cs-nav-link"
      }
    >
      <span className="cs-nav-dot" />
      <span>{label}</span>
    </NavLink>
  );
}

function AuthPage({
  onAuthSuccess,
}: {
  onAuthSuccess: (name: string, email: string) => void;
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [fullName, setFullName] = useState("Luis Delgado");
  const [email, setEmail] = useState("lou.delgado.pfs@gmail.com");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!email.trim() || !password.trim()) {
      setMessage("Please fill in email and password.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    const finalName = mode === "signup" ? fullName.trim() : "Luis Delgado";
    setMessage(mode === "signup" ? "Account created. Entering app..." : "Logging in...");

    setTimeout(() => {
      onAuthSuccess(finalName, email.trim());
      navigate("/dashboard", { replace: true });
    }, 500);
  };

  return (
    <div className="cs-auth-wrap">
      <div className="cs-auth-card">
        <h1>CreatorStudio</h1>
        <p>Build content, manage plans, and grow your creator business.</p>

        <div className="cs-auth-tabs">
          <button
            className={mode === "login" ? "cs-tab active" : "cs-tab"}
            onClick={() => setMode("login")}
          >
            Log In
          </button>
          <button
            className={mode === "signup" ? "cs-tab active" : "cs-tab"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {mode === "signup" && (
          <>
            <label className="cs-label">Full Name</label>
            <input
              className="cs-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </>
        )}

        <label className="cs-label">Email</label>
        <input
          className="cs-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="cs-label">Password</label>
        <input
          className="cs-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="cs-btn cs-btn-primary cs-btn-full" onClick={submit}>
          {mode === "signup" ? "Create Account" : "Log In"}
        </button>

        {message ? <div className="cs-success">{message}</div> : null}
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
}: {
  draftsCount: number;
  queuedCount: number;
  totalCount: number;
  credits: string;
  plan: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="cs-page">
      <TopBar />

      <section className="cs-hero">
        <div className="cs-hero-main">
          <div className="cs-chip">CREATOR BUSINESS APP</div>
          <h1>Build, organize, and grow your creator business</h1>
          <p>
            This dashboard is your command center. Create content, save drafts,
            manage queue items, and keep your work moving.
          </p>

          <div className="cs-button-row">
            <button
              className="cs-btn cs-btn-primary"
              onClick={() => navigate("/create")}
            >
              Generate Image
            </button>
            <button
              className="cs-btn cs-btn-dark"
              onClick={() => navigate("/create")}
            >
              Save Draft
            </button>
            <button
              className="cs-btn cs-btn-dark"
              onClick={() => navigate("/plans")}
            >
              View Plans
            </button>
          </div>
        </div>

        <div className="cs-hero-side">
          <div className="cs-hero-side-label">TODAY’S FOCUS</div>
          <h3>Stay consistent, not random</h3>
          <p>
            Your app should feel like a place where content actually gets created,
            saved, organized, and turned into business.
          </p>

          <div className="cs-mini-grid">
            <StatMini label="Drafts" value={String(draftsCount)} />
            <StatMini label="Queued" value={String(queuedCount)} />
            <StatMini label="Credits" value={credits} />
            <StatMini label="Plan" value={plan} />
          </div>
        </div>
      </section>

      <section className="cs-stat-grid">
        <StatCard label="Total Projects" value={String(totalCount)} />
        <StatCard label="Drafts" value={String(draftsCount)} />
        <StatCard label="Queue" value={String(queuedCount)} />
        <StatCard label="Generated Images" value="0" />
        <StatCard label="Credits" value={credits} />
        <StatCard label="Active Plan" value={plan} />
      </section>

      <section className="cs-content-grid">
        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Recent Projects</h2>
            <button
              className="cs-link-btn"
              onClick={() => navigate("/create")}
            >
              Open Editor
            </button>
          </div>
          <p className="cs-panel-text">
            Nothing here yet. Create your first draft or queue item in the editor.
          </p>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Ideas for Today</h2>
          </div>
          <ul className="cs-bullet-list">
            <li>Turn one idea into 5 short-form posts</li>
            <li>Create a weekly content batch for Instagram</li>
            <li>Write hooks for a TikTok carousel post</li>
            <li>Build a product promo image set</li>
          </ul>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Queue Snapshot</h2>
          </div>
          <div className="cs-big-number">{queuedCount}</div>
          <p className="cs-panel-text">
            Items waiting to be used, published, or turned into the next step.
          </p>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Business Status</h2>
          </div>
          <div className="cs-detail-list">
            <div><span>Workspace</span><strong>Live</strong></div>
            <div><span>Supabase Auth</span><strong>Connected</strong></div>
            <div><span>Draft Saving</span><strong>Working</strong></div>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Next Build Goals</h2>
          </div>
          <ul className="cs-bullet-list">
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

function CreatePage({
  items,
  setItems,
}: {
  items: ContentItem[];
  setItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}) {
  const [title, setTitle] = useState("New Draft");
  const [type, setType] = useState<ContentType>("Image");
  const [prompt, setPrompt] = useState("goku on nimbus cloud with chichi");
  const [message, setMessage] = useState("");

  const previewTitle = title.trim() || "Untitled";
  const previewPrompt = prompt.trim() || "Add your prompt here";

  const saveItem = (status: ItemStatus) => {
    const item: ContentItem = {
      id: crypto.randomUUID(),
      title: previewTitle,
      type,
      prompt: previewPrompt,
      status,
      createdAt: new Date().toLocaleString(),
    };

    setItems((prev) => [item, ...prev]);
    setMessage(
      status === "draft"
        ? "Draft saved."
        : "Added to queue."
    );
  };

  const generatePreview = () => {
    setMessage("Mock image preview created. This is not real AI yet.");
  };

  const visibleItems = useMemo(() => items.slice(0, 5), [items]);

  return (
    <div className="cs-page">
      <TopBar />

      <section className="cs-editor-layout">
        <div className="cs-editor-left">
          <div className="cs-chip">WORKING EDITOR</div>
          <h1>Your working studio</h1>
          <p>
            Create content, save it, queue it, and preview it in a cleaner creator
            dashboard layout.
          </p>

          <label className="cs-label">Title</label>
          <input
            className="cs-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="cs-label">Content Type</label>
          <select
            className="cs-input"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
          >
            <option>Image</option>
            <option>Video</option>
            <option>Post</option>
          </select>

          <label className="cs-label">Caption / Prompt / Notes</label>
          <textarea
            className="cs-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="cs-button-row cs-button-row-wrap">
            <button
              className="cs-btn cs-btn-dark"
              onClick={() => saveItem("draft")}
            >
              Save Draft
            </button>
            <button
              className="cs-btn cs-btn-primary"
              onClick={() => saveItem("queued")}
            >
              Add To Queue
            </button>
            <button
              className="cs-btn cs-btn-outline"
              onClick={generatePreview}
            >
              Generate Preview
            </button>
          </div>

          {message ? <div className="cs-success">{message}</div> : null}

          <div className="cs-panel cs-saved-panel">
            <div className="cs-panel-header">
              <h2>Saved Items</h2>
            </div>

            {visibleItems.length === 0 ? (
              <p className="cs-panel-text">
                Nothing saved yet. Create your first draft or queue item above.
              </p>
            ) : (
              <div className="cs-saved-list">
                {visibleItems.map((item) => (
                  <div key={item.id} className="cs-saved-item">
                    <div className="cs-saved-top">
                      <strong>{item.title}</strong>
                      <span className="cs-status">{item.status}</span>
                    </div>
                    <div className="cs-saved-meta">
                      {item.type} • {item.createdAt}
                    </div>
                    <div className="cs-saved-prompt">{item.prompt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cs-editor-right">
          <div className="cs-panel">
            <div className="cs-panel-header">
              <h2>Preview</h2>
            </div>

            <div className="cs-preview-card">
              <div className="cs-preview-badge">Mock Image</div>
              <div className="cs-preview-title">{previewTitle}</div>
              <div className="cs-preview-line" />
              <div className="cs-preview-label">PROMPT</div>
              <div className="cs-preview-text">{previewPrompt}</div>
              <div className="cs-preview-footer">
                Preview only • not real AI yet
              </div>
              <div className="cs-preview-orb orb-one" />
              <div className="cs-preview-orb orb-two" />
            </div>

            <div className="cs-preview-note">
              This preview is a visual mockup only. The app is not generating a
              real AI image yet.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlansPage() {
  return (
    <div className="cs-page">
      <TopBar />

      <section className="cs-top-section">
        <div>
          <div className="cs-chip">PLANS</div>
          <h1>Choose a business plan that fits how you create</h1>
          <p className="cs-section-copy">
            Keep the layout premium, simple, and useful. Start free, then scale up.
          </p>
        </div>
      </section>

      <section className="cs-plan-grid">
        <PlanCard
          title="Starter"
          price="$0"
          features={[
            "Good for testing",
            "Basic drafts",
            "Light queue usage",
            "Starter workflow",
          ]}
        />
        <PlanCard
          title="Pro"
          price="$29"
          features={[
            "More credits",
            "Better queue flow",
            "Priority creation",
            "Stronger business tools",
          ]}
          featured
        />
        <PlanCard
          title="Admin Unlimited"
          price="Custom"
          features={[
            "Unlimited credits",
            "Admin tools",
            "Advanced workflow",
            "Full creator business setup",
          ]}
        />
      </section>
    </div>
  );
}

function AdminPage({
  email,
  name,
  role,
  plan,
  totalCount,
}: {
  email: string;
  name: string;
  role: string;
  plan: string;
  totalCount: number;
}) {
  return (
    <div className="cs-page">
      <TopBar />

      <section className="cs-top-section">
        <div>
          <div className="cs-chip">ADMIN</div>
          <h1>Control your business workspace</h1>
          <p className="cs-section-copy">
            Use this area for role checks, business setup, and future backend tools.
          </p>
        </div>
      </section>

      <section className="cs-content-grid">
        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Workspace Owner</h2>
          </div>
          <div className="cs-detail-list">
            <div><span>Name</span><strong>{name}</strong></div>
            <div><span>Email</span><strong>{email}</strong></div>
            <div><span>Role</span><strong>{role}</strong></div>
            <div><span>Plan</span><strong>{plan}</strong></div>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>System Status</h2>
          </div>
          <div className="cs-detail-list">
            <div><span>Auth</span><strong>Connected</strong></div>
            <div><span>Routes</span><strong>Working</strong></div>
            <div><span>Content Saved</span><strong>{totalCount}</strong></div>
            <div><span>Environment</span><strong>Live</strong></div>
          </div>
        </div>

        <div className="cs-panel">
          <div className="cs-panel-header">
            <h2>Next Admin Upgrades</h2>
          </div>
          <ul className="cs-bullet-list">
            <li>Manage user roles from dashboard</li>
            <li>See content history</li>
            <li>Track credit usage</li>
            <li>Review published assets</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname.includes("/create")) return "Create";
    if (location.pathname.includes("/plans")) return "Plans";
    if (location.pathname.includes("/admin")) return "Admin";
    return "Dashboard";
  }, [location.pathname]);

  return (
    <div className="cs-topbar">
      <div>
        <div className="cs-topbar-label">CREATOR BUSINESS APP</div>
        <h1 className="cs-topbar-title">{title}</h1>
      </div>

      <div className="cs-topbar-actions">
        <button className="cs-btn cs-btn-dark" onClick={() => navigate("/create")}>
          Open Editor
        </button>
        <button className="cs-btn cs-btn-primary" onClick={() => navigate("/plans")}>
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="cs-stat-card">
      <div className="cs-stat-label">{label}</div>
      <div className="cs-stat-value">{value}</div>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="cs-mini-stat">
      <div className="cs-mini-label">{label}</div>
      <div className="cs-mini-value">{value}</div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div className={featured ? "cs-plan-card cs-plan-card-featured" : "cs-plan-card"}>
      <div className="cs-plan-title">{title}</div>
      <div className="cs-plan-price">{price}</div>
      <ul className="cs-bullet-list">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <button className={featured ? "cs-btn cs-btn-primary" : "cs-btn cs-btn-dark"}>
        Select Plan
      </button>
    </div>
  );
}

export default App;
