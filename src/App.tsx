import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-12 py-12 lg:py-24">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase"
          >
            <Sparkles className="w-3 h-3" />
            Ultimate Neon Fusion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            SNAKE BEATS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-medium max-w-md"
          >
            Classic arcade action meets immersive synthwave rhythms.
            Level up your score while tracking the pulse.
          </motion.p>
        </header>

        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12">
          {/* Left/Main Column - Game */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-auto"
          >
            <SnakeGame />
          </motion.section>

          {/* Right Column - Music and Specs */}
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6 w-full max-w-md"
          >
            <MusicPlayer />
            
            {/* Control Info Card */}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-1">Hardware Interface</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Engine</p>
                  <p className="text-sm font-bold text-zinc-200">V8-CORE_2.4</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Sync</p>
                  <p className="text-sm font-bold text-cyan-400 tracking-widest">ACTIVE</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-400/5 border border-cyan-400/10">
                <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider mb-2">Instructions</p>
                <ul className="text-xs space-y-2 text-zinc-400 font-medium">
                  <li className="flex justify-between"><span>Navigation</span> <span className="text-zinc-200">Arrows</span></li>
                  <li className="flex justify-between"><span>Action Pause</span> <span className="text-zinc-200">Space</span></li>
                  <li className="flex justify-between"><span>Music Sync</span> <span className="text-zinc-200">Auto</span></li>
                </ul>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-zinc-600 font-mono text-[10px] tracking-widest pb-12">
          © 2024 NEON_SYNTH_ARCHITECTS // ALL RIGHTS RESERVED
        </footer>
      </main>
    </div>
  );
}
