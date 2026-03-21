import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SavedEditorItem = {
  id: string;
  title: string;
  type: string;
  caption: string;
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

function saveItems(items: SavedEditorItem[]) {
  localStorage.setItem("creatorstudio_items", JSON.stringify(items));
}

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<SavedEditorItem[]>([]);
  const [message, setMessage] = useState("");

  const editId = searchParams.get("edit");
  const mode = searchParams.get("mode");
  const view = searchParams.get("view");

  const [title, setTitle] = useState(mode === "project" ? "New Project" : "New Draft");
  const [type, setType] = useState("post");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);

    if (editId) {
      const found = loaded.find((item) => item.id === editId);
      if (found) {
        setTitle(found.title);
        setType(found.type);
        setCaption(found.caption);
      }
    }
  }, [editId]);

  const filteredItems = useMemo(() => {
    if (view === "drafts") {
      return items.filter((item) => item.status === "draft");
    }
    return items;
  }, [items, view]);

  function handleSave(status: "draft" | "queued") {
    const now = new Date().toISOString();

    if (!title.trim()) {
      setMessage("Please give this item a title first.");
      return;
    }

    const nextItems = [...items];

    if (editId) {
      const index = nextItems.findIndex((item) => item.id === editId);

      if (index >= 0) {
        nextItems[index] = {
          ...nextItems[index],
          title,
          type,
          caption,
          status,
          updatedAt: now,
        };
      }
    } else {
      nextItems.unshift({
        id: crypto.randomUUID(),
        title,
        type,
        caption,
        status,
        updatedAt: now,
      });
    }

    saveItems(nextItems);
    setItems(nextItems);
    setMessage(status === "draft" ? "Draft saved." : "Item added to queue.");
  }

  function handleLoad(item: SavedEditorItem) {
    setTitle(item.title);
    setType(item.type);
    setCaption(item.caption);
    setMessage(`Loaded: ${item.title}`);
  }

  function handleDelete(id: string) {
    const nextItems = items.filter((item) => item.id !== id);
    saveItems(nextItems);
    setItems(nextItems);
    setMessage("Item deleted.");
  }

  return (
    <div style={pageStyle}>
      <div style={topWrap}>
        <div style={mainCard}>
          <div style={badgeStyle}>Working Editor</div>
          <h1 style={titleStyle}>Create content for your business</h1>
          <p style={subtitleStyle}>
            This editor now lets you create drafts and queue content items. The next step after
            this will be saving everything into Supabase.
          </p>

          <div style={fieldWrap}>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Content Type</label>
            <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="post">Post</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="email">Email</option>
              <option value="script">Script</option>
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Caption / Notes</label>
            <textarea
              style={textAreaStyle}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption, content idea, or notes here..."
            />
          </div>

          <div style={buttonRow}>
            <button style={secondaryButton} onClick={() => handleSave("draft")}>
              Save Draft
            </button>
            <button style={primaryButton} onClick={() => handleSave("queued")}>
              Add To Queue
            </button>
          </div>

          {message ? <div style={messageStyle}>{message}</div> : null}
        </div>

        <div style={sideCard}>
          <div style={sectionTitle}>Editor Tips</div>
          <ul style={tipList}>
            <li>Use short clear titles</li>
            <li>Save rough ideas as drafts</li>
            <li>Move finished work to queue</li>
            <li>Later we will connect uploads and database saving</li>
          </ul>
        </div>
      </div>

      <div style={listCard}>
        <div style={sectionTitle}>
          {view === "drafts" ? "Saved Drafts" : "Saved Items"}
        </div>

        {filteredItems.length === 0 ? (
          <div style={emptyStyle}>
            Nothing saved yet. Create your first draft or queue item above.
          </div>
        ) : (
          <div style={listWrap}>
            {filteredItems.map((item) => (
              <div key={item.id} style={listRow}>
                <div>
                  <div style={itemTitle}>{item.title}</div>
                  <div style={itemMeta}>
                    {item.type} • {item.status} • {new Date(item.updatedAt).toLocaleString()}
                  </div>
                </div>

                <div style={rowButtons}>
                  <button style={miniButton} onClick={() => handleLoad(item)}>
                    Load
                  </button>
                  <button style={dangerButton} onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
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

const topWrap: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.4fr 0.8fr",
  gap: 20,
};

const mainCard: React.CSSProperties = {
  background: "rgba(15,23,42,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 24,
  color: "white",
};

const sideCard: React.CSSProperties = {
  background: "rgba(15,23,42,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 24,
  color: "white",
};

const listCard: React.CSSProperties = {
  background: "rgba(15,23,42,0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 24,
  color: "white",
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
  fontSize: 42,
  lineHeight: 1,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: "14px 0 24px 0",
  fontSize: 18,
  lineHeight: 1.5,
  color: "#cbd5e1",
};

const fieldWrap: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 15,
  fontWeight: 700,
  color: "#e2e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "white",
  fontSize: 16,
  boxSizing: "border-box",
};

const textAreaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 180,
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "white",
  fontSize: 16,
  boxSizing: "border-box",
  resize: "vertical",
};

const buttonRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 8,
  flexWrap: "wrap",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 16,
  padding: "14px 20px",
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "14px 20px",
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "#1e293b",
};

const messageStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 14,
  background: "#0f172a",
  color: "#4ade80",
  fontWeight: 700,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 16,
};

const tipList: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  color: "#cbd5e1",
  lineHeight: 1.8,
  fontSize: 17,
};

const emptyStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#0f172a",
  color: "#cbd5e1",
  fontSize: 17,
};

const listWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const listRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: 16,
  borderRadius: 18,
  background: "#0f172a",
};

const itemTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 6,
};

const itemMeta: React.CSSProperties = {
  fontSize: 14,
  color: "#94a3b8",
};

const rowButtons: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const miniButton: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#1e293b",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButton: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#7f1d1d",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
