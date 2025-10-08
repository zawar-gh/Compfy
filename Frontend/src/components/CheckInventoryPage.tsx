import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { PCBuild, Vendor } from '../types';
import { getInventory, updateInventory } from '../services/api';
import { bulkUpdateInventory } from '../services/api';

interface CheckInventoryPageProps {
  vendor: Vendor;
  onBack: () => void;
}

interface EditableBuild extends PCBuild {
  isEditing?: boolean;
  isSelected?: boolean;
}

type SortField = 'build_name' | 'price';
type SortDirection = 'asc' | 'desc';

export default function CheckInventoryPage({ vendor, onBack }: CheckInventoryPageProps) {
  const [builds, setBuilds] = useState<EditableBuild[]>([]);
  const [sortField, setSortField] = useState<SortField>('build_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Load vendor inventory from backend
  useEffect(() => {
  const fetchInventory = async () => {
  try {
    const response = await getInventory(vendor.id);
    const inventoryArray = response.data ?? response; // fallback to response itself

    if (!Array.isArray(inventoryArray)) {
      console.error("Inventory response is not an array:", response);
      return;
    }

    const mappedBuilds = inventoryArray.map((item: any) => ({
      id: item.id,
      name: item.name, // Changed from item.build?.title
      totalCost: item.totalCost, // Changed from item.build?.price
      components: {
        cpu: { name: item.components.cpu || "N/A" }, // Changed from item.build?.cpu
        gpu: { name: item.components.gpu || "N/A" }, // Changed from item.build?.gpu
        ram: { name: item.components.ram || "N/A" }, // Changed from item.build?.ram
        storage: { name: item.components.storage || "N/A" }, // Changed from item.build?.storage
      },
      isEditing: false,
      isSelected: false,
    }));

    setBuilds(mappedBuilds);
  } catch (err) {
    console.error("Failed to fetch inventory", err);
  }
};


  fetchInventory();
  }, [vendor.id]);

  const selectedBuilds = builds.filter(build => build.isSelected);
  const selectedCount = selectedBuilds.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBuilds = [...builds].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === 'build_name') {
      aValue = a.name;
      bValue = b.name;
    } else {
      aValue = a.totalCost;
      bValue = b.totalCost;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleEdit = (buildId: string) => {
    setBuilds(prev => prev.map(build => 
      build.id === buildId 
        ? { ...build, isEditing: true }
        : { ...build, isEditing: false }
    ));
  };

  const handleSaveEdit = (buildId: string, updatedBuild: Partial<EditableBuild>) => {
    setBuilds(prev => prev.map(build => 
      build.id === buildId 
        ? { ...build, ...updatedBuild, isEditing: false }
        : build
    ));
    setHasChanges(true);
  };

  const handleCancelEdit = (buildId: string) => {
    setBuilds(prev => prev.map(build => 
      build.id === buildId 
        ? { ...build, isEditing: false }
        : build
    ));
  };

  const handleSelect = (buildId: string, checked: boolean) => {
    setBuilds(prev => prev.map(build => 
      build.id === buildId 
        ? { ...build, isSelected: checked }
        : build
    ));
  };

  const handleSelectAll = (checked: boolean) => {
    setBuilds(prev => prev.map(build => ({ ...build, isSelected: checked })));
  };

  const handleDeleteSelected = () => {
    setBuilds(prev => prev.filter(build => !build.isSelected));
    setHasChanges(true);
  };

  const handleDeleteAll = () => {
    setBuilds([]);
    setHasChanges(true);
    setShowDeleteAllDialog(false);
  };

  
//------Adding Builds Button--------
 const handleAddBuild = () => {
  const newBuild: EditableBuild = {
    id: `temp-${Date.now()}`, // temporary unique id
    name: "New Build",
    totalCost: 0,
    components: {
      cpu: { name: "" },
      gpu: { name: "" },
      ram: { name: "" },
      storage: { name: "" },
    },
    isEditing: true,
    isSelected: false,
  };

  setBuilds(prev => [newBuild, ...prev]); // add new build at top
  setHasChanges(true);
};
 // 🔹 Save changes to backend
 const handleSaveChanges = async () => {
  if (builds.length === 0) return; // nothing to save

  setIsLoading(true);
  try {
    // ✅ Flatten data into backend-friendly format
    const payload = builds.map(build => ({
      id: build.id,
      title: build.name,
      price: build.totalCost,
      cpu: build.components.cpu.name,
      gpu: build.components.gpu.name,
      ram: build.components.ram.name,
      storage: build.components.storage.name,
    }));

    // ✅ Call the same API
    console.log("Payload sent to backend:", JSON.stringify(payload, null, 2));
    await bulkUpdateInventory(vendor.id, payload);

    setHasChanges(false);
    console.log("✅ Inventory successfully updated.");
  } catch (error) {
    console.error("❌ Failed to save changes", error);
  } finally {
    setIsLoading(false);
  }
};



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex gap-3">
            {hasChanges && (
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="flex items-center gap-2 neon-button bg-green-900/30 hover:bg-green-900/50 text-white border-green-500/50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            
            {selectedCount > 0 && (
              <Button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 neon-button bg-red-900/30 hover:bg-red-900/50 text-white border-red-500/50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedCount})
              </Button>
            )}
            
            <Button
              onClick={() => setShowDeleteAllDialog(true)}
              variant="outline"
              className="flex items-center gap-2 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400 bg-transparent hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Inventory Management
        </h1>
        <div className="flex items-center gap-4">
          <Badge className="bg-purple-900/30 text-purple-400 border border-purple-500/30">
            {vendor.shopName}
          </Badge>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300">{builds.length} builds</span>
          {hasChanges && (
            <>
              <span className="text-gray-400">•</span>
              <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                Unsaved Changes
              </Badge>
            </>
          )}
        </div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="cyber-card shadow-[0_0_15px_rgba(147,51,234,0.4),_0_0_30px_rgba(147,51,234,0.2)] border-purple-500/50">
          <CardHeader className="pb-4">
  <CardTitle className="flex items-center justify-between">
    <span className="text-white">Inventory Table</span>

    <div className="flex items-center gap-3">
      <Button
        onClick={handleAddBuild}
        className="flex items-center gap-2 neon-button bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-300 border-cyan-500/50"
      >
        <span className="text-lg leading-none">+</span>
        Add Build
      </Button>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={builds.length > 0 && builds.every(build => build.isSelected)}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-gray-300">Select All</span>
      </div>
    </div>
  </CardTitle>
</CardHeader>

          <CardContent>
            {builds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                  <p>No inventory found</p>
                  <p className="text-sm mb-4">No builds found. Add your first one manually.</p>
                  
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-500/30">
                      <th className="text-left py-3 px-2 w-12">
                        <Checkbox
                          checked={builds.length > 0 && builds.every(build => build.isSelected)}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300">
                        <button
                          onClick={() => handleSort('build_name')}
                          className="flex items-center gap-1 hover:text-white"
                        >
                          Build Name
                          {sortField === 'build_name' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300">CPU</th>
                      <th className="text-left py-3 px-4 text-gray-300">GPU</th>
                      <th className="text-left py-3 px-4 text-gray-300">RAM</th>
                      <th className="text-left py-3 px-4 text-gray-300">Storage</th>
                      <th className="text-left py-3 px-4 text-gray-300">
                        <button
                          onClick={() => handleSort('price')}
                          className="flex items-center gap-1 hover:text-white"
                        >
                          Price
                          {sortField === 'price' && (
                            sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBuilds.map((build) => (
                      <BuildRow
                        key={build.id}
                        build={build}
                        onEdit={handleEdit}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        onSelect={handleSelect}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent className="cyber-card border-red-500/30 bg-slate-900/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete All Inventory
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. All your inventory builds will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600/50 text-gray-300 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAll}
              className="bg-red-900/50 text-red-300 hover:bg-red-900/70 border-red-500/50"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 🔹 Row Component
function BuildRow({ 
  build, 
  onEdit, 
  onSave, 
  onCancel, 
  onSelect, 
  formatCurrency 
}: {
  build: EditableBuild;
  onEdit: (id: string) => void;
  onSave: (id: string, updated: Partial<EditableBuild>) => void;
  onCancel: (id: string) => void;
  onSelect: (id: string, checked: boolean) => void;
  formatCurrency: (amount: number) => string;
}) {
  const [editData, setEditData] = useState({
    name: build.name,
    cpu: build.components.cpu.name,
    gpu: build.components.gpu.name,
    ram: build.components.ram.name,
    storage: build.components.storage.name,
    totalCost: build.totalCost
  });

  const handleSave = () => {
    onSave(build.id, {
      name: editData.name,
      totalCost: editData.totalCost,
      components: {
        ...build.components,
        cpu: { ...build.components.cpu, name: editData.cpu },
        gpu: { ...build.components.gpu, name: editData.gpu },
        ram: { ...build.components.ram, name: editData.ram },
        storage: { ...build.components.storage, name: editData.storage }
      }
    });
  };

  return (
    <tr className="border-b border-slate-700/50 hover:bg-purple-900/10">
      <td className="py-3 px-2">
        <Checkbox
          checked={build.isSelected || false}
          onCheckedChange={(checked) => onSelect(build.id, checked as boolean)}
        />
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
          />
        ) : (
          <span className="text-white">{build.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            value={editData.cpu}
            onChange={(e) => setEditData(prev => ({ ...prev, cpu: e.target.value }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
          />
        ) : (
          <span className="text-gray-300 text-sm">{build.components.cpu.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            value={editData.gpu}
            onChange={(e) => setEditData(prev => ({ ...prev, gpu: e.target.value }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
          />
        ) : (
          <span className="text-gray-300 text-sm">{build.components.gpu.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            value={editData.ram}
            onChange={(e) => setEditData(prev => ({ ...prev, ram: e.target.value }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
          />
        ) : (
          <span className="text-gray-300 text-sm">{build.components.ram.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            value={editData.storage}
            onChange={(e) => setEditData(prev => ({ ...prev, storage: e.target.value }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm"
          />
        ) : (
          <span className="text-gray-300 text-sm">{build.components.storage.name}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <Input
            type="number"
            value={editData.totalCost}
            onChange={(e) => setEditData(prev => ({ ...prev, totalCost: Number(e.target.value) }))}
            className="bg-slate-800/50 border-slate-600/50 text-white text-sm w-24"
          />
        ) : (
          <span className="text-cyan-400 font-medium">{formatCurrency(build.totalCost)}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {build.isEditing ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-green-900/30 hover:bg-green-900/50 text-green-300 border-green-500/50 h-8 w-8 p-0"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(build.id)}
              className="neon-button bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-500/50 hover:border-red-400 h-8 w-8 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(build.id)}
            className="neon-button text-gray-200 hover:text-white border-cyan-500/30 hover:border-cyan-400 bg-transparent hover:bg-cyan-900/20 text-xs"
          >
            Edit
          </Button>
        )}
      </td>
    </tr>
  );
}

interface InventoryItem {
  id: number;
  name: string;
  totalCost: string;
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
  }
}
