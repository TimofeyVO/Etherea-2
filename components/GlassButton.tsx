import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }, ref) => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    // Made outline variant same as primary - unified color
    const variantClasses = {
      primary: 'text-white shadow-lg shadow-pink-500/25',
      secondary: 'text-gray-700 shadow-lg shadow-purple-500/20',
      outline: 'text-white shadow-lg shadow-pink-500/25', // Changed from outline style to primary style
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative overflow-hidden rounded-2xl font-medium transition-all duration-300
          glass-card backdrop-blur-xl
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        // Sped up hover animation by ~30% (from 1.02/1.8 to 1.015/1.4)
        whileHover={!disabled ? { scale: 1.015, y: -1.4 } : {}}
        whileTap={!disabled ? { scale: 0.985 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.21 }} // Sped up by 30% (from 0.3)
      >
        {/* Iridescent background gradient - unified for all variants */}
        <motion.div
          className="absolute inset-0 opacity-80"
          style={{
            background: 'linear-gradient(45deg, var(--iridescent-pink), var(--iridescent-gold), var(--iridescent-lilac))',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Shimmer effect on hover - sped up */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transform: 'translateX(-100%)',
          }}
          whileHover={{
            opacity: 1,
            transform: 'translateX(100%)',
            transition: { duration: 0.42, ease: "easeOut" } // Sped up by 30% (from 0.6)
          }}
        />

        {/* Light refraction border */}
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/10" style={{ margin: '2px' }} />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Hover glow effect - sped up */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 183, 228, 0.3) 0%, transparent 70%)',
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.21 }} // Sped up by 30% (from 0.3)
        />
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';