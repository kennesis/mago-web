import { getPlanet } from 'ephemeris';

import { coerceInteger, toPrecision } from './tool';
import { KO_STANDARD_POSITION, SOLAR_TERMS_KO } from './intl';
import { ChineseDate } from './lunar-calendar';

/**
 * @description GB/T 33661-2017 农历的编算和颁行
 * @link http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296
 */
export class SolarTerm {
  public date?: ChineseDate;
  public readonly order: number;
  public readonly longitude: number;

  constructor(order: number, public label: string) {
    if (order < 1 || order > 24 || order % 1 !== 0) {
      throw new Error(`Illegal parameter "order": ${order}, this must be an integer from 1 to 24.`);
    }
    this.order = order;
    this.longitude = (order - 1) * 15;
  }

  toString = (): string => {
    return `${this.label}` + (this.date ? ` ${this.date?.toChineseString()}` : ``);
  };

  isMidTerm(): boolean {
    return this.longitude % 30 === 0;
  }

  static create(index: number, lang: Array<string> | ReadonlyArray<string> = SOLAR_TERMS_KO): SolarTerm {
    return new SolarTerm(coerceInteger(index), lang[index - 1]);
  }
}

export function create24SolarTerms(lang: Array<string> | ReadonlyArray<string> = SOLAR_TERMS_KO): Map<number, SolarTerm> {
  const terms: Map<number, SolarTerm> = new Map<number, SolarTerm>();

  for (let i = 1; i <= 24; i++) {
    terms.set(i, SolarTerm.create(i, lang));
  }
  return terms;
}

export function calcMoonEclipticLongitude(targetDate: Date, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): number {
  return getPlanet<'moon'>('moon', targetDate, coordinate[0], coordinate[1], 0).observed.moon.apparentLongitudeDd;
};

export function calcSunEclipticLongitude(targetDate: Date, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): number {
  return getPlanet<'sun'>('sun', targetDate, coordinate[0], coordinate[1], 0).observed.sun.apparentLongitudeDd;
};

export function calcDiffOfSunAndMoon(time: Date, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): number {
  const sunResult: number = calcSunEclipticLongitude(time, coordinate);
  const moonResult: number = calcMoonEclipticLongitude(time, coordinate);

  return Math.min(
    Math.abs(sunResult - moonResult),
    Math.abs(sunResult - (moonResult - 360)),
    Math.abs((sunResult - 360) - moonResult),
    Math.abs((sunResult - 360) - (moonResult - 360))
  );
}

export function getTermOnDay(date: Date, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): SolarTerm | null {
  const dateS: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dateE: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  let eclipticLngS: number = toPrecision(calcSunEclipticLongitude(dateS, coordinate), 3);
  const eclipticLngE: number = toPrecision(calcSunEclipticLongitude(dateE, coordinate), 3);
  let result: SolarTerm | null = null;
  let x: number = Math.floor(eclipticLngE); // An integer;

  if (eclipticLngS > eclipticLngE) {
    eclipticLngS = eclipticLngS - 360;
  }
  do {
    if (x % 15 === 0 && eclipticLngS <= x && eclipticLngE >= x) {
      const index = x / 15 + 1;

      if (index >= 1 && index <= 24) {
        result = SolarTerm.create(index);
        result.date = new ChineseDate(date);
        break;
      }
    }
    x--;
  } while (x > eclipticLngS);

  return result;
}

export function countSolarTerms(fromDate: Date, toDate: Date, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): Array<SolarTerm> {
  const terms: Array<SolarTerm> = [];
  let startDate: Date;
  let endDate: Date;
  let target: SolarTerm | null;

  if (fromDate.getTime() <= toDate.getTime()) {
    startDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  } else {
    startDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    endDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  }

  do {
    target = getTermOnDay(startDate, coordinate);
    if (target) {
      terms.push(target);
      startDate.setDate(startDate.getDate() + 13);
      continue;
    }
    startDate.setDate(startDate.getDate() + 1);
  } while (startDate.getTime() <= endDate.getTime());

  return terms;
}

/**
 * This method will countSolarTerms with params that are the first date and the latest date of the year.
 */
export function getTermsOnYear(year: number, coordinate: GeoJSON.Position = KO_STANDARD_POSITION): Array<SolarTerm> {
  return countSolarTerms(new Date(year, 0, 1, 0, 0, 0, 0), new Date(year, 11, 31, 23, 59, 59, 999), coordinate);
}
