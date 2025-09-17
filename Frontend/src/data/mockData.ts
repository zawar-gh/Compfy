import { PCBuild, CategoryConfig } from '../types';

export const categories: CategoryConfig[] = [
  {
    id: 'office',
    name: 'Study / Office Work',
    icon: '💼',
    subtitle: 'For students, professionals, and office use.',
    casual: {
      description: 'Perfect for everyday computing tasks',
      tasks: ['Word processing', 'Spreadsheets', 'Billing software', 'Web browsing', 'Social media']
    },
    heavy: {
      description: 'Enhanced productivity and multitasking',
      tasks: ['Programming', 'SEO tools', 'System administration', 'Heavy multitasking', 'Multiple office applications']
    }
  },
  {
    id: 'editing',
    name: 'Professional Editing / AI-ML',
    icon: '🎨',
    subtitle: 'For creators, editors, and AI/ML engineers.',
    casual: {
      description: 'Entry-level creative and AI work',
      tasks: ['Graphic design', 'Basic video editing', 'Entry-level AI/ML tasks', 'Photo editing', 'Light 3D work']
    },
    heavy: {
      description: 'Professional creative and AI workloads',
      tasks: ['3D animation', 'Heavy video rendering', 'Complex AI/ML workloads', '4K video editing', 'Deep learning']
    }
  },
  {
    id: 'gaming',
    name: 'Gaming & Streaming',
    icon: '🎮',
    subtitle: 'For gamers and streamers.',
    casual: {
      description: 'Smooth gaming at 1080p',
      tasks: ['Low-end gaming', 'FPS games', 'Arcade games', 'Older AAA titles', 'Esports titles']
    },
    heavy: {
      description: 'High-end gaming and streaming',
      tasks: ['Latest AAA games', 'Open-world RPGs', 'Live streaming', '1440p+ gaming', 'VR gaming']
    }
  }
];

export const pcBuilds: PCBuild[] = [
  // OFFICE BUILDS - PREBUILDS ONLY (20 builds: 10 casual + 10 heavy)
  
  // Office Casual Builds (10 builds)
  {
    id: 'office-casual-1',
    name: 'Dell OptiPlex 7040 SFF',
    category: 'office',
    intensity: 'casual',
    totalCost: 33660,
    estimatedWattage: 150,
    compatibility: 'optimized',
    imageUrl: 'https://images.unsplash.com/photo-1605041197572-1dcedff5655e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEZWxsJTIwT3B0aVBsZXglMjA3MDQwJTIwU0ZGJTIwY29tcHV0ZXIlMjBkZXNrdG9wfGVufDF8fHx8MTc1ODEwODYxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    components: {
      cpu: { name: 'Intel Core i5-6500', details: '4 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel HD Graphics 530', details: 'Integrated graphics, shared system memory' },
      ram: { name: 'DDR4 8GB', details: '2133MHz, Single stick, upgrade ready' },
      storage: { name: '128GB SSD + 500GB HDD', details: 'Fast boot SSD + storage HDD combo' },
      motherboard: { name: 'Dell OptiPlex 7040 Board', details: 'Custom Dell micro-ATX, business grade' },
      psu: { name: 'Dell 240W PSU', details: '240W, 80+ certified internal PSU', tdp: 240 },
      cooling: { name: 'Stock Cooler', details: 'Optimized for small form factor' }
    },
    upgradesSuggestions: [
      'Add 8GB more RAM to reach 16GB for better multitasking',
      'Replace HDD with larger SSD for improved performance',
      'Consider external GPU via mini PCIe for light gaming'
    ]
  },
  {
    id: 'office-casual-2',
    name: 'HP EliteDesk 800 G3 SFF',
    category: 'office',
    intensity: 'casual',
    totalCost: 28500,
    estimatedWattage: 135,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-7500', details: '4 cores, 3.4GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel HD Graphics 630', details: 'Integrated graphics, 4K support' },
      ram: { name: 'DDR4 8GB', details: '2400MHz, Single stick, expandable' },
      storage: { name: '256GB SSD', details: 'SATA III, Fast boot and applications' },
      motherboard: { name: 'HP EliteDesk 800 G3 Board', details: 'Custom HP board, LGA1151' },
      psu: { name: 'HP 180W PSU', details: '180W, 80+ certified, energy efficient', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'HP optimized cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for improved multitasking',
      'Add larger SSD for more storage space',
      'Consider external GPU for light CAD work'
    ]
  },
  {
    id: 'office-casual-3',
    name: 'Lenovo ThinkCentre M720s SFF',
    category: 'office',
    intensity: 'casual',
    totalCost: 31000,
    estimatedWattage: 140,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-8100', details: '4 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, modern architecture' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, dual channel ready' },
      storage: { name: '256GB SSD', details: 'SATA III, Reliable storage solution' },
      motherboard: { name: 'Lenovo ThinkCentre M720s Board', details: 'Custom Lenovo board, Q370 chipset' },
      psu: { name: 'Lenovo 180W PSU', details: '180W, 80+ certified, compact design', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Lenovo thermal management' }
    },
    upgradesSuggestions: [
      'Add second 8GB RAM stick for dual channel',
      'Upgrade to larger SSD for more storage',
      'Consider i5 processor upgrade for better performance'
    ]
  },
  {
    id: 'office-casual-4',
    name: 'Fujitsu Esprimo D538/2',
    category: 'office',
    intensity: 'casual',
    totalCost: 26000,
    estimatedWattage: 120,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Pentium Gold G5400', details: '2 cores, 3.7GHz, 58W TDP', tdp: 58 },
      gpu: { name: 'Intel UHD Graphics 610', details: 'Integrated graphics, basic display tasks' },
      ram: { name: 'DDR4 4GB', details: '2666MHz, Single stick, expandable' },
      storage: { name: '500GB HDD', details: '7200 RPM, Basic storage' },
      motherboard: { name: 'Fujitsu Esprimo D538 Board', details: 'Custom Fujitsu board, H310 chipset' },
      psu: { name: 'Fujitsu 180W PSU', details: '180W, basic efficiency', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Standard CPU cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 8GB RAM for better performance',
      'Replace HDD with SSD for faster performance',
      'Consider i3 processor upgrade'
    ]
  },
  {
    id: 'office-casual-5',
    name: 'Dell Inspiron 3880 MT',
    category: 'office',
    intensity: 'casual',
    totalCost: 35000,
    estimatedWattage: 155,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-10400', details: '6 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, modern features' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, expandable to 32GB' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast boot SSD + large storage HDD' },
      motherboard: { name: 'Dell Inspiron 3880 Board', details: 'Custom Dell board, H410 chipset' },
      psu: { name: 'Dell 260W PSU', details: '260W, 80+ certified, reliable power', tdp: 260 },
      cooling: { name: 'Stock Cooler', details: 'Dell thermal solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better multitasking',
      'Add dedicated GPU for light gaming',
      'Consider larger SSD for primary storage'
    ]
  },
  {
    id: 'office-casual-6',
    name: 'HP Pavilion Desktop TP01',
    category: 'office',
    intensity: 'casual',
    totalCost: 29500,
    estimatedWattage: 130,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 3 3200G', details: '4 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon Vega 8', details: 'Integrated graphics, good for office work' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, budget option' },
      storage: { name: '256GB SSD', details: 'SATA III, Fast storage solution' },
      motherboard: { name: 'HP Pavilion TP01 Board', details: 'Custom HP board, A320 chipset' },
      psu: { name: 'HP 180W PSU', details: '180W, basic efficiency', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'AMD included cooler' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better performance',
      'Add larger SSD for more storage',
      'Consider faster processor upgrade'
    ]
  },
  {
    id: 'office-casual-7',
    name: 'Lenovo IdeaCentre 3 07ADA05',
    category: 'office',
    intensity: 'casual',
    totalCost: 27000,
    estimatedWattage: 125,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 3 3250U', details: '2 cores, 2.6GHz, 15W TDP', tdp: 15 },
      gpu: { name: 'AMD Radeon Graphics', details: 'Integrated graphics, basic display output' },
      ram: { name: 'DDR4 4GB', details: '2400MHz, Single stick, expandable' },
      storage: { name: '1TB HDD', details: '5400 RPM, Large storage capacity' },
      motherboard: { name: 'Lenovo IdeaCentre 3 Board', details: 'Custom Lenovo board, integrated' },
      psu: { name: 'Lenovo 65W PSU', details: '65W, energy efficient', tdp: 65 },
      cooling: { name: 'Stock Cooler', details: 'Low power cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 8GB RAM for improved performance',
      'Replace HDD with SSD for faster boot',
      'Consider desktop processor for better performance'
    ]
  },
  {
    id: 'office-casual-8',
    name: 'Acer Aspire TC-895',
    category: 'office',
    intensity: 'casual',
    totalCost: 32000,
    estimatedWattage: 145,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-10100', details: '4 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, 4K support' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, dual channel ready' },
      storage: { name: '512GB SSD', details: 'SATA III, Large capacity SSD' },
      motherboard: { name: 'Acer Aspire TC-895 Board', details: 'Custom Acer board, H410 chipset' },
      psu: { name: 'Acer 180W PSU', details: '180W, 80+ certified', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Acer thermal management' }
    },
    upgradesSuggestions: [
      'Add second 8GB RAM stick for dual channel',
      'Upgrade to i5 processor for better performance',
      'Consider dedicated GPU for acceleration'
    ]
  },
  {
    id: 'office-casual-9',
    name: 'ASUS VivoPC M32CD',
    category: 'office',
    intensity: 'casual',
    totalCost: 30000,
    estimatedWattage: 140,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-7100', details: '2 cores, 3.9GHz, 51W TDP', tdp: 51 },
      gpu: { name: 'Intel HD Graphics 630', details: 'Integrated graphics, reliable performance' },
      ram: { name: 'DDR4 4GB', details: '2133MHz, Single stick, expandable' },
      storage: { name: '1TB HDD', details: '7200 RPM, Large storage for documents' },
      motherboard: { name: 'ASUS VivoPC M32CD Board', details: 'Custom ASUS board, H110 chipset' },
      psu: { name: 'ASUS 180W PSU', details: '180W, reliable power delivery', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'ASUS cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 8GB RAM for better multitasking',
      'Add SSD for faster boot times',
      'Consider newer generation processor'
    ]
  },
  {
    id: 'office-casual-10',
    name: 'MSI Cubi 5 10M',
    category: 'office',
    intensity: 'casual',
    totalCost: 25000,
    estimatedWattage: 65,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Celeron 5205U', details: '2 cores, 1.9GHz, 15W TDP', tdp: 15 },
      gpu: { name: 'Intel UHD Graphics', details: 'Integrated graphics, low power' },
      ram: { name: 'DDR4 4GB', details: '2400MHz, Single stick, compact' },
      storage: { name: '128GB SSD', details: 'SATA III, Fast boot storage' },
      motherboard: { name: 'MSI Cubi 5 Board', details: 'Custom MSI mini-ITX board' },
      psu: { name: 'MSI 90W PSU', details: '90W, external power adapter', tdp: 90 },
      cooling: { name: 'Stock Cooler', details: 'Passive cooling design' }
    },
    upgradesSuggestions: [
      'Upgrade to 8GB RAM for better performance',
      'Add larger SSD for more storage',
      'Consider more powerful mini PC'
    ]
  },

  // Office Heavy Builds (10 builds)
  {
    id: 'office-heavy-1',
    name: 'Dell Precision 3440 SFF',
    category: 'office',
    intensity: 'heavy',
    totalCost: 65000,
    estimatedWattage: 200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-10700', details: '8 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, professional features' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel kit' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast professional storage' },
      motherboard: { name: 'Dell Precision 3440 Board', details: 'Custom Dell workstation board' },
      psu: { name: 'Dell 260W PSU', details: '260W, 80+ Gold, high efficiency', tdp: 260 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for heavy multitasking',
      'Add dedicated GPU for CAD applications',
      'Consider larger SSD for storage expansion'
    ]
  },
  {
    id: 'office-heavy-2',
    name: 'HP EliteDesk 800 G6 MT',
    category: 'office',
    intensity: 'heavy',
    totalCost: 58000,
    estimatedWattage: 180,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-10500', details: '6 cores, 3.1GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, business grade' },
      ram: { name: 'DDR4 16GB', details: '2933MHz, Dual channel configuration' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large HDD storage' },
      motherboard: { name: 'HP EliteDesk 800 G6 Board', details: 'Custom HP board, Q470 chipset' },
      psu: { name: 'HP 180W PSU', details: '180W, 80+ certified, reliable', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'HP thermal management' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for virtual machines',
      'Add dedicated GPU for acceleration',
      'Consider larger SSD for primary storage'
    ]
  },
  {
    id: 'office-heavy-3',
    name: 'Lenovo ThinkCentre M720q Tiny',
    category: 'office',
    intensity: 'heavy',
    totalCost: 52000,
    estimatedWattage: 135,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-8500T', details: '6 cores, 2.1GHz, 35W TDP', tdp: 35 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, compact design' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, High capacity for tiny form factor' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast storage solution' },
      motherboard: { name: 'Lenovo ThinkCentre M720q Board', details: 'Custom Lenovo tiny board' },
      psu: { name: 'Lenovo 90W PSU', details: '90W, external adapter, efficient', tdp: 90 },
      cooling: { name: 'Stock Cooler', details: 'Tiny form factor cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for heavy workloads',
      'Add external GPU via Thunderbolt',
      'Consider desktop form factor for expansion'
    ]
  },
  {
    id: 'office-heavy-4',
    name: 'Fujitsu Esprimo P558/2',
    category: 'office',
    intensity: 'heavy',
    totalCost: 48000,
    estimatedWattage: 165,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-9400', details: '6 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, professional tasks' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, expandable' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'SSD for OS + HDD for storage' },
      motherboard: { name: 'Fujitsu Esprimo P558 Board', details: 'Custom Fujitsu board, B365 chipset' },
      psu: { name: 'Fujitsu 180W PSU', details: '180W, 80+ certified', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Fujitsu cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better performance',
      'Add larger SSD for faster access',
      'Consider dedicated GPU for CAD work'
    ]
  },
  {
    id: 'office-heavy-5',
    name: 'Dell OptiPlex 7080 MT',
    category: 'office',
    intensity: 'heavy',
    totalCost: 72000,
    estimatedWattage: 260,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-10700K', details: '8 cores, 3.8GHz, 125W TDP', tdp: 125 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, high performance' },
      ram: { name: 'DDR4 32GB', details: '2933MHz, Dual channel, high capacity' },
      storage: { name: '1TB SSD', details: 'NVMe PCIe, Large fast storage' },
      motherboard: { name: 'Dell OptiPlex 7080 Board', details: 'Custom Dell board, Z490 chipset' },
      psu: { name: 'Dell 500W PSU', details: '500W, 80+ Gold, high wattage', tdp: 500 },
      cooling: { name: 'Stock Cooler', details: 'Enhanced Dell cooling' }
    },
    upgradesSuggestions: [
      'Add dedicated GPU for professional acceleration',
      'Upgrade to faster NVMe SSD',
      'Consider ECC memory for critical applications'
    ]
  },
  {
    id: 'office-heavy-6',
    name: 'HP ProDesk 600 G6 MT',
    category: 'office',
    intensity: 'heavy',
    totalCost: 55000,
    estimatedWattage: 180,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-10400', details: '6 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, business features' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel kit' },
      storage: { name: '512GB SSD', details: 'SATA III, Reliable business storage' },
      motherboard: { name: 'HP ProDesk 600 G6 Board', details: 'Custom HP board, B460 chipset' },
      psu: { name: 'HP 180W PSU', details: '180W, 80+ certified, reliable power', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'HP professional cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for virtual machines',
      'Add secondary SSD for storage',
      'Consider dedicated GPU for acceleration'
    ]
  },
  {
    id: 'office-heavy-7',
    name: 'Lenovo ThinkCentre M90a AIO',
    category: 'office',
    intensity: 'heavy',
    totalCost: 85000,
    estimatedWattage: 135,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-10700T', details: '8 cores, 2.0GHz, 35W TDP', tdp: 35 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, all-in-one design' },
      ram: { name: 'DDR4 16GB', details: '2933MHz, SO-DIMM, AIO optimized' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast AIO storage' },
      motherboard: { name: 'Lenovo ThinkCentre M90a Board', details: 'Custom Lenovo AIO board' },
      psu: { name: 'Lenovo Internal PSU', details: 'Internal AIO power supply', tdp: 135 },
      cooling: { name: 'Stock Cooler', details: 'AIO thermal management' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for heavy multitasking',
      'Add external storage for expansion',
      'Consider external GPU for acceleration'
    ]
  },
  {
    id: 'office-heavy-8',
    name: 'ASUS ExpertCenter D7 SFF',
    category: 'office',
    intensity: 'heavy',
    totalCost: 60000,
    estimatedWattage: 200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-10700', details: '8 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, professional grade' },
      ram: { name: 'DDR4 16GB', details: '2933MHz, Dual channel configuration' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large HDD combo' },
      motherboard: { name: 'ASUS ExpertCenter D7 Board', details: 'Custom ASUS board, Q470 chipset' },
      psu: { name: 'ASUS 180W PSU', details: '180W, 80+ certified, business grade', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'ASUS professional cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for heavy applications',
      'Replace HDD with larger SSD',
      'Add dedicated GPU for CAD work'
    ]
  },
  {
    id: 'office-heavy-9',
    name: 'Acer Veriton X X2665G',
    category: 'office',
    intensity: 'heavy',
    totalCost: 45000,
    estimatedWattage: 155,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-9400', details: '6 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, business features' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, expandable' },
      storage: { name: '256GB SSD', details: 'SATA III, Fast business storage' },
      motherboard: { name: 'Acer Veriton X Board', details: 'Custom Acer board, B365 chipset' },
      psu: { name: 'Acer 180W PSU', details: '180W, 80+ certified', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Acer cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better performance',
      'Add larger SSD for more storage',
      'Consider dedicated GPU for acceleration'
    ]
  },
  {
    id: 'office-heavy-10',
    name: 'MSI PRO DP21',
    category: 'office',
    intensity: 'heavy',
    totalCost: 42000,
    estimatedWattage: 165,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 5 3400G', details: '4 cores, 3.7GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon RX Vega 11', details: 'Integrated graphics, good for office work' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, expandable' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large storage HDD' },
      motherboard: { name: 'MSI PRO DP21 Board', details: 'Custom MSI board, A320 chipset' },
      psu: { name: 'MSI 180W PSU', details: '180W, 80+ certified', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'MSI cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better performance',
      'Add dedicated GPU for acceleration',
      'Consider faster processor for heavy workloads'
    ]
  },

  // EDITING BUILDS - WORKSTATIONS ONLY (20 builds: 10 casual + 10 heavy)
  
  // Editing Casual Builds (10 builds)
  {
    id: 'editing-casual-1',
    name: 'HP Z240 SFF Workstation',
    category: 'editing',
    intensity: 'casual',
    totalCost: 75000,
    estimatedWattage: 200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon E3-1225 v5', details: '4 cores, 3.3GHz, 80W TDP, workstation grade', tdp: 80 },
      gpu: { name: 'NVIDIA Quadro K620', details: '2GB GDDR3, professional graphics' },
      ram: { name: 'DDR4 16GB ECC', details: '2133MHz, Error-correcting memory' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large storage combo' },
      motherboard: { name: 'HP Z240 Workstation Board', details: 'Custom HP workstation board, C236 chipset' },
      psu: { name: 'HP 400W PSU', details: '400W, 80+ Gold, workstation grade', tdp: 400 },
      cooling: { name: 'Stock Cooler', details: 'HP workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB ECC RAM for larger projects',
      'Add faster Quadro GPU for better performance',
      'Consider larger SSD for working files'
    ]
  },
  {
    id: 'editing-casual-2',
    name: 'Dell Precision 3430 SFF',
    category: 'editing',
    intensity: 'casual',
    totalCost: 68000,
    estimatedWattage: 180,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-8500', details: '6 cores, 3.0GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro P400', details: '2GB GDDR5, entry professional graphics' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel kit' },
      storage: { name: '256GB SSD', details: 'NVMe PCIe, Fast storage for editing' },
      motherboard: { name: 'Dell Precision 3430 Board', details: 'Custom Dell workstation board' },
      psu: { name: 'Dell 200W PSU', details: '200W, 80+ certified, compact', tdp: 200 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for better editing performance',
      'Add larger SSD for project storage',
      'Consider faster Quadro GPU'
    ]
  },
  {
    id: 'editing-casual-3',
    name: 'HP Z2 Mini G4 Workstation',
    category: 'editing',
    intensity: 'casual',
    totalCost: 85000,
    estimatedWattage: 135,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-8700', details: '6 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro P600', details: '2GB GDDR5, compact professional graphics' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, SO-DIMM, compact design' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast editing storage' },
      motherboard: { name: 'HP Z2 Mini G4 Board', details: 'Custom HP mini workstation board' },
      psu: { name: 'HP 200W PSU', details: '200W, external adapter, efficient', tdp: 200 },
      cooling: { name: 'Stock Cooler', details: 'HP mini workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for larger projects',
      'Add external storage for project files',
      'Consider external GPU via Thunderbolt'
    ]
  },
  {
    id: 'editing-casual-4',
    name: 'Dell Precision 3630 MT',
    category: 'editing',
    intensity: 'casual',
    totalCost: 92000,
    estimatedWattage: 300,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-8700', details: '6 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro P1000', details: '4GB GDDR5, mid-range professional graphics' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel configuration' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large storage HDD' },
      motherboard: { name: 'Dell Precision 3630 Board', details: 'Custom Dell workstation board, C246 chipset' },
      psu: { name: 'Dell 365W PSU', details: '365W, 80+ Gold, workstation grade', tdp: 365 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation thermal management' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for video editing',
      'Add faster Quadro GPU for acceleration',
      'Consider larger SSD for scratch disk'
    ]
  },
  {
    id: 'editing-casual-5',
    name: 'HP Z240 Tower Workstation',
    category: 'editing',
    intensity: 'casual',
    totalCost: 78000,
    estimatedWattage: 240,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon E3-1245 v5', details: '4 cores, 3.5GHz, 80W TDP, workstation processor', tdp: 80 },
      gpu: { name: 'NVIDIA Quadro K1200', details: '4GB GDDR5, professional graphics' },
      ram: { name: 'DDR4 16GB ECC', details: '2133MHz, Error-correcting memory' },
      storage: { name: '256GB SSD + 2TB HDD', details: 'Fast SSD + large project storage' },
      motherboard: { name: 'HP Z240 Tower Board', details: 'Custom HP workstation board, C236 chipset' },
      psu: { name: 'HP 400W PSU', details: '400W, 80+ Gold, high efficiency', tdp: 400 },
      cooling: { name: 'Stock Cooler', details: 'HP workstation cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB ECC RAM for larger projects',
      'Add faster Quadro GPU for better performance',
      'Consider faster NVMe SSD'
    ]
  },
  {
    id: 'editing-casual-6',
    name: 'Dell Precision 3440 SFF',
    category: 'editing',
    intensity: 'casual',
    totalCost: 72000,
    estimatedWattage: 180,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-10500', details: '6 cores, 3.1GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro T400', details: '2GB GDDR6, modern entry professional graphics' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel kit' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast editing storage' },
      motherboard: { name: 'Dell Precision 3440 Board', details: 'Custom Dell workstation board' },
      psu: { name: 'Dell 200W PSU', details: '200W, 80+ certified, compact workstation', tdp: 200 },
      cooling: { name: 'Stock Cooler', details: 'Dell compact workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for video editing',
      'Add larger SSD for project storage',
      'Consider faster Quadro GPU'
    ]
  },
  {
    id: 'editing-casual-7',
    name: 'HP Z2 G4 SFF Workstation',
    category: 'editing',
    intensity: 'casual',
    totalCost: 88000,
    estimatedWattage: 220,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-8700', details: '6 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro P620', details: '2GB GDDR5, professional graphics' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel configuration' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast boot SSD + project storage HDD' },
      motherboard: { name: 'HP Z2 G4 Board', details: 'Custom HP workstation board, C246 chipset' },
      psu: { name: 'HP 400W PSU', details: '400W, 80+ Gold, workstation grade', tdp: 400 },
      cooling: { name: 'Stock Cooler', details: 'HP workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 32GB RAM for better performance',
      'Add faster Quadro GPU for acceleration',
      'Consider larger SSD for working files'
    ]
  },
  {
    id: 'editing-casual-8',
    name: 'Dell Precision 3431 SFF',
    category: 'editing',
    intensity: 'casual',
    totalCost: 65000,
    estimatedWattage: 165,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-9400', details: '6 cores, 2.9GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, basic editing' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, Dual channel kit' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'SSD for OS + HDD for projects' },
      motherboard: { name: 'Dell Precision 3431 Board', details: 'Custom Dell workstation board' },
      psu: { name: 'Dell 180W PSU', details: '180W, 80+ certified', tdp: 180 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation cooling' }
    },
    upgradesSuggestions: [
      'Add dedicated Quadro GPU for better performance',
      'Upgrade to 32GB RAM for video editing',
      'Consider larger SSD for scratch disk'
    ]
  },
  {
    id: 'editing-casual-9',
    name: 'HP Z1 Entry Tower G5',
    category: 'editing',
    intensity: 'casual',
    totalCost: 70000,
    estimatedWattage: 200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-8500', details: '6 cores, 3.0GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'NVIDIA Quadro P400', details: '2GB GDDR5, entry professional graphics' },
      ram: { name: 'DDR4 8GB', details: '2666MHz, Single stick, expandable' },
      storage: { name: '256GB SSD + 1TB HDD', details: 'Fast SSD + large storage HDD' },
      motherboard: { name: 'HP Z1 Entry G5 Board', details: 'Custom HP workstation board' },
      psu: { name: 'HP 310W PSU', details: '310W, 80+ certified, workstation grade', tdp: 310 },
      cooling: { name: 'Stock Cooler', details: 'HP tower cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better editing',
      'Add faster Quadro GPU for acceleration',
      'Consider larger SSD for project files'
    ]
  },
  {
    id: 'editing-casual-10',
    name: 'Dell Precision 3240 CFF',
    category: 'editing',
    intensity: 'casual',
    totalCost: 62000,
    estimatedWattage: 135,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-10500T', details: '6 cores, 2.3GHz, 35W TDP', tdp: 35 },
      gpu: { name: 'Intel UHD Graphics 630', details: 'Integrated graphics, compact form factor' },
      ram: { name: 'DDR4 16GB', details: '2666MHz, SO-DIMM, compact design' },
      storage: { name: '512GB SSD', details: 'NVMe PCIe, Fast storage for editing' },
      motherboard: { name: 'Dell Precision 3240 Board', details: 'Custom Dell compact workstation board' },
      psu: { name: 'Dell 90W PSU', details: '90W, external adapter, compact', tdp: 90 },
      cooling: { name: 'Stock Cooler', details: 'Dell compact cooling solution' }
    },
    upgradesSuggestions: [
      'Add external Quadro GPU via Thunderbolt',
      'Upgrade to 32GB RAM for better performance',
      'Add external storage for large projects'
    ]
  },

  // Editing Heavy Builds (10 builds)
  {
    id: 'editing-heavy-1',
    name: 'HP Z440 Workstation',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 125000,
    estimatedWattage: 400,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon E5-1620 v3', details: '4 cores, 3.5GHz, 140W TDP, workstation grade', tdp: 140 },
      gpu: { name: 'NVIDIA Quadro K2200', details: '4GB GDDR5, professional graphics' },
      ram: { name: 'DDR4 32GB ECC', details: '2133MHz, Error-correcting memory, registered' },
      storage: { name: '512GB SSD + 2TB HDD', details: 'Fast NVMe SSD + large project storage' },
      motherboard: { name: 'HP Z440 Workstation Board', details: 'Custom HP workstation board, C612 chipset' },
      psu: { name: 'HP 700W PSU', details: '700W, 80+ Gold, high performance', tdp: 700 },
      cooling: { name: 'Stock Cooler', details: 'HP workstation cooling with heat pipes' }
    },
    upgradesSuggestions: [
      'Upgrade to 64GB ECC RAM for complex 3D work',
      'Add faster Quadro RTX GPU for ray tracing',
      'Consider dual processor configuration'
    ]
  },
  {
    id: 'editing-heavy-2',
    name: 'Dell Precision 5820 Tower',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 135000,
    estimatedWattage: 450,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon W-2123', details: '4 cores, 3.6GHz, 120W TDP, workstation processor', tdp: 120 },
      gpu: { name: 'NVIDIA Quadro P2000', details: '5GB GDDR5, mid-range professional graphics' },
      ram: { name: 'DDR4 32GB ECC', details: '2666MHz, Error-correcting memory' },
      storage: { name: '512GB SSD + 2TB HDD', details: 'NVMe PCIe SSD + large project storage' },
      motherboard: { name: 'Dell Precision 5820 Board', details: 'Custom Dell workstation board, C422 chipset' },
      psu: { name: 'Dell 950W PSU', details: '950W, 80+ Gold, high wattage for expansion', tdp: 950 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 64GB ECC RAM for large datasets',
      'Add faster Quadro RTX GPU for AI workloads',
      'Consider additional storage for projects'
    ]
  },
  {
    id: 'editing-heavy-3',
    name: 'HP Z640 Workstation',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 180000,
    estimatedWattage: 650,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon E5-2620 v3', details: '6 cores, 2.4GHz, 85W TDP, dual socket capable', tdp: 85 },
      gpu: { name: 'NVIDIA Quadro M2000', details: '4GB GDDR5, professional graphics' },
      ram: { name: 'DDR4 64GB ECC', details: '2133MHz, High capacity registered memory' },
      storage: { name: '1TB SSD + 4TB HDD', details: 'Large NVMe SSD + massive project storage' },
      motherboard: { name: 'HP Z640 Workstation Board', details: 'Custom HP dual socket board, C612 chipset' },
      psu: { name: 'HP 700W PSU', details: '700W, 80+ Gold, dual socket power', tdp: 700 },
      cooling: { name: 'Stock Cooler', details: 'HP dual socket cooling system' }
    },
    upgradesSuggestions: [
      'Add second Xeon processor for dual socket',
      'Upgrade to 128GB ECC RAM for massive projects',
      'Add faster Quadro RTX GPU for modern workflows'
    ]
  },
  {
    id: 'editing-heavy-4',
    name: 'Dell Precision 7820 Tower',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 165000,
    estimatedWattage: 550,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon W-2133', details: '6 cores, 3.6GHz, 140W TDP, workstation grade', tdp: 140 },
      gpu: { name: 'NVIDIA Quadro P4000', details: '8GB GDDR5, high-end professional graphics' },
      ram: { name: 'DDR4 32GB ECC', details: '2666MHz, Error-correcting memory' },
      storage: { name: '512GB SSD + 2TB HDD', details: 'Fast NVMe SSD + large storage HDD' },
      motherboard: { name: 'Dell Precision 7820 Board', details: 'Custom Dell workstation board, C422 chipset' },
      psu: { name: 'Dell 950W PSU', details: '950W, 80+ Gold, high performance PSU', tdp: 950 },
      cooling: { name: 'Stock Cooler', details: 'Dell workstation liquid cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 64GB ECC RAM for 4K video editing',
      'Add faster Quadro RTX GPU for ray tracing',
      'Consider NVMe RAID for faster storage'
    ]
  },
  {
    id: 'editing-heavy-5',
    name: 'HP Z840 Workstation',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 220000,
    estimatedWattage: 800,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon E5-2630 v3', details: '8 cores, 2.4GHz, 85W TDP, dual socket ready', tdp: 85 },
      gpu: { name: 'NVIDIA Quadro M4000', details: '8GB GDDR5, high-end professional graphics' },
      ram: { name: 'DDR4 64GB ECC', details: '2133MHz, Registered ECC memory' },
      storage: { name: '1TB SSD + 4TB HDD', details: 'Large NVMe SSD + massive storage array' },
      motherboard: { name: 'HP Z840 Workstation Board', details: 'Custom HP dual socket board, C612 chipset' },
      psu: { name: 'HP 1125W PSU', details: '1125W, 80+ Gold, high capacity PSU', tdp: 1125 },
      cooling: { name: 'Stock Cooler', details: 'HP liquid cooling system' }
    },
    upgradesSuggestions: [
      'Add second Xeon processor for dual socket',
      'Upgrade to 128GB ECC RAM for massive datasets',
      'Add multiple Quadro GPUs for GPU acceleration'
    ]
  },
  {
    id: 'editing-heavy-6',
    name: 'Dell Precision 7920 Tower',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 250000,
    estimatedWattage: 950,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon Silver 4110', details: '8 cores, 2.1GHz, 85W TDP, scalable processor', tdp: 85 },
      gpu: { name: 'NVIDIA Quadro P5000', details: '16GB GDDR5X, flagship professional graphics' },
      ram: { name: 'DDR4 64GB ECC', details: '2666MHz, Registered ECC memory' },
      storage: { name: '1TB SSD + 8TB HDD', details: 'NVMe PCIe SSD + massive project storage' },
      motherboard: { name: 'Dell Precision 7920 Board', details: 'Custom Dell dual socket board, C621 chipset' },
      psu: { name: 'Dell 1400W PSU', details: '1400W, 80+ Gold, maximum capacity', tdp: 1400 },
      cooling: { name: 'Stock Cooler', details: 'Dell liquid cooling with redundancy' }
    },
    upgradesSuggestions: [
      'Add second Xeon Silver processor',
      'Upgrade to 128GB ECC RAM for AI workloads',
      'Add multiple Quadro RTX GPUs for parallel processing'
    ]
  },
  {
    id: 'editing-heavy-7',
    name: 'HP Z8 G4 Workstation',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 280000,
    estimatedWattage: 1100,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon Silver 4114', details: '10 cores, 2.2GHz, 85W TDP, scalable architecture', tdp: 85 },
      gpu: { name: 'NVIDIA Quadro RTX 4000', details: '8GB GDDR6, RTX ray tracing professional graphics' },
      ram: { name: 'DDR4 128GB ECC', details: '2666MHz, High capacity registered memory' },
      storage: { name: '2TB SSD + 8TB HDD', details: 'Large NVMe SSD + massive storage array' },
      motherboard: { name: 'HP Z8 G4 Board', details: 'Custom HP dual socket board, C621 chipset' },
      psu: { name: 'HP 1700W PSU', details: '1700W, 80+ Platinum, maximum efficiency', tdp: 1700 },
      cooling: { name: 'Stock Cooler', details: 'HP advanced liquid cooling system' }
    },
    upgradesSuggestions: [
      'Add second Xeon Silver for dual socket configuration',
      'Upgrade to 256GB ECC RAM for extreme workloads',
      'Add multiple Quadro RTX GPUs for GPU clusters'
    ]
  },
  {
    id: 'editing-heavy-8',
    name: 'Dell Precision 7920 Rack',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 320000,
    estimatedWattage: 1200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon Gold 5118', details: '12 cores, 2.3GHz, 105W TDP, high performance', tdp: 105 },
      gpu: { name: 'NVIDIA Quadro RTX 5000', details: '16GB GDDR6, flagship RTX professional graphics' },
      ram: { name: 'DDR4 128GB ECC', details: '2666MHz, Registered ECC memory' },
      storage: { name: '2TB SSD + 16TB HDD', details: 'NVMe RAID + enterprise storage array' },
      motherboard: { name: 'Dell Precision 7920 Rack Board', details: 'Custom Dell rack board, C621 chipset' },
      psu: { name: 'Dell 1400W Redundant PSU', details: '1400W, 80+ Platinum, redundant power', tdp: 1400 },
      cooling: { name: 'Stock Cooler', details: 'Dell rack liquid cooling system' }
    },
    upgradesSuggestions: [
      'Add second Xeon Gold processor for maximum performance',
      'Upgrade to 256GB ECC RAM for massive datasets',
      'Add Tesla GPUs for AI/ML acceleration'
    ]
  },
  {
    id: 'editing-heavy-9',
    name: 'HP Z6 G4 Workstation',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 195000,
    estimatedWattage: 750,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon W-2133', details: '6 cores, 3.6GHz, 140W TDP, workstation processor', tdp: 140 },
      gpu: { name: 'NVIDIA Quadro P6000', details: '24GB GDDR5X, extreme professional graphics' },
      ram: { name: 'DDR4 64GB ECC', details: '2666MHz, Error-correcting memory' },
      storage: { name: '1TB SSD + 4TB HDD', details: 'NVMe PCIe SSD + large project storage' },
      motherboard: { name: 'HP Z6 G4 Board', details: 'Custom HP workstation board, C422 chipset' },
      psu: { name: 'HP 1125W PSU', details: '1125W, 80+ Gold, high capacity', tdp: 1125 },
      cooling: { name: 'Stock Cooler', details: 'HP workstation liquid cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 128GB ECC RAM for 8K video editing',
      'Add multiple Quadro GPUs for GPU rendering',
      'Consider faster NVMe storage array'
    ]
  },
  {
    id: 'editing-heavy-10',
    name: 'Dell Precision 5820 Tower XL',
    category: 'editing',
    intensity: 'heavy',
    totalCost: 155000,
    estimatedWattage: 500,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Xeon W-2145', details: '8 cores, 3.7GHz, 140W TDP, high frequency', tdp: 140 },
      gpu: { name: 'NVIDIA Quadro RTX 4000', details: '8GB GDDR6, RTX ray tracing graphics' },
      ram: { name: 'DDR4 32GB ECC', details: '2666MHz, Error-correcting memory' },
      storage: { name: '1TB SSD + 4TB HDD', details: 'Fast NVMe SSD + large storage HDD' },
      motherboard: { name: 'Dell Precision 5820 XL Board', details: 'Custom Dell workstation board, C422 chipset' },
      psu: { name: 'Dell 950W PSU', details: '950W, 80+ Gold, high performance', tdp: 950 },
      cooling: { name: 'Stock Cooler', details: 'Dell enhanced workstation cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to 64GB ECC RAM for complex rendering',
      'Add faster Quadro RTX GPU for AI acceleration',
      'Consider NVMe RAID for faster project access'
    ]
  },

  // GAMING BUILDS - CUSTOM BUILDS WITH BRAND NAMES (20 builds: 10 casual + 10 heavy)
  
  // Gaming Casual Builds (10 builds)
  {
    id: 'gaming-casual-1',
    name: 'Intel 6th Gen i5 + Nvidia GPU',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 47500,
    estimatedWattage: 180,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-6500', details: '4 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GT 1030', details: '384 CUDA cores, 2GB GDDR5, low power gaming', tdp: 30 },
      ram: { name: 'Corsair Vengeance LPX 8GB DDR4', details: '2400MHz, Single stick, gaming optimized' },
      storage: { name: 'Kingston A400 240GB SSD', details: 'SATA III, Fast game loading' },
      motherboard: { name: 'MSI H110M-A PRO', details: 'H110 chipset, PCIe x16 slot for GPU' },
      psu: { name: 'Corsair CV450', details: '450W, 80+ Bronze, sufficient for entry gaming', tdp: 450 },
      cooling: { name: 'Intel Stock Cooler', details: 'Standard CPU cooling included with processor' }
    },
    upgradesSuggestions: [
      'Upgrade to GTX 1050 Ti for better performance',
      'Add second 8GB RAM stick',
      'Consider aftermarket CPU cooler'
    ]
  },
  {
    id: 'gaming-casual-2',
    name: 'Intel 6th Gen i5 + GTX 1050 Ti',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 63000,
    estimatedWattage: 220,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-6500', details: '4 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 1050 Ti', details: '768 CUDA cores, 4GB GDDR5, 1080p gaming', tdp: 75 },
      ram: { name: 'G.Skill Ripjaws V 8GB DDR4', details: '2400MHz, Single stick, expandable' },
      storage: { name: 'Samsung 860 EVO 240GB SSD', details: 'SATA III, Game ready storage' },
      motherboard: { name: 'ASUS H110M-E/M.2', details: 'H110 chipset, stable gaming platform' },
      psu: { name: 'Seasonic Focus GX-500', details: '500W, 80+ Gold, gaming ready PSU', tdp: 500 },
      cooling: { name: 'Cooler Master Hyper 212 EVO', details: 'Aftermarket tower cooler with heat pipes' }
    },
    upgradesSuggestions: [
      'Add second 8GB RAM for 16GB total',
      'Upgrade to larger SSD for more games',
      'Consider GTX 1060 for higher settings'
    ]
  },
  {
    id: 'gaming-casual-3',
    name: 'AMD Ryzen 3 + GTX 750 Ti',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 41000,
    estimatedWattage: 170,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 3 1200', details: '4 cores, 3.1GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 750 Ti', details: '640 CUDA cores, 2GB GDDR5, entry gaming', tdp: 60 },
      ram: { name: 'Team T-FORCE Vulcan Z 8GB DDR4', details: '2666MHz, Single stick, gaming memory' },
      storage: { name: 'WD Blue 3D NAND 120GB SSD', details: 'SATA III, Fast boot storage' },
      motherboard: { name: 'MSI A320M-A PRO', details: 'A320 chipset, AM4 socket, budget gaming' },
      psu: { name: 'EVGA BR 450W', details: '450W, 80+ Bronze certified, gaming ready', tdp: 450 },
      cooling: { name: 'AMD Wraith Stealth', details: 'Stock AMD cooler included with processor' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better gaming',
      'Add larger SSD for game storage',
      'Consider GTX 1050 Ti upgrade'
    ]
  },
  {
    id: 'gaming-casual-4',
    name: 'Intel 6th Gen i3 + GT 1030',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 38000,
    estimatedWattage: 150,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-6100', details: '2 cores, 3.7GHz, 51W TDP', tdp: 51 },
      gpu: { name: 'Nvidia GeForce GT 1030', details: '384 CUDA cores, 2GB GDDR5, compact gaming', tdp: 30 },
      ram: { name: 'Crucial Ballistix Sport LT 8GB DDR4', details: '2133MHz, Single stick, dual channel ready' },
      storage: { name: 'Kingston NV2 240GB SSD', details: 'NVMe PCIe, Budget gaming storage' },
      motherboard: { name: 'Gigabyte H110M-S2H', details: 'H110 chipset, gaming optimized features' },
      psu: { name: 'Thermaltake Smart 450W', details: '450W, 80+ White, compact gaming PSU', tdp: 450 },
      cooling: { name: 'Intel Stock Cooler', details: 'Standard CPU cooling included' }
    },
    upgradesSuggestions: [
      'Add second 8GB RAM stick',
      'Upgrade to GTX 1050 for better performance',
      'Consider i5 processor upgrade'
    ]
  },
  {
    id: 'gaming-casual-5',
    name: 'AMD Ryzen 3 + RX 560',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 52000,
    estimatedWattage: 200,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 3 2200G', details: '4 cores, 3.5GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon RX 560', details: '1024 stream processors, 4GB GDDR5, 1080p gaming', tdp: 80 },
      ram: { name: 'G.Skill Aegis 8GB DDR4', details: '2666MHz, Single stick, gaming optimized' },
      storage: { name: 'Crucial MX500 240GB SSD', details: 'SATA III, Gaming storage solution' },
      motherboard: { name: 'ASRock B450M PRO4', details: 'B450 chipset, AM4 socket, budget gaming' },
      psu: { name: 'Cooler Master MWE Bronze V2 500W', details: '500W, 80+ Bronze, gaming ready power', tdp: 500 },
      cooling: { name: 'AMD Wraith Stealth', details: 'Stock AMD cooler with good performance' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better performance',
      'Add larger SSD for more games',
      'Consider RX 570 for higher settings'
    ]
  },
  {
    id: 'gaming-casual-6',
    name: 'Intel 4th Gen i5 + GTX 960',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 45000,
    estimatedWattage: 190,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-4460', details: '4 cores, 3.2GHz, 84W TDP, 4th gen', tdp: 84 },
      gpu: { name: 'Nvidia GeForce GTX 960', details: '1024 CUDA cores, 2GB GDDR5, used gaming card', tdp: 120 },
      ram: { name: 'HyperX Fury 8GB DDR3', details: '1600MHz, Dual channel kit, legacy standard' },
      storage: { name: 'Samsung 870 EVO 240GB SSD', details: 'SATA III, Fast game loading' },
      motherboard: { name: 'ASUS H81M-K', details: 'H81 chipset, LGA1150 socket, basic gaming' },
      psu: { name: 'Antec VP500P', details: '500W, 80+ certified, gaming PSU', tdp: 500 },
      cooling: { name: 'Cooler Master Hyper 212 LED', details: 'Aftermarket CPU cooler with LED fan' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB DDR3 RAM',
      'Consider newer generation GPU',
      'Add larger capacity storage'
    ]
  },
  {
    id: 'gaming-casual-7',
    name: 'AMD Ryzen 5 + GTX 1050',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 58000,
    estimatedWattage: 210,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 5 1400', details: '4 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 1050', details: '640 CUDA cores, 2GB GDDR5, budget gaming', tdp: 75 },
      ram: { name: 'Corsair Vengeance LPX 8GB DDR4', details: '2666MHz, Single stick, gaming memory' },
      storage: { name: 'Kingston A400 480GB SSD', details: 'SATA III, Large gaming storage' },
      motherboard: { name: 'MSI B350M GAMING PRO', details: 'B350 chipset, AM4 socket, gaming features' },
      psu: { name: 'Seasonic Focus GX-550', details: '550W, 80+ Gold, modular PSU', tdp: 550 },
      cooling: { name: 'AMD Wraith Spire', details: 'Stock AMD cooler with RGB lighting' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better gaming',
      'Add GTX 1060 for higher frame rates',
      'Consider faster DDR4 memory'
    ]
  },
  {
    id: 'gaming-casual-8',
    name: 'Intel 7th Gen i3 + GTX 1050 Ti',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 55000,
    estimatedWattage: 185,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-7100', details: '2 cores, 3.9GHz, 51W TDP', tdp: 51 },
      gpu: { name: 'Nvidia GeForce GTX 1050 Ti', details: '768 CUDA cores, 4GB GDDR5, 1080p gaming', tdp: 75 },
      ram: { name: 'Team T-FORCE Delta RGB 8GB DDR4', details: '2400MHz, Single stick with RGB lighting' },
      storage: { name: 'WD Blue SN550 250GB NVMe SSD', details: 'NVMe PCIe, Fast gaming storage' },
      motherboard: { name: 'ASUS PRIME B250M-K', details: 'B250 chipset, LGA1151, gaming ready' },
      psu: { name: 'Corsair CV450', details: '450W, 80+ Bronze, reliable gaming PSU', tdp: 450 },
      cooling: { name: 'Intel Stock Cooler', details: 'Standard CPU cooling' }
    },
    upgradesSuggestions: [
      'Upgrade to i5 processor for better performance',
      'Add second 8GB RAM stick',
      'Consider GTX 1060 for higher settings'
    ]
  },
  {
    id: 'gaming-casual-9',
    name: 'AMD FX + GTX 950',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 35000,
    estimatedWattage: 220,
    compatibility: 'warning',
    components: {
      cpu: { name: 'AMD FX-6300', details: '6 cores, 3.5GHz, 95W TDP, older architecture', tdp: 95 },
      gpu: { name: 'Nvidia GeForce GTX 950', details: '768 CUDA cores, 2GB GDDR5, budget gaming', tdp: 90 },
      ram: { name: 'Kingston HyperX Fury 8GB DDR3', details: '1866MHz, Single stick, legacy memory' },
      storage: { name: 'Transcend SSD370 128GB', details: 'SATA III, Budget SSD storage' },
      motherboard: { name: 'ASUS M5A78L-M/USB3', details: 'AMD 760G chipset, AM3+ socket' },
      psu: { name: 'EVGA 500 W1', details: '500W, 80+ White, basic gaming PSU', tdp: 500 },
      cooling: { name: 'AMD Stock Cooler', details: 'Standard AMD cooler for FX series' }
    },
    upgradesSuggestions: [
      'Consider upgrading to modern Ryzen platform',
      'Add more RAM for better multitasking',
      'Upgrade to newer generation GPU'
    ]
  },
  {
    id: 'gaming-casual-10',
    name: 'Intel 8th Gen i3 + GTX 1050',
    category: 'gaming',
    intensity: 'casual',
    totalCost: 48000,
    estimatedWattage: 165,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i3-8100', details: '4 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 1050', details: '640 CUDA cores, 2GB GDDR5, budget gaming', tdp: 75 },
      ram: { name: 'Crucial Ballistix 8GB DDR4', details: '2666MHz, Single stick, expandable' },
      storage: { name: 'Intel 660p 256GB NVMe SSD', details: 'NVMe PCIe, Fast storage solution' },
      motherboard: { name: 'Gigabyte B360M DS3H', details: 'B360 chipset, LGA1151, modern features' },
      psu: { name: 'Thermaltake Smart BX1 450W', details: '450W, 80+ Bronze, compact design', tdp: 450 },
      cooling: { name: 'Intel Stock Cooler', details: 'Standard CPU cooling solution' }
    },
    upgradesSuggestions: [
      'Upgrade to 16GB RAM for better gaming',
      'Add GTX 1060 for higher performance',
      'Consider aftermarket CPU cooler'
    ]
  },

  // Gaming Heavy Builds (10 builds)
  {
    id: 'gaming-heavy-1',
    name: 'Intel 6th Gen i5 + GTX 970',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 72500,
    estimatedWattage: 300,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-6500', details: '4 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 970', details: '1664 CUDA cores, 4GB GDDR5, high 1080p gaming', tdp: 145 },
      ram: { name: 'Corsair Vengeance LPX 16GB DDR4', details: '2400MHz, Dual channel for gaming' },
      storage: { name: 'Samsung 860 EVO 240GB SSD', details: 'SATA III, Fast game loading' },
      motherboard: { name: 'ASUS H170-PRO', details: 'H170 chipset, PCIe 3.0 x16 slot' },
      psu: { name: 'Seasonic Focus GX-600', details: '600W, 80+ Gold, premium efficiency', tdp: 600 },
      cooling: { name: 'Cooler Master Hyper 212 Black Edition', details: 'Aftermarket CPU cooler with black finish' }
    },
    upgradesSuggestions: [
      'Upgrade to GTX 1060 for newer architecture',
      'Add larger SSD for game library',
      'Consider CPU upgrade to i7 for streaming'
    ]
  },
  {
    id: 'gaming-heavy-2',
    name: 'AMD Ryzen 5 + GTX 1060 6GB',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 106500,
    estimatedWattage: 350,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 5 1600', details: '6 cores, 3.2GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 1060 6GB', details: '1280 CUDA cores, 6GB GDDR5, 1440p capable', tdp: 120 },
      ram: { name: 'G.Skill Ripjaws V 16GB DDR4', details: '3000MHz, High speed for Ryzen' },
      storage: { name: 'Crucial MX500 240GB SSD', details: 'SATA III, System and game storage' },
      motherboard: { name: 'MSI B350M PRO-VDH', details: 'B350 chipset, AM4 socket, overclocking support' },
      psu: { name: 'Seasonic Focus GX-650', details: '650W, 80+ Gold, modular design', tdp: 650 },
      cooling: { name: 'AMD Wraith Spire RGB', details: 'Stock AMD cooling with RGB lighting' }
    },
    upgradesSuggestions: [
      'Upgrade to larger NVMe SSD',
      'Add more case fans for airflow',
      'Consider CPU upgrade to Ryzen 5 2600'
    ]
  },
  {
    id: 'gaming-heavy-3',
    name: 'Intel 7th Gen i7 + GTX 1060 6GB',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 123000,
    estimatedWattage: 380,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-7700', details: '4 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'Nvidia GeForce GTX 1060 6GB', details: '1280 CUDA cores, 6GB GDDR5, premium gaming', tdp: 120 },
      ram: { name: 'Corsair Vengeance RGB Pro 16GB DDR4', details: '2400MHz, Dual channel gaming memory with RGB' },
      storage: { name: 'Samsung 860 EVO 480GB SSD', details: 'SATA III, Premium SSD with large capacity' },
      motherboard: { name: 'ASUS PRIME Z270-P', details: 'Z270 chipset, LGA1151, gaming features' },
      psu: { name: 'Seasonic Focus GX-700', details: '700W, 80+ Gold, high wattage headroom', tdp: 700 },
      cooling: { name: 'Cooler Master Hyper 212 RGB Black Edition', details: 'RGB lighting with good performance' }
    },
    upgradesSuggestions: [
      'Upgrade to GTX 1070 for higher frame rates',
      'Add liquid cooling for overclocking',
      'Consider 32GB RAM for content creation'
    ]
  },
  {
    id: 'gaming-heavy-4',
    name: 'AMD Ryzen 5 + RX 580 8GB',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 89000,
    estimatedWattage: 350,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 5 2600', details: '6 cores, 3.4GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon RX 580 8GB', details: '2304 stream processors, 8GB GDDR5, high 1080p gaming', tdp: 185 },
      ram: { name: 'Team T-FORCE Delta RGB 16GB DDR4', details: '3000MHz, High speed dual channel with RGB' },
      storage: { name: 'Kingston A2000 240GB NVMe SSD', details: 'NVMe PCIe, Gaming storage' },
      motherboard: { name: 'MSI B450 TOMAHAWK', details: 'B450 chipset, AM4 socket, gaming features' },
      psu: { name: 'Seasonic Focus GX-600', details: '600W, 80+ Gold, gaming grade PSU', tdp: 600 },
      cooling: { name: 'AMD Wraith Stealth', details: 'Stock AMD cooler' }
    },
    upgradesSuggestions: [
      'Add larger NVMe SSD for game library',
      'Upgrade to RX 6600 for better performance',
      'Consider CPU upgrade to Ryzen 5 3600'
    ]
  },
  {
    id: 'gaming-heavy-5',
    name: 'Intel 6th Gen i7 + GTX 1070',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 135000,
    estimatedWattage: 400,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-6700K', details: '4 cores, 4.0GHz, 91W TDP, unlocked', tdp: 91 },
      gpu: { name: 'Nvidia GeForce GTX 1070', details: '1920 CUDA cores, 8GB GDDR5, high-end 1080p/1440p', tdp: 150 },
      ram: { name: 'G.Skill Trident Z RGB 16GB DDR4', details: '3200MHz, High performance RGB memory' },
      storage: { name: 'Samsung 970 EVO 250GB NVMe SSD', details: 'NVMe PCIe, High-speed gaming storage' },
      motherboard: { name: 'ASUS ROG STRIX Z170-E GAMING', details: 'Z170 chipset, LGA1151, gaming motherboard' },
      psu: { name: 'Corsair RM750x', details: '750W, 80+ Gold, fully modular gaming PSU', tdp: 750 },
      cooling: { name: 'Noctua NH-D15', details: 'Premium air cooler with dual fans' }
    },
    upgradesSuggestions: [
      'Upgrade to RTX series for ray tracing',
      'Add liquid cooling for better overclocking',
      'Consider 32GB RAM for streaming'
    ]
  },
  {
    id: 'gaming-heavy-6',
    name: 'AMD Ryzen 7 + GTX 1070 Ti',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 145000,
    estimatedWattage: 420,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 7 1700X', details: '8 cores, 3.4GHz, 95W TDP', tdp: 95 },
      gpu: { name: 'Nvidia GeForce GTX 1070 Ti', details: '2432 CUDA cores, 8GB GDDR5, high-end gaming', tdp: 180 },
      ram: { name: 'Corsair Vengeance RGB Pro 16GB DDR4', details: '3200MHz, High speed RGB memory for Ryzen' },
      storage: { name: 'WD Black SN750 500GB NVMe SSD', details: 'NVMe PCIe, Gaming optimized storage' },
      motherboard: { name: 'ASUS ROG STRIX B350-F GAMING', details: 'B350 chipset, AM4 socket, gaming features' },
      psu: { name: 'Seasonic Focus GX-750', details: '750W, 80+ Gold, high capacity modular PSU', tdp: 750 },
      cooling: { name: 'Corsair H100i RGB PLATINUM', details: 'AIO liquid cooler with RGB lighting' }
    },
    upgradesSuggestions: [
      'Upgrade to RTX 2070 for ray tracing',
      'Add more storage for game library',
      'Consider 32GB RAM for content creation'
    ]
  },
  {
    id: 'gaming-heavy-7',
    name: 'Intel 8th Gen i5 + GTX 1660 Ti',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 98000,
    estimatedWattage: 320,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i5-8600K', details: '6 cores, 3.6GHz, 95W TDP, unlocked', tdp: 95 },
      gpu: { name: 'Nvidia GeForce GTX 1660 Ti', details: '1536 CUDA cores, 6GB GDDR6, modern gaming', tdp: 120 },
      ram: { name: 'HyperX Predator RGB 16GB DDR4', details: '3200MHz, Gaming memory with RGB lighting' },
      storage: { name: 'Samsung 970 EVO Plus 250GB NVMe SSD', details: 'NVMe PCIe 3.0, Fast gaming storage' },
      motherboard: { name: 'MSI Z370 GAMING PLUS', details: 'Z370 chipset, LGA1151, overclocking support' },
      psu: { name: 'Cooler Master MWE Gold 650W', details: '650W, 80+ Gold, fully modular PSU', tdp: 650 },
      cooling: { name: 'be quiet! Dark Rock 4', details: 'Premium air cooler with low noise' }
    },
    upgradesSuggestions: [
      'Upgrade to RTX 2060 for ray tracing',
      'Add larger NVMe SSD for more games',
      'Consider liquid cooling for overclocking'
    ]
  },
  {
    id: 'gaming-heavy-8',
    name: 'AMD Ryzen 5 + RX 5700',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 112000,
    estimatedWattage: 380,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 5 3600', details: '6 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon RX 5700', details: '2304 stream processors, 8GB GDDR6, 1440p gaming', tdp: 180 },
      ram: { name: 'G.Skill Ripjaws V 16GB DDR4', details: '3600MHz, High speed memory optimized for Ryzen' },
      storage: { name: 'Crucial P1 500GB NVMe SSD', details: 'NVMe PCIe, Large capacity gaming storage' },
      motherboard: { name: 'MSI B450 TOMAHAWK MAX', details: 'B450 chipset, AM4 socket, Ryzen 3000 ready' },
      psu: { name: 'Seasonic Focus GX-650', details: '650W, 80+ Gold, reliable gaming PSU', tdp: 650 },
      cooling: { name: 'AMD Wraith Prism RGB', details: 'Stock AMD cooler with RGB lighting' }
    },
    upgradesSuggestions: [
      'Upgrade to RX 6700 XT for better performance',
      'Add more storage for game collection',
      'Consider aftermarket CPU cooler'
    ]
  },
  {
    id: 'gaming-heavy-9',
    name: 'Intel 9th Gen i7 + RTX 2060',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 155000,
    estimatedWattage: 450,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'Intel Core i7-9700K', details: '8 cores, 3.6GHz, 95W TDP, unlocked', tdp: 95 },
      gpu: { name: 'Nvidia GeForce RTX 2060', details: '1920 CUDA cores, 6GB GDDR6, ray tracing gaming', tdp: 160 },
      ram: { name: 'Corsair Dominator Platinum RGB 16GB DDR4', details: '3200MHz, Premium gaming memory with RGB' },
      storage: { name: 'Samsung 970 EVO Plus 500GB NVMe SSD', details: 'NVMe PCIe 3.0, High-performance storage' },
      motherboard: { name: 'ASUS ROG STRIX Z390-E GAMING', details: 'Z390 chipset, LGA1151, premium gaming board' },
      psu: { name: 'Corsair RM850x', details: '850W, 80+ Gold, fully modular premium PSU', tdp: 850 },
      cooling: { name: 'NZXT Kraken X63', details: 'AIO liquid cooler with customizable display' }
    },
    upgradesSuggestions: [
      'Upgrade to RTX 3070 for 4K gaming',
      'Add more NVMe storage',
      'Consider 32GB RAM for content creation'
    ]
  },
  {
    id: 'gaming-heavy-10',
    name: 'AMD Ryzen 7 + RX 6600 XT',
    category: 'gaming',
    intensity: 'heavy',
    totalCost: 125000,
    estimatedWattage: 400,
    compatibility: 'optimized',
    components: {
      cpu: { name: 'AMD Ryzen 7 3700X', details: '8 cores, 3.6GHz, 65W TDP', tdp: 65 },
      gpu: { name: 'AMD Radeon RX 6600 XT', details: '2048 stream processors, 8GB GDDR6, 1440p gaming', tdp: 160 },
      ram: { name: 'G.Skill Trident Z Neo 16GB DDR4', details: '3600MHz, Optimized for AMD Ryzen with RGB' },
      storage: { name: 'WD Black SN850 500GB NVMe SSD', details: 'NVMe PCIe 4.0, Next-gen gaming storage' },
      motherboard: { name: 'MSI B550 GAMING EDGE WIFI', details: 'B550 chipset, AM4 socket, PCIe 4.0 support' },
      psu: { name: 'Seasonic Focus GX-750', details: '750W, 80+ Gold, modular gaming PSU', tdp: 750 },
      cooling: { name: 'Cooler Master MasterLiquid ML240L RGB V2', details: 'AIO liquid cooler with RGB lighting' }
    },
    upgradesSuggestions: [
      'Upgrade to RX 6800 XT for 4K gaming',
      'Add more PCIe 4.0 NVMe storage',
      'Consider 32GB RAM for streaming and content creation'
    ]
  }
];