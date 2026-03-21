import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SavedEditorItem = {
  id: string;
  title: string;
  type: string;
  caption: string;
  status: "draft" | "queued";
  updatedAt: string;
  previewUrl?: string;
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

function makeMockImage(title: string, caption: string) {
  const safeTitle = title || "Untitled Image";
  const safeCaption = caption || "No prompt yet";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#581c87"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>

    <circle cx="980" cy="220" r="170" fill="rgba(236,72,153,0.16)"/>
    <circle cx="240" cy="980" r="220" fill="rgba(168,85,247,0.14)"/>

    <rect x="90" y="90" rx="36" ry="36" width="1020" height="1020" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)"/>

    <text x="140" y="220" font-family="Arial, sans-serif" font-size="78" font-weight="700" fill="white">
      ${safeTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </text>

    <rect x="140" y="280" rx="16" ry="16" width="320" height="14" fill="url(#accent)"/>

    <foreignObject x="140" y="340" width="880" height="520">
      <div xmlns="http://www.w3.org/1999/xhtml"
        style="
          color:#e5e7eb;
          font-family:Arial, sans-serif;
          font-size:34px;
          line-height:1.5;
          width:100%;
          height:100%;
          overflow:hidden;
        ">
        Prompt: ${safeCaption
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}
      </div>
    </foreignObject>

    <rect x="140" y="980" rx="22" ry="22" width="420" height="82" fill="url(#accent)"/>
    <text x="184" y="1032" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="white">
      Mock Image Preview
    </text>
  </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
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
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);

    if (editId) {
      const found = loaded.find((item) => item.id === editId);
      if (found) {
        setTitle(found.title);
        setType(found.type);
        setCaption(found.caption);
        setPreviewUrl(found.previewUrl || "");
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

    const mock = makeMockImage(title, caption);
    setPreviewUrl(mock);
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
          previewUrl,
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
        previewUrl,
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
    setPreviewUrl(item.previewUrl || "");
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
            This editor now lets you save drafts, queue work, and create a mock image preview.
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

          <div style={buttonRow}>
            <button style={secondaryButton} onClick={() => handleSave("draft")}>
              Save Draft
            </button>

            <button style={primaryButton} onClick={() => handleSave("queued")}>
              Add To Queue
            </button>

            <button style={outlineButton} onClick={handleGenerateMockPreview}>
              Generate Mock Preview
            </button>
          </div>

          {message ? <div style={messageStyle}>{message}</div> : null}
        </div>

        <div style={sideCard}>
          <div style={sectionTitle}>Preview</div>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)",
                display: "block",
              }}
            />
          ) : (
            <div style={emptyPreview}>
              No preview yet. If you choose <strong>Image</strong>, click
              <strong> Generate Mock Preview</strong>.
            </div>
          )}

          <div style={tipBox}>
            Real AI image generation is not connected yet. This preview is a visual mockup only.
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
                <div style={{ minWidth: 0 }}>
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
  padding: "14px 18px",
  minWidth: 170,
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "linear-gradient(90deg, #ec4899, #a855f7)",
  whiteSpace: "normal",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  padding: "14px 18px",
  minWidth: 150,
  fontSize: 16,
  fontWeight: 800,
  color: "white",
  cursor: "pointer",
  background: "#1e293b",
  whiteSpace: "normal",
};

const outlineButton: React.CSSProperties = {
  border: "1px solid rgba(192,132,252,0.4)",
  borderRadius: 16,
  padding: "14px 18px",
  minWidth: 220,
  fontSize: 16,
  fontWeight: 800,
  color: "#f5d0fe",
  cursor: "pointer",
  background: "transparent",
  whiteSpace: "normal",
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
