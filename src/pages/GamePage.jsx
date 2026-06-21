import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { getGameStats, saveGameStats } from '../utils/storage';
import { Gamepad2 } from 'lucide-react';

const GAME_OVER_MESSAGES = [
  { text: "You didn't increase your carbon footprint because your vehicle runs on clean energy! ☀️", sub: "Every eco-friendly choice matters." },
  { text: "Every eco-friendly choice helps reduce emissions! 🌍", sub: "You're making a difference just by learning." },
  { text: "Try again and build a greener future! 🌱", sub: "Small sustainable actions create big environmental impact." },
];

const LANE_COUNT = 3;
const CAR_WIDTH = 60;
const CAR_HEIGHT = 120;

function Car3DModel({ autoMode, tilt }) {
  const bodyColor = autoMode ? "#06b6d4" : "#e11d48";
  const carRef = useRef();

  useFrame((state, delta) => {
    if (carRef.current) {
      // Smooth tilt
      carRef.current.rotation.y += (tilt * -0.5 - carRef.current.rotation.y) * 10 * delta;
      carRef.current.rotation.z += (tilt * -0.2 - carRef.current.rotation.z) * 10 * delta;
    }
  });

  return (
    <group ref={carRef} scale={1.2}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.4, 2.4]} />
        <meshStandardMaterial color={bodyColor} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[0.9, 0.4, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.0} metalness={0.9} />
      </mesh>
      {/* Wheels */}
      {[-0.65, 0.65].map((x) =>
        [-0.8, 0.8].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.2, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 32]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function GamePage({ profile, updateProfile }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState('playing'); // playing, over
  const [score, setScore] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const [gameOverMsg, setGameOverMsg] = useState(GAME_OVER_MESSAGES[0]);
  const [stats, setStats] = useState(getGameStats());
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Expose car X and tilt to React state for the overlay positioning
  const [carPos, setCarPos] = useState({ x: 0, y: 0, tilt: 0 });

  const roadImgRef = useRef(null);

  useEffect(() => {
    const roadImg = new Image();
    roadImg.src = '/road.png';
    roadImgRef.current = roadImg;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const draw = useCallback((ctx, game) => {
    const width = game.width;
    const height = game.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Buildings
    game.buildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Road Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(game.roadX, 0, game.roadWidth, height);

    // Road Edge Glow
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(game.roadX, 0); ctx.lineTo(game.roadX, height);
    ctx.moveTo(game.roadX + game.roadWidth, 0); ctx.lineTo(game.roadX + game.roadWidth, height);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Road Texture
    if (roadImgRef.current && roadImgRef.current.complete && roadImgRef.current.naturalHeight > 0) {
      const roadImg = roadImgRef.current;
      const textureHeight = roadImg.height * (game.roadWidth / roadImg.width);
      const offset = game.distance % textureHeight;

      // Draw two repeating textures to fill the road
      ctx.drawImage(roadImg, 0, 0, roadImg.width, roadImg.height, game.roadX, offset - textureHeight, game.roadWidth, textureHeight);
      ctx.drawImage(roadImg, 0, 0, roadImg.width, roadImg.height, game.roadX, offset, game.roadWidth, textureHeight);
    } else {
      // Fallback road lines
      ctx.fillStyle = '#334155';
      game.roadLines.forEach(line => {
        for (let i = 1; i < LANE_COUNT; i++) {
          ctx.fillRect(game.roadX + i * game.laneWidth - 2, line.y, 4, 30);
        }
      });
    }

    // Objects
    game.objects.forEach(obj => {
      ctx.save();
      if (obj.type === 'token') {
        ctx.shadowColor = '#10b981'; ctx.shadowBlur = 15;
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, obj.w / 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⚡', obj.x + obj.w / 2, obj.y + obj.h / 2);
      } else if (obj.type === 'renewable') {
        ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 20;
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      } else if (obj.type === 'pollution' || obj.type === 'fossil') {
        ctx.fillStyle = '#475569';
        ctx.beginPath(); ctx.arc(obj.x + obj.w / 2, obj.y + obj.h / 2, obj.w / 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.arc(obj.x + obj.w / 2 - 5, obj.y + obj.h / 2 - 5, obj.w / 3, 0, Math.PI * 2); ctx.fill();
      } else if (obj.type === 'traffic') {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      }
      ctx.restore();
    });

    // Particles
    game.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 40;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Notice we DO NOT draw the car here anymore! The 3D overlay handles it.
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTokens(0);
    setSpeed(3);
    setAutoMode(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const width = dimensions.width;
    const height = dimensions.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const roadWidth = Math.min(width * 0.9, 600);
    const roadX = (width - roadWidth) / 2;
    const laneWidth = roadWidth / LANE_COUNT;

    const carY = height - 150;

    const game = {
      running: true,
      car: {
        x: roadX + (1 * laneWidth) + laneWidth / 2 - CAR_WIDTH / 2,
        lane: 1,
        targetX: roadX + (1 * laneWidth) + laneWidth / 2 - CAR_WIDTH / 2
      },
      speed: 3,
      score: 0,
      tokens: 0,
      distance: 0,
      autoMode: true,
      objects: [],
      roadLines: [],
      buildings: [],
      particles: [],
      lastSpawn: 0,
      width,
      height,
      roadWidth,
      roadX,
      laneWidth,
      carY
    };

    // Initialize road lines
    for (let y = 0; y < height; y += 60) {
      game.roadLines.push({ y });
    }

    // Initialize scenery
    for (let y = -200; y < height + 200; y += 150) {
      if (roadX > 50) {
        game.buildings.push({
          x: Math.random() * (roadX - 60),
          y, w: 40 + Math.random() * 40, h: 80 + Math.random() * 100,
          color: `hsl(${200 + Math.random() * 40}, 30%, ${10 + Math.random() * 15}%)`
        });
      }
      if (width - (roadX + roadWidth) > 50) {
        game.buildings.push({
          x: roadX + roadWidth + 20 + Math.random() * (width - roadX - roadWidth - 80),
          y: y + 80, w: 40 + Math.random() * 40, h: 80 + Math.random() * 100,
          color: `hsl(${200 + Math.random() * 40}, 30%, ${10 + Math.random() * 15}%)`
        });
      }
    }

    gameRef.current = game;

    const handleControl = (direction) => {
      if (!game.running) return;
      
      if (game.autoMode) {
        // User taking control for the first time
        game.autoMode = false;
        setAutoMode(false);
        // Reset the "fake" data accumulated by the AI
        game.score = 0;
        game.tokens = 0;
        game.distance = 0;
        game.speed = 3;
        // Clear nearby obstacles so they don't immediately crash
        game.objects = game.objects.filter(o => o.y < height * 0.3);
      }

      if (direction === 'left') {
        game.car.lane = Math.max(0, game.car.lane - 1);
      } else if (direction === 'right') {
        game.car.lane = Math.min(LANE_COUNT - 1, game.car.lane + 1);
      }
      game.car.targetX = game.roadX + game.car.lane * game.laneWidth + game.laneWidth / 2 - CAR_WIDTH / 2;
    };

    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') handleControl('left');
      if (e.key === 'ArrowRight' || e.key === 'd') handleControl('right');
    };
    window.addEventListener('keydown', handleKey);

    const spawnObject = () => {
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const x = game.roadX + lane * game.laneWidth + game.laneWidth / 2 - 20;
      const rand = Math.random();

      if (rand < 0.4) game.objects.push({ type: 'token', x, y: -50, lane, w: 40, h: 40 });
      else if (rand < 0.6) game.objects.push({ type: 'pollution', x, y: -50, lane, w: 45, h: 45 });
      else if (rand < 0.8) game.objects.push({ type: 'traffic', x, y: -50, lane, w: 40, h: 80 });
      else if (rand < 0.9) game.objects.push({ type: 'fossil', x, y: -50, lane, w: 45, h: 45 });
      else game.objects.push({ type: 'renewable', x, y: -50, lane, w: 45, h: 45 });
    };

    const gameLoop = () => {
      if (!game.running) return;

      game.distance += game.speed;
      game.score = Math.floor(game.distance / 10);
      game.speed = 4 + Math.floor(game.score / 100) * 0.5;
      game.speed = Math.min(game.speed, 12);

      // Auto mode AI
      if (game.autoMode) {
        const dangerYMin = height * 0.4;
        const dangerYMax = height * 0.8;

        const nearestDanger = game.objects.find(o =>
          (o.type === 'pollution' || o.type === 'traffic' || o.type === 'fossil') &&
          o.lane === game.car.lane && o.y > dangerYMin && o.y < dangerYMax
        );
        const nearestToken = game.objects.find(o =>
          o.type === 'token' && o.y > dangerYMin - 100 && o.y < dangerYMax
        );

        if (nearestDanger) {
          const safeLanes = [0, 1, 2].filter(l => l !== game.car.lane);
          const bestLane = nearestToken && safeLanes.includes(nearestToken.lane)
            ? nearestToken.lane
            : safeLanes[Math.floor(Math.random() * safeLanes.length)];
          game.car.lane = bestLane;
        } else if (nearestToken && nearestToken.lane !== game.car.lane) {
          game.car.lane = nearestToken.lane;
        }
        game.car.targetX = game.roadX + game.car.lane * game.laneWidth + game.laneWidth / 2 - CAR_WIDTH / 2;
      }

      // Smooth car move
      const oldX = game.car.x;
      game.car.x += (game.car.targetX - game.car.x) * 0.15;
      const tilt = (game.car.x - oldX) / 2;

      // Spawn
      if (game.distance - game.lastSpawn > 100 + Math.random() * 80) {
        spawnObject();
        game.lastSpawn = game.distance;
      }

      // Objects & Collision
      game.objects = game.objects.filter(obj => {
        obj.y += game.speed;
        if (obj.y > height + 50) return false;

        if (
          obj.y + obj.h > game.carY && obj.y < game.carY + CAR_HEIGHT &&
          obj.x + obj.w > game.car.x && obj.x < game.car.x + CAR_WIDTH
        ) {
          switch (obj.type) {
            case 'token':
              game.tokens++; game.score += 15;
              for (let i = 0; i < 8; i++) game.particles.push({ x: obj.x + 20, y: obj.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4, life: 30, color: '#10b981' });
              return false;
            case 'renewable':
              game.tokens += 5; game.score += 30; game.speed = Math.max(3, game.speed - 1);
              for (let i = 0; i < 12; i++) game.particles.push({ x: obj.x + 20, y: obj.y, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 5, life: 40, color: '#06b6d4' });
              return false;
            case 'pollution':
            case 'fossil':
              if (!game.autoMode) {
                endGame();
                return false;
              }
              break;
            case 'traffic':
              game.speed = Math.max(2, game.speed - 2);
              return false;
            default: break;
          }
        }
        return true;
      });

      // Lines & Scenery
      game.roadLines.forEach(line => {
        line.y += game.speed;
        if (line.y > height) line.y -= height + 60;
      });
      game.buildings.forEach(b => {
        b.y += game.speed * 0.2;
        if (b.y > height + 100) {
          b.y = -200;
          b.h = 80 + Math.random() * 100;
        }
      });

      // Particles
      game.particles = game.particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.life--;
        return p.life > 0;
      });

      draw(ctx, game);

      // Pass state out to React for HUD and 3D Car Overlay
      setScore(game.score);
      setSpeed(Math.round(game.speed * 15));
      setTokens(game.tokens);
      setCarPos({ x: game.car.x, y: game.carY, tilt });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    const endGame = () => {
      game.running = false;
      const msg = GAME_OVER_MESSAGES[Math.floor(Math.random() * GAME_OVER_MESSAGES.length)];
      setGameOverMsg(msg);
      setGameState('over');

      const newStats = {
        highScore: Math.max(stats.highScore, game.score),
        gamesPlayed: stats.gamesPlayed + 1,
        totalTokens: stats.totalTokens + game.tokens,
      };
      saveGameStats(newStats);
      setStats(newStats);

      updateProfile({
        totalPoints: profile.totalPoints + game.tokens,
        gameHighScore: newStats.highScore,
      });
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, draw, stats, profile, updateProfile]);

  useEffect(() => {
    const cleanup = startGame();
    return cleanup;
  }, [startGame]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-dark-950">

      {/* 2D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block" />

      {/* 3D Car Overlay */}
      {gameState === 'playing' && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${carPos.x - 30}px`, // Center the wider 120px 3D canvas over the 60px 2D car hitbox
            top: `${carPos.y - 20}px`,
            width: '120px',
            height: '180px'
          }}
        >
          <Canvas camera={{ position: [0, 4, 3], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <Car3DModel autoMode={autoMode} tilt={carPos.tilt} />
            <Environment preset="city" />
          </Canvas>
        </div>
      )}

      {/* Main UI Overlay */}
      <AnimatePresence>
        {gameState === 'playing' && autoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-900/40 backdrop-blur-[2px] pointer-events-none"
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl font-display font-bold gradient-text text-center tracking-tight drop-shadow-2xl mb-4"
            >
              yntro.
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white font-medium mb-12 drop-shadow-lg text-center px-4"
            >
              Drive Towards a Greener Future.
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
              className="glass rounded-full px-8 py-4 pointer-events-auto cursor-pointer hover:bg-white/10 transition-all shadow-2xl shadow-primary-500/20"
              onClick={() => {
                setAutoMode(false);
                if (gameRef.current) {
                  const game = gameRef.current;
                  game.autoMode = false;
                  // Reset the "fake" data accumulated by the AI
                  game.score = 0;
                  game.tokens = 0;
                  game.distance = 0;
                  game.speed = 3;
                  // Clear nearby obstacles
                  game.objects = game.objects.filter(o => o.y < game.height * 0.3);
                }
              }}
            >
              <div className="flex items-center gap-4 text-white">
                <Gamepad2 size={32} className="animate-pulse text-primary-400" />
                <div className="text-left">
                  <p className="font-bold text-lg leading-tight">Take Control</p>
                  <p className="text-xs text-primary-300">Tap or press Arrow Keys</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 text-white/70 pointer-events-auto">
              <Link to="/explore" className="flex items-center gap-2 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                <span>Explore Platform</span> <span className="text-xl">→</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Game HUD */}
      <AnimatePresence>
        {gameState === 'playing' && !autoMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-4 right-4 z-20 flex justify-between pointer-events-none"
          >
            <div className="glass rounded-2xl px-6 py-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-dark-300 uppercase font-bold tracking-wider mb-1">Score</span>
              <span className="text-2xl font-display font-bold text-white">{score}</span>
            </div>
            <div className="glass rounded-2xl px-6 py-3 flex flex-col items-center min-w-[100px]">
              <span className="text-xs text-dark-300 uppercase font-bold tracking-wider mb-1">Tokens</span>
              <span className="text-2xl font-display font-bold text-primary-400">{tokens}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState === 'over' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-dark-900/80 backdrop-blur-md px-4"
          >
            <div className="glass shadow-2xl shadow-primary-500/10 rounded-3xl p-8 max-w-lg text-center w-full">
              <div className="flex justify-center mb-4">
                <Gamepad2 size={64} className="text-primary-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">{gameOverMsg.text}</h2>
              <p className="text-primary-300 text-sm mb-8">{gameOverMsg.sub}</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass-light rounded-2xl p-4">
                  <p className="text-2xl font-bold text-white">{score}</p>
                  <p className="text-xs text-dark-300 uppercase tracking-wider">Score</p>
                </div>
                <div className="glass-light rounded-2xl p-4">
                  <p className="text-2xl font-bold text-primary-400">{tokens}</p>
                  <p className="text-xs text-dark-300 uppercase tracking-wider">Tokens</p>
                </div>
                <div className="glass-light rounded-2xl p-4">
                  <p className="text-2xl font-bold text-accent-400">{stats.highScore}</p>
                  <p className="text-xs text-dark-300 uppercase tracking-wider">Best</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
                >
                  Play Again
                </button>
                <Link
                  to="/explore"
                  className="flex-1 glass text-white rounded-xl py-4 font-bold text-lg hover:bg-dark-800 transition-colors flex items-center justify-center"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Controls */}
      {gameState === 'playing' && !autoMode && (
        <div className="absolute bottom-8 left-4 right-4 z-20 flex justify-between md:hidden">
          <button
            className="w-24 h-24 glass rounded-full flex items-center justify-center text-white/50 active:text-white active:bg-white/10 transition-colors"
            onClick={() => {
              const game = gameRef.current;
              if (game && game.running) {
                game.car.lane = Math.max(0, game.car.lane - 1);
                game.car.targetX = game.roadX + game.car.lane * game.laneWidth + game.laneWidth / 2 - CAR_WIDTH / 2;
              }
            }}
          >
            <span className="text-4xl">←</span>
          </button>
          <button
            className="w-24 h-24 glass rounded-full flex items-center justify-center text-white/50 active:text-white active:bg-white/10 transition-colors"
            onClick={() => {
              const game = gameRef.current;
              if (game && game.running) {
                game.car.lane = Math.min(LANE_COUNT - 1, game.car.lane + 1);
                game.car.targetX = game.roadX + game.car.lane * game.laneWidth + game.laneWidth / 2 - CAR_WIDTH / 2;
              }
            }}
          >
            <span className="text-4xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
