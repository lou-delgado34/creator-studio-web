import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Zap, RefreshCw, Copy, Check, Lightbulb, TrendingUp, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const VIRAL_HOOKS = [
  "Nobody talks about this… but it changed everything.",
  "I tried this for 30 days and I can't believe the results.",
  "Stop scrolling — you need to see this.",
  "POV: You found out about this too late.",
  "The one thing nobody tells you about [your niche].",
  "This went from 0 to 1M views in 48 hours. Here's why.",
  "I wish someone told me this sooner.",
  "You've been doing it wrong this whole time.",
  "Warning: this will completely change how you think.",
  "I tested this so you don't have to.",
  "The secret they don't want you to know.",
  "If you're not doing this yet, you're missing out.",
  "This 60-second trick saved me hours every week.",
  "Honest review after 6 months of daily use.",
  "Why is no one talking about this?",
  "The algorithm rewards THIS kind of content.",
  "Do this before you post your next video.",
  "I went viral twice doing exactly this.",
  "Unpopular opinion: most creators are doing it backwards.",
  "Here's what happened when I posted every day for a month.",
];

const CONTENT_IDEAS: { title: string; type: string; emoji: string; desc: string }[] = [
  { title: "Day in my life", type: "Lifestyle", emoji: "☀️", desc: "Follow your daily routine from morning to night" },
  { title: "Before & After reveal", type: "Transformation", emoji: "✨", desc: "Show a dramatic transformation in your niche" },
  { title: "Top 5 mistakes people make", type: "Educational", emoji: "📚", desc: "Call out common mistakes your audience makes" },
  { title: "Hot take video", type: "Opinion", emoji: "🔥", desc: "Share a controversial opinion in your niche" },
  { title: "React to viral content", type: "Entertainment", emoji: "😱", desc: "React and add your commentary to trending videos" },
  { title: "Behind the scenes", type: "Authentic", emoji: "🎬", desc: "Show your creative process and workspace" },
  { title: "This vs That comparison", type: "Comparison", emoji: "⚖️", desc: "Compare two popular options in your niche" },
  { title: "Q&A from your DMs", type: "Community", emoji: "💬", desc: "Answer real questions from your followers" },
  { title: "Story time: my biggest fail", type: "Personal", emoji: "💡", desc: "Share a relatable failure and what you learned" },
  { title: "Product/tool I can't live without", type: "Review", emoji: "📦", desc: "Honest review of your favorite tool or product" },
  { title: "Challenge response", type: "Trending", emoji: "⚡", desc: "Put your spin on a current viral challenge" },
  { title: "Month in review", type: "Recap", emoji: "📊", desc: "Transparent recap of your wins and losses" },
];

const CAPTION_STARTERS = [
  "okay so I wasn't going to post this but…",
  "wait until you see what happens at the end 👀",
  "this is the part nobody shows you.",
  "I've been doing this for [X] years and JUST figured this out.",
  "save this before it gets removed 🫣",
  "comments below if this helped you!",
  "the algorithm pushed this to you for a reason 🔥",
  "I promise this is worth 60 seconds of your time.",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white hover:bg-white/10 transition-all"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 280, damping: 22 },
  }),
};

export function AITools() {
  const { toast } = useToast();

  const [hooks, setHooks] = useState<string[]>([]);
  const [hooksLoading, setHooksLoading] = useState(false);

  const [ideas, setIdeas] = useState<typeof CONTENT_IDEAS>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  const [captions, setCaptions] = useState<string[]>([]);
  const [captionsLoading, setCaptionsLoading] = useState(false);

  const [niche, setNiche] = useState('');

  const generateHooks = () => {
    setHooksLoading(true);
    setHooks([]);
    setTimeout(() => {
      setHooks(shuffle(VIRAL_HOOKS).slice(0, 5));
      setHooksLoading(false);
    }, 1300);
  };

  const generateIdeas = () => {
    setIdeasLoading(true);
    setIdeas([]);
    setTimeout(() => {
      setIdeas(shuffle(CONTENT_IDEAS).slice(0, 5));
      setIdeasLoading(false);
    }, 1100);
  };

  const generateCaptions = () => {
    if (!niche.trim()) {
      toast({ title: "Add a niche first", description: "Type your niche or topic above to generate captions." });
      return;
    }
    setCaptionsLoading(true);
    setCaptions([]);
    setTimeout(() => {
      setCaptions(shuffle(CAPTION_STARTERS).slice(0, 4));
      setCaptionsLoading(false);
    }, 1000);
  };

  const applyHook = (hook: string) => {
    toast({ title: "Hook copied!", description: "Paste it into your caption or text overlay." });
    navigator.clipboard.writeText(hook).catch(() => {});
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-5 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/20">
              <Wand2 className="w-4.5 h-4.5 text-white" style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Creator Tools</h1>
              <p className="text-xs text-white/40">Generate hooks, ideas and captions for viral content</p>
            </div>
          </div>
        </motion.div>

        {/* Niche input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-card border border-card-border"
        >
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Your Niche / Topic</label>
          <div className="flex gap-2">
            <input
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="e.g. fitness, cooking, travel, finance, gaming…"
              className="flex-1 h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Hook Generator ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 22 }}
            className="rounded-2xl bg-card border border-card-border overflow-hidden"
          >
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">Hook Generator</h2>
                  <p className="text-[10px] text-white/30">Viral opening lines that stop the scroll</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={generateHooks}
                disabled={hooksLoading}
                className="h-8 px-3 rounded-xl bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 text-xs font-bold"
              >
                {hooksLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <><Sparkles className="w-3 h-3 mr-1" /> Generate</>
                )}
              </Button>
            </div>

            <div className="p-4 space-y-2 min-h-[200px]">
              {hooksLoading && (
                <div className="flex items-center justify-center h-32 text-white/20">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Generating viral hooks…</span>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {hooks.map((hook, i) => (
                  <motion.div
                    key={hook}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/25 hover:bg-primary/[0.04] transition-all group cursor-pointer"
                    onClick={() => applyHook(hook)}
                  >
                    <span className="text-[10px] font-black text-primary/50 pt-0.5 shrink-0 w-4">#{i + 1}</span>
                    <p className="flex-1 text-sm text-white/80 leading-snug">{hook}</p>
                    <CopyButton text={hook} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {!hooksLoading && hooks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Zap className="w-8 h-8 text-white/10 mb-2" />
                  <p className="text-xs text-white/25">Click Generate to get viral hook ideas</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Content Idea Generator ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
            className="rounded-2xl bg-card border border-card-border overflow-hidden"
          >
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-white">Idea Generator</h2>
                  <p className="text-[10px] text-white/30">Content formats proven to perform</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={generateIdeas}
                disabled={ideasLoading}
                className="h-8 px-3 rounded-xl bg-accent/15 text-accent border border-accent/25 hover:bg-accent/25 text-xs font-bold"
              >
                {ideasLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <><Sparkles className="w-3 h-3 mr-1" /> Generate</>
                )}
              </Button>
            </div>

            <div className="p-4 space-y-2 min-h-[200px]">
              {ideasLoading && (
                <div className="flex items-center justify-center h-32 text-white/20">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Generating content ideas…</span>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {ideas.map((idea, i) => (
                  <motion.div
                    key={idea.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/25 hover:bg-accent/[0.04] transition-all group"
                  >
                    <span className="text-lg shrink-0 mt-0.5">{idea.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white">{idea.title}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 font-bold uppercase tracking-wide shrink-0">
                          {idea.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-snug">{idea.desc}</p>
                    </div>
                    <CopyButton text={idea.title} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {!ideasLoading && ideas.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Lightbulb className="w-8 h-8 text-white/10 mb-2" />
                  <p className="text-xs text-white/25">Click Generate to get content ideas</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* ── Caption Starter Generator ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
          className="rounded-2xl bg-card border border-card-border overflow-hidden"
        >
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">Caption Starters</h2>
                <p className="text-[10px] text-white/30">Opening lines that drive engagement and saves</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={generateCaptions}
              disabled={captionsLoading}
              className="h-8 px-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 text-xs font-bold"
            >
              {captionsLoading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <><Sparkles className="w-3 h-3 mr-1" /> Generate</>
              )}
            </Button>
          </div>
          <div className="p-4">
            {captionsLoading && (
              <div className="flex items-center justify-center h-20 text-white/20">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-xs">Generating…</span>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-2">
              <AnimatePresence>
                {captions.map((cap, i) => (
                  <motion.div
                    key={cap}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/25 transition-all"
                  >
                    <p className="flex-1 text-sm text-white/80 leading-snug italic">"{cap}"</p>
                    <CopyButton text={cap} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {!captionsLoading && captions.length === 0 && (
                <div className="col-span-2 flex items-center justify-center h-20 text-xs text-white/20">
                  Add your niche above and click Generate
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pro tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-primary/8 to-accent/8 border border-white/[0.06] flex items-start gap-3"
        >
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="text-white/70 font-semibold">Pro tip:</span> The best-performing videos combine a strong hook (first 1–3 seconds),
            a clear value promise (what the viewer gets), and a call-to-action at the end. Use these tools to build that formula fast.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
