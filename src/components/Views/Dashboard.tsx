import { useState } from "react";
import { PlayCircle, TrendingUp, Users, Heart, Eye, CalendarClock, Zap, Trash2, Plus, BarChart2, ArrowRight, FilmIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES, Template, Draft } from "@/hooks/use-creator-store";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  applyTemplate: (t: Template) => void;
  setActiveNav: (nav: any) => void;
  activeTemplateId: string | null;
  drafts: Draft[];
  deleteDraft: (id: string) => void;
  loadDraft: (d: Draft) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

const ANALYTICS = [
  { label: 'Total Views', value: '1.24M', change: '+12.4%', up: true, icon: Eye, color: 'text-sky-400', bg: 'bg-sky-400/10', sparkline: [40, 55, 48, 72, 65, 88, 95] },
  { label: 'Followers', value: '84.2K', change: '+4.1%', up: true, icon: Users, color: 'text-violet-400', bg: 'bg-violet-400/10', sparkline: [30, 35, 38, 44, 50, 58, 65] },
  { label: 'Likes', value: '320K', change: '+8.4%', up: true, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10', sparkline: [60, 72, 55, 80, 75, 90, 100] },
  { label: 'Est. Revenue', value: '$4,250', change: '+24%', up: true, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', sparkline: [20, 30, 45, 35, 55, 65, 80] },
];

const ENGAGEMENT_STATS = [
  { label: 'Avg. Watch Time', value: '18.3s', sub: 'per view' },
  { label: 'Completion Rate', value: '64%', sub: 'finished video' },
  { label: 'Share Rate', value: '8.2%', sub: 'of viewers' },
  { label: 'Save Rate', value: '12.1%', sub: 'of viewers' },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56, h = 22;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color.replace('text-', '').replace('sky-400', '#38bdf8').replace('violet-400', '#a78bfa').replace('pink-400', '#f472b6').replace('emerald-400', '#34d399')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const COLOR_MAP: Record<string, string> = {
  'text-sky-400': '#38bdf8',
  'text-violet-400': '#a78bfa',
  'text-pink-400': '#f472b6',
  'text-emerald-400': '#34d399',
};

export function Dashboard({ applyTemplate, setActiveNav, activeTemplateId, drafts, deleteDraft, loadDraft }: DashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'drafts'>('overview');

  const handleApplyTemplate = (t: Template) => {
    applyTemplate(t);
    setActiveNav('Media');
    toast({ title: `${t.emoji} Template Applied`, description: `"${t.name}" — text, caption and hashtags updated.` });
  };

  const handleLoadDraft = (d: Draft) => {
    loadDraft(d);
    setActiveNav('Media');
    toast({ title: "Draft Loaded", description: `"${d.title}" is ready to edit.` });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-5 md:p-7">
      <div className="max-w-6xl mx-auto space-y-7">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white mb-0.5">Creator Dashboard</h1>
          <p className="text-sm text-white/30">March 2026 · Your content performance at a glance</p>
        </motion.div>

        {/* Analytics cards */}
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {ANALYTICS.map((stat, i) => {
            const Icon = stat.icon;
            const hex = COLOR_MAP[stat.color] || '#fff';
            return (
              <motion.div
                key={i} variants={item}
                className="bg-card p-4 rounded-2xl border border-card-border hover:border-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <Sparkline data={stat.sparkline} color={stat.color} />
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">{stat.value}</h3>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-white/35">{stat.label}</p>
                  <span className="text-[10px] font-bold text-emerald-400">{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Engagement bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl border border-card-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-accent" />
            <h2 className="font-bold text-sm text-white">Engagement Breakdown</h2>
            <span className="ml-auto text-[10px] text-white/25">Last 30 days</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ENGAGEMENT_STATS.map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs font-semibold text-white/50">{s.label}</p>
                <p className="text-[10px] text-white/25">{s.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs: Overview / Drafts */}
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
          {(['overview', 'drafts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {tab === 'drafts' ? `Drafts (${drafts.length})` : 'Overview'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-7"
            >
              <div className="lg:col-span-2 space-y-7">

                {/* Templates */}
                <motion.section variants={item}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-white">Templates</h2>
                    <span className="text-[10px] text-white/25 bg-white/5 px-2 py-1 rounded-lg border border-white/[0.07]">Click to apply</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {TEMPLATES.map(t => {
                      const isActive = activeTemplateId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleApplyTemplate(t)}
                          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                            isActive
                              ? 'ring-2 ring-offset-1 ring-offset-background scale-[1.04]'
                              : 'ring-1 ring-white/[0.08] hover:ring-white/25 hover:scale-[1.02]'
                          }`}
                          style={isActive ? { '--tw-ring-color': t.accentColor } as any : undefined}
                        >
                          <div
                            className="aspect-[9/16] flex flex-col items-center justify-center gap-1.5 p-2 relative"
                            style={{ background: `linear-gradient(135deg, ${t.accentColor}28, #080808)` }}
                          >
                            <span className="text-xl">{t.emoji}</span>
                            <span className="text-[9px] font-bold text-center leading-tight" style={{ color: t.accentColor }}>{t.name}</span>
                            {isActive && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: t.accentColor }}>
                                <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur px-2 py-1 rounded-full">Apply</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.section>

                {/* Workflow CTA */}
                <motion.section variants={item}>
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/8 to-transparent border border-white/[0.08] flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                      <FilmIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm mb-0.5">Start Creating</h3>
                      <p className="text-xs text-white/40">Upload a video, pick a template, add captions and export in minutes.</p>
                    </div>
                    <button
                      onClick={() => setActiveNav('Media')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all shrink-0"
                    >
                      Open Editor <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.section>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Scheduled */}
                <motion.section variants={item}>
                  <div className="bg-card rounded-2xl border border-card-border p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarClock className="w-4 h-4 text-accent" />
                      <h2 className="font-bold text-sm text-white">Upcoming Posts</h2>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { title: 'Workout Routine #4', date: 'Today · 5:00 PM', platform: 'TikTok', color: '#ff2d55' },
                        { title: 'Weekly Recap', date: 'Tomorrow · 10 AM', platform: 'Instagram', color: '#e879f9' },
                        { title: 'Tutorial Part 2', date: 'Mar 22 · 3 PM', platform: 'YouTube', color: '#ff4444' },
                      ].map((post, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-colors">
                          <div className="w-1.5 h-1.5 mt-1.5 rounded-full shrink-0" style={{ background: post.color }} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{post.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] text-white/30">{post.date}</span>
                              <span className="text-white/20">·</span>
                              <span className="text-[9px] font-bold" style={{ color: post.color }}>{post.platform}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setActiveNav('Planner')}
                        className="w-full text-center text-[10px] text-accent/60 hover:text-accent font-semibold mt-1 transition-colors"
                      >
                        View full calendar →
                      </button>
                    </div>
                  </div>
                </motion.section>

                {/* AI Tools CTA */}
                <motion.section variants={item}>
                  <div className="bg-gradient-to-br from-accent/12 to-primary/8 rounded-2xl border border-accent/20 p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/15 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Zap className="w-4 h-4 text-accent" />
                      <h2 className="font-bold text-sm text-white">AI Tools</h2>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/25 font-black uppercase tracking-wide">New</span>
                    </div>
                    <p className="text-xs text-white/40 mb-4 relative z-10">Generate viral hooks, content ideas, and caption starters in seconds.</p>
                    <button
                      onClick={() => setActiveNav('AI Tools')}
                      className="relative z-10 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent/20 hover:bg-accent/30 border border-accent/25 text-xs font-bold text-accent transition-all"
                    >
                      Open AI Tools <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.section>
              </div>
            </motion.div>
          ) : (
            /* Drafts tab */
            <motion.div
              key="drafts"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              {drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FilmIcon className="w-12 h-12 text-white/10 mb-3" />
                  <h3 className="font-bold text-white/30 mb-1">No Drafts Yet</h3>
                  <p className="text-sm text-white/20 max-w-[260px]">Save your project from the editor to see it here.</p>
                  <button
                    onClick={() => setActiveNav('Media')}
                    className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Open Editor
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {drafts.map((draft, i) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative rounded-2xl border border-white/[0.07] bg-card overflow-hidden hover:border-white/15 transition-all cursor-pointer"
                        onClick={() => handleLoadDraft(draft)}
                      >
                        {/* Gradient header */}
                        <div
                          className="h-28 flex items-center justify-center relative"
                          style={{ background: `linear-gradient(135deg, ${draft.accentColor}25, #0a0a0a)` }}
                        >
                          <FilmIcon className="w-8 h-8 text-white/10" />
                          {/* Load overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                              Load Draft
                            </span>
                          </div>
                          {/* Delete btn */}
                          <button
                            onClick={e => { e.stopPropagation(); deleteDraft(draft.id); toast({ title: "Draft deleted" }); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="p-3.5">
                          <h3 className="font-bold text-sm text-white truncate mb-0.5">{draft.title}</h3>
                          <p className="text-[10px] text-white/30 mb-2">{draft.savedAt}</p>
                          {draft.captions && (
                            <p className="text-[11px] text-white/40 line-clamp-2 leading-snug">{draft.captions}</p>
                          )}
                          {draft.hashtags && (
                            <p className="text-[10px] text-primary/60 font-semibold mt-1.5 truncate">
                              {draft.hashtags.split(/\s+/).slice(0, 3).map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* New draft card */}
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: drafts.length * 0.05 }}
                    className="rounded-2xl border border-dashed border-white/10 hover:border-white/20 flex items-center justify-center cursor-pointer h-[200px] transition-all hover:bg-white/[0.02]"
                    onClick={() => setActiveNav('Media')}
                  >
                    <div className="flex flex-col items-center gap-2 text-white/25 hover:text-white/50 transition-colors">
                      <Plus className="w-7 h-7" />
                      <span className="text-xs font-semibold">New Project</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
