import React from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { User } from '../types';
import { useNavigate } from 'react-router-dom'; // ✅ add this line

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
}

export default function ProfileModal({ isOpen, onClose, user, onLogout }: ProfileModalProps) {
  const navigate = useNavigate(); // ✅ add this line

  const handleLogout = () => {
    onLogout();
    onClose();
    navigate('/auth'); // ✅ redirect to your signup/login screen (change path if needed)
  };

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
          <DialogDescription className="text-gray-400 text-center">
            View your account details below
          </DialogDescription>

          <div className="flex flex-col space-y-2 w-full">
            <div className="text-gray-300">
              <span className="font-semibold">Username:</span> {user.username}
            </div>
            <div className="text-gray-300">
              <span className="font-semibold">Email:</span> {user.email}
            </div>
          </div>

          <Button
            onClick={handleLogout} // ✅ use new function
            className="bg-red-600 hover:bg-red-700 w-full"
          >
            Logout
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
