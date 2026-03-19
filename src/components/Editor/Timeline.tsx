import { Plus, Video, Type, Music, Trash2, Upload, Film, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Transition } from "@/hooks/use-creator-store";

function formatTime(secs: number) {
  if (!isFinite(secs) || isNaN(secs) || secs === 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ color, bars = 24 }: { color: string; bars?: number }) {
  const heights = Array.from({ length: bars }, (_, i) =>
    4 + Math.abs(Math.sin(i * 0.7) * 10) + Math.abs(Math.cos(i * 1.3) * 6)
  );
  return (
    <svg viewBox={`0 0 ${bars * 3.5} 20`} preserveAspectRatio="none" className="w-full h-full opacity-40">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 3.5 + 0.75}
          y={(20 - h) / 2}
          width={2}
          height={h}
          rx={1}
          fill={color}
        />
      ))}
    </svg>
  );
}

function TransitionPill({ type }: { type: string }) {
  const label = type === 'fade' ? '↔ Fade' : type === 'slide' ? '▶ Slide' : '';
  if (!label) return null;
  return (
    <div className="shrink-0 flex items-center justify-center z-10">
      <div className="px-1.5 py-0.5 rounded-md bg-accent/20 border border-accent/30 text-[8px] font-bold text-accent uppercase tracking-wide whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

interface TimelineProps {
  videoSrc: string | null;
  videoFileName: string;
  videoDuration: number;
  audioSrc: string | null;
  audioFileName: string;
  textOverlay: { text: string; color: string };
  transition: Transition;
  triggerUpload: () => void;
  triggerAudioUpload: () => void;
  removeVideo: () => void;
  removeAudio: () => void;
}

const LANE_W = 36;

export function Timeline({
  videoSrc,
  videoFileName,
  videoDuration,
  audioSrc,
  audioFileName,
  textOverlay,
  transition,
  triggerUpload,
  triggerAudioUpload,
  removeVideo,
  removeAudio,
}: TimelineProps) {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);

  const hasVideo = !!videoSrc;
  const hasAudio = !!audioSrc;
  const hasText = !!textOverlay.text;
  const showTransition = transition.type !== 'none';

  return (
    <div
      className="w-full border-t border-white/[0.05] bg-[#090909] flex flex-col shrink-0"
      style={{ minHeight: 172 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-[#0d0d0d]">
        <div className="flex items-center gap-2.5">
          <Film className="w-3.5 h-3.5 text-white/25" />
          <span className="text-xs font-bold text-white/80">Timeline</span>
          <span className="text-[10px] text-white/25 font-mono">
            {hasVideo ? `0:00 → ${formatTime(videoDuration)}` : "Empty"}
          </span>
          {showTransition && (
            <div className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent/15 text-accent border border-accent/25 uppercase tracking-wide">
              {transition.type} · {transition.duration}s
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-white/40 hover:text-white border border-white/[0.07] hover:border-white/20 rounded-lg gap-1 px-2.5"
            onClick={triggerUpload}
          >
            <Plus className="w-3 h-3" /> Media
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[11px] text-white/40 hover:text-white border border-white/[0.07] hover:border-white/20 rounded-lg gap-1 px-2.5"
            onClick={triggerAudioUpload}
          >
            <Plus className="w-3 h-3" /> Audio
          </Button>
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-3 py-2.5 space-y-2">

        {/* ── VIDEO LANE ── */}
        <div className="flex items-center gap-2" style={{ height: 46 }}>
          {/* Lane icon */}
          <div className="shrink-0 flex flex-col items-center justify-center gap-0.5 text-white/25" style={{ width: LANE_W }}>
            <Video className="w-3.5 h-3.5" />
            <span className="text-[7px] font-black uppercase tracking-widest">VID</span>
          </div>

          {hasVideo ? (
            <div className="flex flex-1 items-center gap-1 h-full min-w-[300px]">
              {/* Transition indicator before clip */}
              {showTransition && <TransitionPill type={transition.type} />}

              {/* Clip */}
              <div
                className={`flex-1 relative group h-full rounded-xl overflow-hidden border cursor-pointer transition-all ${
                  selectedClip === 'video'
                    ? 'border-[#ff2d55]/60 ring-1 ring-[#ff2d55]/30'
                    : 'border-[#ff2d55]/25 hover:border-[#ff2d55]/50'
                } bg-[#ff2d55]/10`}
                onClick={() => setSelectedClip(selectedClip === 'video' ? null : 'video')}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff2d55] rounded-l-xl" />
                {/* Waveform */}
                <div className="absolute inset-0 left-2">
                  <Waveform color="#ff2d55" />
                </div>
                {/* Info */}
                <div className="relative z-10 flex items-center gap-2 px-4 h-full">
                  <span className="text-xs font-bold text-white/90 truncate flex-1 drop-shadow">
                    {videoFileName || "Video Clip"}
                  </span>
                  <span className="text-[10px] text-[#ff2d55] font-mono shrink-0">{formatTime(videoDuration)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeVideo(); }}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Selected indicator */}
                {selectedClip === 'video' && (
                  <div className="absolute inset-0 ring-1 ring-[#ff2d55]/40 rounded-xl pointer-events-none" />
                )}
              </div>

              {/* Transition indicator after clip */}
              {showTransition && <TransitionPill type={transition.type} />}
            </div>
          ) : (
            <div
              className="flex-1 h-full min-w-[300px] rounded-xl border border-dashed border-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2 text-white/25 hover:text-white/60 cursor-pointer transition-all text-xs"
              onClick={triggerUpload}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload video to start</span>
            </div>
          )}
        </div>

        {/* ── TEXT LANE ── */}
        <div className="flex items-center gap-2" style={{ height: 30 }}>
          <div className="shrink-0 flex flex-col items-center justify-center gap-0.5 text-white/25" style={{ width: LANE_W }}>
            <Type className="w-3 h-3" />
            <span className="text-[7px] font-black uppercase tracking-widest">TXT</span>
          </div>

          {hasText ? (
            <div
              className={`h-full rounded-xl border cursor-pointer overflow-hidden flex items-center px-3 gap-2 relative transition-all ${
                selectedClip === 'text' ? 'ring-1' : 'hover:border-opacity-60'
              }`}
              style={{
                width: "40%",
                minWidth: 110,
                background: `${textOverlay.color}12`,
                borderColor: `${textOverlay.color}35`,
              }}
              onClick={() => setSelectedClip(selectedClip === 'text' ? null : 'text')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: textOverlay.color }} />
              <span className="text-[11px] font-bold text-white/80 truncate pl-1">{textOverlay.text}</span>
            </div>
          ) : (
            <span className="text-[9px] text-white/20 italic">Type text in Settings → text layer shows here</span>
          )}
        </div>

        {/* ── AUDIO LANE ── */}
        <div className="flex items-center gap-2" style={{ height: 30 }}>
          <div className="shrink-0 flex flex-col items-center justify-center gap-0.5 text-white/25" style={{ width: LANE_W }}>
            <Music className="w-3 h-3" />
            <span className="text-[7px] font-black uppercase tracking-widest">AUD</span>
          </div>

          {hasAudio ? (
            <div
              className={`relative h-full rounded-xl border border-blue-500/25 bg-blue-500/10 overflow-hidden flex items-center cursor-pointer group transition-all ${
                selectedClip === 'audio' ? 'border-blue-500/60 ring-1 ring-blue-500/25' : 'hover:border-blue-500/45'
              }`}
              style={{ width: "66%", minWidth: 150 }}
              onClick={() => setSelectedClip(selectedClip === 'audio' ? null : 'audio')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
              <div className="absolute inset-0 left-1">
                <Waveform color="#3b82f6" bars={18} />
              </div>
              <div className="relative z-10 flex items-center gap-2 px-3 w-full">
                <span className="text-[11px] font-bold text-white/80 truncate flex-1">
                  {audioFileName || "Audio Track"}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeAudio(); }}
                  className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="h-full flex items-center gap-1.5 text-white/20 hover:text-white/50 cursor-pointer transition-all text-xs"
              onClick={triggerAudioUpload}
            >
              <Upload className="w-3 h-3" />
              <span>Upload audio</span>
            </div>
          )}
        </div>

        {/* Selected clip info bar */}
        {selectedClip && (
          <div className="flex items-center gap-3 px-1">
            <Layers className="w-3 h-3 text-white/25" />
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
              {selectedClip === 'video' ? 'Video' : selectedClip === 'text' ? 'Text' : 'Audio'} clip selected
            </span>
            {selectedClip === 'video' && (
              <span className="text-[9px] text-white/20 font-mono">{formatTime(videoDuration)}</span>
            )}
            <button
              onClick={() => setSelectedClip(null)}
              className="ml-auto text-[9px] text-white/20 hover:text-white/50 transition-colors uppercase tracking-widest font-bold"
            >
              Deselect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
