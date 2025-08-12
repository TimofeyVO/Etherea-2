import { motion } from 'framer-motion';
import { useState } from 'react';
import { GlassButton } from '../GlassButton';
import { ArrowLeft, ArrowRight, Upload, Image } from 'lucide-react';

interface SettingsData {
  name: string;
  symbol: string;
  description: string;
  totalSupply: string;
  decimals: string;
  imageFile: File | null;
  imagePreview: string;
}

interface SettingsScreenProps {
  onNext: (data: SettingsData) => void;
  onBack: () => void;
  initialData?: Partial<SettingsData>;
}

export function SettingsScreen({ onNext, onBack, initialData }: SettingsScreenProps) {
  const [formData, setFormData] = useState<SettingsData>({
    name: initialData?.name || '',
    symbol: initialData?.symbol || '',
    description: initialData?.description || '',
    totalSupply: initialData?.totalSupply || '1000000', // Default to 1 million
    decimals: initialData?.decimals || '9',
    imageFile: initialData?.imageFile || null,
    imagePreview: initialData?.imagePreview || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragOver, setIsDragOver] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Token name is required';
    if (!formData.symbol.trim()) newErrors.symbol = 'Token symbol is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.totalSupply.trim()) newErrors.totalSupply = 'Total supply is required';
    
    // English alphanumeric validation
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    if (formData.name && !alphanumericRegex.test(formData.name)) {
      newErrors.name = 'Name must contain only English letters and numbers';
    }
    if (formData.symbol && !alphanumericRegex.test(formData.symbol.replace(/\s/g, ''))) {
      newErrors.symbol = 'Symbol must contain only English letters and numbers';
    }

    // Total supply validation: min 1M (1000000), max 1T (1000000000000)
    const supplyNum = Number(formData.totalSupply);
    if (isNaN(supplyNum) || supplyNum < 1000000 || supplyNum > 1000000000000) {
      newErrors.totalSupply = 'Total supply must be between 1M and 1T';
    }
    
    if (formData.decimals && (isNaN(Number(formData.decimals)) || Number(formData.decimals) < 0 || Number(formData.decimals) > 18)) {
      newErrors.decimals = 'Decimals must be between 0 and 18';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) handleImageUpload(files[0]);
  };

  const handleTotalSupplyChange = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/[^0-9]/g, '');
    
    if (cleaned === '') {
      setFormData(prev => ({ ...prev, totalSupply: '1000000' })); // Reset to minimum
      return;
    }
    
    const numValue = Number(cleaned);
    
    // Minimum is 1M (1000000), maximum is 1T (1000000000000)
    if (numValue >= 1000000 && numValue <= 1000000000000) {
      setFormData(prev => ({ ...prev, totalSupply: cleaned }));
    } else if (numValue < 1000000) {
      setFormData(prev => ({ ...prev, totalSupply: '1000000' })); // Keep at minimum
    } else if (numValue > 1000000000000) {
      setFormData(prev => ({ ...prev, totalSupply: '1000000000000' })); // Cap at maximum
    }
  };

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
          <h2 className="text-4xl font-bold screen-heading mb-2">Token Settings</h2>
          <p 
            className="text-gray-600"
            style={{
              color: '#4A4A5A',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
            }}
          >
            Configure your token's basic properties
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="glass-card p-8 space-y-6 relative z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Image Upload */}
          <div className="space-y-2 relative z-20">
            <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Token Image</label>
            <motion.div
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                ${isDragOver ? 'border-pink-400 bg-pink-50/50' : 'border-gray-300 hover:border-pink-300'}
                ${formData.imagePreview ? 'border-solid border-pink-400' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              whileHover={{ scale: 1.02 }}
            >
              {formData.imagePreview ? (
                <motion.div
                  className="relative flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated border circle - perfectly centered */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: '136px',
                      height: '136px',
                      background: 'conic-gradient(from 0deg, var(--iridescent-pink), var(--iridescent-gold), var(--iridescent-lilac), var(--iridescent-pink))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Image perfectly centered inside */}
                  <img
                    src={formData.imagePreview}
                    alt="Token preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-lg relative z-10"
                  />
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    className="w-16 h-16 mx-auto rounded-full glass-card flex items-center justify-center relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image className="w-8 h-8 text-gray-400 relative z-20" />
                  </motion.div>
                  <div>
                    <p className="text-gray-600">Drop your image here or</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-white/50 text-gray-700 cursor-pointer hover:bg-white/70 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Browse Files
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Form Fields WITHOUT character counters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {/* Token Name - NO counter */}
            <div className="space-y-2">
              <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Token Name</label>
              <motion.div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  maxLength={15}
                  className="w-full px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 relative z-10"
                  placeholder="e.g. My Token"
                />
                {errors.name && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Token Symbol - NO counter */}
            <div className="space-y-2">
              <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Token Symbol</label>
              <motion.div className="relative">
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 relative z-10"
                  placeholder="e.g. MTK"
                />
                {errors.symbol && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.symbol}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Description - NO counter */}
          <div className="space-y-2 relative z-20">
            <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Description</label>
            <motion.div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                maxLength={200}
                rows={4}
                className="w-full px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 resize-none relative z-10"
                placeholder="Describe about your token..."
              />
              {errors.description && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.description}
                </motion.p>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {/* Total Supply - RESTORED to 1M-1T range */}
            <div className="space-y-2">
              <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Total Supply</label>
              <motion.div className="relative">
                <input
                  type="text"
                  value={formData.totalSupply}
                  onChange={(e) => handleTotalSupplyChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 relative z-10"
                  placeholder="1000000"
                />
                {errors.totalSupply && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.totalSupply}
                  </motion.p>
                )}
              </motion.div>
              {/* Display formatted text BELOW the field */}
              <div className="text-sm font-medium" style={{ color: 'var(--counter-text)' }}>
                {formatSupplyDisplay(formData.totalSupply)} tokens (Range: 1M - 1T)
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium" style={{ color: '#2E2E3A', fontWeight: '600' }}>Decimals</label>
              <motion.div className="relative">
                <input
                  type="number"
                  min="0"
                  max="18"
                  value={formData.decimals}
                  onChange={(e) => setFormData(prev => ({ ...prev, decimals: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl glass-card border-0 bg-white/30 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 relative z-10 no-arrows"
                />
                {errors.decimals && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.decimals}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between mt-8"
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