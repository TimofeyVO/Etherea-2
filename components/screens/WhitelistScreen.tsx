import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GlassButton } from '../GlassButton';
import { ArrowLeft, ArrowRight, Plus, X, Users } from 'lucide-react';

interface WhitelistData {
  addresses: string[];
  maxPerWallet: string;
  isEnabled: boolean;
  // New additional whitelist features
  prohibitSales: boolean;
  prohibitTransfers: boolean;
}

interface WhitelistScreenProps {
  onNext: (data: WhitelistData) => void;
  onBack: () => void;
  initialData?: Partial<WhitelistData>;
}

export function WhitelistScreen({ onNext, onBack, initialData }: WhitelistScreenProps) {
  const [formData, setFormData] = useState<WhitelistData>({
    addresses: initialData?.addresses || [],
    maxPerWallet: initialData?.maxPerWallet || '100',
    isEnabled: initialData?.isEnabled || false,
    // New additional whitelist features - disabled by default
    prohibitSales: initialData?.prohibitSales || false,
    prohibitTransfers: initialData?.prohibitTransfers || false,
  });

  const [newAddress, setNewAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Track which addresses have been animated to prevent re-animation
  const [animatedAddresses, setAnimatedAddresses] = useState<Set<string>>(new Set());

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.isEnabled && formData.addresses.length === 0) {
      newErrors.addresses = 'At least one address is required when whitelist is enabled';
    }

    if (formData.maxPerWallet && (isNaN(Number(formData.maxPerWallet)) || Number(formData.maxPerWallet) <= 0)) {
      newErrors.maxPerWallet = 'Max per wallet must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const addAddress = () => {
    const trimmedAddress = newAddress.trim();
    
    // Check for duplicates and length limit
    if (trimmedAddress && 
        formData.addresses.length < 5 && 
        !formData.addresses.includes(trimmedAddress)) {
      setFormData(prev => ({
        ...prev,
        addresses: [...prev.addresses, trimmedAddress]
      }));
      setNewAddress('');
      // Clear any previous duplicate error
      if (errors.duplicate) {
        setErrors(prev => ({ ...prev, duplicate: '' }));
      }
    } else if (formData.addresses.includes(trimmedAddress)) {
      // Show duplicate error
      setErrors(prev => ({ ...prev, duplicate: 'This address is already added' }));
    }
  };

  const removeAddress = (addressToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr !== addressToRemove)
    }));
    // Keep track of animated addresses even after removal
    // This prevents remaining addresses from re-animating
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newAddress.trim()) {
      e.preventDefault();
      addAddress();
    }
  };

  const toggleWhitelist = () => {
    setFormData(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const toggleFeature = (feature: 'prohibitSales' | 'prohibitTransfers') => {
    setFormData(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-2xl"
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
          <h2 className="text-4xl font-bold screen-heading mb-2">Whitelist Settings</h2>
          <p 
            className="text-gray-600"
            style={{
              color: '#4A4A5A',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
            }}
          >
            Select the wallets that will have additional functions
          </p>
        </motion.div>

        {/* Main Whitelist Card - Dynamic height */}
        <motion.div
          className="glass-card p-8 space-y-8 mb-8 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          transition={{ 
            opacity: { delay: 0.3 },
            scale: { delay: 0.3 }
          }}
        >
          {/* Enable Whitelist Toggle - Centered */}
          <div className="flex flex-col items-center space-y-4 relative z-20">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative z-10">
                <Users className="w-6 h-6 text-purple-500 relative z-20" />
              </div>
              
              {/* Centered "Enable Whitelist" text */}
              <h3 className="text-xl font-semibold text-center" style={{ color: '#2E2E3A', fontWeight: '700' }}>
                Enable Whitelist
              </h3>
              
              {/* Toggle switch with smooth animation */}
              <motion.button
                onClick={toggleWhitelist}
                className={`relative w-14 h-7 rounded-full overflow-hidden ${
                  formData.isEnabled ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={{
                  backgroundColor: formData.isEnabled 
                    ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                    : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  style={{ zIndex: 10 }}
                  animate={{
                    left: formData.isEnabled ? '26px' : '2px',
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Whitelist Content */}
          <AnimatePresence>
            {formData.isEnabled && (
              <motion.div
                className="space-y-6 relative z-20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Add Address Section */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => {
                        setNewAddress(e.target.value);
                        // Clear duplicate error on input change
                        if (errors.duplicate) {
                          setErrors(prev => ({ ...prev, duplicate: '' }));
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter wallet address"
                      className="flex-1 px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 relative z-10"
                      disabled={formData.addresses.length >= 5}
                    />
                    <GlassButton
                      onClick={addAddress}
                      disabled={!newAddress.trim() || formData.addresses.length >= 5}
                      className="relative z-10"
                    >
                      <Plus className="w-5 h-5" />
                      Add Address
                    </GlassButton>
                  </div>
                  
                  <p className="text-sm" style={{ color: '#6B6B7D' }}>
                    Maximum 5 addresses ({formData.addresses.length}/5)
                  </p>

                  {/* Show duplicate error */}
                  {errors.duplicate && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.duplicate}
                    </motion.p>
                  )}
                  
                  {/* FIXED: Super fast address buttons with no re-animation on deletion */}
                  <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                    {formData.addresses.map((address, index) => {
                      // Check if this address has been animated before
                      const hasBeenAnimated = animatedAddresses.has(address);
                      
                      // Mark address as animated
                      if (!hasBeenAnimated) {
                        setAnimatedAddresses(prev => new Set(prev).add(address));
                      }

                      return (
                        <motion.button
                          key={address} // Stable key to prevent re-mounting
                          onClick={() => removeAddress(address)}
                          className="group px-2.5 py-1.5 rounded-full glass-card text-xs font-mono bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 hover:from-pink-200 hover:to-purple-200 transition-all duration-300 relative z-10 flex items-center justify-center"
                          style={{ 
                            minWidth: 'calc(20% - 6px)',
                            maxWidth: 'calc(20% - 6px)',
                            height: '32px'
                          }}
                          // FIXED: Only animate if this is a new address (hasn't been animated before)
                          initial={hasBeenAnimated ? false : { 
                            scale: 0, 
                            opacity: 0,
                            y: -20
                          }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: [0, -3, 0], // Floating animation
                          }}
                          exit={{ 
                            scale: 0, 
                            opacity: 0,
                            y: -20
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            y: -4
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ 
                            // FIXED: Much faster appearance - 0.3s total (reduced from long duration)
                            scale: { duration: 0.3 },
                            opacity: { duration: 0.3 },
                            // Floating animation remains smooth
                            y: { 
                              duration: 0.5,
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: index * 0.05
                            }
                          }}
                        >
                          <span className="relative z-20 text-center truncate">
                            {address.slice(0, 4)}...{address.slice(-4)}
                          </span>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity relative z-30 hidden group-hover:flex"
                            whileHover={{ scale: 1.1 }}
                          >
                            <X className="w-2.5 h-2.5 text-white" />
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Whitelist Features - remove empty space below */}
                <motion.div 
                  className="space-y-4 pt-6 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-semibold text-center" style={{ color: '#2E2E3A', fontWeight: '700' }}>
                    Additional Whitelist Features
                  </h4>
                  <p className="text-sm text-center" style={{ color: '#5A5A6B' }}>
                    Allow the selected addresses additional functions
                  </p>
                  
                  {/* Prohibit Sales Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/20">
                    <div className="flex-1">
                      <h5 className="font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>
                        Prohibit token sales to users without a whitelist
                      </h5>
                    </div>
                    <motion.button
                      onClick={() => toggleFeature('prohibitSales')}
                      className={`relative w-14 h-7 rounded-full overflow-hidden ${
                        formData.prohibitSales ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        backgroundColor: formData.prohibitSales 
                          ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                          : 'rgb(209, 213, 219)'
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <motion.div
                        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                        style={{ zIndex: 10 }}
                        animate={{
                          left: formData.prohibitSales ? '26px' : '2px',
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </motion.button>
                  </div>

                  {/* Prohibit Transfers Toggle - remove bottom padding/margin */}
                  <motion.div 
                    className="flex items-center justify-between p-4 rounded-xl bg-white/20"
                    style={{ marginBottom: '0' }}
                  >
                    <div className="flex-1">
                      <h5 className="font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>
                        Prohibit token transfer to users without whitelist
                      </h5>
                    </div>
                    <motion.button
                      onClick={() => toggleFeature('prohibitTransfers')}
                      className={`relative w-14 h-7 rounded-full overflow-hidden ${
                        formData.prohibitTransfers ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        backgroundColor: formData.prohibitTransfers 
                          ? 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))' 
                          : 'rgb(209, 213, 219)'
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <motion.div
                        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                        style={{ zIndex: 10 }}
                        animate={{
                          left: formData.prohibitTransfers ? '26px' : '2px',
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {errors.addresses && (
                  <motion.p
                    className="text-red-500 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.addresses}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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