import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      
      <div className="flex gap-6 items-center mb-6">
        <div className="relative group w-24 h-24 shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-2xl shadow-xl ring-1 ring-white/10"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 border-2 border-zinc-900 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music className="w-3 h-3 text-black" />
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            key={currentTrack.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-1"
          >
            <h3 className="text-xl font-bold text-white truncate leading-tight tracking-tight">
              {currentTrack.title}
            </h3>
            <p className="text-sm font-medium text-zinc-400 truncate tracking-wide italic">
              {currentTrack.artist}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <input
            type="range"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-cyan-500 group-hover:h-2 transition-all"
          />
          <div 
            className="absolute top-0 left-0 h-1.5 bg-cyan-400 rounded-full pointer-events-none group-hover:h-2 transition-all shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-500">
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">Stereo</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrev}
              className="text-zinc-400 hover:text-white transition-colors active:scale-90"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button 
              onClick={handleTogglePlay}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black fill-current" />
              ) : (
                <Play className="w-6 h-6 text-black fill-current ml-1" />
              )}
            </button>

            <button 
              onClick={handleNext}
              className="text-zinc-400 hover:text-white transition-colors active:scale-90"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 tracking-wider">
            {Math.floor((progress / 100) * currentTrack.duration / 60)}:
            {Math.floor(((progress / 100) * currentTrack.duration) % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
