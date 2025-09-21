import React, { useState } from 'react';
import { TrendingUp, X, ExternalLink } from 'lucide-react';

const AlertNotification = ({ alert }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getAlertColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/30 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'danger':
        return 'bg-danger/10 border-danger/30 text-danger';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getAlertColor(alert.type)} shadow-card`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">{alert.title}</h4>
            <p className="text-sm opacity-90">{alert.message}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-xs opacity-75">{alert.timestamp}</span>
              <button className="text-xs hover:underline flex items-center space-x-1">
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-black/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;