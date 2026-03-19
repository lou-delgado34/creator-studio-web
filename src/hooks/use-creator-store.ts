import { useState, useRef, useCallback } from 'react';

export type NavItem =
  | 'Dashboard' | 'Media' | 'Text' | 'Audio' | 'Effects'
  | 'Templates' | 'Captions' | 'Post Setup' | 'AI Tools' | 'Planner';

export type TransitionType = 'none' | 'fade' | 'slide';
export type ExportPreset = 'tiktok' | 'reels' | 'shorts';

export interface TextOverlay {
  text: string;
  size: 'Small' | 'Medium' | 'Large';
  color: string;
}

export interface Transition {
  type: TransitionType;
  duration: number;
}

export interface Template {
  id: string;
  name: string;
  emoji: string;
  textOverlay: TextOverlay;
  captions: string;
  hashtags: string;
  accentColor: string;
}

export interface Draft {
  id: string;
  title: string;
  savedAt: string;
  captions: string;
  hashtags: string;
  templateId: string | null;
  accentColor: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  day: number;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  status: 'scheduled' | 'published' | 'draft';
}

export const TEMPLATES: Template[] = [
  {
    id: 'viral',
    name: 'Viral Hook',
    emoji: '🔥',
    textOverlay: { text: 'Watch till the end 🔥', size: 'Large', color: '#ff2d55' },
    captions: "You won't believe what happens next! This completely changed my perspective.",
    hashtags: '#viral #fyp #trending #shocking #mustwatch',
    accentColor: '#ff2d55',
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic',
    emoji: '✨',
    textOverlay: { text: 'living my best life ✨', size: 'Medium', color: '#e879f9' },
    captions: 'Slow mornings, good energy. This is the vibe.',
    hashtags: '#aesthetic #vibes #mood #dreamy #softlife',
    accentColor: '#e879f9',
  },
  {
    id: 'tutorial',
    name: 'Tutorial',
    emoji: '📚',
    textOverlay: { text: 'Step-by-step guide', size: 'Medium', color: '#38bdf8' },
    captions: "Here's everything you need to know — follow along and try it yourself.",
    hashtags: '#tutorial #howto #tips #guide #learnontiktok',
    accentColor: '#38bdf8',
  },
  {
    id: 'motivation',
    name: 'Motivation',
    emoji: '💪',
    textOverlay: { text: "Don't give up.", size: 'Large', color: '#facc15' },
    captions: 'The journey is hard. But you are harder. Keep going.',
    hashtags: '#motivation #mindset #grind #inspired #fyp',
    accentColor: '#facc15',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    emoji: '😂',
    textOverlay: { text: 'POV: it happened again 😂', size: 'Medium', color: '#4ade80' },
    captions: "Why does this always happen to me? Tell me I'm not alone.",
    hashtags: '#funny #comedy #relatable #pov #fyp',
    accentColor: '#4ade80',
  },
];

const SEED_DRAFTS: Draft[] = [
  {
    id: 'd1',
    title: 'Morning Routine Reel',
    savedAt: '2 hrs ago',
    captions: 'My morning routine for maximum productivity ☀️',
    hashtags: '#morning #routine #productivity #fyp',
    templateId: 'aesthetic',
    accentColor: '#e879f9',
  },
  {
    id: 'd2',
    title: 'Workout Tips #12',
    savedAt: 'Yesterday',
    captions: "3 tips that changed my entire training approach. Don't skip these.",
    hashtags: '#fitness #workout #tips #motivation',
    templateId: 'motivation',
    accentColor: '#facc15',
  },
  {
    id: 'd3',
    title: 'Editing Tutorial',
    savedAt: '3 days ago',
    captions: "Learn how I edit my TikToks in under 10 minutes. It's easier than you think!",
    hashtags: '#tutorial #editing #capcut #learnontiktok',
    templateId: 'tutorial',
    accentColor: '#38bdf8',
  },
];

const SEED_EVENTS: PlannerEvent[] = [
  { id: 'e1', title: 'Workout Routine #4', day: 17, platform: 'TikTok', status: 'scheduled' },
  { id: 'e2', title: 'Weekly Recap', day: 18, platform: 'Instagram', status: 'scheduled' },
  { id: 'e3', title: 'Day in My Life', day: 20, platform: 'TikTok', status: 'draft' },
  { id: 'e4', title: 'Tutorial Part 2', day: 22, platform: 'YouTube', status: 'scheduled' },
  { id: 'e5', title: 'Q&A Response', day: 25, platform: 'TikTok', status: 'draft' },
  { id: 'e6', title: 'Collab Drop', day: 28, platform: 'Instagram', status: 'scheduled' },
];

export function useCreatorStore() {
  const [activeNav, setActiveNav] = useState<NavItem>('Dashboard');
  const [projectTitle, setProjectTitle] = useState('My Video Project');

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);

  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState('');

  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: '',
    size: 'Medium',
    color: '#ffffff',
  });

  const [captions, setCaptions] = useState('');
  const [hashtags, setHashtags] = useState('');

  const [volume, setVolume] = useState([80]);
  const [brightness, setBrightness] = useState([100]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [transition, setTransition] = useState<Transition>({ type: 'none', duration: 0.5 });
  const [exportPreset, setExportPreset] = useState<ExportPreset>('tiktok');
  const [exportPanelOpen, setExportPanelOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Draft[]>(SEED_DRAFTS);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(SEED_EVENTS);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      setVideoFileName(file.name);
    }
    e.target.value = '';
  }, []);

  const handleAudioUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioSrc(URL.createObjectURL(file));
      setAudioFileName(file.name);
    }
    e.target.value = '';
  }, []);

  const triggerUpload = useCallback(() => fileInputRef.current?.click(), []);
  const triggerAudioUpload = useCallback(() => audioInputRef.current?.click(), []);

  const removeVideo = useCallback(() => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setVideoFileName('');
    setVideoDuration(0);
  }, [videoSrc]);

  const removeAudio = useCallback(() => {
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc(null);
    setAudioFileName('');
  }, [audioSrc]);

  const applyTemplate = useCallback((template: Template) => {
    setTextOverlay(template.textOverlay);
    setCaptions(template.captions);
    setHashtags(template.hashtags);
    setActiveTemplateId(template.id);
  }, []);

  const saveDraft = useCallback(() => {
    const draft: Draft = {
      id: `d${Date.now()}`,
      title: projectTitle || 'Untitled Project',
      savedAt: 'Just now',
      captions,
      hashtags,
      templateId: activeTemplateId,
      accentColor: TEMPLATES.find(t => t.id === activeTemplateId)?.accentColor || '#7c3aed',
    };
    setDrafts(prev => [draft, ...prev]);
    return draft;
  }, [projectTitle, captions, hashtags, activeTemplateId]);

  const loadDraft = useCallback((draft: Draft) => {
    setCaptions(draft.captions);
    setHashtags(draft.hashtags);
    if (draft.templateId) {
      const t = TEMPLATES.find(t => t.id === draft.templateId);
      if (t) {
        setTextOverlay(t.textOverlay);
        setActiveTemplateId(t.id);
      }
    }
    setProjectTitle(draft.title);
  }, []);

  const deleteDraft = useCallback((id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  }, []);

  const addPlannerEvent = useCallback((event: Omit<PlannerEvent, 'id'>) => {
    setPlannerEvents(prev => [...prev, { ...event, id: `e${Date.now()}` }]);
  }, []);

  const removePlannerEvent = useCallback((id: string) => {
    setPlannerEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    activeNav, setActiveNav,
    projectTitle, setProjectTitle,
    videoSrc,
    videoFileName,
    videoDuration, setVideoDuration,
    audioSrc,
    audioFileName,
    textOverlay, setTextOverlay,
    captions, setCaptions,
    hashtags, setHashtags,
    volume, setVolume,
    brightness, setBrightness,
    playbackSpeed, setPlaybackSpeed,
    transition, setTransition,
    exportPreset, setExportPreset,
    exportPanelOpen, setExportPanelOpen,
    activeTemplateId,
    drafts,
    plannerEvents,
    videoRef,
    audioRef,
    fileInputRef,
    audioInputRef,
    handleFileUpload,
    handleAudioUpload,
    triggerUpload,
    triggerAudioUpload,
    removeVideo,
    removeAudio,
    applyTemplate,
    saveDraft,
    loadDraft,
    deleteDraft,
    addPlannerEvent,
    removePlannerEvent,
  };
}
