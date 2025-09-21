import React from 'react';

const DepositCard = ({ deposit }) => {
  const getProtocolColor = (protocol) => {
    switch (protocol.toLowerCase()) {
      case 'aave':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'compound':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maker':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-accent/20 text-accent border-accent/30';
    }
  };

  const getTokenIcon = (token) => {
    // Simple token icon representation
    return (
      <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">{token}</span>
      </div>
    );
  };

  return (
    <div className="bg-surface/30 border border-surface rounded-xl p-6 shadow-card hover:bg-surface/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getTokenIcon(deposit.token)}
          <div>
            <h3 className="font-semibold text-text-primary">{deposit.token}</h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${getProtocolColor(deposit.protocol)}`}>
              {deposit.protocol}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-text-primary">
            ${deposit.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-success">
            +${deposit.earnings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Current APY</span>
          <span className="text-sm font-medium text-text-primary">{deposit.apy.toFixed(2)}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Deposited</span>
          <span className="text-sm font-medium text-text-primary">
            {deposit.amount.toLocaleString()} {deposit.token}
          </span>
        </div>

        <div className="pt-3 border-t border-surface">
          <div className="flex justify-between items-center text-xs text-text-secondary">
            <span>Last updated</span>
            <span>{deposit.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositCard;