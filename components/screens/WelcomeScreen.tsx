import { motion } from 'framer-motion';
import { GlassButton } from '../GlassButton';
import { Wallet, ArrowRight } from 'lucide-react';
import logoImage from 'figma:asset/d00e2b5924d98f768e2c28c871fa0a8cd6652c9e.png';

interface WelcomeScreenProps {
  onNext: () => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

export function WelcomeScreen({ onNext, onConnectWallet, isWalletConnected, walletAddress }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative py-8">
      {/* Floating decorative elements - stable positions and smooth animations */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--iridescent-pink) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0, 0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="absolute bottom-32 right-16 w-16 h-16 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--iridescent-gold) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{
          scale: [1.2, 0.8, 1.2],
          opacity: [0, 0.2, 0.5, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
      />

      <motion.div
        className="absolute top-1/3 right-8 w-12 h-12 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, var(--iridescent-lilac) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: [0, -20, 0],
          opacity: [0, 0.25, 0.4, 0.25],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Main content */}
      <motion.div
        className="text-center max-w-2xl mx-auto flex-1 flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        {/* New Logo - completely clean, no background effects */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <motion.div className="relative">
            {/* Logo with NO background styling at all */}
            <motion.img
              src={logoImage}
              alt="Etherea Logo"
              className="w-48 h-48 relative z-20"
              style={{
                // Completely remove any background styling
                filter: 'none'
              }}
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(255, 183, 228, 0.3))',
                  'drop-shadow(0 0 40px rgba(255, 232, 165, 0.4))',
                  'drop-shadow(0 0 20px rgba(224, 187, 255, 0.3))',
                  'drop-shadow(0 0 20px rgba(255, 183, 228, 0.3))',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
            />
            
            {/* Orbiting particles around the logo */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full z-30"
                style={{
                  background: i === 0 ? 'var(--iridescent-pink)' : i === 1 ? 'var(--iridescent-gold)' : 'var(--iridescent-lilac)',
                  top: '50%',
                  left: '50%',
                  marginTop: '-6px',
                  marginLeft: '-6px',
                }}
                initial={{ 
                  rotate: i * 120, 
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  rotate: 360,
                  scale: [0, 1, 1.5, 1],
                  opacity: [0, 1, 1, 1]
                }}
                transition={{
                  rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: 1.8 },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 + 1.8 },
                  opacity: { duration: 0.3, delay: 1.8 }
                }}
                style={{
                  transformOrigin: `${80 + i * 20}px 0px`, // Adjusted for larger logo
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Main title with smooth separate animation */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{
            background: 'var(--etherea-gradient)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundPosition: '0% 50%',
            filter: 'drop-shadow(0 1px 2px rgba(168, 85, 247, 0.4))',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ 
            opacity: { duration: 0.6, ease: "easeOut", delay: 0.6 },
            y: { duration: 0.6, ease: "easeOut", delay: 0.6 },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }
          }}
        >
          Etherea
        </motion.h1>

        {/* Subtitle with separate smooth animation */}
        <motion.p
          className="text-xl md:text-2xl mb-12"
          style={{
            color: '#2E2E3A',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
        >
          Create a Solana token in a few steps
        </motion.p>

        {/* Wallet connection with smooth animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
        >
          {!isWalletConnected ? (
            <GlassButton
              onClick={onConnectWallet}
              size="lg"
              className="mb-4 relative z-10"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </GlassButton>
          ) : (
            <motion.div
              className="glass-card px-6 py-4 inline-flex items-center gap-3 mb-4 relative z-10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse relative z-20" />
              <span className="text-gray-700 relative z-20" style={{ color: '#2E2E3A', fontWeight: '600' }}>
                Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Start button with smooth animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.5 }}
        >
          <GlassButton
            onClick={onNext}
            size="lg"
            disabled={!isWalletConnected}
            className="min-w-48 relative z-10"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </GlassButton>
        </motion.div>
      </motion.div>

      {/* Bottom decorative text - moved UP by additional 15px for better PC visibility */}
      <motion.div
        className="text-center text-sm"
        style={{
          color: '#6B6B7D',
          fontWeight: '500',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
          paddingBottom: '29px', // Increased from 14px back to 29px (moved UP more)
          marginBottom: '15px' // Additional spacing for better visibility
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p>Powered by Solana blockchain technology</p>
      </motion.div>
    </div>
  );
}