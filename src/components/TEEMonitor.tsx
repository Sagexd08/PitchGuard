'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

interface TEEStatus {
  isActive: boolean;
  attestationValid: boolean;
  enclaveId: string;
  securityLevel: 'high' | 'medium' | 'low';
  lastVerified: Date;
}

interface TEEMonitorProps {
  className?: string;
  showDetails?: boolean;
  onTEEStatusChange?: (status: TEEStatus) => void;
}

const TEEMonitor: React.FC<TEEMonitorProps> = ({
  className = '',
  showDetails = false,
  onTEEStatusChange,
}) => {
  const [teeStatus, setTeeStatus] = useState<TEEStatus>({
    isActive: true,
    attestationValid: true,
    enclaveId: 'TEE-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    securityLevel: 'high',
    lastVerified: new Date(),
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate TEE status updates
    const interval = setInterval(() => {
      setTeeStatus(prev => {
        const newStatus = {
          ...prev,
          lastVerified: new Date(),
          attestationValid: Math.random() > 0.1, // 90% chance of valid attestation
        };

        // Call the callback if provided
        if (onTEEStatusChange) {
          onTEEStatusChange(newStatus);
        }

        return newStatus;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [onTEEStatusChange]);

  const getStatusColor = () => {
    if (!teeStatus.isActive) return 'text-red-400';
    if (!teeStatus.attestationValid) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusIcon = () => {
    if (!teeStatus.isActive) return <AlertTriangle className="w-4 h-4" />;
    if (!teeStatus.attestationValid) return <Eye className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!teeStatus.isActive) return 'TEE Inactive';
    if (!teeStatus.attestationValid) return 'Attestation Pending';
    return 'TEE Active';
  };

  return (
    <motion.div
      className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Trusted Execution Environment</span>
          </div>
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/60"
        >
          ▼
        </motion.div>
      </div>

      {(isExpanded || showDetails) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-3 border-t border-white/10 pt-4"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Enclave ID:</span>
              <div className="text-white font-mono text-xs mt-1">
                {teeStatus.enclaveId}
              </div>
            </div>
            
            <div>
              <span className="text-white/60">Security Level:</span>
              <div className={`mt-1 capitalize ${
                teeStatus.securityLevel === 'high' ? 'text-green-400' :
                teeStatus.securityLevel === 'medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {teeStatus.securityLevel}
              </div>
            </div>
            
            <div>
              <span className="text-white/60">Last Verified:</span>
              <div className="text-white text-xs mt-1">
                {teeStatus.lastVerified.toLocaleTimeString()}
              </div>
            </div>
            
            <div>
              <span className="text-white/60">Attestation:</span>
              <div className={`mt-1 ${teeStatus.attestationValid ? 'text-green-400' : 'text-yellow-400'}`}>
                {teeStatus.attestationValid ? 'Valid' : 'Pending'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Hardware-backed encryption</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Remote attestation enabled</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TEEMonitor;
