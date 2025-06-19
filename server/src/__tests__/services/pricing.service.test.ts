import { PricingService } from '../../services/pricing.service';
import { Model } from '../../entities/Model';

describe('PricingService', () => {
  let pricingService: PricingService;
  let mockModel: Model;

  beforeEach(() => {
    pricingService = new PricingService();
    mockModel = {
      model_id: 1,
      model_name: 'Test Model',
      price_peak: 100,
      price_mid: 80,
      price_off: 60,
      cars: []
    };
  });

  describe('calculatePricing', () => {
    it('should calculate peak season pricing correctly', () => {
      // Test peak season (June 1 - September 15)
      const result = pricingService.calculatePricing(
        '2024-07-01',
        '2024-07-03',
        mockModel
      );

      expect(result.totalPrice).toBe(300); // 3 days * 100
      expect(result.averagePrice).toBe(100);
      expect(result.days).toBe(3);
    });

    it('should calculate mid season pricing correctly', () => {
      // Test mid season (March 1 - May 31)
      const result = pricingService.calculatePricing(
        '2024-04-01',
        '2024-04-02',
        mockModel
      );

      expect(result.totalPrice).toBe(160); // 2 days * 80
      expect(result.averagePrice).toBe(80);
      expect(result.days).toBe(2);
    });

    it('should calculate off season pricing correctly', () => {
      // Test off season (November 1 - February 28)
      const result = pricingService.calculatePricing(
        '2024-01-01',
        '2024-01-01',
        mockModel
      );

      expect(result.totalPrice).toBe(60); // 1 day * 60
      expect(result.averagePrice).toBe(60);
      expect(result.days).toBe(1);
    });

    it('should handle mixed seasons correctly', () => {
      // Test spanning from off season to mid season
      const result = pricingService.calculatePricing(
        '2024-02-29',
        '2024-03-02',
        mockModel
      );

      // Feb 29: off season (60)
      // Mar 1: mid season (80)
      // Mar 2: mid season (80)
      expect(result.totalPrice).toBe(220); // 60 + 80 + 80
      expect(result.averagePrice).toBe(73.33);
      expect(result.days).toBe(3);
    });

    it('should throw error for invalid date range', () => {
      expect(() => {
        pricingService.calculatePricing(
          '2024-07-02',
          '2024-07-01',
          mockModel
        );
      }).toThrow('End date cannot be before start date');
    });

    it('should throw error for invalid date format', () => {
      expect(() => {
        pricingService.calculatePricing(
          'invalid-date',
          '2024-07-01',
          mockModel
        );
      }).toThrow('Invalid date format');
    });

    it('should handle same start and end date', () => {
      const result = pricingService.calculatePricing(
        '2024-07-01',
        '2024-07-01',
        mockModel
      );

      expect(result.totalPrice).toBe(100);
      expect(result.averagePrice).toBe(100);
      expect(result.days).toBe(1);
    });

    it('should handle year boundaries correctly', () => {
      // Test December to January transition
      const result = pricingService.calculatePricing(
        '2023-12-31',
        '2024-01-01',
        mockModel
      );

      // Both dates are in off season
      expect(result.totalPrice).toBe(120); // 2 days * 60
      expect(result.averagePrice).toBe(60);
      expect(result.days).toBe(2);
    });
  });

  describe('getSeasonName', () => {
    it('should return correct season names', () => {
      expect(pricingService.getSeasonName('2024-07-01')).toBe('Peak');
      expect(pricingService.getSeasonName('2024-04-01')).toBe('Mid');
      expect(pricingService.getSeasonName('2024-01-01')).toBe('Off');
    });
  });

  describe('edge cases', () => {
    it('should handle leap year correctly', () => {
      const result = pricingService.calculatePricing(
        '2024-02-28',
        '2024-03-01',
        mockModel
      );

      // Feb 28: off season, Feb 29: off season, Mar 1: mid season
      expect(result.days).toBe(3);
      expect(result.totalPrice).toBe(200); // 60 + 60 + 80
    });

    it('should handle season boundaries precisely', () => {
      // Test exactly on season boundary
      const result = pricingService.calculatePricing(
        '2024-06-01',
        '2024-06-01',
        mockModel
      );

      expect(result.totalPrice).toBe(100); // Should be peak season
      expect(result.averagePrice).toBe(100);
    });
  });
}); 