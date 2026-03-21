import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SavedEditorItem = {
  id: string;
  title: string;
  type: string;
  caption: string;
  status: "draft" | "queued";
  updatedAt: string;
  mockReady?: boolean;
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
  const [type, setType] = useState("image");
  const [caption, setCaption] = useState("");
  const [mockReady, setMockReady] = useState(false);

  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);

    if (editId) {
      const found = loaded.find((item) => item.id === editId);
      if (found) {
        setTitle(found.title);
        setType(found.type);
        setCaption(found.caption);
        setMockReady(Boolean(found.mockReady));
      }
    }
  }, [editId]);

  const filteredItems = useMemo(() => {
    if (view === "drafts") {
      return items.filter((item) => item.status === "draft");
    }
    return items;
  }, [items, view]);

  function handleGenerateMockPreview() {
    if (type !== "image") {
      setMessage("Mock preview works only when Content Type is Image.");
      return;
    }

    setMockReady(true);
    setMessage("Mock image preview created. This is not real AI yet.");
  }

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
          mockReady,
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
        mockReady,
        updatedAt: now,
      });
    }

    saveItems(nextItems);
    setItems(nextItems);
    setMessage(
      status === "draft"
        ? "Draft saved."
        : type === "image"
        ? "Item added to queue. Real AI image generation is not connected yet."
        : "Item added to queue."
    );
  }

  function handleLoad(item: SavedEditorItem) {
    setTitle(item.title);
    setType(item.type);
    setCaption(item.caption);
    setMockReady(Boolean(item.mockReady));
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
            This editor lets you save drafts, queue work, and create a visible mock preview.
            Real AI image generation is the next upgrade.
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
              <option value="image">Image</option>
              <option value="post">Post</option>
              <option value="video">Video</option>
              <option value="email">Email</option>
              <option value="script">Script</option>
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Caption / Prompt / Notes</label>
            <textarea
              style={textAreaStyle}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your image prompt or content idea here..."
            />
          </div>

          <div style={buttonGrid}>
            <button style={secondaryButton} onClick={() => handleSave("draft")}>
              Save Draft
            </button>

            <button style={primaryButton} onClick={() => handleSave("queued")}>
              Add To Queue
            </button>

            <button style={outlineButton} onClick={handleGenerateMockPreview}>
              Generate Preview
            </button>
          </div>

          {message ? <div style={messageStyle}>{message}</div> : null}
        </div>

        <div style={sideCard}>
          <div style={sectionTitle}>Preview</div>

          {type === "image" && mockReady ? (
            <div style={mockCard}>
              <div style={mockGlowOne} />
              <div style={mockGlowTwo} />

              <div style={mockInner}>
                <div style={mockBadge}>Mock Image</div>
                <div style={mockTitle}>{title || "Untitled Image"}</div>
                <div style={mockLine} />
                <div style={mockPromptLabel}>Prompt</div>
                <div style={mockPromptText}>
                  {caption || "No prompt yet"}
                </div>
                <div style={mockFooter}>Preview only • not real AI yet</div>
              </div>
            </div>
          ) : (
            <div style={emptyPreview}>
              No preview yet. Choose <strong>Image</strong>, then click{" "}
              <strong>Generate Preview</strong>.
            </div>
          )}

          <div style={tipBox}>
            This preview is a visual mockup only. The app is not generating a real AI image yet.
          </div>
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
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={itemTitle}>{item.title}</div>
                  <div style={itemMeta}>
                    {item.type} • {item.status} • {new Date(item.updatedAt).toLocaleString()}
                  </div>
                  {item.caption ? <div style={itemCaption}>{item.caption}</div> : null}
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
  lineHeight: 1.1,
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

const buttonGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
  marginTop: 8,
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 16,
  padding: "14px 12px",
  minHeight: 56,
  width: "100%",
  fontSize: 15,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: 1.2,
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "14px 12px",
  minHeight: 56,
  width: "100%",
  fontSize: 15,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "#1e293b",
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: 1.2,
};

const outlineButton: React.CSSProperties = {
  border: "1px solid rgba(192,132,252,0.4)",
  borderRadius: 16,
  padding: "14px 12px",
  minHeight: 56,
  width: "100%",
  fontSize: 15,
  fontWeight: 800,
  color: "#f5d0fe",
  cursor: "pointer",
  background: "transparent",
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: 1.2,
};

const messageStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 14,
  background: "#0f172a",
  color: "#4ade80",
  fontWeight: 700,
  lineHeight: 1.5,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 16,
};

const mockCard: React.CSSProperties = {
  position: "relative",
  minHeight: 420,
  borderRadius: 24,
  overflow: "hidden",
  background: "linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #581c87 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const mockGlowOne: React.CSSProperties = {
  position: "absolute",
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "rgba(236,72,153,0.18)",
  top: 20,
  right: 20,
};

const mockGlowTwo: React.CSSProperties = {
  position: "absolute",
  width: 220,
  height: 220,
  borderRadius: "50%",
  background: "rgba(168,85,247,0.14)",
  bottom: 10,
  left: 10,
};

const mockInner: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 28,
  padding: 24,
  borderRadius: 24,
  minHeight: 320,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
};

const mockBadge: React.CSSProperties = {
  display: "inline-block",
  alignSelf: "flex-start",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  color: "#f5d0fe",
  fontWeight: 700,
  fontSize: 13,
  marginBottom: 18,
};

const mockTitle: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: 12,
  wordBreak: "break-word",
};

const mockLine: React.CSSProperties = {
  width: 120,
  height: 6,
  borderRadius: 999,
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
  marginBottom: 20,
};

const mockPromptLabel: React.CSSProperties = {
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: 1,
  color: "#cbd5e1",
  marginBottom: 8,
};

const mockPromptText: React.CSSProperties = {
  fontSize: 20,
  lineHeight: 1.5,
  color: "white",
  wordBreak: "break-word",
};

const mockFooter: React.CSSProperties = {
  marginTop: "auto",
  paddingTop: 20,
  fontSize: 14,
  color: "#e9d5ff",
  fontWeight: 700,
};

const emptyPreview: React.CSSProperties = {
  padding: 18,
  borderRadius: 16,
  background: "#0f172a",
  color: "#cbd5e1",
  fontSize: 16,
  lineHeight: 1.6,
};

const tipBox: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  borderRadius: 16,
  background: "rgba(236,72,153,0.08)",
  color: "#fbcfe8",
  fontSize: 15,
  lineHeight: 1.5,
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
  flexWrap: "wrap",
};

const itemTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 6,
  wordBreak: "break-word",
};

const itemMeta: React.CSSProperties = {
  fontSize: 14,
  color: "#94a3b8",
};

const itemCaption: React.CSSProperties = {
  marginTop: 8,
  fontSize: 15,
  color: "#e2e8f0",
  wordBreak: "break-word",
  lineHeight: 1.5,
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
