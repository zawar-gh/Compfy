export interface Component {
  name: string;
  details: string;
  tdp?: number; // Thermal Design Power for power calculation
}

export interface PCBuild {
  id: string;
  name: string;
  category: CategoryType;
  intensity: IntensityType;
  totalCost: number;
  estimatedWattage: number;
  compatibility: 'optimized' | 'warning';
  imageUrl?: string; // Optional product image URL
  vendor?: Vendor; // Optional vendor info for vendor builds
  city?: string; // City for vendor builds
  isActive?: boolean;
  components: {
    cpu: Component;
    gpu: Component;
    ram: Component;
    storage: Component;
    motherboard: Component;
    psu: Component;
    cooling: Component;
  };
  upgradesSuggestions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryType = 'office' | 'editing' | 'gaming';
export type IntensityType = 'casual' | 'heavy';
export type UserRole = 'customer' | 'vendor';

export interface ElectricitySettings {
  pricePerUnit: number;
  currency: string;
}

export interface CategoryConfig {
  id: CategoryType;
  name: string;
  icon: string;
  subtitle: string;
  casual: {
    description: string;
    tasks: string[];
  };
  heavy: {
    description: string;
    tasks: string[];
  };
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  username: string;
  address: string;
  role?: UserRole;
  createdAt: string;
}

export interface Vendor {
  id?: string;
  userId?: string;
  shop_name: string;
  contact: string;
  city: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedBuild {
  id: string;
  userId: string;
  buildId: string;
  build?: PCBuild;
  savedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  buildId: string;
  vendorId: string;
  receiverAddress: string;
  receiverPhone: string;
  price: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  vendor: Vendor | null;
  token: string | null;
}