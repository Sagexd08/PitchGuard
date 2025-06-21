import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Settings,
  X,
  Camera,
  Shield,
  Crown,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ClickSpark from './ClickSpark';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      toast.success('Signed out successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleAvatarChange = () => {

    toast('Avatar settings coming soon!', {
      icon: '⚙️',
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#ffffff',
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            onClick={onClose}
          />

          {}
          <ClickSpark sparkColor="#3b82f6" sparkCount={12} sparkRadius={40}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="fixed bottom-24 right-8 z-[101]"
            >
              <div className="glass-card p-8 w-96 max-w-[90vw] shadow-2xl border border-white/30">
                {}
                <div className="flex items-center justify-between mb-8">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-white flex items-center gap-3"
                  >
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    Profile
                  </motion.h3>
                  <ClickSpark sparkColor="#ef4444" sparkCount={6} sparkRadius={20}>
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </ClickSpark>
                </div>

                {}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-6 mb-8"
                >
                  <div className="relative">
                    <ClickSpark sparkColor="#8b5cf6" sparkCount={8} sparkRadius={30}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl"
                      >
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </motion.div>
                    </ClickSpark>
                    <ClickSpark sparkColor="#10b981" sparkCount={4} sparkRadius={15}>
                      <motion.button
                        onClick={handleAvatarChange}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                    </ClickSpark>
                  </div>

                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {user.email?.split('@')[0] || 'User'}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">Pro Member</span>
                  </div>
                </div>
              </motion.div>

              {}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-400">12</div>
                  <div className="text-xs text-white/60">Pitches Analyzed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400">8.7</div>
                  <div className="text-xs text-white/60">Avg Score</div>
                </div>
              </div>

              {}
              <div className="space-y-3">
                <button
                  onClick={handleAvatarChange}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Avatar Settings</span>
                </button>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>

              {}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Your data is protected with AES-256 encryption</span>
                </div>
              </div>
            </div>
            </motion.div>
          </ClickSpark>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfilePopup;
