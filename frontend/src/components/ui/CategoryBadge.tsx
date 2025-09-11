import React from 'react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface CategoryBadgeProps {
  category: Category;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  showDescription?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  variant = 'default',
  size = 'md',
  className = '',
  showIcon = true,
  showDescription = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded-full font-medium inline-flex items-center gap-1.5 transition-colors';

    switch (variant) {
      case 'filled':
        return `${baseClasses} text-white`;
      case 'outline':
        return `${baseClasses} border-2 bg-transparent`;
      default:
        return `${baseClasses} text-gray-700`;
    }
  };

  const getCategoryStyles = () => {
    const color = category.color || '#6B7280'; // Default gray color

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: color,
          borderColor: color,
        };
      case 'outline':
        return {
          borderColor: color,
          color: color,
        };
      default:
        return {
          backgroundColor: `${color}20`, // 20% opacity
          color: color,
          borderColor: color,
        };
    }
  };

  const renderIcon = () => {
    if (!showIcon || !category.icon) return null;

    // If icon is a FontAwesome class
    if (category.icon.startsWith('fas ') || category.icon.startsWith('far ') || category.icon.startsWith('fab ')) {
      return <i className={`${category.icon} text-current`} style={{ fontSize: size === 'sm' ? '10px' : '12px' }} />;
    }

    // If icon is a URL or emoji, display as text
    return <span className="text-current">{category.icon}</span>;
  };

  return (
    <div className={`${getSizeClasses()} ${getVariantClasses()} ${className}`} style={getCategoryStyles()}>
      {renderIcon()}
      <span className="font-medium">{category.name}</span>
      {showDescription && category.description && (
        <span className="text-xs opacity-75 ml-1">({category.description})</span>
      )}
    </div>
  );
};

export default CategoryBadge;
