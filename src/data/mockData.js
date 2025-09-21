// Mock data for demonstration purposes
export const mockProtocolData = (walletAddress) => {
  return {
    deposits: [
      {
        protocol: 'Aave',
        token: 'USDC',
        amount: 5000,
        balance: 5174.02,
        apy: 4.2,
        earnings: 174.02,
        lastUpdated: '2 min ago'
      },
      {
        protocol: 'Compound',
        token: 'USDT',
        amount: 3000,
        balance: 3139.94,
        apy: 3.8,
        earnings: 139.94,
        lastUpdated: '5 min ago'
      },
      {
        protocol: 'Maker',
        token: 'DAI',
        amount: 2500,
        balance: 2649.50,
        apy: 5.1,
        earnings: 149.50,
        lastUpdated: '1 min ago'
      }
    ],
    protocolHealth: [
      {
        name: 'Aave V3',
        healthScore: 87,
        tvl: '12.4B',
        utilization: 68,
        riskLevel: 'Low'
      },
      {
        name: 'Compound V3',
        healthScore: 79,
        tvl: '8.2B',
        utilization: 72,
        riskLevel: 'Low'
      },
      {
        name: 'MakerDAO',
        healthScore: 91,
        tvl: '15.8B',
        utilization: 45,
        riskLevel: 'Low'
      }
    ]
  };
};

export const generateYieldAlert = () => {
  return {
    id: 1,
    type: 'success',
    title: 'Yield Opportunity Detected',
    message: 'USDC APY on Compound increased to 5.2% (+1.4%). Consider moving funds from Aave (4.2% APY) for better returns.',
    timestamp: '2 minutes ago'
  };
};

// Simulate real-time APY data
export const getAPYData = (protocol) => {
  const baseAPYs = {
    'aave': 4.2,
    'compound': 3.8,
    'maker': 5.1
  };
  
  // Add some random fluctuation
  const fluctuation = (Math.random() - 0.5) * 0.4;
  return Math.max(0, baseAPYs[protocol.toLowerCase()] + fluctuation);
};