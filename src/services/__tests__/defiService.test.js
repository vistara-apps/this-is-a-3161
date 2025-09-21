import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import defiService from '../defiService';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('DeFiService', () => {
  beforeEach(() => {
    // Clear cache before each test
    defiService.cache.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Cache Management', () => {
    it('should cache data correctly', () => {
      const testData = { test: 'data' };
      defiService.setCachedData('test-key', testData);
      
      const cached = defiService.getCachedData('test-key');
      expect(cached).toEqual(testData);
    });

    it('should return null for expired cache', () => {
      const testData = { test: 'data' };
      defiService.setCachedData('test-key', testData);
      
      // Mock expired cache
      const cacheEntry = defiService.cache.get('test-key');
      cacheEntry.timestamp = Date.now() - (6 * 60 * 1000); // 6 minutes ago
      defiService.cache.set('test-key', cacheEntry);
      
      const cached = defiService.getCachedData('test-key');
      expect(cached).toBeNull();
    });
  });

  describe('DeFiLlama Integration', () => {
    it('should fetch and filter DeFiLlama data', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              pool: '1',
              symbol: 'USDC',
              project: 'aave-v3',
              apy: 4.5,
              tvl: 1000000
            },
            {
              pool: '2',
              symbol: 'USDT',
              project: 'compound-v3',
              apy: 3.2,
              tvl: 500000
            },
            {
              pool: '3',
              symbol: 'ETH',
              project: 'uniswap-v3',
              apy: 8.0,
              tvl: 2000000
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await defiService.fetchDeFiLlamaData();
      
      expect(mockedAxios.get).toHaveBeenCalledWith('https://yields.llama.fi/pools');
      expect(result).toHaveLength(2); // Only stablecoin pools from major protocols
      expect(result[0].project).toBe('aave-v3');
      expect(result[1].project).toBe('compound-v3');
    });

    it('should handle DeFiLlama API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await defiService.fetchDeFiLlamaData();
      
      expect(result).toEqual([]);
    });
  });

  describe('Aave Integration', () => {
    it('should fetch Aave data using GraphQL', async () => {
      const mockResponse = {
        data: {
          data: {
            userReserves: [
              {
                id: '1',
                currentATokenBalance: '1000000000000000000000', // 1000 * 10^18
                reserve: {
                  symbol: 'USDC',
                  name: 'USD Coin',
                  decimals: 6,
                  liquidityRate: '42000000000000000000000000' // 4.2% in ray format
                }
              }
            ],
            reserves: [
              {
                symbol: 'USDC',
                name: 'USD Coin',
                liquidityRate: '42000000000000000000000000',
                totalLiquidity: '1000000000000000000000000',
                utilizationRate: '680000000000000000000000000'
              }
            ]
          }
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await defiService.fetchAaveData('0x123');
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('aave'),
        expect.objectContaining({
          query: expect.stringContaining('userReserves'),
          variables: { user: '0x123' }
        })
      );
      expect(result.userReserves).toHaveLength(1);
      expect(result.reserves).toHaveLength(1);
    });

    it('should process Aave data correctly', () => {
      const mockAaveData = {
        userReserves: [
          {
            currentATokenBalance: '5000000000', // 5000 USDC (6 decimals)
            reserve: {
              symbol: 'USDC',
              decimals: 6,
              liquidityRate: '42000000000000000000000000' // 4.2% APY
            }
          }
        ],
        reserves: [
          {
            symbol: 'USDC',
            totalLiquidity: '1000000000000000000000000',
            utilizationRate: '680000000000000000000000000'
          }
        ]
      };

      const result = defiService.processAaveData(mockAaveData, '0x123');
      
      expect(result.deposits).toHaveLength(1);
      expect(result.deposits[0].protocol).toBe('Aave V3');
      expect(result.deposits[0].token).toBe('USDC');
      expect(result.deposits[0].balance).toBe(5000);
      expect(result.deposits[0].apy).toBeCloseTo(4.2, 1);
      
      expect(result.protocolHealth).toHaveLength(1);
      expect(result.protocolHealth[0].name).toBe('Aave V3');
    });
  });

  describe('User Data Aggregation', () => {
    it('should fetch and aggregate data from all protocols', async () => {
      // Mock all API calls
      const mockDeFiLlama = [
        { project: 'aave-v3', symbol: 'USDC', apy: 4.5 }
      ];
      const mockAave = { userReserves: [], reserves: [] };
      const mockCompound = { accountCTokens: [], markets: [] };
      const mockMaker = { user: null, potDsrUpdates: [] };

      mockedAxios.get.mockResolvedValueOnce({ data: { data: mockDeFiLlama } });
      mockedAxios.post
        .mockResolvedValueOnce({ data: { data: mockAave } })
        .mockResolvedValueOnce({ data: { data: mockCompound } })
        .mockResolvedValueOnce({ data: { data: mockMaker } });

      const result = await defiService.fetchUserDefiData('0x123');
      
      expect(result).toHaveProperty('deposits');
      expect(result).toHaveProperty('protocolHealth');
      expect(Array.isArray(result.deposits)).toBe(true);
      expect(Array.isArray(result.protocolHealth)).toBe(true);
    });

    it('should handle missing user address', async () => {
      await expect(defiService.fetchUserDefiData()).rejects.toThrow('User address is required');
    });

    it('should provide fallback data on API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await defiService.fetchUserDefiData('0x123');
      
      // Should still return structured data
      expect(result).toHaveProperty('deposits');
      expect(result).toHaveProperty('protocolHealth');
      expect(result.deposits.length).toBeGreaterThan(0); // Sample data
      expect(result.protocolHealth.length).toBeGreaterThan(0);
    });
  });

  describe('Yield Alerts Generation', () => {
    it('should generate alerts for yield opportunities', () => {
      const mockDeposits = [
        { protocol: 'Aave V3', token: 'USDC', apy: 5.0, balance: 1000 },
        { protocol: 'Compound V3', token: 'USDT', apy: 3.0, balance: 1000 }
      ];

      const alerts = defiService.generateYieldAlerts(mockDeposits);
      
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('success');
      expect(alerts[0].title).toBe('Yield Optimization Opportunity');
      expect(alerts[0].message).toContain('5.00%');
      expect(alerts[0].message).toContain('+2.0%');
    });

    it('should not generate alerts when APY differences are small', () => {
      const mockDeposits = [
        { protocol: 'Aave V3', token: 'USDC', apy: 4.2, balance: 1000 },
        { protocol: 'Compound V3', token: 'USDT', apy: 4.0, balance: 1000 }
      ];

      const alerts = defiService.generateYieldAlerts(mockDeposits);
      
      expect(alerts).toHaveLength(0);
    });

    it('should handle empty deposits array', () => {
      const alerts = defiService.generateYieldAlerts([]);
      expect(alerts).toEqual([]);
      
      const alertsUndefined = defiService.generateYieldAlerts();
      expect(alertsUndefined).toEqual([]);
    });
  });

  describe('Sample Data Generation', () => {
    it('should generate sample deposits with real APY data', () => {
      const mockDeFiLlama = [
        { project: 'aave-v3', symbol: 'USDC', apy: 4.8 },
        { project: 'compound-v3', symbol: 'USDT', apy: 3.5 },
        { project: 'makerdao', symbol: 'DAI', apy: 5.3 }
      ];

      const result = defiService.generateSampleDepositsWithRealAPY(mockDeFiLlama);
      
      expect(result).toHaveLength(3);
      expect(result[0].apy).toBe(4.8); // Should use real APY from DeFiLlama
      expect(result[1].apy).toBe(3.5);
      expect(result[2].apy).toBe(5.3);
    });

    it('should use default APYs when DeFiLlama data is unavailable', () => {
      const result = defiService.generateSampleDepositsWithRealAPY([]);
      
      expect(result).toHaveLength(3);
      expect(result[0].apy).toBe(4.2); // Default APY
      expect(result[1].apy).toBe(3.8);
      expect(result[2].apy).toBe(5.1);
    });
  });
});