import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, trend, change, variant = 'default' }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      default:
        return 'text-text-secondary';
    }
  };

  const cardClasses = variant === 'highlight' 
    ? 'bg-accent/10 border-accent/30' 
    : 'bg-surface/30 border-surface';

  return (
    <div className={`border rounded-xl p-6 ${cardClasses} shadow-card`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        {trend && getTrendIcon()}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {change && (
          <p className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;