import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { GameState } from '../types';

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((snake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions (walls)
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      // Check collisions (self)
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      newSnake.unshift(head);

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10,
        };
      } else {
        newSnake.pop();
        return { ...prev, snake: newSnake };
      }
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setGameState(prev => {
        if (prev.isGameOver) return prev;
        
        const key = e.key;
        let newDir = prev.direction;

        if (key === 'ArrowUp' && prev.direction !== 'DOWN') newDir = 'UP';
        if (key === 'ArrowDown' && prev.direction !== 'UP') newDir = 'DOWN';
        if (key === 'ArrowLeft' && prev.direction !== 'RIGHT') newDir = 'LEFT';
        if (key === 'ArrowRight' && prev.direction !== 'LEFT') newDir = 'RIGHT';
        if (key === ' ') return { ...prev, isPaused: !prev.isPaused };

        return { ...prev, direction: newDir };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl">
      <div className="flex justify-between w-full items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Score</p>
            <p className="text-xl font-bold text-zinc-100 font-mono tracking-tighter">{gameState.score.toString().padStart(4, '0')}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setGameState(p => ({ ...p, isPaused: !p.isPaused }))}
          className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          {gameState.isPaused ? <Play className="w-4 h-4 text-zinc-300" /> : <Pause className="w-4 h-4 text-zinc-300" />}
        </button>
      </div>

      <div 
        className="relative bg-black/80 rounded-2xl border-4 border-zinc-800 overflow-hidden shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]"
        style={{ 
          width: 'min(80vw, 400px)', 
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Snake segments */}
        {gameState.snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={i === 0 ? { scale: 1.2 } : { scale: 1 }}
            animate={{ scale: 1 }}
            className={`
              rounded-sm 
              ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10' : 'bg-cyan-600/60'}
            `}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8 
          }}
          className="bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.8)]"
          style={{
            gridColumnStart: gameState.food.x + 1,
            gridRowStart: gameState.food.y + 1,
          }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {(gameState.isGameOver || (gameState.isPaused && gameState.snake.length > 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <h2 className={`text-4xl font-black mb-6 tracking-tighter ${gameState.isGameOver ? 'text-red-500' : 'text-zinc-100'}`}>
                {gameState.isGameOver ? 'SYSTEM FAILURE' : 'PAUSED'}
              </h2>
              {gameState.isGameOver ? (
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  RESTART
                </button>
              ) : (
                <button
                  onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  RESUME
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-between items-center text-zinc-500 px-2 font-mono text-[10px] tracking-widest uppercase">
        <span>Arrow keys to move</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};

export default SnakeGame;
