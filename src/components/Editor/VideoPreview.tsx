import { Button } from "@/components/ui/button";
import {
  Upload, Play, Pause, Scissors, Zap, Type, Crop,
  RotateCcw, Sparkles, X, SkipBack, SkipForward, Mic, MicOff,
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { TextOverlay, Transition } from "@/hooks/use-creator-store";
import { useToast } from "@/hooks/use-toast";

interface VideoPreviewProps {
  videoSrc: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioSrc: string | null;
  textOverlay: TextOverlay;
  brightness: number[];
  volume: number[];
  playbackSpeed: number;
  captions: string;
  transition: Transition;
  setVideoDuration: (d: number) => void;
  triggerUpload: () => void;
  removeVideo: () => void;
}

function formatTime(secs: number) {
  if (!isFinite(secs) || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const QUICK_ACTIONS = [
  { icon: Scissors, label: "Split" },
  { icon: Zap, label: "Speed" },
  { icon: Sparkles, label: "Filters" },
  { icon: Type, label: "Text" },
  { icon: Crop, label: "Crop" },
  { icon: RotateCcw, label: "Rotate" },
];

// Get current caption chunk synced to video time
function getSyncedCaption(captions: string, currentTime: number, duration: number): string {
  if (!captions || !duration) return "";
  const words = captions.trim().split(/\s+/);
  const chunkSize = 5;
  const numChunks = Math.ceil(words.length / chunkSize);
  const chunkDuration = duration / numChunks;
  const idx = Math.min(Math.floor(currentTime / chunkDuration), numChunks - 1);
  return words.slice(idx * chunkSize, idx * chunkSize + chunkSize).join(" ");
}

export function VideoPreview({
  videoSrc,
  videoRef,
  audioRef,
  audioSrc,
  textOverlay,
  brightness,
  volume,
  playbackSpeed,
  captions,
  transition,
  setVideoDuration,
  triggerUpload,
  removeVideo,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transitionClass, setTransitionClass] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const { toast } = useToast();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const syncedCaption = getSyncedCaption(captions, currentTime, duration);

  useEffect(() => {
    const vol = volume[0] / 100;
    if (videoRef.current) videoRef.current.volume = Math.min(vol, 1);
    if (audioRef.current) audioRef.current.volume = Math.min(vol, 1);
  }, [volume, videoRef, audioRef]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed, videoRef, audioRef]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLiveTranscript("");
    if (isListening) stopListening();
  }, [videoSrc]);

  // Apply transition animation when video starts playing
  const triggerTransition = useCallback(() => {
    if (transition.type === "none") return;
    setIsTransitioning(true);
    if (transition.type === "fade") setTransitionClass("animate-fade-in");
    if (transition.type === "slide") setTransitionClass("animate-slide-in");
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionClass("");
    }, transition.duration * 1000);
  }, [transition]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    const aud = audioRef.current;
    if (!vid || !videoSrc) return;

    if (isPlaying) {
      vid.pause();
      aud?.pause();
      setIsPlaying(false);
    } else {
      triggerTransition();
      vid.play();
      if (aud && audioSrc) {
        aud.currentTime = vid.currentTime;
        aud.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  }, [isPlaying, videoSrc, audioSrc, videoRef, audioRef, triggerTransition]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (
        audioRef.current &&
        audioSrc &&
        Math.abs(audioRef.current.currentTime - videoRef.current.currentTime) > 0.3
      ) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  }, [videoRef, audioRef, audioSrc]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const d = videoRef.current.duration;
      setDuration(d);
      setVideoDuration(d);
    }
  }, [videoRef, setVideoDuration]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  }, [audioRef]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const seekTo = Math.max(0, Math.min(pct * duration, duration));
      if (videoRef.current) videoRef.current.currentTime = seekTo;
      if (audioRef.current && audioSrc) audioRef.current.currentTime = seekTo;
      setCurrentTime(seekTo);
    },
    [duration, videoRef, audioRef, audioSrc]
  );

  const skipSeconds = useCallback(
    (secs: number) => {
      const vid = videoRef.current;
      if (!vid) return;
      const next = Math.max(0, Math.min(vid.currentTime + secs, duration));
      vid.currentTime = next;
      if (audioRef.current && audioSrc) audioRef.current.currentTime = next;
      setCurrentTime(next);
    },
    [videoRef, audioRef, duration, audioSrc]
  );

  // ── Speech Recognition ──
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support speech recognition. Try Chrome.",
      });
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + " ";
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      setLiveTranscript(interim);
      if (final) setLiveTranscript(final.trim());
    };

    recognition.onerror = () => {
      stopListening();
      toast({ title: "Recognition stopped", description: "Speech input ended." });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast({ title: "Listening…", description: "Speak clearly into your microphone." });
  }, [isListening, stopListening, toast]);

  const textFontSize =
    textOverlay.size === "Small"
      ? "clamp(0.8rem, 2vw, 1.05rem)"
      : textOverlay.size === "Large"
      ? "clamp(1.3rem, 4vw, 2.6rem)"
      : "clamp(0.95rem, 3vw, 1.75rem)";

  const shownSubtitle = liveTranscript || (isPlaying ? syncedCaption : (captions ? captions.split(/\s+/).slice(0, 5).join(" ") + (captions.split(/\s+/).length > 5 ? "…" : "") : ""));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#080808] min-w-0">
      {/* ── Video Canvas ── */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/[0.07] flex items-center justify-center"
          style={{
            aspectRatio: "9/16",
            maxHeight: "calc(100vh - 250px)",
            maxWidth: "100%",
          }}
        >
          {videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className={`w-full h-full object-contain ${transitionClass}`}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                style={{ filter: `brightness(${brightness[0]}%)` }}
                playsInline
              />

              {/* ── Text Overlay / Subtitle ── */}
              {textOverlay.text && (
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-3 pointer-events-none">
                  <span
                    className="rounded-lg px-3 py-1.5"
                    style={{
                      color: textOverlay.color,
                      fontSize: textFontSize,
                      fontWeight: 800,
                      textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                      background: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(4px)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                      maxWidth: "90%",
                      display: "inline-block",
                      border: `1px solid ${textOverlay.color}20`,
                    }}
                  >
                    {textOverlay.text}
                  </span>
                </div>
              )}

              {/* ── Synced Captions / Live Transcript ── */}
              {!textOverlay.text && shownSubtitle && (
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
                  <span
                    className="rounded-lg px-3 py-1.5 text-white"
                    style={{
                      fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
                      fontWeight: 700,
                      background: isListening ? "rgba(255,45,85,0.7)" : "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(4px)",
                      textAlign: "center",
                      maxWidth: "92%",
                      display: "inline-block",
                      lineHeight: 1.3,
                      border: isListening ? "1px solid rgba(255,45,85,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {isListening && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse align-middle" />}
                    {shownSubtitle}
                  </span>
                </div>
              )}

              {/* Transition type badge */}
              {transition.type !== "none" && (
                <div className="absolute top-3 left-3 z-30 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-[9px] font-bold text-white/60 uppercase tracking-widest">
                  ⟳ {transition.type}
                </div>
              )}

              {/* Remove */}
              <button
                onClick={removeVideo}
                className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600/80 flex items-center justify-center text-white transition-all border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">No Video Uploaded</h3>
              <p className="text-xs text-muted-foreground mb-5 max-w-[160px] leading-relaxed">
                Upload a vertical 9:16 video to start editing
              </p>
              <Button
                onClick={triggerUpload}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 px-6"
              >
                Select Video
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Playback Controls ── */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#0b0b0b] px-4 sm:px-5 pt-2.5 pb-2 space-y-2">
        {/* Progress bar */}
        <div
          className="w-full h-1.5 bg-white/[0.08] rounded-full cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        {/* Transport */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipSeconds(-5)}
            disabled={!videoSrc}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors disabled:opacity-20"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!videoSrc}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 ${
              videoSrc
                ? "bg-gradient-to-br from-primary to-accent hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                : "bg-white/10"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(5)}
            disabled={!videoSrc}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-colors disabled:opacity-20"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs text-white/30 font-mono ml-1">{formatTime(currentTime)}</span>
          <div className="flex-1" />

          {/* Auto-caption / mic button */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              isListening
                ? "bg-primary/20 text-primary border-primary/30 animate-pulse"
                : "text-white/30 border-white/10 hover:text-white hover:border-white/20"
            }`}
            title="Auto-caption via microphone"
          >
            {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            <span>{isListening ? "Stop" : "Caption"}</span>
          </button>

          <span className="text-xs text-white/30 font-mono">{formatTime(duration)}</span>
        </div>

        {/* Quick tools */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1 pb-0.5">
          {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => toast({ title: label, description: `${label} tool activated.` })}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-white/5 text-white/25 hover:text-white transition-all min-w-[44px]"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
