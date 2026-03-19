import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Heart, MessageCircle, Bookmark, Share2, Music2,
  Calendar, Send, Play, Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostSetupProps {
  captions: string;
  setCaptions: (v: string) => void;
  hashtags: string;
  setHashtags: (v: string) => void;
  videoSrc: string | null;
}

export function PostSetup({ captions, setCaptions, hashtags, setHashtags, videoSrc }: PostSetupProps) {
  const { toast } = useToast();

  const displayHashtags = hashtags
    ? hashtags.split(/\s+/).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")
    : "#fyp #viral";

  return (
    <div className="flex-1 flex overflow-hidden bg-background">

      {/* ── Left: Form ── */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 border-r border-white/[0.06]">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Finalize Your Post</h1>
            <p className="text-sm text-muted-foreground">
              Add metadata, hashtags, and schedule your content.
            </p>
          </div>

          {/* Content card */}
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Caption</Label>
              <Textarea
                value={captions}
                onChange={(e) => setCaptions(e.target.value)}
                placeholder="Write an engaging caption that stops the scroll…"
                className="min-h-[110px] bg-background border-white/10 focus-visible:ring-primary rounded-xl text-sm resize-none placeholder:text-white/25"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Hashtags</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="trending viral fyp"
                  className="bg-background border-white/10 focus-visible:ring-primary rounded-xl pl-8 placeholder:text-white/25"
                />
              </div>
              {hashtags && (
                <p className="text-xs text-primary/80 font-medium px-1">{displayHashtags}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/50 uppercase tracking-widest font-semibold">Cover Title</Label>
              <Input
                placeholder="Text overlay on thumbnail"
                className="bg-background border-white/10 focus-visible:ring-primary rounded-xl placeholder:text-white/25"
              />
            </div>
          </div>

          {/* Schedule card */}
          <div className="rounded-2xl border border-white/[0.08] bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-sm text-white">Schedule</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/50">Date</Label>
                <Input type="date" className="bg-background border-white/10 rounded-xl text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/50">Time</Label>
                <Input type="time" className="bg-background border-white/10 rounded-xl text-sm" />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-white/10 hover:bg-white/5 text-sm font-semibold"
                onClick={() => toast({ title: "Post Scheduled", description: "Your video will be published at the selected time." })}
              >
                Schedule
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 font-semibold shadow-lg shadow-primary/20 text-sm"
                onClick={() => toast({ title: "Publishing…", description: "Your video is being uploaded to your channels." })}
              >
                <Send className="w-4 h-4 mr-1.5" />
                Publish Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: TikTok Phone Preview ── */}
      <div className="w-[420px] shrink-0 bg-[#090909] hidden lg:flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold">Live Preview</p>

          {/* Phone frame */}
          <div
            className="relative bg-black rounded-[42px] overflow-hidden shadow-2xl"
            style={{
              width: 260,
              height: 520,
              border: "6px solid #1a1a1a",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Dynamic island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[88px] h-[26px] bg-black rounded-full z-50 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] border border-white/10" />
            </div>

            {/* Video / placeholder background */}
            {videoSrc ? (
              <video
                src={videoSrc}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
                loop
                autoPlay
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-accent/15 to-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-white/20">
                  <Play className="w-10 h-10" />
                  <span className="text-xs">Upload a video</span>
                </div>
              </div>
            )}

            {/* TikTok overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

            {/* Top bar */}
            <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex gap-4 text-white/80">
                <span className="text-xs font-medium opacity-60">Following</span>
                <span className="text-xs font-bold border-b border-white">For You</span>
              </div>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
              {/* Creator info */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 border border-white/20">
                  <span className="text-[10px] font-bold text-white">C</span>
                </div>
                <span className="text-xs font-bold text-white drop-shadow">@creator</span>
                <div className="ml-auto px-2 py-0.5 rounded border border-white/40 text-[9px] text-white font-semibold">
                  Follow
                </div>
              </div>

              {/* Caption */}
              <p className="text-[11px] text-white/90 leading-snug mb-1 line-clamp-2 drop-shadow-md pr-8">
                {captions || "Your caption will appear here…"}
              </p>

              {/* Hashtags */}
              <p className="text-[11px] font-bold text-primary drop-shadow-md mb-2">
                {displayHashtags.split(" ").slice(0, 5).join(" ")}
              </p>

              {/* Audio ticker */}
              <div className="flex items-center gap-1.5 text-white/70">
                <Music2 className="w-2.5 h-2.5 shrink-0" />
                <span className="text-[9px] truncate">Original Audio · @creator</span>
              </div>
            </div>

            {/* Right actions */}
            <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3 pointer-events-none">
              {[
                { icon: Heart, val: "1.2M" },
                { icon: MessageCircle, val: "4.8K" },
                { icon: Bookmark, val: "Save" },
                { icon: Share2, val: "Share" },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[8px] text-white/80 font-semibold">{val}</span>
                </div>
              ))}
              {/* Spinning disc */}
              <div
                className="w-9 h-9 rounded-full bg-black border-2 border-white/20 overflow-hidden mt-1"
                style={{ animation: "spin 4s linear infinite" }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent" />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/20 text-center max-w-[200px]">
            Caption and hashtags update live as you type
          </p>
        </div>
      </div>
    </div>
  );
}
