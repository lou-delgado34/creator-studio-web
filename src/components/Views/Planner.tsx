import { useState } from "react";
import { PlannerEvent } from "@/hooks/use-creator-store";
import { CalendarDays, Plus, Trash2, X, TrendingUp, Instagram, Youtube, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PlannerProps {
  plannerEvents: PlannerEvent[];
  addPlannerEvent: (e: Omit<PlannerEvent, 'id'>) => void;
  removePlannerEvent: (id: string) => void;
}

const PLATFORM_CONFIG = {
  TikTok: { color: '#ff2d55', icon: Smartphone },
  Instagram: { color: '#e879f9', icon: Instagram },
  YouTube: { color: '#ff4444', icon: Youtube },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function Planner({ plannerEvents, addPlannerEvent, removePlannerEvent }: PlannerProps) {
  const { toast } = useToast();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<PlannerEvent['platform']>('TikTok');
  const [newStatus, setNewStatus] = useState<PlannerEvent['status']>('scheduled');

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const eventsForDay = (day: number) =>
    plannerEvents.filter(e => e.day === day);

  const eventsForSelected = selectedDay ? eventsForDay(selectedDay) : [];

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleAddEvent = () => {
    if (!newTitle.trim() || !selectedDay) return;
    addPlannerEvent({ title: newTitle, day: selectedDay, platform: newPlatform, status: newStatus });
    setNewTitle('');
    setShowAddForm(false);
    toast({ title: "Event Added", description: `${newTitle} scheduled for ${MONTHS[viewMonth]} ${selectedDay}` });
  };

  const platformStats = (['TikTok', 'Instagram', 'YouTube'] as const).map(p => ({
    platform: p,
    count: plannerEvents.filter(e => e.platform === p).length,
    ...PLATFORM_CONFIG[p],
  }));

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Calendar ── */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                <CalendarDays className="w-4.5 h-4.5 text-accent" style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Content Planner</h1>
                <p className="text-xs text-white/30">{plannerEvents.length} posts scheduled this month</p>
              </div>
            </motion.div>

            {/* Platform summary */}
            <div className="grid grid-cols-3 gap-3">
              {platformStats.map(({ platform, count, color, icon: Icon }) => (
                <div key={platform} className="p-3.5 rounded-2xl border border-white/[0.07] bg-card flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon className="w-4 h-4" style={{ color, width: '1rem', height: '1rem' }} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{count}</p>
                    <p className="text-[10px] text-white/30">{platform}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar card */}
            <div className="rounded-2xl border border-white/[0.07] bg-card overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg font-bold"
                >
                  ‹
                </button>
                <h2 className="font-bold text-white">{MONTHS[viewMonth]} {viewYear}</h2>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg font-bold"
                >
                  ›
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 border-b border-white/[0.05]">
                {DAYS.map(d => (
                  <div key={d} className="py-2 text-center text-[10px] font-bold text-white/25 uppercase tracking-wide">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16 border-b border-r border-white/[0.04]" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dayEvents = eventsForDay(day);
                  const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`h-16 border-b border-r border-white/[0.04] p-1.5 cursor-pointer transition-all ${
                        isSelected ? 'bg-accent/10' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-bold inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          isToday
                            ? 'bg-primary text-white'
                            : isSelected
                            ? 'text-accent'
                            : 'text-white/40'
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 2).map(ev => {
                          const cfg = PLATFORM_CONFIG[ev.platform];
                          return (
                            <div
                              key={ev.id}
                              className="w-full px-1 py-0.5 rounded text-[8px] font-bold truncate leading-tight"
                              style={{ background: `${cfg.color}20`, color: cfg.color }}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[8px] text-white/25 pl-1">+{dayEvents.length - 2}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Day Detail / Event List ── */}
        <div className="w-[300px] shrink-0 border-l border-white/[0.06] bg-[#090909] flex flex-col">
          <div className="px-4 py-4 border-b border-white/[0.06]">
            <h3 className="font-bold text-sm text-white">
              {selectedDay
                ? `${MONTHS[viewMonth]} ${selectedDay}`
                : 'Select a day'}
            </h3>
            <p className="text-[10px] text-white/30 mt-0.5">
              {selectedDay
                ? `${eventsForSelected.length} post${eventsForSelected.length !== 1 ? 's' : ''} scheduled`
                : 'Click a day to view posts'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {eventsForSelected.map(ev => {
                const cfg = PLATFORM_CONFIG[ev.platform];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="p-3 rounded-xl border group relative"
                    style={{ background: `${cfg.color}08`, borderColor: `${cfg.color}25` }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${cfg.color}20` }}>
                        <Icon className="w-3 h-3" style={{ color: cfg.color, width: '0.75rem', height: '0.75rem' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{ev.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
                            {ev.platform}
                          </span>
                          <span className="text-[9px] text-white/25">·</span>
                          <span className={`text-[9px] font-semibold uppercase tracking-wide ${
                            ev.status === 'published' ? 'text-emerald-400'
                            : ev.status === 'scheduled' ? 'text-sky-400'
                            : 'text-white/30'
                          }`}>
                            {ev.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removePlannerEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {selectedDay && eventsForSelected.length === 0 && !showAddForm && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarDays className="w-8 h-8 text-white/10 mb-2" />
                <p className="text-xs text-white/20">No posts scheduled</p>
              </div>
            )}
          </div>

          {/* Add event form */}
          <div className="p-4 border-t border-white/[0.06] space-y-3">
            {showAddForm && selectedDay ? (
              <div className="space-y-2">
                <Input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Post title…"
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-xs h-9"
                  onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
                  autoFocus
                />
                <div className="flex gap-1.5">
                  {(['TikTok', 'Instagram', 'YouTube'] as const).map(p => {
                    const cfg = PLATFORM_CONFIG[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setNewPlatform(p)}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide transition-all border"
                        style={newPlatform === p
                          ? { background: `${cfg.color}20`, color: cfg.color, borderColor: `${cfg.color}35` }
                          : { background: 'transparent', color: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.07)' }
                        }
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 h-8 rounded-xl border border-white/10 text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="flex-1 h-8 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!selectedDay) {
                    toast({ title: "Select a day first", description: "Click a day on the calendar to add a post." });
                    return;
                  }
                  setShowAddForm(true);
                }}
                className="w-full h-9 rounded-xl border border-dashed border-white/10 hover:border-accent/30 hover:bg-accent/5 text-white/30 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Post
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
