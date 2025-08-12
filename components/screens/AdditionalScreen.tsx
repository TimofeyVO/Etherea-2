import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GlassButton } from '../GlassButton';
import { ArrowLeft, ArrowRight, Coins, Shield, Droplets, Eye, Lock, Star } from 'lucide-react';

interface AdditionalData {
  mintable: boolean;
  burnable: boolean;
  liquidityPool: boolean;
  scannerListing: boolean;
  taxRate: string;
  liquidityLock: boolean;
  liquidityLockDays: string;
  platformMint: boolean;
}

interface AdditionalScreenProps {
  onNext: (data: AdditionalData) => void;
  onBack: () => void;
  initialData?: Partial<AdditionalData>;
}

export function AdditionalScreen({ onNext, onBack, initialData }: AdditionalScreenProps) {
  const [formData, setFormData] = useState<AdditionalData>({
    mintable: initialData?.mintable || false,
    burnable: initialData?.burnable || false,
    liquidityPool: initialData?.liquidityPool || false,
    scannerListing: initialData?.scannerListing || false,
    taxRate: initialData?.taxRate || '1',
    liquidityLock: initialData?.liquidityLock || false,
    liquidityLockDays: initialData?.liquidityLockDays || '30',
    platformMint: initialData?.platformMint || false,
  });

  const handleSubmit = () => {
    // Validation to prevent 0 days for Liquidity Lock
    if (formData.liquidityLock && (parseInt(formData.liquidityLockDays) < 1)) {
      // Reset to minimum 1 day if invalid
      setFormData(prev => ({ ...prev, liquidityLockDays: '1' }));
      return;
    }
    onNext(formData);
  };

  const toggleFeature = (feature: keyof AdditionalData) => {
    if (feature === 'taxRate' || feature === 'liquidityLockDays') return; // Don't toggle these fields
    setFormData(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleTaxRateChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      taxRate: value.toString()
    }));
  };

  const handleLiquidityLockDaysChange = (value: string) => {
    // Only allow numbers 1-365 and prevent 0
    const numValue = parseInt(value) || 1; // Default to 1 if invalid
    if (numValue >= 1 && numValue <= 365) {
      setFormData(prev => ({
        ...prev,
        liquidityLockDays: value
      }));
    }
  };

  // Function to convert days to human readable format
  const formatLockPeriod = (days: string): string => {
    const numDays = parseInt(days) || 0;
    if (numDays === 0) return '';
    
    const years = Math.floor(numDays / 365);
    const months = Math.floor((numDays % 365) / 30);
    const weeks = Math.floor(((numDays % 365) % 30) / 7);
    const remainingDays = ((numDays % 365) % 30) % 7;
    
    const parts = [];
    
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
    if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);
    
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(' and ');
    
    // For 3+ parts: "X months, Y weeks and Z days"
    const lastPart = parts.pop();
    return parts.join(', ') + ' and ' + lastPart;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold screen-heading mb-2">Additional Features</h2>
          <p 
            className="text-gray-600"
            style={{
              color: '#4A4A5A',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
            }}
          >
            Enhance your token with advanced functionality
          </p>
        </motion.div>

        {/* Main Features - 2x2 Grid with FIXED hover animations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Mintable - FIXED hover animation and independent toggle */}
          <motion.div
            className="glass-card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ 
              scale: 1.014, // Reduced by 30%: was 1.02, now ~1.014
              y: -1.4,     // Reduced by 30%: was -2, now ~-1.4
            }}
            transition={{
              // FIXED: Made 20% slower for smoother animation
              scale: { duration: 0.18 }, // Was 0.15, now 0.18 (20% slower)
              y: { duration: 0.18 },
              // No delay on exit - immediate response
              default: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                  <Coins className="w-6 h-6 text-purple-500 relative z-20" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                    Mintable
                  </h3>
                  <p className="text-sm" style={{ color: '#5A5A6B' }}>
                    Allow creating new tokens after deployment
                  </p>
                </div>
              </div>
              
              {/* FIXED: Individual Toggle Switch - completely independent */}
              <motion.button
                onClick={() => toggleFeature('mintable')}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.mintable ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.mintable 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.mintable ? '23px' : '2px',
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Burnable - FIXED hover animation and independent toggle */}
          <motion.div
            className="glass-card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ 
              scale: 1.014, 
              y: -1.4,
            }}
            transition={{
              scale: { duration: 0.18 },
              y: { duration: 0.18 },
              default: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                  <Shield className="w-6 h-6 text-purple-500 relative z-20" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                    Burnable
                  </h3>
                  <p className="text-sm" style={{ color: '#5A5A6B' }}>
                    Allow token holders to burn their tokens
                  </p>
                </div>
              </div>
              
              {/* FIXED: Individual Toggle Switch - completely independent */}
              <motion.button
                onClick={() => toggleFeature('burnable')}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.burnable ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.burnable 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.burnable ? '26px' : '2px',
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Create Liquidity Pool - FIXED hover animation and independent toggle */}
          <motion.div
            className="glass-card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ 
              scale: 1.014, 
              y: -1.4,
            }}
            transition={{
              scale: { duration: 0.18 },
              y: { duration: 0.18 },
              default: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                  <Droplets className="w-6 h-6 text-purple-500 relative z-20" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                    Create Liquidity Pool
                  </h3>
                  <p className="text-sm" style={{ color: '#5A5A6B' }}>
                    Automatically create a liquidity pool on Raydium
                  </p>
                </div>
              </div>
              
              {/* FIXED: Individual Toggle Switch - completely independent */}
              <motion.button
                onClick={() => toggleFeature('liquidityPool')}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.liquidityPool ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.liquidityPool 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.liquidityPool ? '20px' : '2px',
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Add to Scanners - FIXED hover animation and independent toggle */}
          <motion.div
            className="glass-card p-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ 
              scale: 1.014, 
              y: -1.4,
            }}
            transition={{
              scale: { duration: 0.18 },
              y: { duration: 0.18 },
              default: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                  <Eye className="w-6 h-6 text-purple-500 relative z-20" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                    Add to Scanners
                  </h3>
                  <p className="text-sm" style={{ color: '#5A5A6B' }}>
                    Submit token to popular Solana scanners
                  </p>
                </div>
              </div>
              
              {/* FIXED: Individual Toggle Switch - completely independent */}
              <motion.button
                onClick={() => toggleFeature('scannerListing')}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.scannerListing ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.scannerListing 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.scannerListing ? '25px' : '2px',
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Transaction Tax Rate Section - FIXED hover animation and isolated from toggles */}
        <motion.div
          className="glass-card p-5 mb-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ 
            scale: 1.014, 
            y: -1.4,
          }}
          transition={{
            scale: { duration: 0.18 },
            y: { duration: 0.18 },
            default: { duration: 0.15 }
          }}
        >
          <div className="space-y-3">
            <h3 className="font-semibold" style={{ color: '#2E2E3A' }}>
              Transaction Tax Rate (%)
            </h3>
            
            {/* FIXED: Purple Gradient Slider - isolated from toggle animations */}
            <div className="relative">
              <div className="w-full h-3 rounded-full bg-gray-200 relative overflow-hidden">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #9F7AEA 0%, #D97BB8 50%, #8975D1 100%)', // 15% desaturated version of etherea gradient
                  }}
                />
              </div>
              
              <input
                type="range"
                min="1"
                max="99"
                value={formData.taxRate}
                onChange={(e) => handleTaxRateChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                style={{ zIndex: 10 }}
              />
              
              <motion.div
                className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-purple-400 pointer-events-none"
                style={{
                  left: `${((Number(formData.taxRate) - 1) / 98) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20
                }}
                // REMOVED: Any animation that could interfere with toggles
              />
            </div>
            
            {/* Simplified display */}
            <div className="flex justify-center">
              <motion.span 
                className="font-bold text-lg"
                style={{ color: '#2E2E3A' }}
                key={formData.taxRate}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formData.taxRate}%
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Security Features Section with FIXED Liquidity Lock expansion and independent toggles */}
        <motion.div
          className="glass-card p-6 mb-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ 
            scale: 1.014, 
            y: -1.4,
          }}
          transition={{
            scale: { duration: 0.18 },
            y: { duration: 0.18 },
            default: { duration: 0.15 }
          }}
        >
          <div className="space-y-6">
            <h3 className="font-semibold" style={{ color: '#2E2E3A' }}>
              Security Features
            </h3>
            
            {/* Liquidity Lock with expandable period input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                    <Lock className="w-6 h-6 text-purple-500 relative z-20" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                      Liquidity Lock
                    </h4>
                    <p className="text-sm" style={{ color: '#5A5A6B' }}>
                      Lock liquidity for a specified period
                    </p>
                  </div>
                </div>
                
                {/* FIXED: Individual Toggle Switch - completely independent */}
                <motion.button
                  onClick={() => toggleFeature('liquidityLock')}
                  className={`relative w-14 h-7 rounded-full overflow-hidden ${
                    formData.liquidityLock ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    backgroundColor: formData.liquidityLock 
                      ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                      : 'rgb(209, 213, 219)'
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    style={{ zIndex: 10 }}
                    animate={{
                      left: formData.liquidityLock ? '26px' : '2px',
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.button>
              </div>

              {/* Smoother expandable liquidity lock period input */}
              <AnimatePresence>
                {formData.liquidityLock && (
                  <motion.div
                    className="space-y-3 pl-16"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto', 
                      y: 0,
                      transition: {
                        height: { duration: 0.4, ease: "easeOut" },
                        opacity: { duration: 0.25, delay: 0.1 },
                        y: { duration: 0.3, ease: "easeOut" }
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0, 
                      y: -10,
                      transition: {
                        height: { duration: 0.3, ease: "easeIn" },
                        opacity: { duration: 0.15 },
                        y: { duration: 0.2, ease: "easeIn" }
                      }
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2E2E3A' }}>
                        Enter liquidity lock period (in days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={formData.liquidityLockDays}
                        onChange={(e) => handleLiquidityLockDaysChange(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 no-arrows"
                        placeholder="Enter days (1-365)"
                      />
                    </div>
                    
                    {/* Smart period display */}
                    {parseInt(formData.liquidityLockDays) > 0 && (
                      <motion.div
                        className="text-sm font-medium"
                        style={{ color: '#8B5CF6' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Lock period: {formatLockPeriod(formData.liquidityLockDays)}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create Coin from Platform - FIXED: Individual toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                  <Star className="w-6 h-6 text-purple-500 relative z-20" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: '#2E2E3A' }}>
                    Create Coin from Platform
                  </h4>
                  <p className="text-sm" style={{ color: '#5A5A6B' }}>
                    The token will be created from our wallet, and you will have all the rights
                  </p>
                </div>
              </div>
              
              {/* FIXED: Individual Toggle Switch - completely independent */}
              <motion.button
                onClick={() => toggleFeature('platformMint')}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.platformMint ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.platformMint 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.platformMint ? '26px' : '2px',
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <GlassButton onClick={onBack} variant="outline" className="relative z-10">
            <ArrowLeft className="w-5 h-5" />
            Back
          </GlassButton>
          <GlassButton onClick={handleSubmit} className="relative z-10">
            Next
            <ArrowRight className="w-5 h-5" />
          </GlassButton>
        </motion.div>
      </motion.div>
    </div>
  );
}