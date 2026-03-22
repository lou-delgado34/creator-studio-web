import { useEffect, useMemo, useState } from "react";

type ContentType = "Image" | "Caption" | "Post" | "Video Idea";

type SavedItem = {
  id: string;
  title: string;
  type: ContentType;
  prompt: string;
  status: "draft" | "queued";
  createdAt: string;
};

function getSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem("creatorstudio-items");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveSavedItems(items: SavedItem[]) {
  localStorage.setItem("creatorstudio-items", JSON.stringify(items));
  window.dispatchEvent(new Event("creatorstudio-items-updated"));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function EditorPage() {
  const [title, setTitle] = useState("New Draft");
  const [contentType, setContentType] = useState<ContentType>("Image");
  const [prompt, setPrompt] = useState("goku on nimbus cloud with chichi");
  const [items, setItems] = useState<SavedItem[]>([]);
  const [message, setMessage] = useState("");
  const [previewSeed, setPreviewSeed] = useState(1);

  useEffect(() => {
    setItems(getSavedItems());
  }, []);

  const previewTitle = title.trim() || "Untitled Project";
  const previewPrompt = prompt.trim() || "No prompt yet";

  const refreshItems = () => {
    setItems(getSavedItems());
  };

  const createItem = (status: "draft" | "queued") => {
    const newItem: SavedItem = {
      id: makeId(),
      title: previewTitle,
      type: contentType,
      prompt: previewPrompt,
      status,
      createdAt: new Date().toISOString(),
    };

    const next = [newItem, ...getSavedItems()];
    saveSavedItems(next);
    setItems(next);
    setMessage(status === "draft" ? "Draft saved." : "Item added to queue.");
  };

  const deleteItem = (id: string) => {
    const next = getSavedItems().filter((item) => item.id !== id);
    saveSavedItems(next);
    setItems(next);
    setMessage("Item deleted.");
  };

  const loadItem = (item: SavedItem) => {
    setTitle(item.title);
    setContentType(item.type);
    setPrompt(item.prompt);
    setMessage(`Loaded: ${item.title}`);
  };

  const generatePreview = () => {
    setPreviewSeed((value) => value + 1);
    setMessage("Visual preview refreshed.");
  };

  const draftItems = useMemo(
    () => items.filter((item) => item.status === "draft"),
    [items]
  );

  const queuedItems = useMemo(
    () => items.filter((item) => item.status === "queued"),
    [items]
  );

  return (
    <div className="cs-page">
      <section className="cs-editor-layout">
        <div className="cs-card">
          <div className="cs-badge">Working Editor</div>
          <h1 className="cs-editor-title">Create content for your business</h1>
          <p className="cs-editor-text">
            Use this workspace to save drafts, queue ideas, and preview what your
            content could look like.
          </p>

          <div className="cs-form-group">
            <label>Title</label>
            <input
              className="cs-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type project title"
            />
          </div>

          <div className="cs-form-group">
            <label>Content Type</label>
            <select
              className="cs-input"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
            >
              <option>Image</option>
              <option>Caption</option>
              <option>Post</option>
              <option>Video Idea</option>
            </select>
          </div>

          <div className="cs-form-group">
            <label>Caption / Prompt / Notes</label>
            <textarea
              className="cs-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your idea here"
            />
          </div>

          <div className="cs-button-row">
            <button className="cs-btn cs-btn-secondary" onClick={() => createItem("draft")}>
              Save Draft
            </button>
            <button className="cs-btn cs-btn-primary" onClick={() => createItem("queued")}>
              Add To Queue
            </button>
            <button className="cs-btn cs-btn-outline" onClick={generatePreview}>
              Generate Preview
            </button>
          </div>

          {message && <div className="cs-success-text">{message}</div>}
        </div>

        <div className="cs-card cs-preview-card">
          <div className="cs-card-head">
            <h2>Preview</h2>
          </div>

          <div className="cs-mock-image">
            <div className={`cs-mock-circle one seed-${previewSeed % 4}`} />
            <div className={`cs-mock-circle two seed-${(previewSeed + 1) % 4}`} />
            <div className="cs-mock-inner-card">
              <div className="cs-mock-badge">Mock Image</div>
              <h3>{previewTitle}</h3>
              <div className="cs-mock-line" />
              <p>{previewPrompt}</p>
              <span>Preview only • real AI later</span>
            </div>
          </div>

          <div className="cs-preview-note">
            This preview is visual only right now. Real image generation comes in the next step.
          </div>
        </div>
      </section>

      <section className="cs-two-col">
        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Saved Drafts</h2>
          </div>

          {draftItems.length === 0 ? (
            <div className="cs-empty-state">Nothing saved yet.</div>
          ) : (
            <div className="cs-grid-cards">
              {draftItems.map((item) => (
                <div key={item.id} className="cs-library-card">
                  <div className="cs-library-thumb" />
                  <div className="cs-library-body">
                    <strong>{item.title}</strong>
                    <span>{item.type}</span>
                    <small>{formatDate(item.createdAt)}</small>
                  </div>
                  <div className="cs-library-actions">
                    <button className="cs-mini-btn" onClick={() => loadItem(item)}>
                      Load
                    </button>
                    <button className="cs-mini-btn danger" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cs-card">
          <div className="cs-card-head">
            <h2>Queue</h2>
          </div>

          {queuedItems.length === 0 ? (
            <div className="cs-empty-state">Nothing queued yet.</div>
          ) : (
            <div className="cs-list">
              {queuedItems.map((item) => (
                <div key={item.id} className="cs-list-row">
                  <div className="cs-list-thumb" />
                  <div className="cs-list-content">
                    <strong>{item.title}</strong>
                    <span>
                      {item.type} • {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="cs-library-actions">
                    <button className="cs-mini-btn" onClick={() => loadItem(item)}>
                      Load
                    </button>
                    <button className="cs-mini-btn danger" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
