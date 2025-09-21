import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import defiService from '../services/defiService';

export const useDefiData = () => {
  const { address } = useAccount();
  const [data, setData] = useState({
    deposits: [],
    protocolHealth: [],
    alerts: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!address) {
      setData({ deposits: [], protocolHealth: [], alerts: [] });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        defiService.cache.clear();
      }

      const result = await defiService.fetchUserDefiData(address);
      const alerts = defiService.generateYieldAlerts(result.deposits);

      setData({
        deposits: result.deposits,
        protocolHealth: result.protocolHealth,
        alerts
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching DeFi data:', err);
      setError(err.message || 'Failed to fetch DeFi data');
      
      // Set empty data on error
      setData({ deposits: [], protocolHealth: [], alerts: [] });
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Auto-fetch data when address changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [address, fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Computed values
  const totalBalance = data.deposits.reduce((sum, deposit) => sum + deposit.balance, 0);
  const totalEarnings = data.deposits.reduce((sum, deposit) => sum + deposit.earnings, 0);
  const avgAPY = data.deposits.length > 0 
    ? data.deposits.reduce((sum, deposit) => sum + deposit.apy, 0) / data.deposits.length 
    : 0;
  const activeProtocols = data.deposits.length;

  return {
    // Data
    deposits: data.deposits,
    protocolHealth: data.protocolHealth,
    alerts: data.alerts,
    
    // Computed values
    totalBalance,
    totalEarnings,
    avgAPY,
    activeProtocols,
    
    // State
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    refresh
  };
};