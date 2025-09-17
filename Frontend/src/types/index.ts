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
}

export type CategoryType = 'office' | 'editing' | 'gaming';
export type IntensityType = 'casual' | 'heavy';

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