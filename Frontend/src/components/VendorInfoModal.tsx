import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { CheckCircle, MapPin, CreditCard } from "lucide-react";
import { Vendor } from "../types";

interface VendorInfoModalProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorInfoModal({ vendor, isOpen, onClose }: VendorInfoModalProps) {
  if (!vendor) return null;

  return (
    <AnimatePresence>
      {isOpen && vendor && (
        <motion.div
          key="vendor-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />

          {/* Modal Card with subtle neon border */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="relative w-96 rounded-xl p-6 shadow-xl"
            style={{
              backgroundColor: "#0f172a", // solid dark blue
              border: "1px solid #00ffff", // thin neon cyan border
              boxShadow: "0 0 4px #00ffff, 0 0 8px #00ffff" // subtle glow
            }}
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Vendor Information</h2>

            <div className="space-y-3 text-gray-200 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="font-medium">Shop Name:</span>
                <span>{vendor.shop_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Address:</span>
                <span>{vendor.address || vendor.city}</span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Contact:</span>
                <span>{vendor.contact}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-gray-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
