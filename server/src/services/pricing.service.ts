import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Season, PricingResult } from '../types';
import { Model } from '../entities/Model';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export class PricingService {
  private readonly PEAK_START = '06-01';
  private readonly PEAK_END = '09-15';
  private readonly MID_SEASON_1_START = '09-15';
  private readonly MID_SEASON_1_END = '10-31';
  private readonly MID_SEASON_2_START = '03-01';
  private readonly MID_SEASON_2_END = '05-31';

  public calculatePricing(
    startDate: string | Date,
    endDate: string | Date,
    model: Model
  ): PricingResult {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    this.validateDateRange(start, end);

    let totalPrice = 0;
    let totalDays = 0;
    let current = start.clone();

    while (current.isSameOrBefore(end, 'day')) {
      const season = this.determineSeason(current);
      const dailyPrice = this.getDailyPrice(season, model);
      
      totalPrice += dailyPrice;
      totalDays += 1;
      current = current.add(1, 'day');
    }

    const averagePrice = totalDays > 0 ? totalPrice / totalDays : 0;

    return {
      totalPrice: Number(totalPrice.toFixed(2)),
      averagePrice: Number(averagePrice.toFixed(2)),
      days: totalDays
    };
  }

  private determineSeason(date: Dayjs): Season {
    const year = date.year();
    
    // Peak season: June 1 - September 15
    if (this.isDateInRange(date, `${year}-${this.PEAK_START}`, `${year}-${this.PEAK_END}`)) {
      return Season.PEAK;
    }
    
    // Mid season: September 15 - October 31, March 1 - May 31
    if (
      this.isDateInRange(date, `${year}-${this.MID_SEASON_1_START}`, `${year}-${this.MID_SEASON_1_END}`) ||
      this.isDateInRange(date, `${year}-${this.MID_SEASON_2_START}`, `${year}-${this.MID_SEASON_2_END}`)
    ) {
      return Season.MID;
    }
    
    // Off season: November 1 - February 28/29
    return Season.OFF;
  }

  private getDailyPrice(season: Season, model: Model): number {
    switch (season) {
      case Season.PEAK:
        return Number(model.price_peak);
      case Season.MID:
        return Number(model.price_mid);
      case Season.OFF:
        return Number(model.price_off);
      default:
        return Number(model.price_mid); 
    }
  }

  private isDateInRange(date: Dayjs, startRange: string, endRange: string): boolean {
    return date.isSameOrAfter(dayjs(startRange)) && date.isSameOrBefore(dayjs(endRange));
  }

  private validateDateRange(start: Dayjs, end: Dayjs): void {
    if (!start.isValid() || !end.isValid()) {
      throw new Error('Invalid date format');
    }
    
    if (end.isBefore(start)) {
      throw new Error('End date cannot be before start date');
    }
  }

  public getSeasonName(date: string | Date): string {
    const season = this.determineSeason(dayjs(date));
    return season.charAt(0).toUpperCase() + season.slice(1);
  }
} 