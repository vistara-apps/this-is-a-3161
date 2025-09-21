import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../App';
import defiService from '../../services/defiService';

// Mock wagmi
vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }) => children,
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true
  }),
  useWalletClient: () => ({
    data: null,
    isError: false,
    isLoading: false
  })
}));

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  RainbowKitProvider: ({ children }) => children,
  getDefaultConfig: () => ({}),
}));

// Mock DeFi service
vi.mock('../../services/defiService');

const mockDefiService = vi.mocked(defiService);

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('DeFi Integration E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful DeFi data fetch
    mockDefiService.fetchUserDefiData.mockResolvedValue({
      deposits: [
        {
          protocol: 'Aave V3',
          token: 'USDC',
          amount: 5000,
          balance: 5174.02,
          apy: 4.2,
          earnings: 174.02,
          lastUpdated: 'Live'
        },
        {
          protocol: 'Compound V3',
          token: 'USDT',
          amount: 3000,
          balance: 3139.94,
          apy: 3.8,
          earnings: 139.94,
          lastUpdated: 'Live'
        }
      ],
      protocolHealth: [
        {
          name: 'Aave V3',
          healthScore: 87,
          tvl: '12.4B',
          utilization: 68,
          riskLevel: 'Low'
        }
      ]
    });

    mockDefiService.generateYieldAlerts.mockReturnValue([
      {
        id: 1,
        type: 'success',
        title: 'Yield Optimization Opportunity',
        message: 'USDC APY on Aave V3 is 4.20% (+0.4% vs Compound V3). Consider reallocating funds for better returns.',
        timestamp: 'Just now'
      }
    ]);

    // Mock cache
    mockDefiService.cache = { clear: vi.fn() };
  });

  it('should display DeFi data for connected wallet', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display total balance
    await waitFor(() => {
      expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    });

    // Should display protocol deposits
    expect(screen.getByText('Aave V3')).toBeInTheDocument();
    expect(screen.getByText('Compound V3')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();

    // Should display APY rates
    expect(screen.getByText('4.2%')).toBeInTheDocument();
    expect(screen.getByText('3.8%')).toBeInTheDocument();

    // Should display earnings
    expect(screen.getByText(/174\.02/)).toBeInTheDocument();
    expect(screen.getByText(/139\.94/)).toBeInTheDocument();
  });

  it('should show yield optimization alerts for premium users', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display yield alert
    await waitFor(() => {
      expect(screen.getByText('Yield Optimization Opportunity')).toBeInTheDocument();
    });

    expect(screen.getByText(/USDC APY on Aave V3 is 4\.20%/)).toBeInTheDocument();
  });

  it('should refresh data when refresh button is clicked', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find and click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();

    // Clear previous calls
    vi.clearAllMocks();

    fireEvent.click(refreshButton);

    // Should clear cache and fetch new data
    expect(mockDefiService.cache.clear).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(mockDefiService.fetchUserDefiData).toHaveBeenCalled();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockDefiService.fetchUserDefiData.mockRejectedValue(new Error('Network error'));

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/connection error/i)).toBeInTheDocument();
    });

    // Should show error banner
    expect(screen.getByText('Data Connection Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to fetch live DeFi data/)).toBeInTheDocument();
  });

  it('should display protocol health information', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display protocol health section
    await waitFor(() => {
      expect(screen.getByText('Protocol Health Overview')).toBeInTheDocument();
    });

    // Should show health metrics
    expect(screen.getByText('87')).toBeInTheDocument(); // Health score
    expect(screen.getByText('12.4B')).toBeInTheDocument(); // TVL
    expect(screen.getByText('68')).toBeInTheDocument(); // Utilization
    expect(screen.getByText('Low')).toBeInTheDocument(); // Risk level
  });

  it('should show live data indicator when connected', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Live Data')).toBeInTheDocument();
    });

    // Should show WiFi connected icon (via screen reader text or data attribute)
    const liveIndicator = screen.getByText('Live Data');
    expect(liveIndicator).toBeInTheDocument();
  });

  it('should calculate and display summary statistics correctly', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display calculated totals
    await waitFor(() => {
      // Total balance: 5174.02 + 3139.94 = 8313.96
      expect(screen.getByText(/8,313\.96/)).toBeInTheDocument();
      
      // Total earnings: 174.02 + 139.94 = 313.96
      expect(screen.getByText(/313\.96/)).toBeInTheDocument();
      
      // Average APY: (4.2 + 3.8) / 2 = 4.00%
      expect(screen.getByText('4.00%')).toBeInTheDocument();
      
      // Active protocols: 2
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should handle empty deposits gracefully', async () => {
    // Mock empty deposits
    mockDefiService.fetchUserDefiData.mockResolvedValue({
      deposits: [],
      protocolHealth: []
    });
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should show empty state message
    await waitFor(() => {
      expect(screen.getByText('No Active Deposits Found')).toBeInTheDocument();
    });

    expect(screen.getByText(/Connect your wallet and make deposits/)).toBeInTheDocument();
    
    // Should show protocol opportunities
    expect(screen.getByText('Aave V3')).toBeInTheDocument();
    expect(screen.getByText('Compound V3')).toBeInTheDocument();
    expect(screen.getByText('MakerDAO DSR')).toBeInTheDocument();
  });
});