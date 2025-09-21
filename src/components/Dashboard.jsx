import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import StatCard from './StatCard';
import DepositCard from './DepositCard';
import AlertNotification from './AlertNotification';
import ProtocolHealthCard from './ProtocolHealthCard';
import YieldChart from './YieldChart';
import { mockProtocolData, generateYieldAlert } from '../data/mockData';

const Dashboard = ({ isSubscribed, hasTrialAccess, onUpgrade }) => {
  const { address } = useAccount();
  const [deposits, setDeposits] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [protocolHealth, setProtocolHealth] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading protocol data
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = mockProtocolData(address);
      setDeposits(data.deposits);
      setProtocolHealth(data.protocolHealth);
      
      // Generate sample alerts for pro users
      if (isSubscribed || hasTrialAccess) {
        const alert = generateYieldAlert();
        setAlerts([alert]);
      }
      
      setIsLoading(false);
    };

    if (address) {
      loadData();
    }
  }, [address, isSubscribed, hasTrialAccess]);

  const totalBalance = deposits.reduce((sum, deposit) => sum + deposit.balance, 0);
  const totalEarnings = deposits.reduce((sum, deposit) => sum + deposit.earnings, 0);
  const avgAPY = deposits.length > 0 
    ? deposits.reduce((sum, deposit) => sum + deposit.apy, 0) / deposits.length 
    : 0;

  const hasAccess = isSubscribed || hasTrialAccess;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
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
      {alerts.length > 0 && hasAccess && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Yield Optimization Alerts</h2>
          {alerts.map((alert, index) => (
            <AlertNotification key={index} alert={alert} />
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
          value={deposits.length.toString()}
          trend="neutral"
        />
      </div>

      {/* Deposits Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Stablecoin Deposits</h2>
          <div className="text-sm text-text-secondary">
            Balances updated in real-time
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deposits.map((deposit, index) => (
            <DepositCard key={index} deposit={deposit} />
          ))}
        </div>
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