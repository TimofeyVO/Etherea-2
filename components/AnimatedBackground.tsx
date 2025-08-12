import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      // Increased from 30 to 40 particles
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.4 + 0.1,
          duration: Math.random() * 15 + 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base stable gradient background - darkened */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #EDEDF7 0%, #E8C4DC 50%, #E195C2 100%)',
        }}
      />

      {/* Animated gradient overlay layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 25% 25%, rgba(255, 183, 228, 0.15) 0%, transparent 60%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 25% 25%, rgba(255, 183, 228, 0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 75% 25%, rgba(255, 232, 165, 0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 75% 75%, rgba(224, 187, 255, 0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 25% 75%, rgba(255, 183, 228, 0.15) 0%, transparent 60%)',
            'radial-gradient(circle at 25% 25%, rgba(255, 183, 228, 0.15) 0%, transparent 60%)',
          ],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 75% 75%, rgba(255, 232, 165, 0.12) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 75% 75%, rgba(255, 232, 165, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 25% 75%, rgba(224, 187, 255, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 25% 25%, rgba(255, 183, 228, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 75% 25%, rgba(255, 232, 165, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 75% 75%, rgba(255, 232, 165, 0.12) 0%, transparent 50%)',
          ],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(224, 187, 255, 0.08) 0%, transparent 40%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(224, 187, 255, 0.08) 0%, transparent 40%)',
            'radial-gradient(circle at 30% 70%, rgba(255, 183, 228, 0.08) 0%, transparent 40%)',
            'radial-gradient(circle at 70% 30%, rgba(255, 232, 165, 0.08) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(224, 187, 255, 0.08) 0%, transparent 40%)',
          ],
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 5
        }}
      />

      {/* Subtle aurora effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 183, 228, 0.06) 25%, rgba(255, 232, 165, 0.06) 50%, rgba(224, 187, 255, 0.06) 75%, transparent 100%)',
          transform: 'translateX(-100%) skewX(-15deg)',
        }}
        animate={{
          transform: [
            'translateX(-100%) skewX(-15deg)',
            'translateX(100%) skewX(-15deg)',
            'translateX(-100%) skewX(-15deg)',
          ],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />

      {/* Floating iridescent particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, rgba(255, 183, 228, ${particle.opacity}) 0%, rgba(255, 232, 165, ${particle.opacity * 0.7}) 50%, rgba(224, 187, 255, ${particle.opacity * 0.5}) 100%)`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            x: [0, Math.random() * 60 - 30, 0],
            y: [0, Math.random() * 60 - 30, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.4, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Soft light rays */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"
          style={{ transform: 'rotate(12deg)', transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scaleY: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ transform: 'rotate(-12deg)', transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.15, 0.3, 0.15],
            scaleY: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent"
          style={{ transform: 'rotate(6deg)', transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.1, 0.25, 0.1],
            scaleY: [1, 1.08, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
    </div>
  );
}