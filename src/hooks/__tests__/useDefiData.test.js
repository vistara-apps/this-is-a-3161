import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { useDefiData } from '../useDefiData';
import defiService from '../../services/defiService';

// Mock dependencies
vi.mock('wagmi');
vi.mock('../../services/defiService');

const mockUseAccount = vi.mocked(useAccount);
const mockDefiService = vi.mocked(defiService);

describe('useDefiData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const mockDefiData = {
    deposits: [
      {
        protocol: 'Aave V3',
        token: 'USDC',
        amount: 1000,
        balance: 1042,
        apy: 4.2,
        earnings: 42,
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
  };

  const mockAlerts = [
    {
      id: 1,
      type: 'success',
      title: 'Yield Opportunity',
      message: 'Better APY available',
      timestamp: 'Just now'
    }
  ];

  it('should initialize with empty data when no address is connected', () => {
    mockUseAccount.mockReturnValue({ address: null });

    const { result } = renderHook(() => useDefiData());

    expect(result.current.deposits).toEqual([]);
    expect(result.current.protocolHealth).toEqual([]);
    expect(result.current.alerts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data when address is available', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockDefiService.fetchUserDefiData.mockResolvedValue(mockDefiData);
    mockDefiService.generateYieldAlerts.mockReturnValue(mockAlerts);

    const { result } = renderHook(() => useDefiData());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledWith(mockAddress);
    expect(mockDefiService.generateYieldAlerts).toHaveBeenCalledWith(mockDefiData.deposits);
    
    expect(result.current.deposits).toEqual(mockDefiData.deposits);
    expect(result.current.protocolHealth).toEqual(mockDefiData.protocolHealth);
    expect(result.current.alerts).toEqual(mockAlerts);
    expect(result.current.error).toBeNull();
  });

  it('should calculate computed values correctly', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    
    const multipleDeposits = {
      deposits: [
        { protocol: 'Aave V3', balance: 1000, earnings: 40, apy: 4.0 },
        { protocol: 'Compound V3', balance: 2000, earnings: 80, apy: 4.0 },
        { protocol: 'MakerDAO', balance: 1500, earnings: 90, apy: 6.0 }
      ],
      protocolHealth: []
    };
    
    mockDefiService.fetchUserDefiData.mockResolvedValue(multipleDeposits);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    const { result } = renderHook(() => useDefiData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.totalBalance).toBe(4500);
    expect(result.current.totalEarnings).toBe(210);
    expect(result.current.avgAPY).toBeCloseTo(4.67, 2); // (4 + 4 + 6) / 3
    expect(result.current.activeProtocols).toBe(3);
  });

  it('should handle API errors gracefully', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockDefiService.fetchUserDefiData.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useDefiData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.deposits).toEqual([]);
    expect(result.current.protocolHealth).toEqual([]);
    expect(result.current.alerts).toEqual([]);
  });

  it('should refresh data manually', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockDefiService.fetchUserDefiData.mockResolvedValue(mockDefiData);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);
    
    // Mock cache clear
    mockDefiService.cache = { clear: vi.fn() };

    const { result } = renderHook(() => useDefiData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear the mock calls from initial load
    vi.clearAllMocks();

    // Trigger refresh
    act(() => {
      result.current.refresh();
    });

    expect(result.current.isLoading).toBe(true);
    expect(mockDefiService.cache.clear).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledWith(mockAddress);
  });

  it('should auto-refresh data every 5 minutes', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockDefiService.fetchUserDefiData.mockResolvedValue(mockDefiData);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    renderHook(() => useDefiData());

    // Wait for initial load
    await waitFor(() => {
      expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledTimes(1);
    });

    // Clear mock calls
    vi.clearAllMocks();

    // Fast-forward 5 minutes
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    // Should trigger auto-refresh
    expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledTimes(1);
  });

  it('should not auto-refresh when no address is connected', () => {
    mockUseAccount.mockReturnValue({ address: null });

    renderHook(() => useDefiData());

    // Fast-forward 5 minutes
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    // Should not call the service
    expect(mockDefiService.fetchUserDefiData).not.toHaveBeenCalled();
  });

  it('should update lastUpdated timestamp on successful fetch', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockDefiService.fetchUserDefiData.mockResolvedValue(mockDefiData);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    const { result } = renderHook(() => useDefiData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.lastUpdated).toBeInstanceOf(Date);
    expect(result.current.lastUpdated.getTime()).toBeCloseTo(Date.now(), -1000);
  });

  it('should reset data when address changes', async () => {
    const { rerender } = renderHook(
      ({ address }) => {
        mockUseAccount.mockReturnValue({ address });
        return useDefiData();
      },
      { initialProps: { address: '0x123' } }
    );

    mockDefiService.fetchUserDefiData.mockResolvedValue(mockDefiData);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    // Wait for initial load
    await waitFor(() => {
      expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledWith('0x123');
    });

    // Change address
    rerender({ address: '0x456' });

    await waitFor(() => {
      expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledWith('0x456');
    });

    // Should have been called twice with different addresses
    expect(mockDefiService.fetchUserDefiData).toHaveBeenCalledTimes(2);
  });

  it('should handle zero deposits correctly', async () => {
    const mockAddress = '0x123456789';
    mockUseAccount.mockReturnValue({ address: mockAddress });
    
    const emptyData = { deposits: [], protocolHealth: [] };
    mockDefiService.fetchUserDefiData.mockResolvedValue(emptyData);
    mockDefiService.generateYieldAlerts.mockReturnValue([]);

    const { result } = renderHook(() => useDefiData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.totalBalance).toBe(0);
    expect(result.current.totalEarnings).toBe(0);
    expect(result.current.avgAPY).toBe(0);
    expect(result.current.activeProtocols).toBe(0);
  });
});