import { TextOverlay, Transition, TransitionType } from "@/hooks/use-creator-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Type, Volume2, Sun, Music2, Upload, X, Hash, Heart,
  MessageCircle, Bookmark, Share2, Play, AtSign, Layers,
} from "lucide-react";

interface RightPanelProps {
  textOverlay: TextOverlay;
  setTextOverlay: (v: TextOverlay) => void;
  captions: string;
  setCaptions: (v: string) => void;
  hashtags: string;
  setHashtags: (v: string) => void;
  volume: number[];
  setVolume: (v: number[]) => void;
  brightness: number[];
  setBrightness: (v: number[]) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (v: number) => void;
  audioSrc: string | null;
  audioFileName: string;
  triggerAudioUpload: () => void;
  removeAudio: () => void;
  videoSrc: string | null;
  transition: Transition;
  setTransition: (v: Transition) => void;
}

function Divider() {
  return <div className="h-px bg-white/[0.05]" />;
}

function SectionLabel({ icon: Icon, label, color = "text-white/40" }: {
  icon: React.ElementType;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${color.replace('/40', '/60')}`}>{label}</span>
    </div>
  );
}

const TRANSITION_OPTIONS: { value: TransitionType; label: string; desc: string }[] = [
  { value: 'none', label: 'None', desc: 'No effect' },
  { value: 'fade', label: 'Fade', desc: 'Smooth fade in' },
  { value: 'slide', label: 'Slide', desc: 'Slide from side' },
];

export function RightPanel(props: RightPanelProps) {
  const displayHashtags = props.hashtags
    ? props.hashtags.split(/\s+/).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")
    : "#fyp #viral";

  return (
    <div className="w-[268px] border-l border-white/[0.06] bg-[#090909] overflow-y-auto shrink-0 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] sticky top-0 bg-[#090909] z-10">
        <h2 className="font-bold text-sm text-white">Settings</h2>
      </div>

      <div className="flex flex-col gap-5 p-4 pb-10">

        {/* ── Text Overlay ── */}
        <section className="space-y-3">
          <SectionLabel icon={Type} label="Text Overlay" color="text-primary/70" />

          <Input
            value={props.textOverlay.text}
            onChange={(e) => props.setTextOverlay({ ...props.textOverlay, text: e.target.value })}
            placeholder="Type text on video…"
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-sm h-9 placeholder:text-white/20"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-[9px] text-white/30 uppercase tracking-widest">Size</Label>
              <Select
                value={props.textOverlay.size}
                onValueChange={(val: "Small" | "Medium" | "Large") =>
                  props.setTextOverlay({ ...props.textOverlay, size: val })
                }
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] rounded-xl text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] text-white/30 uppercase tracking-widest">Color</Label>
              <div className="h-9 rounded-xl overflow-hidden border border-white/[0.08] p-0.5 bg-white/[0.04]">
                <input
                  type="color"
                  value={props.textOverlay.color}
                  onChange={(e) => props.setTextOverlay({ ...props.textOverlay, color: e.target.value })}
                  className="w-full h-full cursor-pointer bg-transparent border-0 rounded-lg"
                />
              </div>
            </div>
          </div>

          {props.textOverlay.text && (
            <div
              className="w-full rounded-xl px-3 py-2 text-center font-bold truncate border"
              style={{
                color: props.textOverlay.color,
                background: `${props.textOverlay.color}12`,
                borderColor: `${props.textOverlay.color}25`,
                fontSize:
                  props.textOverlay.size === "Small" ? "0.7rem"
                  : props.textOverlay.size === "Large" ? "1rem"
                  : "0.825rem",
              }}
            >
              {props.textOverlay.text}
            </div>
          )}
        </section>

        <Divider />

        {/* ── Transitions ── */}
        <section className="space-y-3">
          <SectionLabel icon={Layers} label="Transition" color="text-violet-400/70" />
          <div className="flex gap-1.5">
            {TRANSITION_OPTIONS.map((opt) => {
              const active = props.transition.type === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => props.setTransition({ ...props.transition, type: opt.value })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    active
                      ? "bg-accent/20 text-accent border-accent/30"
                      : "bg-white/[0.03] text-white/30 border-white/[0.07] hover:text-white hover:border-white/15"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {props.transition.type !== 'none' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/30 uppercase tracking-widest">Duration</span>
                <span className="text-[10px] text-white/40 font-mono">{props.transition.duration.toFixed(1)}s</span>
              </div>
              <Slider
                value={[props.transition.duration * 10]}
                onValueChange={(v) => props.setTransition({ ...props.transition, duration: v[0] / 10 })}
                min={1}
                max={20}
                step={1}
              />
            </div>
          )}
        </section>

        <Divider />

        {/* ── Caption + Hashtags ── */}
        <section className="space-y-3">
          <SectionLabel icon={AtSign} label="Caption" color="text-accent/70" />

          <Textarea
            value={props.captions}
            onChange={(e) => props.setCaptions(e.target.value)}
            placeholder="Write an engaging caption…"
            className="bg-white/[0.04] border-white/[0.08] rounded-xl resize-none h-[72px] text-xs placeholder:text-white/20"
          />

          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
            <Input
              value={props.hashtags}
              onChange={(e) => props.setHashtags(e.target.value)}
              placeholder="viral trending fyp"
              className="bg-white/[0.04] border-white/[0.08] rounded-xl text-xs pl-7 placeholder:text-white/20"
            />
          </div>

          {/* Mini TikTok post preview */}
          <div
            className="rounded-2xl overflow-hidden border border-white/[0.07] bg-black relative"
            style={{ aspectRatio: "9/16", maxHeight: 260 }}
          >
            {props.videoSrc ? (
              <video
                src={props.videoSrc}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-black flex items-center justify-center">
                <Play className="w-7 h-7 text-white/15" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-2.5 pointer-events-none">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <span className="text-[7px] font-black text-white">C</span>
                </div>
                <span className="text-[10px] font-bold text-white">@creator</span>
              </div>
              {props.captions && (
                <p className="text-[9px] text-white/85 leading-snug mb-1 line-clamp-2 pr-8">
                  {props.captions}
                </p>
              )}
              {props.hashtags && (
                <p className="text-[9px] font-bold text-primary leading-tight">
                  {displayHashtags.split(" ").slice(0, 4).join(" ")}
                </p>
              )}
            </div>

            <div className="absolute right-1.5 bottom-8 flex flex-col items-center gap-2.5 pointer-events-none">
              {[
                { icon: Heart, val: "1.2M" },
                { icon: MessageCircle, val: "4.8K" },
                { icon: Bookmark, val: "Save" },
                { icon: Share2, val: "Share" },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex flex-col items-center gap-0.5">
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[7px] text-white/70 font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── Audio Track ── */}
        <section className="space-y-3">
          <SectionLabel icon={Music2} label="Audio" color="text-blue-400/70" />
          {props.audioSrc ? (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Music2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs text-white/80 flex-1 truncate">{props.audioFileName}</span>
              <button onClick={props.removeAudio} className="text-white/25 hover:text-red-400 transition-colors shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={props.triggerAudioUpload}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.08] hover:border-blue-400/30 hover:bg-blue-400/5 text-white/25 hover:text-white transition-all text-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload audio file
            </button>
          )}
        </section>

        <Divider />

        {/* ── Volume ── */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <SectionLabel icon={Volume2} label="Volume" color="text-blue-400/70" />
            <span className="text-[10px] font-mono text-white/30">{props.volume[0]}%</span>
          </div>
          <Slider value={props.volume} onValueChange={props.setVolume} max={100} step={1} />
        </section>

        <Divider />

        {/* ── Brightness ── */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <SectionLabel icon={Sun} label="Brightness" color="text-yellow-400/70" />
            <span className="text-[10px] font-mono text-white/30">{props.brightness[0]}%</span>
          </div>
          <Slider value={props.brightness} onValueChange={props.setBrightness} max={200} step={1} />
        </section>

        <Divider />

        {/* ── Speed ── */}
        <section className="space-y-2.5">
          <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Playback Speed</span>
          <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] gap-0.5">
            {[0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => props.setPlaybackSpeed(speed)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  props.playbackSpeed === speed
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30"
                    : "text-white/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
