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
import ProfileModal from './ProfileModal'; // Import the modal

interface HeaderProps {
  authState: AuthState;
  savedBuilds: SavedBuild[];
  onShowSavedBuilds: () => void;
  onDeleteProfile: () => void;
  onEditVendorProfile: () => void;
  onLogout: () => void;
  isCompact?: boolean;
}

export default function Header({ 
  authState, 
  savedBuilds,
  onShowSavedBuilds,
  onEditVendorProfile,
  onDeleteProfile,
  onLogout,
  isCompact = false 
}: HeaderProps) {
  const { isAuthenticated, user, vendor } = authState;
  const [showProfileModal, setShowProfileModal] = useState(false);

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
              
              <DropdownMenuItem 
                onClick={() => setShowProfileModal(true)}
                className="text-gray-300 hover:text-white hover:bg-cyan-900/30 cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={onDeleteProfile}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Profile
              </DropdownMenuItem>

              {/* Vendor Section */}
              {vendor && (
                <>
                  <DropdownMenuSeparator className="bg-slate-600/50" />
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Shop Settings</p>
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={onEditVendorProfile}
                    className="text-gray-300 hover:text-white hover:bg-purple-900/30 cursor-pointer"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    {vendor.shopName}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={onEditVendorProfile}
                    className="text-gray-300 hover:text-white hover:bg-purple-900/30 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {vendor.address}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={onEditVendorProfile}
                    className="text-gray-300 hover:text-white hover:bg-purple-900/30 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {vendor.phone}
                  </DropdownMenuItem>
                </>
              )}

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

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onLogout={onLogout}
        />
      )}
    </>
  );
}
