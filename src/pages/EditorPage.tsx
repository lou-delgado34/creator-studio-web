import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isAdminUnlimited } from "../lib/appTypes";

export default function EditorPage() {
  const { profile } = useAuth();
  const [projectTitle, setProjectTitle] = useState("My Video Project");
  const [caption, setCaption] = useState("");
  const [overlay, setOverlay] = useState("");
  const [hashtags, setHashtags] = useState("#viral #fyp");

  return (
    <div className="page-grid">
      <section className="hero-card">
        <span className="badge">Real Editor Foundation</span>
        <h1>Editor</h1>
        <p>
          This is the cleaner editor shell. Next upgrades will add real uploads, saved layers,
          draft autosave, and export jobs.
        </p>
      </section>

      <section className="editor-layout">
        <div className="editor-box">
          <h2>{projectTitle}</h2>
          <div className="preview-stage">
            <div>
              <h3>Preview Area</h3>
              <p className="small-note">
                Your uploaded media and timeline will go here in the next build.
              </p>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="editor-box">
            <h2>Project Settings</h2>

            <div className="field-group">
              <label className="field-label">Project Title</label>
              <input
                className="text-input"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Text Overlay</label>
              <input
                className="text-input"
                value={overlay}
                onChange={(e) => setOverlay(e.target.value)}
                placeholder="Type overlay text"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Caption</label>
              <textarea
                className="text-area"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Hashtags</label>
              <input
                className="text-input"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
            </div>

            <div className="inline-row">
              <button className="secondary-btn">Save Draft</button>
              <button className="primary-btn">Export</button>
            </div>
          </div>

          <div className="editor-box">
            <h2>Usage Rules</h2>
            <p>
              Current access:{" "}
              <span className={isAdminUnlimited(profile) ? "limit-admin" : "limit-ok"}>
                {isAdminUnlimited(profile) ? "Admin Unlimited" : profile?.plan || "free"}
              </span>
            </p>
            <br />
            <p className="small-note">
              In the next phase, export limits and AI generation limits will follow the user plan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
