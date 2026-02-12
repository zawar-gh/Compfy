//mockdata.ts
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
]
