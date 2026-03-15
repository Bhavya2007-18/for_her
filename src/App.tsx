import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, History, PartyPopper, Sparkles, Calendar, ArrowRight, Home, BookOpen, Star, Heart, Share2, Settings, Music, Palette, History as HistoryIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- DATA STRUCTURE ---
const QUESTIONS = [
  { year: 1, question: "What do you think baby you loved the most?", context: "The very first footprint in a vast world of possibilities.", date: "January 2004", icon: "history" },
  { year: 2, question: "What was the first thing you loved exploring?", context: "Curiosity began to bloom as you discovered the world around you.", date: "Toddler Years", icon: "explore" },
  { year: 3, question: "What toy probably made you happiest?", context: "The simple joy of play and the first favorite things.", date: "Playtime", icon: "toys" },
  { year: 4, question: "What small thing used to make you laugh?", context: "Pure, unfiltered joy in the smallest of moments.", date: "Early Smiles", icon: "mood" },
  { year: 5, question: "What do you remember about starting school?", context: "Imagination took flight. Boxes became spaceships.", date: "School Days", icon: "palette" },
  { year: 6, question: "What was your favorite thing after school?", context: "The transition from learning to pure freedom.", date: "Afternoons", icon: "home" },
  { year: 7, question: "What childhood memory still feels warm?", context: "The core memories that stay with you forever.", date: "Warmth", icon: "favorite" },
  { year: 8, question: "What did you enjoy doing with friends?", context: "The first bonds and shared adventures.", date: "Friendship", icon: "group" },
  { year: 9, question: "What hobby excited you the most?", context: "Discovering passions that would last a lifetime.", date: "Hobbies", icon: "brush" },
  { year: 10, question: "What was your favorite way to spend weekends?", context: "The double-digit era. A new sense of independence.", date: "Weekends", icon: "weekend" },
  { year: 11, question: "What song or show reminds you of this age?", context: "The soundtrack of your growing years.", date: "Pop Culture", icon: "music_note" },
  { year: 12, question: "What was something you were proud of learning?", context: "The satisfaction of mastering something new.", date: "Growth", icon: "school" },
  { year: 13, question: "What started becoming important in life?", context: "The threshold of change and self-discovery.", date: "Values", icon: "lightbulb" },
  { year: 14, question: "What dream started forming?", context: "Looking towards the horizon with hope.", date: "Dreams", icon: "auto_awesome" },
  { year: 15, question: "What moment made you feel more grown up?", context: "Navigating the tides of friendship and self.", date: "High School", icon: "auto_stories" },
  { year: 16, question: "What memory from this age feels unforgettable?", context: "The intensity of teenage experiences.", date: "Unforgettable", icon: "camera" },
  { year: 17, question: "What were you thinking about your future?", context: "The weight and excitement of what's next.", date: "Future", icon: "trending_up" },
  { year: 18, question: "What new freedom stood out?", context: "Stepping into adulthood with open arms.", date: "Independence", icon: "key" },
  { year: 19, question: "What lesson has life taught you recently?", context: "The wisdom gained from recent experiences.", date: "Wisdom", icon: "psychology" },
  { year: 20, question: "What are you most excited about in the future?", context: "The present moment. A beautiful horizon.", date: "Present Day", icon: "star" },
];

type Screen = 'landing' | 'journey' | 'celebration' | 'timeline';

// --- UI COMPONENTS ---

const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="floating-particle w-1 h-1 top-[10%] left-[15%]"></div>
    <div className="floating-particle w-2 h-2 top-[25%] left-[80%] opacity-10"></div>
    <div className="floating-particle w-1.5 h-1.5 top-[60%] left-[45%] opacity-25"></div>
    <div className="floating-particle w-1 h-1 top-[85%] left-[20%]"></div>
    <div className="floating-particle w-3 h-3 top-[40%] left-[90%] opacity-5"></div>
    <div className="floating-particle w-1 h-1 top-[70%] left-[75%]"></div>
    <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -top-48 -left-48"></div>
    <div className="absolute w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] -bottom-48 -right-48"></div>
  </div>
);

const NavBar: React.FC<{ setScreen: (s: Screen) => void }> = ({ setScreen }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="font-headline text-xl font-bold tracking-tight text-primary">Chapter 20</span>
    </div>
    <div className="hidden md:flex items-center gap-12 bg-surface-container-lowest/80 backdrop-blur-xl px-10 py-3 rounded-full border border-outline-variant/10">
      <button onClick={() => setScreen('landing')} className="text-sm font-medium hover:text-primary transition-colors">The Beginning</button>
      <button onClick={() => setScreen('timeline')} className="text-sm font-medium hover:text-primary transition-colors">Milestones</button>
      <button onClick={() => setScreen('celebration')} className="text-sm font-medium hover:text-primary transition-colors">Wishes</button>
    </div>
    <div className="flex items-center gap-6">
      <button className="flex items-center justify-center p-2 text-on-surface-variant hover:text-primary transition-colors">
        <span className="material-symbols-outlined">auto_awesome</span>
      </button>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
        <img alt="Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDRnSP-NPHAwr5bTkLcAaKrbnyOMv2kfQqqSFZfLsROB1ecioy-3yrBzg_bpyL7HBPjZwJzsZ4LZyOyAqRmrjnFcP6JYJdhNOQ6v3PArRgUcjsQYAg5lRIkgbbF63eyj7P1c3K-h-Nw65z5_kBjO4FZDXL6TwLpIzIAHRT44LHe6AjYQAOagwtmykaHGjwyN8_rvpb5IrYFNpsmfTkl5_AYJYekMlY7k-CdOJrVcLrQjC2xV5YDdCDZ_oYlNmMyLWJ20-f1plCENs" />
      </div>
    </div>
  </nav>
);

const LandingScreen: React.FC<{ startJourney: () => void }> = ({ startJourney }) => (
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center max-w-5xl mx-auto"
  >
    <div className="space-y-4 mb-2">
      <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase bg-secondary/10 px-4 py-1.5 rounded-full inline-block">Established 2004</span>
      <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-none text-on-surface">
        A Journey Through<br />
        <span className="text-primary italic">20 Years</span>
      </h1>
    </div>
    <p className="mt-8 text-lg md:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed">
      Answer a few small questions and unlock a special message.
    </p>
    <div className="mt-12 flex flex-col items-center gap-8">
      <button onClick={startJourney} className="gradient-button px-12 py-5 rounded-full text-on-primary font-bold text-lg flex items-center gap-3 group">
        Start the Journey
        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
      </button>
      <div className="w-64 space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold tracking-wider text-on-surface-variant/60 uppercase">Journey Progress</span>
          <span className="text-sm font-headline text-primary">0%</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
    {/* Decorative Elements */}
    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12">
      <div className="glass-card p-4 rounded-lg border border-outline-variant/10 rotate-[-6deg] max-w-[200px]">
        <img alt="Memory" className="rounded-md grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeKhphhM_5WrDPTYE1ImzqotQ824yCrM69fulDXbrMl80V5QJHamyXCVdRtwVyhQgXZJug6U1s_eXmsViXFED1ZxaN4PXHJrxIhrU9O6rzOw7xAW-UdDhz6_4--8AoJ-wqN1eLCcJvvITkxiZzecJtLQguGzszZGbcB36XtdBTUjmaHr8voPuxEi9xAOrGZOuLtLAuFkQxpfZanIKBwCbq2jpmJEaWHtXbOoTZr00OMskH2OpdhPnHV-v6qlZKwWg1Mo_qLH4lk2g" />
        <p className="mt-3 text-[10px] font-bold text-on-surface-variant/50 tracking-widest text-left">ARCHIVE // 001</p>
      </div>
    </div>
    <div className="hidden lg:block absolute right-0 top-1/3 translate-x-12">
      <div className="glass-card p-4 rounded-lg border border-outline-variant/10 rotate-[4deg] max-w-[180px]">
        <img alt="Memory" className="rounded-md grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuebdh3JqKwnaw8St-LxLepdLo32mdIDFrdo0b1LW_VmF-UAYRNPq8xGU7K83nAO90rS5SDxrfN6o2pNH1NmBXJaXbqN0ZwHm-1B2ODsCKvAlz1OxadiLSnmrBwCCeiI3PBuIgg9kTgFyil-qWWRTxTi4kjNgdKa-FgKJDreSmG8By3ozOVLMClIDwHV7MJSOc0LIOD9xQov2916aBwWzGqrwRNZh_tXWf_Qgee6nO_tO1iB4NVG0gojiSU6GLcMAr6pMSctpOxdA" />
        <p className="mt-3 text-[10px] font-bold text-on-surface-variant/50 tracking-widest text-right">MOMENT // 20</p>
      </div>
    </div>
  </motion.main>
);

const JourneyScreen: React.FC<{ 
  currentYearIndex: number, 
  currentInput: string, 
  setCurrentInput: (s: string) => void, 
  handleNextYear: () => void, 
  inputRef: React.RefObject<HTMLTextAreaElement>, 
  isCapturing: boolean 
}> = ({ 
  currentYearIndex, 
  currentInput, 
  setCurrentInput, 
  handleNextYear, 
  inputRef, 
  isCapturing 
}) => {
  const q = QUESTIONS[currentYearIndex];
  const progress = ((currentYearIndex + 1) / 20) * 100;
  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative z-10 flex flex-col items-center px-6 py-12 md:py-20 max-w-5xl mx-auto"
    >
      <div className="w-full max-w-3xl mb-16 md:mb-24">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Current Milestone</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Year {q.year} / 20</h2>
            </div>
            <div className="text-right">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">Journey Progress</span>
              <span className="font-headline text-2xl text-secondary">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden border border-outline-variant/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_15px_rgba(192,193,255,0.3)]"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className={`glass-card w-full max-w-2xl rounded-lg p-10 md:p-16 border border-outline-variant/10 shadow-2xl relative group ${isCapturing ? 'memory-captured' : ''}`}>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/10 blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>
          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            <div className="space-y-4">
              <span className="font-label text-sm uppercase tracking-[0.3em] text-tertiary">Life Journey Progress</span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface">Year {q.year}</h1>
            </div>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-md">
              {q.question}
            </p>
            <div className="w-full mt-4">
              <textarea
                ref={inputRef}
                autoFocus
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleNextYear(); } }}
                className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface placeholder:text-outline/40 py-4 px-0 min-h-[120px] text-lg resize-none transition-all duration-300 font-body"
                placeholder="Type your memory here..."
              />
            </div>
            <div className="pt-8">
              <button onClick={handleNextYear} disabled={!currentInput.trim()} className={`gradient-button text-on-primary-fixed font-headline font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 ${!currentInput.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {currentYearIndex === 19 ? 'Finish Journey' : 'Next Year'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 md:-mt-20 md:ml-auto md:mr-0 relative z-20 w-full md:w-80">
          <div className="aspect-square rounded-lg overflow-hidden border-8 border-surface-container-high shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
            <img alt="Nostalgia" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" src={`https://picsum.photos/seed/${q.year}/400/400`} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="text-xs font-label uppercase tracking-widest text-primary-fixed">Circa {2004 + q.year - 1}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

const CelebrationScreen: React.FC<{ setScreen: (s: Screen) => void }> = ({ setScreen }) => (
  <motion.main 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32"
  >
    <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center text-center">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none opacity-40">
        <div className="flex justify-around">
          <div className="w-2 h-2 bg-secondary rounded-sm rotate-45"></div>
          <div className="w-3 h-1 bg-primary rounded-full -rotate-12"></div>
          <div className="w-2 h-2 bg-tertiary rounded-full"></div>
          <div className="w-1 h-4 bg-secondary rounded-full rotate-45"></div>
          <div className="w-2 h-2 bg-primary rounded-sm -rotate-45"></div>
        </div>
      </div>
      <div className="absolute left-0 top-1/4 w-32 h-48 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute right-10 bottom-0 w-48 h-64 bg-gradient-to-b from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="relative z-10 mb-8">
        <span className="font-label text-sm uppercase tracking-[0.4em] text-on-surface-variant mb-6 block">A Milestone Celebration</span>
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-extrabold leading-[0.9] tracking-tighter text-on-surface glow-text">
          Happy 20th <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">Birthday</span>
        </h1>
      </div>
      <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
        You just walked through 20 years of memories. Each step has been a story, each moment a spark in the archive of your life.
      </p>
      <div className="flex flex-col md:flex-row items-center gap-6 z-20">
        <button onClick={() => setScreen('timeline')} className="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-label font-bold text-lg rounded-full shadow-[0_0_40px_rgba(192,193,255,0.2)] hover:scale-105 transition-transform duration-300">
          See Your Journey
        </button>
        <button className="px-10 py-5 bg-surface-bright/10 backdrop-blur-md border border-white/5 text-on-surface font-label font-bold text-lg rounded-full hover:bg-surface-bright/20 transition-all">
          Send a Wish
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 w-full max-w-7xl mx-auto mt-32">
      <div className="md:col-span-2 md:row-span-2 glass-card rounded-lg p-8 relative overflow-hidden group">
        <img alt="Celebration" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPnyv2WwETHWkCy128BfnfJLm4hi2VH7ybTrjR0-LoR5R_hTMWl55xPLoRtz8G_pos6bHRBSkUTnhdXwZg3VDdFMrmMMewb7Y3gwZHT86n0pRg9yKXx9zzrAdOHKglyij-GAixkwf7HnYtDBubBirmdl0dZuDJhrTLsthJrEj4t_-k6o-PtsC-lTIQoQ9A4XsiLo_qn978hqfC2flcPAZjXgP1HN6AeuzAiJ2KJDaVI-Aq9nP0u4QjVgewMTiUHTHHlVuEauH7tds" />
        <div className="relative z-10 h-full flex flex-col justify-end">
          <span className="text-secondary font-label text-xs uppercase tracking-widest mb-2">Year One</span>
          <h3 className="font-headline text-3xl font-bold text-on-surface">The First Spark</h3>
          <p className="text-on-surface-variant mt-4 font-body max-w-xs text-sm">Every epic story begins with a single, small heartbeat.</p>
        </div>
      </div>
      <div className="glass-card rounded-lg p-8 flex flex-col justify-between items-start border-l-2 border-primary/20">
        <HistoryIcon className="text-primary w-10 h-10" />
        <div>
          <div className="font-headline text-4xl font-extrabold text-on-surface">7,305</div>
          <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Days Lived</div>
        </div>
      </div>
      <div className="glass-card rounded-lg p-8 flex flex-col justify-between bg-gradient-to-br from-surface-container to-secondary-container/10">
        <Heart className="text-secondary w-10 h-10 fill-secondary" />
        <div>
          <div className="font-headline text-2xl font-bold text-on-surface">Wishes</div>
          <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant">124 Received</div>
        </div>
      </div>
      <div className="md:col-span-2 glass-card rounded-lg p-8 flex flex-col justify-center">
        <div className="flex justify-between items-end mb-4">
          <span className="font-label text-sm text-on-surface-variant">Journey Progress</span>
          <span className="font-headline text-3xl font-bold text-primary">100%</span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary w-full rounded-full shadow-[0_0_15px_rgba(192,193,255,0.5)]"></div>
        </div>
        <p className="text-xs text-on-surface-variant mt-4 font-label uppercase tracking-widest opacity-60">To The Next Decade</p>
      </div>
    </div>
  </motion.main>
);

const TimelineScreen: React.FC<{ answers: string[] }> = ({ answers }) => (
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative max-w-7xl mx-auto px-6 pb-32 pt-24"
  >
    <div className="absolute left-1/2 top-0 bottom-0 w-px timeline-line -translate-x-1/2 hidden md:block opacity-30"></div>
    <div className="space-y-24 md:space-y-32 relative">
      {QUESTIONS.map((q, idx) => (
        <div key={q.year} className={`relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 group ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
          <div className={`md:w-1/2 hidden md:block ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
            <div className={`${idx % 2 === 0 ? 'pr-8 group-hover:-translate-x-2' : 'pl-8 group-hover:translate-x-2'} transform transition-transform duration-500`}>
              <p className="font-label text-on-surface-variant text-sm tracking-wide leading-relaxed">{q.context}</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container flex items-center justify-center border-2 ${idx % 3 === 0 ? 'border-primary/30' : idx % 3 === 1 ? 'border-secondary/30' : 'border-tertiary/30'} glow-dot group-hover:scale-110 transition-transform duration-500`}>
              <span className="font-headline text-xl md:text-2xl font-bold">{q.year < 10 ? `0${q.year}` : q.year}</span>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className={`glass-card p-8 rounded-lg border-l-4 ${idx % 3 === 0 ? 'border-primary' : idx % 3 === 1 ? 'border-secondary' : 'border-tertiary'} group-hover:translate-x-2 transition-all duration-500`}>
              <h3 className={`font-headline text-lg mb-2 ${idx % 3 === 0 ? 'text-primary' : idx % 3 === 1 ? 'text-secondary' : 'text-tertiary'}`}>Year {q.year}</h3>
              <p className="font-body text-on-surface italic mb-4">"{answers[idx] || "A memory waiting to be written..."}"</p>
              <div className="flex items-center gap-2 text-on-surface-variant text-xs font-label uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">{q.icon}</span>
                <span>{q.date}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.main>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(20).fill(''));
  const [currentInput, setCurrentInput] = useState('');
  const [displayAge, setDisplayAge] = useState(17);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startJourney = () => {
    setScreen('journey');
    setCurrentYearIndex(0);
    setCurrentInput('');
  };

  const handleNextYear = async () => {
    if (!currentInput.trim()) return;
    
    // Feature 1: Memory Capture Effect
    await playMemoryCaptureEffect();
    
    saveAnswer(currentInput);
    
    if (currentYearIndex < 19) {
      setCurrentYearIndex(prev => prev + 1);
      setCurrentInput('');
    } else {
      // Final submission to Google Form
      const finalAnswers = [...answers];
      finalAnswers[currentYearIndex] = currentInput;
      sendToGoogleForm(finalAnswers);

      // Feature 2: Birthday Celebration Animation
      await playBirthdayConfetti();
      showPreparingMessage();
      setTimeout(() => {
        redirectToCelebration();
      }, 1500);
    }
  };

  const sendToGoogleForm = (finalAnswers: string[]) => {
    const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSdzX-PKHRo9c1GcEy-dFktpD8CjXYlIj5QDBKXLBcxl_JqIAQ/formResponse";
    const formData = new FormData();

    // Map the answers to the Google Form fields using entry IDs
    // NOTE: Replace FIELD_ID_1, FIELD_ID_2, etc. with your actual Google Form entry IDs
    finalAnswers.forEach((answer, index) => {
      formData.append(`entry.FIELD_ID_${index + 1}`, answer);
    });

    fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    }).catch(err => console.error("Google Form submission error:", err));
  };

  const playMemoryCaptureEffect = () => {
    return new Promise<void>((resolve) => {
      setIsCapturing(true);
      // Create sparkles around textarea
      const textarea = inputRef.current;
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        for (let i = 0; i < 15; i++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle-particle';
          sparkle.style.left = `${rect.left + Math.random() * rect.width}px`;
          sparkle.style.top = `${rect.top + Math.random() * rect.height}px`;
          document.body.appendChild(sparkle);
          setTimeout(() => sparkle.remove(), 700);
        }
      }

      setTimeout(() => {
        setIsCapturing(false);
        resolve();
      }, 700);
    });
  };

  const playBirthdayConfetti = () => {
    return new Promise<void>((resolve) => {
      // Large confetti burst
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
      });

      // Side streams
      const end = Date.now() + 3000;
      const interval: any = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          resolve();
          return;
        }
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C0C1FF', '#FFD1E3']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C0C1FF', '#FFD1E3']
        });
      }, 50);
    });
  };

  const showPreparingMessage = () => {
    setIsPreparing(true);
  };

  const redirectToCelebration = () => {
    window.location.href = 'celebration.html';
  };

  const saveAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentYearIndex] = answer;
    setAnswers(newAnswers);
  };

  const showCelebration = () => {
    setScreen('celebration');
    triggerConfetti();
    animateAge();
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const animateAge = () => {
    let age = 17;
    const interval = setInterval(() => {
      if (age < 20) {
        age += 1;
        setDisplayAge(age);
      } else {
        clearInterval(interval);
      }
    }, 800);
  };

  // --- UI RENDER ---

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <Background />
      <NavBar setScreen={setScreen} />
      
      <AnimatePresence mode="wait">
        {screen === 'landing' && <LandingScreen key="landing" startJourney={startJourney} />}
        {screen === 'journey' && (
          <JourneyScreen 
            key="journey" 
            currentYearIndex={currentYearIndex}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            handleNextYear={handleNextYear}
            inputRef={inputRef}
            isCapturing={isCapturing}
          />
        )}
        {screen === 'celebration' && <CelebrationScreen key="celebration" setScreen={setScreen} />}
        {screen === 'timeline' && <TimelineScreen key="timeline" answers={answers} />}
      </AnimatePresence>

      {isPreparing && (
        <div className="preparing-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <span>✨ Preparing something special...</span>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-outline-variant/10 px-8 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-headline text-lg text-primary">Celebrating 20 Years of Magic</p>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60">The Ethereal Archive © 2024</p>
          </div>
          <div className="flex gap-8">
            <button className="text-sm font-label uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors">Credits</button>
            <button className="text-sm font-label uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors">Share the Story</button>
          </div>
        </div>
      </footer>

      {/* Horizon Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl">
          <button onClick={() => setScreen('landing')} className={`flex flex-col items-center gap-1 group ${screen === 'landing' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] uppercase font-label tracking-tighter">Home</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30"></div>
          <button onClick={() => setScreen('journey')} className={`flex flex-col items-center gap-1 group ${screen === 'journey' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] uppercase font-label tracking-tighter">Journey</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30"></div>
          <button onClick={() => setScreen('timeline')} className={`flex flex-col items-center gap-1 group ${screen === 'timeline' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase font-label tracking-tighter">Archive</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30"></div>
          <button onClick={() => setScreen('celebration')} className={`flex flex-col items-center gap-1 group ${screen === 'celebration' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <Star className="w-6 h-6" />
            <span className="text-[10px] uppercase font-label tracking-tighter">Future</span>
          </button>
        </div>
      </div>
    </div>
  );
}
