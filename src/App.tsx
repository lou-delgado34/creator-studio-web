import React, { useMemo, useRef, useState } from "react";

type MenuItem =
  | "Dashboard"
  | "Editor"
  | "Templates"
  | "Captions"
  | "AI Generate"
  | "TikTok Preview"
  | "Pricing";

type TextSize = "Small" | "Medium" | "Large";
type TransitionType = "None" | "Fade" | "Slide";
type ExportPreset = "TikTok 9:16" | "Instagram Reels" | "YouTube Shorts";
type PlanType = "Standard" | "Pro" | "Teams";
type RoleType = "Admin" | "User";
type AITemplate =
  | "Anime Glow"
  | "Cinematic Portrait"
  | "Hyper Real"
  | "Music Promo";

type TextLayer = {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  size: TextSize;
};

export default function App() {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>("Dashboard");
  const [projectName, setProjectName] = useState("My Video Project");
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("No video uploaded");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("#viral #fyp");
  const [transition, setTransition] = useState<TransitionType>("None");
  const [exportPreset, setExportPreset] = useState<ExportPreset>("TikTok 9:16");

  const [plan, setPlan] = useState<PlanType>("Standard");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Yearly">(
    "Monthly",
  );
  const [role, setRole] = useState<RoleType>("Admin");
  const [adminMode, setAdminMode] = useState(true);

  const [hookIdeas, setHookIdeas] = useState<string[]>([
    "Nobody talks about this...",
    "This changed everything...",
    "Watch this before you scroll...",
    "This one tip changes everything...",
  ]);

  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 1,
      text: "",
      x: 50,
      y: 55,
      color: "#ffffff",
      size: "Medium",
    },
  ]);
  const [selectedTextId, setSelectedTextId] = useState<number>(1);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const [aiTemplate, setAiTemplate] = useState<AITemplate>("Anime Glow");
  const [aiPrompt, setAiPrompt] = useState(
    "Turn this into a cinematic anime-style creator clip",
  );
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiResultTitle, setAiResultTitle] = useState("No AI result yet");
  const [aiResultDescription, setAiResultDescription] = useState(
    "Run AI Generate to preview the styled output.",
  );
  const [creditsUsed, setCreditsUsed] = useState(24);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const selectedTextLayer =
    textLayers.find((layer) => layer.id === selectedTextId) || textLayers[0];

  const menuItems: MenuItem[] = [
    "Dashboard",
    "Editor",
    "Templates",
    "Captions",
    "AI Generate",
    "TikTok Preview",
    "Pricing",
  ];

  const isAdmin = role === "Admin" && adminMode;

  const creditsLimit = useMemo(() => {
    if (isAdmin) return Infinity;
    if (plan === "Standard") return 10;
    if (plan === "Pro") return 200;
    return 1200;
  }, [plan, isAdmin]);

  const creditsLeft =
    creditsLimit === Infinity
      ? "Unlimited"
      : Math.max(0, creditsLimit - creditsUsed);

  const canUseAutoCaptions = isAdmin || plan === "Pro" || plan === "Teams";
  const canUseAdvancedAI = isAdmin || plan === "Pro" || plan === "Teams";
  const canUseBrandKit = isAdmin || plan === "Teams";

  const getFontSize = (size: TextSize) => {
    if (size === "Small") return 18;
    if (size === "Large") return 34;
    return 26;
  };

  const previewTransitionStyle = useMemo(() => {
    if (transition === "Fade") return { opacity: 0.96 };
    if (transition === "Slide") return { transform: "translateX(0px)" };
    return {};
  }, [transition]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoURL(url);
    setVideoName(file.name);
    setSelectedMenu("Editor");
  };

  const generateHooks = () => {
    const options = [
      "Nobody talks about this...",
      "This changed everything...",
      "I wish I knew this sooner...",
      "Watch this before you scroll...",
      "This one trick saves so much time...",
      "You need to see this...",
      "This is what most people miss...",
      "Here’s the real secret...",
    ];
    const shuffled = [...options].sort(() => Math.random() - 0.5).slice(0, 4);
    setHookIdeas(shuffled);
  };

  const addTextLayer = () => {
    const newId = Date.now();
    const newLayer: TextLayer = {
      id: newId,
      text: "New text",
      x: 50,
      y: 50,
      color: "#ffffff",
      size: "Medium",
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedTextId(newId);
  };

  const updateSelectedTextLayer = (updates: Partial<TextLayer>) => {
    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === selectedTextId ? { ...layer, ...updates } : layer,
      ),
    );
  };

  const deleteSelectedTextLayer = () => {
    if (textLayers.length <= 1) {
      setTextLayers([
        { id: 1, text: "", x: 50, y: 55, color: "#ffffff", size: "Medium" },
      ]);
      setSelectedTextId(1);
      return;
    }

    const filtered = textLayers.filter((layer) => layer.id !== selectedTextId);
    setTextLayers(filtered);
    setSelectedTextId(filtered[0].id);
  };

  const onTextMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();
    setSelectedTextId(id);
    setDraggingId(id);
  };

  const onPreviewMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(10, Math.min(90, y));

    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === draggingId
          ? { ...layer, x: clampedX, y: clampedY }
          : layer,
      ),
    );
  };

  const stopDragging = () => setDraggingId(null);

  const runAIGenerate = () => {
    if (!isAdmin && creditsLimit !== Infinity && creditsUsed >= creditsLimit) {
      alert("You used all your AI credits for this month.");
      setSelectedMenu("Pricing");
      return;
    }

    const results: Record<AITemplate, { title: string; description: string }> =
      {
        "Anime Glow": {
          title: "Anime Glow Result",
          description:
            "Bold anime-style lighting, stronger edge glow, and dramatic creator look.",
        },
        "Cinematic Portrait": {
          title: "Cinematic Portrait Result",
          description:
            "Softer shadows, dramatic contrast, and polished studio-style framing.",
        },
        "Hyper Real": {
          title: "Hyper Real Result",
          description:
            "Sharper detail, stronger realism, and premium social-ready enhancement.",
        },
        "Music Promo": {
          title: "Music Promo Result",
          description:
            "High-energy promo style with stronger color punch and stage-like mood.",
        },
      };

    setAiGenerated(true);
    setAiResultTitle(results[aiTemplate].title);
    setAiResultDescription(results[aiTemplate].description);

    if (!isAdmin) {
      setCreditsUsed((prev) => prev + 1);
    }
  };

  const applyTemplate = (templateName: string) => {
    if (templateName === "Cinematic Gold" && !canUseAdvancedAI) {
      alert("This template is a Pro or Teams feature.");
      setSelectedMenu("Pricing");
      return;
    }

    if (templateName === "Viral Hook") {
      updateSelectedTextLayer({
        text: "Watch this before you scroll...",
        color: "#ffffff",
        size: "Large",
      });
    }
    if (templateName === "Storytime") {
      updateSelectedTextLayer({
        text: "Storytime...",
        color: "#ffffff",
        size: "Large",
      });
    }
    if (templateName === "Promo Ad") {
      updateSelectedTextLayer({
        text: "Limited offer today",
        color: "#ffd966",
        size: "Large",
      });
    }
    if (templateName === "Cinematic Gold") {
      updateSelectedTextLayer({
        text: "Cinematic reveal",
        color: "#ffd966",
        size: "Large",
      });
    }

    setSelectedMenu("Editor");
  };

  const renderLockBadge = (label: string) => (
    <span style={styles.lockBadge}>{label}</span>
  );

  const renderEditorView = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>Editor</div>
          <div style={styles.pageSubtitle}>
            Upload video, move text, and build your short-form content.
          </div>
        </div>
      </div>

      <div style={styles.editorLayout}>
        <div style={styles.editorMain}>
          <div style={styles.previewCard}>
            <div
              ref={previewRef}
              style={{
                ...styles.previewFrame,
                ...previewTransitionStyle,
                ...(aiGenerated ? styles.aiPreviewGlow : {}),
              }}
              onMouseMove={onPreviewMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onClick={() => stopDragging()}
            >
              {!videoURL ? (
                <label style={styles.uploadLabel}>
                  <div style={styles.uploadIcon}>⇪</div>
                  <div style={styles.uploadTitle}>Upload Video</div>
                  <div style={styles.uploadSub}>
                    Select a vertical video to start editing
                  </div>
                  <span style={styles.uploadButton}>Choose File</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={videoURL}
                    controls
                    style={styles.video}
                  />

                  {textLayers.map((layer) =>
                    layer.text.trim() ? (
                      <div
                        key={layer.id}
                        onMouseDown={(e) => onTextMouseDown(e, layer.id)}
                        style={{
                          ...styles.textOverlay,
                          left: `${layer.x}%`,
                          top: `${layer.y}%`,
                          color: layer.color,
                          fontSize: getFontSize(layer.size),
                          border:
                            layer.id === selectedTextId
                              ? "2px dashed rgba(255,255,255,0.65)"
                              : "2px solid transparent",
                          transform: "translate(-50%, -50%)",
                          cursor: "move",
                        }}
                      >
                        {layer.text}
                      </div>
                    ) : null,
                  )}

                  {selectedTextLayer?.text?.trim() ? (
                    <div style={styles.subtitleBar}>
                      {selectedTextLayer.text}
                    </div>
                  ) : null}

                  {aiGenerated ? (
                    <div style={styles.aiAppliedTag}>AI Styled</div>
                  ) : null}
                </>
              )}
            </div>

            <div style={styles.controlsRow}>
              {["Split", "Speed", "Filters", "Text", "Crop", "Rotate"].map(
                (item) => (
                  <button key={item} style={styles.toolButton}>
                    {item}
                  </button>
                ),
              )}
              <button style={styles.addTextButton} onClick={addTextLayer}>
                + Add Text Layer
              </button>
            </div>
          </div>

          <div style={styles.timelineCard}>
            <div style={styles.timelineHeader}>
              <div style={styles.timelineTitle}>Timeline</div>
              <div style={styles.timelineTime}>
                {videoURL ? "00:00 – 00:24" : "Empty"}
              </div>
            </div>

            <div style={styles.timelineLane}>
              <div style={styles.laneLabel}>VID</div>
              <div style={styles.clipBlock}>
                {videoURL ? videoName : "Upload video to create clip"}
              </div>
            </div>

            {textLayers.map((layer, index) => (
              <div key={layer.id} style={styles.timelineLane}>
                <div style={styles.laneLabel}>TXT</div>
                <button
                  onClick={() => setSelectedTextId(layer.id)}
                  style={{
                    ...styles.textBlock,
                    ...(layer.id === selectedTextId
                      ? styles.textBlockActive
                      : {}),
                  }}
                >
                  {layer.text.trim() || `Text Layer ${index + 1}`}
                </button>
              </div>
            ))}

            <div style={styles.timelineLane}>
              <div style={styles.laneLabel}>TRN</div>
              <div style={styles.transitionBlock}>Transition: {transition}</div>
            </div>
          </div>
        </div>

        <div style={styles.editorSidebar}>
          <div style={styles.sidePanelCard}>
            <div style={styles.sidePanelTitle}>Editor Settings</div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Selected Text Layer</label>
              <select
                value={selectedTextId}
                onChange={(e) => setSelectedTextId(Number(e.target.value))}
                style={styles.select}
              >
                {textLayers.map((layer, index) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.text.trim() || `Text Layer ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Text Overlay</label>
              <input
                value={selectedTextLayer?.text || ""}
                onChange={(e) =>
                  updateSelectedTextLayer({ text: e.target.value })
                }
                placeholder="Type text on video..."
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Size</label>
                <select
                  value={selectedTextLayer?.size || "Medium"}
                  onChange={(e) =>
                    updateSelectedTextLayer({
                      size: e.target.value as TextSize,
                    })
                  }
                  style={styles.select}
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={styles.label}>Color</label>
                <input
                  type="color"
                  value={selectedTextLayer?.color || "#ffffff"}
                  onChange={(e) =>
                    updateSelectedTextLayer({ color: e.target.value })
                  }
                  style={styles.colorInput}
                />
              </div>
            </div>

            <div style={styles.row}>
              <button style={styles.smallButton} onClick={addTextLayer}>
                Add Layer
              </button>
              <button
                style={{ ...styles.smallButton, ...styles.deleteButton }}
                onClick={deleteSelectedTextLayer}
              >
                Delete Layer
              </button>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Transition</label>
              <select
                value={transition}
                onChange={(e) =>
                  setTransition(e.target.value as TransitionType)
                }
                style={styles.select}
              >
                <option>None</option>
                <option>Fade</option>
                <option>Slide</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Export Preset</label>
              <select
                value={exportPreset}
                onChange={(e) =>
                  setExportPreset(e.target.value as ExportPreset)
                }
                style={styles.select}
              >
                <option>TikTok 9:16</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>Dashboard</div>
          <div style={styles.pageSubtitle}>
            Manage your creator workspace, credits, and premium access.
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Projects</div>
          <div style={styles.statValue}>12</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Drafts</div>
          <div style={styles.statValue}>4</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>AI Credits</div>
          <div style={styles.statValue}>{creditsLeft}</div>
        </div>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Current Access</div>
          <div style={styles.cardLine}>Role: {role}</div>
          <div style={styles.cardLine}>
            Plan: {isAdmin ? "Admin Unlimited" : plan}
          </div>
          <div style={styles.cardLine}>Billing: {billingCycle}</div>
        </div>

        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Monetization Plan</div>
          <div style={styles.cardLine}>Standard = starter creator tools</div>
          <div style={styles.cardLine}>
            Pro = premium AI + premium templates
          </div>
          <div style={styles.cardLine}>Teams = collaboration + brand kit</div>
        </div>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Income Ideas</div>
          <div style={styles.cardLine}>Sell subscriptions</div>
          <div style={styles.cardLine}>Offer done-for-you content packages</div>
          <div style={styles.cardLine}>
            Sell branded short-form creation for businesses
          </div>
        </div>

        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Premium Access Summary</div>
          <div style={styles.cardLine}>
            Auto Captions: {canUseAutoCaptions ? "Unlocked" : "Locked"}
          </div>
          <div style={styles.cardLine}>
            Advanced AI: {canUseAdvancedAI ? "Unlocked" : "Locked"}
          </div>
          <div style={styles.cardLine}>
            Brand Kit: {canUseBrandKit ? "Unlocked" : "Locked"}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>Templates</div>
          <div style={styles.pageSubtitle}>
            Use ready-made layouts and premium creator styles.
          </div>
        </div>
      </div>

      <div style={styles.templateGrid}>
        {["Viral Hook", "Storytime", "Promo Ad", "Cinematic Gold"].map(
          (item) => {
            const locked = item === "Cinematic Gold" && !canUseAdvancedAI;
            return (
              <button
                key={item}
                style={{
                  ...styles.templateCard,
                  ...(locked ? styles.lockedTemplateCard : {}),
                }}
                onClick={() => applyTemplate(item)}
              >
                <div>{item}</div>
                {locked ? renderLockBadge("PRO") : null}
              </button>
            );
          },
        )}
      </div>
    </div>
  );

  const renderCaptions = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>Captions</div>
          <div style={styles.pageSubtitle}>
            Manage subtitles, auto captions, and creator text overlays.
          </div>
        </div>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Current Caption</div>
          <div style={styles.cardLine}>
            {selectedTextLayer?.text || "No caption text yet"}
          </div>
        </div>

        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>Auto Captions</div>
          <div style={styles.cardLine}>
            {canUseAutoCaptions
              ? "Unlocked for this account"
              : "Locked on Standard plan"}
          </div>
          {canUseAutoCaptions ? (
            <button
              style={styles.dashboardButton}
              onClick={() =>
                updateSelectedTextLayer({
                  text: "Auto captions sample generated here",
                })
              }
            >
              Generate Caption Sample
            </button>
          ) : (
            <button
              style={styles.upgradeButton}
              onClick={() => setSelectedMenu("Pricing")}
            >
              Upgrade for Auto Captions
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderAIGenerate = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>AI Generate</div>
          <div style={styles.pageSubtitle}>
            Demo AI styling page. This shows the flow and premium access logic.
          </div>
        </div>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>AI Style Engine</div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>AI Template</label>
            <select
              value={aiTemplate}
              onChange={(e) => setAiTemplate(e.target.value as AITemplate)}
              style={styles.select}
            >
              <option>Anime Glow</option>
              <option>Cinematic Portrait</option>
              <option>Hyper Real</option>
              <option>Music Promo</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Prompt</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.cardLine}>Credits Left: {creditsLeft}</div>

          {!canUseAdvancedAI ? (
            <div style={styles.proNoticeBox}>
              <div style={styles.cardTitle}>Advanced AI Locked</div>
              <div style={styles.cardLine}>
                Upgrade to Pro or Teams for stronger AI styles and
                image-to-video tools.
              </div>
              <button
                style={styles.upgradeButton}
                onClick={() => setSelectedMenu("Pricing")}
              >
                Upgrade Now
              </button>
            </div>
          ) : null}

          <button style={styles.primaryWideButton} onClick={runAIGenerate}>
            Generate AI Look
          </button>
        </div>

        <div style={styles.dashboardCard}>
          <div style={styles.cardTitle}>AI Preview Result</div>
          <div
            style={{
              ...styles.aiMockCard,
              ...(aiGenerated ? styles.aiMockCardGenerated : {}),
            }}
          >
            <div style={styles.aiMockGlow} />
            <div style={styles.aiMockTextTop}>{aiResultTitle}</div>
            <div style={styles.aiMockTextBottom}>{aiResultDescription}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTikTokPreview = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>TikTok Preview</div>
          <div style={styles.pageSubtitle}>
            See how your content might feel in a short-form social layout.
          </div>
        </div>
      </div>

      <div style={styles.tiktokWrap}>
        <div style={styles.tiktokPhone}>
          <div style={styles.tiktokTopBar}>
            <div style={styles.tiktokBack}>←</div>
            <div style={styles.tiktokSearch}>goku vs superman</div>
            <div style={styles.tiktokSearchBtn}>Search</div>
          </div>

          <div style={styles.tiktokVideoArea}>
            {videoURL ? (
              <video src={videoURL} style={styles.tiktokVideo} muted />
            ) : (
              <div style={styles.tiktokPlaceholder}>
                Upload video for full preview
              </div>
            )}

            {selectedTextLayer?.text?.trim() ? (
              <div style={styles.tiktokBigText}>{selectedTextLayer.text}</div>
            ) : null}

            <div style={styles.tiktokRightIcons}>
              <div style={styles.tiktokRound}>AI</div>
              <div style={styles.tiktokRound}>＋</div>
              <div style={styles.tiktokHeart}>♥</div>
              <div style={styles.tiktokStat}>73.1K</div>
              <div style={styles.tiktokHeart}>💬</div>
              <div style={styles.tiktokStat}>1,917</div>
              <div style={styles.tiktokHeart}>↗</div>
              <div style={styles.tiktokStat}>10.1K</div>
            </div>

            <div style={styles.tiktokCaptionBox}>
              <div style={styles.tiktokUser}>Your Brand • 4d ago</div>
              <div style={styles.tiktokCaptionText}>
                {caption || "Your TikTok-style caption will show here."}
              </div>
              <div style={styles.tiktokHash}>{hashtags}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div style={styles.pageWrap}>
      <div style={styles.pageTitleRow}>
        <div>
          <div style={styles.pageTitle}>Plans & Pricing</div>
          <div style={styles.pageSubtitle}>
            Build a real income path with Standard, Pro, and Teams.
          </div>
        </div>
      </div>

      <div style={styles.roleAdminBar}>
        <div>
          <div style={styles.cardTitle}>Admin Access Control</div>
          <div style={styles.cardLine}>
            Admin has unlimited access to all features and unlimited credits.
          </div>
        </div>

        <div style={styles.roleControls}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)}
            style={styles.selectSmall}
          >
            <option>Admin</option>
            <option>User</option>
          </select>

          <button
            style={isAdmin ? styles.adminOnButton : styles.adminOffButton}
            onClick={() => setAdminMode((prev) => !prev)}
          >
            {adminMode ? "Admin Unlimited ON" : "Admin Unlimited OFF"}
          </button>
        </div>
      </div>

      <div style={styles.planTabs}>
        {(["Standard", "Pro", "Teams"] as PlanType[]).map((item) => (
          <button
            key={item}
            onClick={() => setPlan(item)}
            style={{
              ...styles.planTabButton,
              ...(plan === item ? styles.planTabButtonActive : {}),
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={styles.billingTabs}>
        <button
          onClick={() => setBillingCycle("Monthly")}
          style={{
            ...styles.billingButton,
            ...(billingCycle === "Monthly" ? styles.billingButtonActive : {}),
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("Yearly")}
          style={{
            ...styles.billingButton,
            ...(billingCycle === "Yearly" ? styles.billingButtonActive : {}),
          }}
        >
          Yearly
        </button>
      </div>

      <div style={styles.pricingCards}>
        <div
          style={
            plan === "Standard" ? styles.pricingCardActive : styles.pricingCard
          }
        >
          <div style={styles.pricingTopTag}>Free Trial</div>
          <div style={styles.pricePlanTitle}>Standard</div>
          <div style={styles.priceSub}>
            {billingCycle === "Monthly" ? "$1.99 first month" : "$89.99 / year"}
          </div>
          <div style={styles.priceBig}>$0</div>
          <div style={styles.priceSmall}>Basic creator tools</div>
        </div>

        <div
          style={
            plan === "Pro" ? styles.pricingCardActivePro : styles.pricingCard
          }
        >
          <div style={styles.pricingTopTagPurple}>Free Trial</div>
          <div style={styles.pricePlanTitle}>Pro</div>
          <div style={styles.priceSub}>
            {billingCycle === "Monthly"
              ? "$3.99 first month"
              : "$179.99 / year"}
          </div>
          <div style={styles.priceBig}>$0</div>
          <div style={styles.priceSmall}>Advanced AI + premium templates</div>
        </div>

        <div
          style={
            plan === "Teams" ? styles.pricingCardActivePro : styles.pricingCard
          }
        >
          <div style={styles.pricingTopTagPurple}>Free Trial</div>
          <div style={styles.pricePlanTitle}>Teams</div>
          <div style={styles.priceSub}>
            {billingCycle === "Monthly"
              ? "$4.99 first month"
              : "$214.99 / year"}
          </div>
          <div style={styles.priceBig}>$0</div>
          <div style={styles.priceSmall}>Collaboration + brand tools</div>
        </div>
      </div>

      <div style={styles.compareWrap}>
        <div style={styles.compareHeaderRow}>
          <div style={styles.compareHeaderCell}>Benefits</div>
          <div style={styles.compareHeaderCell}>Standard</div>
          <div style={styles.compareHeaderCell}>Pro</div>
          <div style={styles.compareHeaderCell}>Teams</div>
        </div>

        {[
          ["Premium assets", "✓", "✓", "✓"],
          ["Auto captions", "—", "✓", "✓"],
          ["Features", "Basic", "Advanced", "Advanced"],
          ["Premium templates", "✓", "✓", "✓"],
          ["Retouch toolkit", "✓", "✓", "✓"],
          [
            "Device",
            "Mobile",
            "Mobile, desktop, and web",
            "Mobile, desktop, and web",
          ],
          ["Monthly credits", "10", "200", "1200"],
          ["Space storage", "100GB", "1TB", "1TB"],
          ["Brand kit", "—", "—", "✓"],
          ["Share for review", "—", "—", "✓"],
          ["Brand templates", "—", "—", "✓"],
        ].map((row) => (
          <div key={row[0]} style={styles.compareRow}>
            <div style={styles.compareCellLeft}>{row[0]}</div>
            <div style={styles.compareCell}>{row[1]}</div>
            <div style={styles.compareCell}>{row[2]}</div>
            <div style={styles.compareCell}>{row[3]}</div>
          </div>
        ))}
      </div>

      <button style={styles.purchaseBigButton}>
        {isAdmin
          ? "Admin Access Enabled"
          : `Start 7-day free trial for ${plan}`}
      </button>
    </div>
  );

  const renderMainContent = () => {
    if (selectedMenu === "Dashboard") return renderDashboard();
    if (selectedMenu === "Editor") return renderEditorView();
    if (selectedMenu === "Templates") return renderTemplates();
    if (selectedMenu === "Captions") return renderCaptions();
    if (selectedMenu === "AI Generate") return renderAIGenerate();
    if (selectedMenu === "TikTok Preview") return renderTikTokPreview();
    if (selectedMenu === "Pricing") return renderPricing();
    return renderDashboard();
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoBadge}>✦</div>
          <div>
            <div style={styles.logoText}>CreatorStudio</div>
            <div style={styles.logoSub}>CapCut + TikTok style</div>
          </div>
        </div>

        <div style={styles.menuTitle}>MENU</div>

        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedMenu(item)}
            style={{
              ...styles.menuButton,
              ...(selectedMenu === item ? styles.menuButtonActive : {}),
            }}
          >
            {item}
          </button>
        ))}
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={styles.projectInput}
          />

          <div style={styles.topbarButtons}>
            <button style={styles.secondaryButton}>Save Draft</button>
            <button style={styles.primaryButton}>Export</button>
          </div>
        </header>

        {renderMainContent()}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(180deg, rgb(8,8,10) 0%, rgb(14,14,18) 100%)",
    color: "#ffffff",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  sidebar: {
    width: 250,
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: 20,
    background: "rgba(0,0,0,0.35)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ff4d8d, #8b5cf6)",
    fontWeight: 700,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
  },
  logoSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  menuTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 10,
  },
  menuButton: {
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    marginBottom: 8,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 16,
  },
  menuButtonActive: {
    background: "rgba(255,255,255,0.08)",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 18,
    gap: 18,
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 16,
  },
  projectInput: {
    flex: 1,
    maxWidth: 420,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 20,
    fontWeight: 700,
    outline: "none",
  },
  topbarButtons: {
    display: "flex",
    gap: 10,
  },
  secondaryButton: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 18px",
    fontSize: 15,
    cursor: "pointer",
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #ff4d8d, #8b5cf6)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  pageWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  pageTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  pageSubtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.68)",
    fontSize: 15,
    lineHeight: 1.45,
  },
  editorLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 360px",
    gap: 18,
    alignItems: "start",
  },
  editorMain: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  editorSidebar: {
    minWidth: 0,
  },
  sidePanelCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 18,
  },
  sidePanelTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 14,
  },
  previewCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 18,
  },
  previewFrame: {
    position: "relative",
    width: 340,
    height: 590,
    maxWidth: "100%",
    margin: "0 auto",
    borderRadius: 28,
    overflow: "hidden",
    background:
      "radial-gradient(circle at top, rgba(255,77,141,0.18), rgba(255,255,255,0.02) 35%, rgba(0,0,0,0.85) 70%)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  aiPreviewGlow: {
    boxShadow:
      "0 0 0 2px rgba(155,135,245,0.25), 0 0 40px rgba(155,135,245,0.25)",
  },
  uploadLabel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    padding: 20,
  },
  uploadIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    marginBottom: 14,
  },
  uploadTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
  },
  uploadSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 15,
    marginBottom: 18,
  },
  uploadButton: {
    padding: "12px 18px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff4d8d, #8b5cf6)",
    fontWeight: 700,
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    background: "#000",
  },
  textOverlay: {
    position: "absolute",
    textAlign: "center",
    fontWeight: 800,
    textShadow: "0 3px 20px rgba(0,0,0,0.7)",
    wordBreak: "break-word",
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(0,0,0,0.15)",
    userSelect: "none",
    maxWidth: "80%",
  },
  subtitleBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    textAlign: "center",
    fontWeight: 800,
    fontSize: 18,
    padding: "8px 12px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.45)",
    textShadow: "0 2px 10px rgba(0,0,0,0.7)",
  },
  aiAppliedTag: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: "8px 12px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #79d7ff, #b77dff)",
    fontWeight: 700,
    fontSize: 12,
  },
  controlsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 18,
  },
  toolButton: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
  },
  addTextButton: {
    border: "none",
    background: "linear-gradient(135deg, #ff4d8d, #8b5cf6)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  timelineCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 18,
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  timelineTitle: {
    fontSize: 24,
    fontWeight: 700,
  },
  timelineTime: {
    color: "rgba(255,255,255,0.6)",
  },
  timelineLane: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  laneLabel: {
    width: 48,
    color: "rgba(255,255,255,0.55)",
    fontWeight: 700,
  },
  clipBlock: {
    flex: 1,
    background:
      "linear-gradient(135deg, rgba(255,77,141,0.28), rgba(139,92,246,0.28))",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  textBlock: {
    flex: 1,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 16px",
    color: "#ffffff",
    textAlign: "left",
    cursor: "pointer",
  },
  textBlockActive: {
    outline: "2px solid rgba(255,77,141,0.7)",
    background: "rgba(255,77,141,0.12)",
  },
  transitionBlock: {
    flex: 1,
    background: "rgba(139,92,246,0.14)",
    border: "1px solid rgba(139,92,246,0.35)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.74)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 110,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: 15,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },
  select: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: 15,
    outline: "none",
  },
  selectSmall: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
  },
  colorInput: {
    width: "100%",
    height: 50,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 4,
    cursor: "pointer",
  },
  primaryWideButton: {
    width: "100%",
    border: "none",
    background: "linear-gradient(135deg, #ff4d8d, #8b5cf6)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  smallButton: {
    flex: 1,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  deleteButton: {
    background: "rgba(255,77,141,0.12)",
    border: "1px solid rgba(255,77,141,0.35)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 20,
  },
  statLabel: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 800,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  dashboardCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
  },
  cardLine: {
    color: "rgba(255,255,255,0.82)",
    marginBottom: 10,
    lineHeight: 1.5,
  },
  dashboardButton: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    borderRadius: 14,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "left",
  },
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
  },
  templateCard: {
    minHeight: 140,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(255,77,141,0.18), rgba(139,92,246,0.18))",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    padding: 20,
    textAlign: "left",
    position: "relative",
  },
  lockedTemplateCard: {
    opacity: 0.72,
  },
  lockBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.15)",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.6,
  },
  proNoticeBox: {
    background: "rgba(155,135,245,0.12)",
    border: "1px solid rgba(155,135,245,0.35)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  upgradeButton: {
    border: "none",
    background: "linear-gradient(135deg, #79d7ff, #b77dff)",
    color: "#111",
    borderRadius: 14,
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
  },
  aiMockCard: {
    position: "relative",
    height: 360,
    borderRadius: 24,
    background:
      "radial-gradient(circle at center, rgba(255,77,141,0.15), rgba(139,92,246,0.12), rgba(0,0,0,0.9))",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  aiMockCardGenerated: {
    background:
      "radial-gradient(circle at center, rgba(121,215,255,0.2), rgba(183,125,255,0.18), rgba(0,0,0,0.92))",
  },
  aiMockGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 30% 20%, rgba(121,215,255,0.25), transparent 35%), radial-gradient(circle at 70% 75%, rgba(183,125,255,0.25), transparent 35%)",
  },
  aiMockTextTop: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  aiMockTextBottom: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 1.5,
  },
  tiktokWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  tiktokPhone: {
    width: 380,
    minHeight: 760,
    borderRadius: 28,
    background: "#000",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
    position: "relative",
  },
  tiktokTopBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  tiktokBack: {
    fontSize: 28,
    fontWeight: 700,
  },
  tiktokSearch: {
    flex: 1,
    border: "2px solid rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: "12px 18px",
    fontSize: 18,
    fontWeight: 700,
  },
  tiktokSearchBtn: {
    border: "2px solid rgba(255,255,255,0.9)",
    borderRadius: 999,
    padding: "12px 18px",
    fontSize: 18,
    fontWeight: 700,
  },
  tiktokVideoArea: {
    position: "relative",
    minHeight: 650,
    background: "linear-gradient(180deg, #111, #000)",
  },
  tiktokVideo: {
    width: "100%",
    height: 650,
    objectFit: "cover",
    display: "block",
  },
  tiktokPlaceholder: {
    height: 650,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.75)",
    fontSize: 22,
    fontWeight: 700,
  },
  tiktokBigText: {
    position: "absolute",
    top: 80,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 34,
    fontWeight: 900,
    textTransform: "uppercase",
    textShadow: "0 4px 18px rgba(0,0,0,0.8)",
  },
  tiktokRightIcons: {
    position: "absolute",
    right: 12,
    top: 140,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  tiktokRound: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  tiktokHeart: {
    fontSize: 40,
    lineHeight: 1,
  },
  tiktokStat: {
    fontSize: 15,
    fontWeight: 700,
  },
  tiktokCaptionBox: {
    position: "absolute",
    left: 16,
    right: 90,
    bottom: 22,
  },
  tiktokUser: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 8,
  },
  tiktokCaptionText: {
    fontSize: 17,
    lineHeight: 1.45,
    marginBottom: 8,
  },
  tiktokHash: {
    fontSize: 17,
    color: "#fff",
    opacity: 0.9,
  },
  roleAdminBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  roleControls: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  adminOnButton: {
    border: "none",
    background: "linear-gradient(135deg, #79d7ff, #b77dff)",
    color: "#111",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  adminOffButton: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  planTabs: {
    display: "flex",
    gap: 10,
  },
  planTabButton: {
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },
  planTabButtonActive: {
    background:
      "linear-gradient(135deg, rgba(121,215,255,0.18), rgba(183,125,255,0.18))",
    border: "1px solid rgba(183,125,255,0.45)",
  },
  billingTabs: {
    display: "flex",
    gap: 10,
  },
  billingButton: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  billingButtonActive: {
    background: "rgba(255,255,255,0.12)",
  },
  pricingCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  pricingCard: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#fff",
    color: "#111",
    padding: 20,
    position: "relative",
    minHeight: 230,
  },
  pricingCardActive: {
    borderRadius: 24,
    border: "3px solid #18d1ea",
    background: "#fff",
    color: "#111",
    padding: 20,
    position: "relative",
    minHeight: 230,
  },
  pricingCardActivePro: {
    borderRadius: 24,
    border: "3px solid #b77dff",
    background: "#fff",
    color: "#111",
    padding: 20,
    position: "relative",
    minHeight: 230,
  },
  pricingTopTag: {
    position: "absolute",
    top: -10,
    left: 14,
    padding: "8px 14px",
    borderRadius: 12,
    background: "#18d1ea",
    color: "#111",
    fontWeight: 800,
  },
  pricingTopTagPurple: {
    position: "absolute",
    top: -10,
    left: 14,
    padding: "8px 14px",
    borderRadius: 12,
    background: "#c3a4ff",
    color: "#111",
    fontWeight: 800,
  },
  pricePlanTitle: {
    fontSize: 28,
    fontWeight: 800,
    marginTop: 28,
    marginBottom: 8,
  },
  priceSub: {
    color: "#666",
    fontSize: 18,
    marginBottom: 30,
  },
  priceBig: {
    fontSize: 64,
    fontWeight: 900,
    marginBottom: 8,
  },
  priceSmall: {
    fontSize: 18,
    color: "#555",
  },
  compareWrap: {
    background: "#ececef",
    color: "#111",
    borderRadius: 24,
    overflow: "hidden",
  },
  compareHeaderRow: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
    background: "#e5e5e8",
  },
  compareHeaderCell: {
    padding: 20,
    fontWeight: 800,
    fontSize: 18,
  },
  compareRow: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
    borderTop: "1px solid #ddd",
  },
  compareCellLeft: {
    padding: 20,
    fontSize: 16,
    lineHeight: 1.4,
  },
  compareCell: {
    padding: 20,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 1.4,
  },
  purchaseBigButton: {
    border: "none",
    borderRadius: 999,
    padding: "22px 24px",
    fontSize: 24,
    fontWeight: 900,
    background: "linear-gradient(135deg, #79d7ff, #b77dff)",
    color: "#111",
    cursor: "pointer",
  },
};
