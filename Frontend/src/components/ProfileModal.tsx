// src/components/ProfileModal.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { User, Vendor } from '../types';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  vendor?: Vendor | null;
  onLogout: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  vendor,
  onLogout,
}: ProfileModalProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    onClose();
    navigate('/auth'); // adjust route if your auth page path differs
  };

  // Support both normalized vendor shape and raw backend shape:
  // normalized (App.normalizeVendor) -> { shopName, phone, city, address, ... }
  // backend raw -> { shop_name, contact, city, address, ... }
  const shopName = vendor?.shopName ?? (vendor as any)?.shop_name ?? null;
  const shopAddress = vendor?.address ?? (vendor as any)?.address ?? null;
  const shopCity = (vendor as any)?.city ?? null;
  const shopContact = vendor?.phone ?? (vendor as any)?.contact ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent p-0 shadow-none">
        <motion.div
          className="bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_cyan] flex flex-col items-center space-y-6 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className="text-2xl font-bold text-gray-300">Profile</DialogTitle>

          {/* 👤 User Info */}
          <div className="flex flex-col space-y-2 w-full text-gray-300">
            <div>
              <span className="font-semibold">Username:</span> {user.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email ?? '—'}
            </div>
          </div>

          {/* 🏪 Shop Settings (show if vendor provided) */}
          {vendor && (
            <div className="flex flex-col space-y-2 w-full text-gray-300 border-t border-cyan-500/30 pt-4 mt-2">
              <p className="text-sm text-cyan-400 uppercase tracking-wide mb-1">Shop Details</p>

              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-purple-400" />
                <span>{shopName ?? 'N/A'}</span>
              </div>

              {shopAddress ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>{shopAddress}</span>
                </div>
              ) : shopCity ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>{shopCity}</span>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>{shopContact ?? 'N/A'}</span>
              </div>
            </div>
          )}

          {/* 🚪 Logout Button */}
          <Button onClick={handleLogout} className="w-full neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-white border-cyan-500/50">
          
            Logout
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
