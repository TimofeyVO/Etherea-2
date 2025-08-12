import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassButton } from '../GlassButton';
import { ArrowLeft, Rocket, Eye, Users, Droplets, Shield, Coins, Copy, ExternalLink, Star, Edit } from 'lucide-react';

interface PreviewData {
  settings: {
    name: string;
    symbol: string;
    description: string;
    totalSupply: string;
    decimals: string;
    imagePreview: string;
  };
  whitelist: {
    addresses: string[];
    maxPerWallet: string;
    isEnabled: boolean;
    // New additional whitelist features
    prohibitSales: boolean;
    prohibitTransfers: boolean;
  };
  additional: {
    mintable: boolean;
    burnable: boolean;
    liquidityPool: boolean; // Changed from freezable
    scannerListing: boolean; // Changed from revokable
    taxRate: string;
    liquidityLock: boolean;
    liquidityLockDays: string; // ADDED: Liquidity lock period
    platformMint: boolean; // Changed from antiBot
  };
}

interface PreviewScreenProps {
  onBack: () => void;
  onComplete: () => void;
  data: PreviewData;
}

export function PreviewScreen({ onBack, onComplete, data }: PreviewScreenProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate token creation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock transaction hash
    setTransactionHash('3KqK4XRk8Nk6zKx7b9mH5pL2vN8sQ1wR4eT6yU7iO9pA');
    setIsCreating(false);
    setIsComplete(true);
    
    // Auto-complete after showing success
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const features = [
    { key: 'mintable', icon: Coins, label: 'Mintable', active: data.additional.mintable },
    { key: 'burnable', icon: Shield, label: 'Burnable', active: data.additional.burnable },
    { key: 'liquidityPool', icon: Droplets, label: 'Liquidity Pool', active: data.additional.liquidityPool }, // Changed from freezable
    { key: 'scannerListing', icon: Eye, label: 'Scanner Listing', active: data.additional.scannerListing }, // Changed from revokable
  ];

  const formatSupplyDisplay = (supply: string) => {
    const num = Number(supply);
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(1)}T`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return num.toLocaleString();
  };

  // ADDED: Function to format liquidity lock period for display
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="w-12 h-12 rounded-full glass-card flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255, 183, 228, 0.3)',
                  '0 0 40px rgba(255, 232, 165, 0.4)',
                  '0 0 20px rgba(224, 187, 255, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="w-6 h-6 text-pink-400" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold screen-heading mb-2">Preview & Create</h2>
          <p 
            className="text-gray-600"
            style={{
              color: '#4A4A5A',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
            }}
          >
            Review your token configuration before launch
          </p>
        </motion.div>

        {/* Preview Card */}
        <motion.div
          className="glass-card p-8 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 249, 252, 0.2) 0%, rgba(255, 215, 232, 0.15) 50%, rgba(224, 187, 255, 0.1) 100%)',
            borderImage: 'linear-gradient(135deg, var(--iridescent-pink), var(--iridescent-gold), var(--iridescent-lilac)) 1',
            boxShadow: '0 20px 40px rgba(255, 183, 228, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
            {/* Token Info */}
            <div className="space-y-6">
              {/* Token Header */}
              <div className="flex items-center gap-4">
                {data.settings.imagePreview ? (
                  <motion.div
                    className="relative flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    {/* Animated border circle - thinner border */}
                    <motion.div
                      className="absolute rounded-full"
                      style={{
                        width: '88px',
                        height: '88px',
                        background: 'conic-gradient(from 0deg, var(--iridescent-pink), var(--iridescent-gold), var(--iridescent-lilac), var(--iridescent-pink))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Larger image with thinner border */}
                    <img
                      src={data.settings.imagePreview}
                      alt={data.settings.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-lg relative z-10"
                    />
                  </motion.div>
                ) : (
                  <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center relative z-10">
                    <Coins className="w-10 h-10 text-gray-400 relative z-20" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#2E2E3A' }}>{data.settings.name}</h3>
                  <p className="text-lg" style={{ color: '#5A5A6B' }}>${data.settings.symbol}</p>
                </div>
              </div>

              {/* Description with icon - FIXED overflow clipping */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold" style={{ color: '#2E2E3A', fontWeight: '700' }}>Description</h4>
                </div>
                <div className="bg-white/30 rounded-lg p-3 relative z-10">
                  <p 
                    className="overflow-hidden text-ellipsis"
                    style={{ 
                      color: '#4A4A5A',
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.5',
                      maxHeight: '4.5em' // 3 lines × 1.5 line-height
                    }}
                  >
                    {data.settings.description}
                  </p>
                </div>
              </div>

              {/* Token Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/30 rounded-lg p-4 relative z-10">
                  <p className="text-sm" style={{ color: '#6B6B7D' }}>Total Supply</p>
                  <p className="text-lg font-semibold" style={{ color: '#2E2E3A' }}>
                    {formatSupplyDisplay(data.settings.totalSupply)}
                  </p>
                </div>
                <div className="bg-white/30 rounded-lg p-4 relative z-10">
                  <p className="text-sm" style={{ color: '#6B6B7D' }}>Decimals</p>
                  <p className="text-lg font-semibold" style={{ color: '#2E2E3A' }}>{data.settings.decimals}</p>
                </div>
              </div>

              {/* Features with icon */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold" style={{ color: '#2E2E3A', fontWeight: '700' }}>Features</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 relative z-10 ${
                        feature.active 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-600'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.07 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <feature.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{feature.label}</span>
                      <span className="text-xs ml-auto">
                        {feature.active ? 'Active' : 'Disabled'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuration Details */}
            <div className="space-y-6">
              {/* Whitelist with icon and new features */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold" style={{ color: '#2E2E3A', fontWeight: '700' }}>Whitelist</h4>
                </div>
                {data.whitelist.isEnabled ? (
                  <div className="space-y-2">
                    <div className="bg-white/30 rounded-lg p-3 relative z-10">
                      <p className="text-sm" style={{ color: '#4A4A5A' }}>
                        <span className="font-medium">{data.whitelist.addresses.length}</span> addresses whitelisted
                      </p>
                    </div>
                    <div className="max-h-24 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {/* Show maximum 5 addresses without "+more" text */}
                        {data.whitelist.addresses.slice(0, 5).map((addr, index) => (
                          <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {addr.slice(0, 6)}...
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* New whitelist features display */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white/30 rounded-lg p-3 relative z-10">
                        <span className="text-sm" style={{ color: '#4A4A5A' }}>Prohibit Sales</span>
                        <span className={`text-sm font-medium ${data.whitelist.prohibitSales ? 'text-green-600' : 'text-red-600'}`}>
                          {data.whitelist.prohibitSales ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white/30 rounded-lg p-3 relative z-10">
                        <span className="text-sm" style={{ color: '#4A4A5A' }}>Prohibit Transfers</span>
                        <span className={`text-sm font-medium ${data.whitelist.prohibitTransfers ? 'text-green-600' : 'text-red-600'}`}>
                          {data.whitelist.prohibitTransfers ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm bg-white/30 rounded-lg p-3 relative z-10" style={{ color: '#6B6B7D' }}>Disabled</p>
                )}
              </div>

              {/* Security with icon */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold" style={{ color: '#2E2E3A', fontWeight: '700' }}>Security</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white/30 rounded-lg p-3 relative z-10">
                    <span className="text-sm" style={{ color: '#4A4A5A' }}>Tax Rate</span>
                    <span className="text-sm font-medium" style={{ color: '#2E2E3A' }}>{data.additional.taxRate}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/30 rounded-lg p-3 relative z-10">
                    <span className="text-sm" style={{ color: '#4A4A5A' }}>Liquidity Lock</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${data.additional.liquidityLock ? 'text-green-600' : 'text-red-600'}`}>
                        {data.additional.liquidityLock ? 'Enabled' : 'Disabled'}
                      </span>
                      {/* ADDED: Show liquidity lock days when enabled */}
                      {data.additional.liquidityLock && (
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                          {formatLockPeriod(data.additional.liquidityLockDays)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/30 rounded-lg p-3 relative z-10">
                    <span className="text-sm" style={{ color: '#4A4A5A' }}>Platform Mint</span>
                    <span className={`text-sm font-medium ${data.additional.platformMint ? 'text-green-600' : 'text-red-600'}`}>
                      {data.additional.platformMint ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success State */}
        {isComplete && (
          <motion.div
            className="glass-card p-8 mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center relative z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, delay: 0.14 }}
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Token Created Successfully!</h3>
            <p style={{ color: '#4A4A5A' }} className="mb-4">Your token has been deployed to the Solana blockchain</p>
            
            {transactionHash && (
              <div className="bg-white/30 rounded-lg p-4 flex items-center justify-between relative z-10">
                <div className="text-left">
                  <p className="text-sm" style={{ color: '#6B6B7D' }}>Transaction Hash</p>
                  <p className="font-mono text-sm" style={{ color: '#2E2E3A' }}>{transactionHash}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => copyToClipboard(transactionHash)}
                    className="p-2 rounded-lg glass-card hover:bg-white/50 transition-colors relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4 text-gray-600 relative z-20" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg glass-card hover:bg-white/50 transition-colors relative z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600 relative z-20" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Create Button */}
        {!isComplete && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div className="relative inline-block">
              <GlassButton
                onClick={handleCreate}
                size="lg"
                disabled={isCreating}
                className="min-w-64 relative overflow-hidden"
              >
                {isCreating ? (
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating Token...
                  </motion.div>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    CREATE TOKEN
                  </>
                )}
              </GlassButton>
              
              {/* Chromatic explosion effect on press */}
              {isCreating && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 183, 228, 0.8) 0%, rgba(255, 232, 165, 0.6) 50%, rgba(224, 187, 255, 0.4) 100%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 2, 4], 
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{ duration: 1.05 }}
                />
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Navigation */}
        {!isComplete && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassButton onClick={onBack} variant="outline" disabled={isCreating} className="relative z-10">
              <ArrowLeft className="w-5 h-5" />
              Back
            </GlassButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}