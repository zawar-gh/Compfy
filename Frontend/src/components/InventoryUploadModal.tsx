import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Vendor } from '../types';

interface InventoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInventoryUploaded: () => void;
  vendor: Vendor;
}

interface UploadResult {
  rowsProcessed: number;
  rowsCreated: number;
  rowsUpdated: number;
  rowsInvalid: number;
  errors: string[];
}

export default function InventoryUploadModal({ 
  isOpen, 
  onClose, 
  onInventoryUploaded,
  vendor 
}: InventoryUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDownloadTemplate = () => {
    // Create a mock Excel template download
    const csvContent = `build_name,cpu_model,gpu_model,ram,storage,psu,casing,price,city
Gaming Beast i5,Intel Core i5-8400,GTX 1060 6GB,16GB DDR4,256GB SSD + 1TB HDD,Standard PSU,Standard Casing,45000,${vendor.city}
Office Pro,Intel Core i3-8100,Intel UHD 630,8GB DDR4,256GB SSD,Standard PSU,Standard Casing,25000,${vendor.city}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
        setErrors(['Please select an Excel (.xlsx) or CSV (.csv) file']);
        return;
      }
      
      setSelectedFile(file);
      setErrors([]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrors(['Please select a file first']);
      return;
    }

    setIsUploading(true);
    setErrors([]);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock upload result
      const mockResult: UploadResult = {
        rowsProcessed: 12,
        rowsCreated: 10,
        rowsUpdated: 2,
        rowsInvalid: 0,
        errors: []
      };
      
      setUploadResult(mockResult);
      
      // Auto-navigate to inventory after 2 seconds
      setTimeout(() => {
        onInventoryUploaded();
      }, 2000);
      
    } catch (error) {
      setErrors(['Failed to upload inventory. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setErrors([]);
      setUploadResult(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg cyber-card border-purple-500/30 bg-slate-900/95">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogTitle className="sr-only">Manage Inventory</DialogTitle>
          <DialogDescription className="sr-only">
            Upload and manage your inventory using Excel templates
          </DialogDescription>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-400" />
              Manage Inventory
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isUploading}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-green-300">Upload Successful!</h3>
              </div>
              <div className="space-y-1 text-sm text-green-200">
                <p>• {uploadResult.rowsProcessed} rows processed</p>
                <p>• {uploadResult.rowsCreated} new builds created</p>
                <p>• {uploadResult.rowsUpdated} builds updated</p>
                {uploadResult.rowsInvalid > 0 && (
                  <p className="text-yellow-300">• {uploadResult.rowsInvalid} invalid rows skipped</p>
                )}
              </div>
              <p className="text-xs text-green-300 mt-2">
                Redirecting to inventory management...
              </p>
            </motion.div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-medium">Upload Errors</span>
              </div>
              <ul className="text-red-300 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {!uploadResult && (
            <>
              {/* Instructions */}
              <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <h3 className="font-semibold text-purple-300 mb-2">Required Excel Columns:</h3>
                <div className="text-sm text-purple-200 space-y-1">
                  <p><strong>Required:</strong> build_name, cpu_model, gpu_model, ram, storage, price, city</p>
                  <p><strong>Optional:</strong> psu, casing (will default to "Standard PSU/Casing")</p>
                  <p className="text-xs text-purple-300 mt-2">
                    Download our template to get started with the correct format.
                  </p>
                </div>
              </div>

              {/* Download Template */}
              <div className="mb-6">
                <Button
                  onClick={handleDownloadTemplate}
                  className="w-full neon-button bg-blue-900/30 hover:bg-blue-900/50 text-white border-blue-500/50"
                  disabled={isUploading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Inventory Template
                </Button>
              </div>

              {/* Upload File */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory-file" className="text-gray-300">
                    Upload Inventory File (.xlsx or .csv)
                  </Label>
                  <Input
                    id="inventory-file"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileSelect}
                    className="bg-slate-800/50 border-slate-600/50 text-white file:bg-purple-900/50 file:text-purple-200 file:border-0 file:rounded file:px-4 file:py-2"
                    disabled={isUploading}
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-400">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="w-full neon-button bg-purple-900/30 hover:bg-purple-900/50 text-white border-purple-500/50 disabled:bg-gray-700/30 disabled:text-gray-500 disabled:border-gray-600/30"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Inventory
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {!uploadResult && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 text-gray-200 hover:text-white border-slate-600/50 hover:border-slate-500"
              >
                Cancel
              </Button>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}