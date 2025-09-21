import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import StatCard from './StatCard';
import DepositCard from './DepositCard';
import AlertNotification from './AlertNotification';
import ProtocolHealthCard from './ProtocolHealthCard';
import YieldChart from './YieldChart';
import { useDefiData } from '../hooks/useDefiData';

const Dashboard = ({ isSubscribed, hasTrialAccess, onUpgrade }) => {
  const { address } = useAccount();
  const {
    deposits,
    protocolHealth,
    alerts,
    totalBalance,
    totalEarnings,
    avgAPY,
    activeProtocols,
    isLoading,
    error,
    lastUpdated,
    refresh
  } = useDefiData();

  const hasAccess = isSubscribed || hasTrialAccess;

  // Filter alerts based on subscription status
  const visibleAlerts = hasAccess ? alerts : [];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Connection Status & Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {error ? (
              <WifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <Wifi className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm text-text-secondary">
              {error ? 'Connection Error' : 'Live Data'}
              {lastUpdated && !error && (
                <span className="ml-2">
                  • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </span>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-1.5 bg-surface/50 hover:bg-surface/70 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-red-500 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-red-500 font-medium">Data Connection Error</p>
              <p className="text-text-secondary text-sm">
                Unable to fetch live DeFi data. Showing cached/sample data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trial Banner */}
      {hasTrialAccess && !isSubscribed && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
              <span className="text-warning text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-warning font-medium">Trial Active</p>
              <p className="text-text-secondary text-sm">You have limited access. Upgrade for full features.</p>
            </div>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-warning hover:bg-warning/90 text-black font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Yield Optimization Alerts</h2>
          {visibleAlerts.map((alert, index) => (
            <AlertNotification key={alert.id || index} alert={alert} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="up"
          change="+2.4%"
        />
        <StatCard
          title="Total Earnings"
          value={`$${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="up"
          change="+$45.20"
        />
        <StatCard
          title="Average APY"
          value={`${avgAPY.toFixed(2)}%`}
          trend="neutral"
        />
        <StatCard
          title="Active Protocols"
          value={activeProtocols.toString()}
          trend="neutral"
        />
      </div>

      {/* Deposits Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {deposits.length > 0 ? 'Your DeFi Deposits' : 'Sample DeFi Opportunities'}
          </h2>
          <div className="text-sm text-text-secondary">
            {deposits.length > 0 ? 'Live balances' : 'Connect wallet for personal data'}
          </div>
        </div>
        
        {deposits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deposits.map((deposit, index) => (
              <DepositCard key={`${deposit.protocol}-${deposit.token}-${index}`} deposit={deposit} />
            ))}
          </div>
        ) : (
          <div className="bg-surface/30 border border-surface rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              No Active Deposits Found
            </h3>
            <p className="text-text-secondary mb-6">
              Connect your wallet and make deposits in Aave, Compound, or MakerDAO to see your positions here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-surface/50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary">Aave V3</h4>
                <p className="text-sm text-text-secondary mt-1">Lending & Borrowing</p>
                <p className="text-lg font-semibold text-accent mt-2">4.2% APY</p>
              </div>
              <div className="bg-surface/50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary">Compound V3</h4>
                <p className="text-sm text-text-secondary mt-1">Supply & Earn</p>
                <p className="text-lg font-semibold text-accent mt-2">3.8% APY</p>
              </div>
              <div className="bg-surface/50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary">MakerDAO DSR</h4>
                <p className="text-sm text-text-secondary mt-1">DAI Savings Rate</p>
                <p className="text-lg font-semibold text-accent mt-2">5.1% APY</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Protocol Health */}
      {hasAccess ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Protocol Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {protocolHealth.map((protocol, index) => (
              <ProtocolHealthCard key={index} protocol={protocol} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface/30 border border-surface rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Protocol Health Insights
          </h3>
          <p className="text-text-secondary mb-6">
            Upgrade to access detailed protocol health metrics, risk scores, and advanced analytics.
          </p>
          <button
            onClick={onUpgrade}
            className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Unlock Protocol Health
          </button>
        </div>
      )}

      {/* Yield Chart */}
      {hasAccess && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">APY Trends</h2>
          <YieldChart />
        </div>
      )}
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface/30 border border-surface rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-surface rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-surface rounded w-3/4"></div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface/30 border border-surface rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-surface rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-surface rounded w-2/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface rounded"></div>
              <div className="h-4 bg-surface rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;