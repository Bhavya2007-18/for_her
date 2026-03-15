import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, History, PartyPopper, Sparkles, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- DATA STRUCTURE ---
const QUESTIONS = [
  { year: 1, question: "What do you think baby you loved the most?" },
  { year: 2, question: "What was the first thing you loved exploring?" },
  { year: 3, question: "What toy probably made you happiest?" },
  { year: 4, question: "What small thing used to make you laugh?" },
  { year: 5, question: "What do you remember about starting school?" },
  { year: 6, question: "What was your favorite thing after school?" },
  { year: 7, question: "What childhood memory still feels warm?" },
  { year: 8, question: "What did you enjoy doing with friends?" },
  { year: 9, question: "What hobby excited you the most?" },
  { year: 10, question: "What was your favorite way to spend weekends?" },
  { year: 11, question: "What song or show reminds you of this age?" },
  { year: 12, question: "What was something you were proud of learning?" },
  { year: 13, question: "What started becoming important in life?" },
  { year: 14, question: "What dream started forming?" },
  { year: 15, question: "What moment made you feel more grown up?" },
  { year: 16, question: "What memory from this age feels unforgettable?" },
  { year: 17, question: "What were you thinking about your future?" },
  { year: 18, question: "What new freedom stood out?" },
  { year: 19, question: "What lesson has life taught you recently?" },
  { year: 20, question: "What are you most excited about in the future?" },
];

type Screen = 'landing' | 'journey' | 'celebration' | 'timeline';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(20).fill(''));
  const [currentInput, setCurrentInput] = useState('');
  const [displayAge, setDisplayAge] = useState(17);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --- MODULAR FUNCTIONS ---

  const startJourney = () => {
    setScreen('journey');
    setCurrentYearIndex(0);
    setCurrentInput('');
  };

  const handleNextYear = () => {
    if (!currentInput.trim()) return;

    saveAnswer(currentInput);
    
    if (currentYearIndex < 19) {
      setCurrentYearIndex(prev => prev + 1);
      setCurrentInput('');
    } else {
      showCelebration();
    }
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

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

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

  const renderTimeline = () => {
    setScreen('timeline');
  };

  // --- UI COMPONENTS ---

  const LandingScreen = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-stone-50"
    >
      <div className="max-w-2xl">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 inline-block p-4 bg-white rounded-full shadow-sm border border-stone-200"
        >
          <Calendar className="w-12 h-12 text-stone-800" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-stone-900 tracking-tight">
          The 20 Year Journey
        </h1>
        <p className="text-xl text-stone-600 mb-12 font-light leading-relaxed">
          Take a moment to walk through two decades of memories. <br />
          Reflect on your growth, your dreams, and the moments that shaped you.
        </p>
        <button
          onClick={startJourney}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-full text-lg font-medium transition-all hover:bg-stone-800 hover:scale-105 active:scale-95 shadow-xl"
        >
          Start the Journey
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );

  const JourneyScreen = () => {
    const currentQuestion = QUESTIONS[currentYearIndex];
    const progress = ((currentYearIndex + 1) / 20) * 100;

    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1.5 bg-stone-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-stone-900"
          />
        </div>

        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <span className="text-stone-500 font-mono text-sm tracking-widest uppercase">
              Year {currentQuestion.year} / 20
            </span>
            <div className="h-px flex-grow mx-4 bg-stone-300" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentYearIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-stone-200"
            >
              <h2 className="text-3xl md:text-4xl font-serif italic text-stone-900 mb-8 leading-tight">
                {currentQuestion.question}
              </h2>
              
              <textarea
                ref={inputRef}
                autoFocus
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your memory here..."
                className="w-full h-40 p-0 text-xl text-stone-800 placeholder-stone-300 bg-transparent border-none focus:ring-0 resize-none font-light"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNextYear();
                  }
                }}
              />

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextYear}
                  disabled={!currentInput.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    currentInput.trim() 
                      ? 'bg-stone-900 text-white hover:bg-stone-800 hover:translate-x-1 shadow-lg' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {currentYearIndex === 19 ? 'Finish Journey' : 'Next Year'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const CelebrationScreen = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="mb-8"
      >
        <PartyPopper className="w-20 h-20 text-stone-400 mx-auto mb-6" />
        <p className="text-stone-400 font-mono tracking-[0.3em] uppercase text-sm mb-4">
          Journey Complete
        </p>
        <h2 className="text-2xl md:text-3xl font-light text-stone-300 mb-2">
          You just walked through 20 years of memories.
        </h2>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative"
      >
        <h1 className="text-6xl md:text-8xl font-serif italic mb-4">
          Happy 20th Birthday
        </h1>
        
        <div className="flex items-center justify-center gap-4 text-4xl md:text-6xl font-mono text-stone-500">
          <motion.span key={displayAge} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {displayAge}
          </motion.span>
          <Sparkles className="w-8 h-8 text-stone-400" />
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        onClick={renderTimeline}
        className="mt-16 flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-medium hover:bg-stone-100 transition-colors shadow-2xl"
      >
        <History className="w-5 h-5" />
        See Your Journey
      </motion.button>
    </motion.div>
  );

  const TimelineScreen = () => (
    <div className="min-h-screen bg-stone-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900 mb-4">Your 20 Year Timeline</h2>
          <p className="text-stone-500 font-light">A collection of your reflections and memories.</p>
        </header>

        <div className="space-y-12 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-stone-200">
          {QUESTIONS.map((q, idx) => (
            <motion.div 
              key={q.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Dot */}
              <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-stone-900 ring-4 ring-stone-50 z-10" />
              
              {/* Content */}
              <div className="w-full md:w-[45%] bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">Year {q.year}</span>
                </div>
                <h3 className="text-lg font-serif italic text-stone-800 mb-4 leading-snug">{q.question}</h3>
                <p className="text-stone-600 font-light italic border-l-2 border-stone-100 pl-4">
                  "{answers[idx] || "No memory recorded."}"
                </p>
              </div>
              
              {/* Spacer for desktop */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          ))}
        </div>

        <footer className="mt-24 text-center pb-12">
          <button 
            onClick={() => setScreen('landing')}
            className="text-stone-400 hover:text-stone-900 transition-colors font-medium underline underline-offset-8"
          >
            Back to Start
          </button>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="font-sans selection:bg-stone-200 selection:text-stone-900">
      <AnimatePresence mode="wait">
        {screen === 'landing' && <LandingScreen key="landing" />}
        {screen === 'journey' && <JourneyScreen key="journey" />}
        {screen === 'celebration' && <CelebrationScreen key="celebration" />}
        {screen === 'timeline' && <TimelineScreen key="timeline" />}
      </AnimatePresence>
    </div>
  );
}
