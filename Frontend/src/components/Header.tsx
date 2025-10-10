// src/components/Header.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Trash2, 
  Store, 
  MapPin, 
  Phone, 
  Heart,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { AuthState, SavedBuild } from '../types';
import { deleteAccount } from "../api/auth";
import toast from 'react-hot-toast'; // if not already imported

interface HeaderProps {
  authState: AuthState;
  savedBuilds: SavedBuild[];
  onShowSavedBuilds: () => void;
  onEditProfile: () => void;        // <-- added
  onDeleteProfile: () => void;
  onEditVendorProfile: () => void;
  onLogout: () => void;
  isCompact?: boolean;
}

export default function Header({ 
  authState, 
  savedBuilds,
  onShowSavedBuilds,
  onEditProfile,
  onEditVendorProfile,
  onDeleteProfile,
  onLogout,
  isCompact = false 
}: HeaderProps) {
  const { isAuthenticated, user, vendor } = authState;
  // Removed the header-local profile modal state — App will control profile modal now

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <motion.header 
        className={`flex justify-between items-center px-6 py-4 ${isCompact ? '' : 'absolute top-0 left-0 right-0 z-50'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {!isCompact && (
          <h1 className="text-xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Compfy
          </h1>
        )}

        <div className={isCompact ? 'ml-auto' : ''}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                <User className="w-4 h-4" />
                {user.username}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-56 cyber-card border-cyan-500/30 bg-slate-900/95"
            >
              {/* User Section */}
              <div className="px-2 py-1.5">
                <p className="text-xs text-gray-400 uppercase tracking-wider">User Settings</p>
              </div>
              
              {/* Use the App-level onEditProfile handler */}
              <DropdownMenuItem 
                onClick={onEditProfile}
                className="text-gray-300 hover:text-white hover:bg-cyan-900/30 cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={async () => {
                  if (!authState.token) return;
                  const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
                  if (!confirmed) return;
                  try {
                    await deleteAccount(authState.token);
                    toast.success("Your account has been deleted.");
                    onDeleteProfile(); // App will clear state and open auth modal
                  } catch (err) {
                    toast.error("Failed to delete account. Please try again.");
                    console.error(err);
                  }
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Profile
              </DropdownMenuItem>

           
              <DropdownMenuSeparator className="bg-slate-600/50" />
              
              {/* Saved Builds */}
              <DropdownMenuItem 
                onClick={onShowSavedBuilds}
                className="text-gray-300 hover:text-white hover:bg-blue-900/30 cursor-pointer"
              >
                <Heart className="w-4 h-4 mr-2" />
                Saved Builds ({savedBuilds?.length ||0})
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-600/50" />
              
              {/* Logout */}
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-gray-300 hover:text-white hover:bg-slate-700/50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
    </>
  );
}
