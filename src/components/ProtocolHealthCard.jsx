import React from 'react';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';

const ProtocolHealthCard = ({ protocol }) => {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getHealthIcon = (score) => {
    if (score >= 80) return <Shield className="w-5 h-5 text-success" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <AlertTriangle className="w-5 h-5 text-danger" />;
  };

  return (
    <div className="bg-surface/30 border border-surface rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{protocol.name}</h3>
        {getHealthIcon(protocol.healthScore)}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Health Score</span>
            <span className={`text-sm font-medium ${getHealthColor(protocol.healthScore)}`}>
              {protocol.healthScore}/100
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                protocol.healthScore >= 80 ? 'bg-success' :
                protocol.healthScore >= 60 ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${protocol.healthScore}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary block">TVL</span>
            <span className="text-text-primary font-medium">${protocol.tvl}</span>
          </div>
          <div>
            <span className="text-text-secondary block">Utilization</span>
            <span className="text-text-primary font-medium">{protocol.utilization}%</span>
          </div>
        </div>

        <div className="pt-3 border-t border-surface">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Risk Level</span>
            <span className={`px-2 py-1 rounded-full ${
              protocol.riskLevel === 'Low' ? 'bg-success/20 text-success' :
              protocol.riskLevel === 'Medium' ? 'bg-warning/20 text-warning' :
              'bg-danger/20 text-danger'
            }`}>
              {protocol.riskLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolHealthCard;