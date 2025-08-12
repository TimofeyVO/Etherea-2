import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { WhitelistScreen } from './components/screens/WhitelistScreen';
import { AdditionalScreen } from './components/screens/AdditionalScreen';
import { PreviewScreen } from './components/screens/PreviewScreen';
import { Footer } from './components/Footer';
import logoImage from 'figma:asset/d00e2b5924d98f768e2c28c871fa0a8cd6652c9e.png';

type ScreenType = 'welcome' | 'settings' | 'whitelist' | 'additional' | 'preview';

interface SettingsData {
  name: string;
  symbol: string;
  description: string;
  totalSupply: string;
  decimals: string;
  imageFile: File | null;
  imagePreview: string;
}

interface WhitelistData {
  addresses: string[];
  maxPerWallet: string;
  isEnabled: boolean;
  // New additional whitelist features
  prohibitSales: boolean;
  prohibitTransfers: boolean;
}

interface AdditionalData {
  mintable: boolean;
  burnable: boolean;
  liquidityPool: boolean; // Changed from freezable
  scannerListing: boolean; // Changed from revokable
  taxRate: string;
  liquidityLock: boolean;
  liquidityLockDays: string; // NEW: Added liquidity lock period
  platformMint: boolean; // Changed from antiBot
}

interface AppData {
  settings: SettingsData;
  whitelist: WhitelistData;
  additional: AdditionalData;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  const [appData, setAppData] = useState<AppData>({
    settings: {
      name: '',
      symbol: '',
      description: '',
      totalSupply: '1000000', // Back to 1 million as default
      decimals: '9',
      imageFile: null,
      imagePreview: '',
    },
    whitelist: {
      addresses: [],
      maxPerWallet: '100',
      isEnabled: false,
      // New additional whitelist features - disabled by default
      prohibitSales: false,
      prohibitTransfers: false,
    },
    additional: {
      // ALL features disabled by default
      mintable: false,
      burnable: false,
      liquidityPool: false,
      scannerListing: false,
      taxRate: '1',
      liquidityLock: false,
      liquidityLockDays: '30', // NEW: Default 30 days
      platformMint: false,
    },
  });

  const handleConnectWallet = async () => {
    // Mock wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsWalletConnected(true);
    setWalletAddress('7xKK4XRk8Nk6zKx7b9mH5pL2vN8sQ1wR4eT6yU7iO9pA');
  };

  const handleNext = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleBack = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleSettingsComplete = (data: SettingsData) => {
    setAppData(prev => ({ ...prev, settings: data }));
    setCurrentScreen('whitelist');
  };

  const handleWhitelistComplete = (data: WhitelistData) => {
    setAppData(prev => ({ ...prev, whitelist: data }));
    setCurrentScreen('additional');
  };

  const handleAdditionalComplete = (data: AdditionalData) => {
    setAppData(prev => ({ ...prev, additional: data }));
    setCurrentScreen('preview');
  };

  const handleComplete = () => {
    // Reset to welcome screen or handle completion
    setCurrentScreen('welcome');
    // Could also show a completion modal or redirect
  };

  const screenDirection = {
    welcome: 0,
    settings: 1,
    whitelist: 2,
    additional: 3,
    preview: 4,
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleScreenChange = (newScreen: ScreenType) => {
    const newDirection = screenDirection[newScreen] - screenDirection[currentScreen];
    setDirection(newDirection);
    setCurrentScreen(newScreen);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Progress indicator with repositioned logo - logo outside left, gray panel centered */}
      <motion.div
        className="sticky top-0 left-0 right-0 z-50"
        style={{ marginTop: '-5px' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative mx-4 mt-4">
          {/* Large logo positioned outside and to the left */}
          <motion.img
            src={logoImage}
            alt="Etherea Logo"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20"
            style={{ 
              width: 'calc(80% * 0.8)', // 20% smaller than white panel width (80% of panel)
              height: 'auto',
              maxWidth: '48px', // Cap maximum size
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Glass card shifted right to center around logo + Etherea */}
          <div className="glass-card px-6 py-3" style={{ marginLeft: '60px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Gray background centered around Etherea title only */}
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-lg backdrop-blur-sm"
                    style={{ 
                      margin: '-4px -6px',
                      borderRadius: '8px',
                      background: 'rgba(0, 0, 0, 0.105)' // 25% lighter than 0.14
                    }}
                  />
                  
                  {/* Etherea title centered in gray background */}
                  <h1 className="text-lg font-bold etherea-title relative z-10 px-1">Etherea</h1>
                </div>
                
                {/* Navigation moved further right */}
                <div className="hidden md:flex items-center gap-2 text-sm relative" style={{ marginLeft: '35px' }}>
                  <span 
                    className={`relative z-10 px-2 py-1 ${currentScreen === 'welcome' ? 'etherea-title font-bold' : ''}`}
                    style={{ color: '#4A4A5A', fontWeight: '600' }}
                  >
                    Welcome
                  </span>
                  <span style={{ color: '#6B6B7D', position: 'relative', zIndex: 10 }}>→</span>
                  <span 
                    className={`relative z-10 px-2 py-1 ${currentScreen === 'settings' ? 'etherea-title font-bold' : ''}`}
                    style={{ color: '#4A4A5A', fontWeight: '600' }}
                  >
                    Settings
                  </span>
                  <span style={{ color: '#6B6B7D', position: 'relative', zIndex: 10 }}>→</span>
                  <span 
                    className={`relative z-10 px-2 py-1 ${currentScreen === 'whitelist' ? 'etherea-title font-bold' : ''}`}
                    style={{ color: '#4A4A5A', fontWeight: '600' }}
                  >
                    Whitelist
                  </span>
                  <span style={{ color: '#6B6B7D', position: 'relative', zIndex: 10 }}>→</span>
                  <span 
                    className={`relative z-10 px-2 py-1 ${currentScreen === 'additional' ? 'etherea-title font-bold' : ''}`}
                    style={{ color: '#4A4A5A', fontWeight: '600' }}
                  >
                    Features
                  </span>
                  <span style={{ color: '#6B6B7D', position: 'relative', zIndex: 10 }}>→</span>
                  <span 
                    className={`relative z-10 px-2 py-1 ${currentScreen === 'preview' ? 'etherea-title font-bold' : ''}`}
                    style={{ color: '#4A4A5A', fontWeight: '600' }}
                  >
                    Create
                  </span>
                </div>
              </div>
              
              {/* Enhanced progress bar with soft colors */}
              <div className="flex-1 max-w-xs ml-4">
                <div className="h-3 enhanced-progress-bg rounded-full overflow-hidden">
                  <motion.div
                    className="h-full enhanced-progress-fill"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${(screenDirection[currentScreen] / 4) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screen content container */}
      <div className="relative min-h-screen">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="relative w-full"
          >
            {currentScreen === 'welcome' && (
              <WelcomeScreen
                onNext={() => handleScreenChange('settings')}
                onConnectWallet={handleConnectWallet}
                isWalletConnected={isWalletConnected}
                walletAddress={walletAddress}
              />
            )}
            
            {currentScreen === 'settings' && (
              <SettingsScreen
                onNext={handleSettingsComplete}
                onBack={() => handleScreenChange('welcome')}
                initialData={appData.settings}
              />
            )}
            
            {currentScreen === 'whitelist' && (
              <WhitelistScreen
                onNext={handleWhitelistComplete}
                onBack={() => handleScreenChange('settings')}
                initialData={appData.whitelist}
              />
            )}
            
            {currentScreen === 'additional' && (
              <AdditionalScreen
                onNext={handleAdditionalComplete}
                onBack={() => handleScreenChange('whitelist')}
                initialData={appData.additional}
              />
            )}
            
            {currentScreen === 'preview' && (
              <PreviewScreen
                onBack={() => handleScreenChange('additional')}
                onComplete={handleComplete}
                data={appData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />

      {/* Enhanced floating particles for mobile interaction - increased from 8 to 15 */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}