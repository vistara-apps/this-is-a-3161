import React from 'react';
import { TrendingUp } from 'lucide-react';

const YieldChart = () => {
  // Mock chart data
  const chartData = [
    { protocol: 'Aave', apy: 4.2, change: +0.3 },
    { protocol: 'Compound', apy: 3.8, change: -0.1 },
    { protocol: 'Maker', apy: 5.1, change: +0.8 },
  ];

  return (
    <div className="bg-surface/30 border border-surface rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">APY Comparison</h3>
        <TrendingUp className="w-5 h-5 text-accent" />
      </div>

      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-bg rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                item.protocol === 'Aave' ? 'bg-purple-500' :
                item.protocol === 'Compound' ? 'bg-green-500' : 'bg-orange-500'
              }`}></div>
              <span className="text-text-primary font-medium">{item.protocol}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-text-primary font-bold">{item.apy}%</span>
              <span className={`text-sm ${
                item.change > 0 ? 'text-success' : 'text-danger'
              }`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-text-secondary text-center">
        APY rates updated every 15 minutes
      </div>
    </div>
  );
};

export default YieldChart;