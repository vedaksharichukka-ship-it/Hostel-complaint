import {
  Bug,
  Hammer,
  Refrigerator,
  ShieldAlert,
  Sparkles,
  UtensilsCrossed,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';
import React from 'react';
import { ComplaintCategory } from '../../types';

interface CategoryIconProps {
  category: ComplaintCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'electrical':
      return <Zap className={className} />;
    case 'plumbing':
      return <Wrench className={className} />;
    case 'wifi':
      return <Wifi className={className} />;
    case 'carpentry':
      return <Hammer className={className} />;
    case 'housekeeping':
      return <Sparkles className={className} />;
    case 'mess':
      return <UtensilsCrossed className={className} />;
    case 'pest_control':
      return <Bug className={className} />;
    case 'security':
      return <ShieldAlert className={className} />;
    case 'appliances':
      return <Refrigerator className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
