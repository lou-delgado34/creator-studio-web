import { NavItem } from "@/hooks/use-creator-store";
import {
  Home, Film, Type, Music, Sparkles, LayoutGrid,
  MessageSquare, Send, Wand2, CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface SidebarProps {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
}

const NAV_ITEMS: { label: NavItem; icon: React.ElementType; section?: string }[] = [
  { label: 'Dashboard', icon: Home, section: 'Overview' },
  { label: 'Media', icon: Film, section: 'Editor' },
  { label: 'Text', icon: Type },
  { label: 'Audio', icon: Music },
  { label: 'Effects', icon: Sparkles },
  { label: 'Templates', icon: LayoutGrid },
  { label: 'Captions', icon: MessageSquare },
  { label: 'AI Tools', icon: Wand2, section: 'Creator' },
  { label: 'Planner', icon: CalendarDays },
  { label: 'Post Setup', icon: Send },
];

export function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  let lastSection = '';

  return (
    <div className="w-[80px] md:w-[210px] h-[calc(100vh-56px)] border-r border-white/[0.05] bg-[#080808] flex flex-col py-4 shrink-0 overflow-y-auto">
      <nav className="flex-1 flex flex-col gap-0.5 px-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.label}>
              {showSection && (
                <div className="px-3 pt-4 pb-1.5 hidden md:block">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">
                    {item.section}
                  </span>
                </div>
              )}
              <button
                onClick={() => setActiveNav(item.label)}
                className={clsx(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full text-left",
                  isActive
                    ? "text-white font-medium"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className={clsx(
                    "w-4.5 h-4.5 relative z-10 transition-colors shrink-0",
                    isActive ? "text-primary" : "text-white/30 group-hover:text-white/70"
                  )}
                  style={{ width: '1.1rem', height: '1.1rem' }}
                />
                <span className="relative z-10 hidden md:block text-[13px] font-medium">
                  {item.label}
                </span>
                {item.label === 'AI Tools' && (
                  <span className="relative z-10 hidden md:block ml-auto text-[8px] font-black px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/20 uppercase tracking-wide">
                    AI
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="px-3 pt-4 border-t border-white/[0.05] hidden md:block">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-white">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">@creator</p>
            <p className="text-[10px] text-white/30 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
