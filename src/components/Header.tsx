import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Sparkles, CheckCircle2, X, Smartphone, Instagram, Youtube } from "lucide-react";
import React from "react";
import { ExportPreset } from "@/hooks/use-creator-store";

interface HeaderProps {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  exportPanelOpen: boolean;
  setExportPanelOpen: (v: boolean) => void;
  exportPreset: ExportPreset;
  setExportPreset: (v: ExportPreset) => void;
}

const EXPORT_OPTIONS: { id: ExportPreset; label: string; sub: string; icon: React.ElementType; color: string }[] = [
  { id: 'tiktok', label: 'TikTok', sub: '1080 × 1920 · 9:16 · 60fps', icon: Smartphone, color: '#ff2d55' },
  { id: 'reels', label: 'Instagram Reels', sub: '1080 × 1920 · 9:16 · 30fps', icon: Instagram, color: '#e879f9' },
  { id: 'shorts', label: 'YouTube Shorts', sub: '1080 × 1920 · 9:16 · 60fps', icon: Youtube, color: '#ff4444' },
];

export function Header({
  projectTitle,
  setProjectTitle,
  exportPanelOpen,
  setExportPanelOpen,
  exportPreset,
  setExportPreset,
}: HeaderProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Draft Saved",
      description: "Your project has been saved.",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    });
  };

  const handleExportNow = () => {
    const opt = EXPORT_OPTIONS.find((o) => o.id === exportPreset)!;
    setExportPanelOpen(false);
    toast({
      title: "Export Started",
      description: `Rendering for ${opt.label} (${opt.sub})`,
      icon: <Download className="w-4 h-4 text-white" />,
    });
  };

  return (
    <>
      <header className="h-14 w-full flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md z-50 sticky top-0">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
            CreatorStudio
          </h1>
        </div>

        {/* Project title */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-transparent border border-transparent hover:border-white/10 focus:border-primary/50 focus:bg-white/[0.04] transition-all px-4 py-1.5 rounded-lg text-sm font-medium text-center focus:outline-none w-56 text-white/80 focus:text-white"
            placeholder="Untitled Project"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="border border-white/[0.08] hover:bg-white/5 font-medium rounded-xl h-9 text-sm text-white/70 hover:text-white"
            onClick={handleSave}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 border-0 font-semibold rounded-xl h-9 text-sm transition-all hover:scale-105 active:scale-95"
            onClick={() => setExportPanelOpen(true)}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </header>

      {/* ── Export Modal ── */}
      {exportPanelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setExportPanelOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 bg-[#111] rounded-2xl border border-white/10 shadow-2xl w-[440px] max-w-[90vw] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div>
                <h2 className="font-bold text-white">Export Video</h2>
                <p className="text-xs text-white/40 mt-0.5">Choose your target platform and format</p>
              </div>
              <button
                onClick={() => setExportPanelOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="p-5 space-y-2.5">
              {EXPORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = exportPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setExportPreset(opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      active
                        ? 'bg-white/[0.06] border-white/20'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${opt.color}20`, border: `1px solid ${opt.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: opt.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white">{opt.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{opt.sub}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                        active ? 'border-primary bg-primary' : 'border-white/20'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quality row */}
            <div className="px-5 pb-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xs text-white/40 flex-1">Quality</span>
                {['720p', '1080p', '4K'].map((q) => (
                  <button
                    key={q}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      q === '1080p'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 h-11 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-semibold"
                onClick={() => setExportPanelOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 font-bold shadow-lg shadow-primary/20"
                onClick={handleExportNow}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
