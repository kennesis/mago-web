import { calcDiffOfSunAndMoon, countSolarTerms, getTermOnDay, getTermsOnYear, SolarTerm } from './solar-terms';
import { toPrecision } from './tool';

export const TIME_ZONE_OFFSET: number = new Date().getTimezoneOffset();
export const CHINESE_OFFSET: number = -480;
export const KOREAN_OFFSET: number = -540;

const ZODIACS: Array<string> = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const CELESTIAL_STEMS: Array<string> = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const CELESTIAL_STEMS_KR: Array<string> = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const TERRESTRIAL_BRANCHES: Array<string> = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TERRESTRIAL_BRANCHES_KR: Array<string> = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const CAPITALIZE_NUMBER: Array<string> = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const CAPITALIZE_TEN_NUMBER: Array<string> = ['初', '十', '廿', '卅'];


const DAY_TIME: number = 24 * 60 * 60 * 1000;
const YEAR_ORIGIN: Date = new Date(1984, 1, 2);
const MONTH_ORIGIN: Date = new Date(2013, 11, 7);
const DAY_ORIGIN: Date = new Date(1949, 9, 1, 0);

/*
const PRC_TIMEZON_CHANGED_HISTORY = new Map<number, DaylightSavingTimeChange>([
  [1991, {
    divider: new Date(1991, 8, 15, 2),
    offset: 0
  }],
  [1987, {
    daylightSavingTime: {
      start: new Date(1919, 3, 12, 2),
      end: new Date(1991, 9, 13, 2)
    },
    divider: null,
    offset: 1
  }],
  [1919, {
    daylightSavingTime: {
      start: new Date(1919, 3, 13),
      end: new Date(1991, 9, 1)
    },
    divider: null,
    offset: 1
  }]
]);


interface DaylightSavingTimeChange {
  daylightSavingTime?: {
    start: Date;
    end: Date;
  };
  divider: Date | null;
  offset: number;
}
 */


export function countDaysOnYear(year: number): number {
  return Math.ceil((Date.UTC(year, 11, 31, 23, 59, 59, 999) - Date.UTC(year, 0, 1)) / DAY_TIME);
}

export function isNewMoon(date: Date): boolean {
  const yesterdday: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59, 59);
  const tomorrow: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const startTime: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const endTime: Date = new Date(tomorrow.getTime() - 1000);
  const startDiff: number = toPrecision(calcDiffOfSunAndMoon(startTime), 4);
  const endDiff: number = toPrecision(calcDiffOfSunAndMoon(endTime), 4);

  // If the sun ecliptic longitude overlay with moon ecliptic longitude almost at zero hour,
  // need to detect yesterday and tomorrow whether are new moon.
  if ((startDiff < 0.5 && toPrecision(calcDiffOfSunAndMoon(yesterdday), 4) < startDiff) || (endDiff < 0.5 && toPrecision(calcDiffOfSunAndMoon(tomorrow), 4) < endDiff)) {
    return false;
  }

  const stime: number = yesterdday.getTime();
  let oldSum: number;
  let sum: number;
  let result: boolean = false;
  let i: number = 0;

  do {
    if (i > 24) {
      console.warn(`Potential infinite loop! Start time: ${startTime.toLocaleString()}, current time: ${endTime.toLocaleString()}. =>  ${endTime.getTime() >= stime}`);
      break;
    }
    oldSum = sum!;
    sum = calcDiffOfSunAndMoon(endTime);
    if (!isNaN(oldSum) && sum > oldSum) {
      break;
    }
    if (sum < 0.5) {
      result = true;
      break;
    }
    if (endTime.getHours() === 0 && endTime.getMinutes() !== 0) {
      endTime.setHours(endTime.getHours(), 0, 0);
    } else {
      endTime.setTime(endTime.getTime() - 3600000);
      endTime.setMinutes(59, 59);
    }
    /*
    endTime.setTime(endTime.getTime() - (sum / 2 / (360 / 30)) * DAY_TIME);
    if (endTime.getTime() <= stime) {
      break;
    }
    */
    i++;
  } while (endTime.getTime() > stime);

  return result;
}

export function countNewMoons(fromDate: Date, toDate: Date): Array<Date> {
  const newMoons: Array<Date> = [];
  let startDate: Date;
  let endDate: Date;

  if (fromDate.getTime() <= toDate.getTime()) {
    startDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    endDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  } else {
    startDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
    endDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  }

  do {
    if (isNewMoon(startDate)) {
      newMoons.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 27);
      continue;
    }
    startDate.setDate(startDate.getDate() + 1);
  } while (startDate.getTime() <= endDate.getTime());

  return newMoons;
}

export function getWinterSolstice(year: number): Date {
  const lastTerms: Array<SolarTerm> = getTermsOnYear(year);
  const winterSolstice: Date = lastTerms.find((item) => item.longitude === 270)!.date!;

  return winterSolstice;
}

export function getWinterSolsticeRange(date: Date): Array<Date> {
  const year: number = date.getFullYear();
  let newMoons: Array<Date>;
  let curr11thNewMoon: Date = getWinterSolstice(year);
  let winterSolstice: Date;

  if (!isNewMoon(curr11thNewMoon)) {
    const prevNewMoons = countNewMoons(new Date(
      curr11thNewMoon.getFullYear(),
      curr11thNewMoon.getMonth(),
      curr11thNewMoon.getDate() - 30
    ), curr11thNewMoon);

    if (prevNewMoons.length < 1) {
      throw new Error(`The first eleventh month is incorrect. ${prevNewMoons}`);
    }
    curr11thNewMoon = prevNewMoons.pop()!;
  }
  if (date.getTime() >= curr11thNewMoon.getTime()) {
    winterSolstice = getWinterSolstice(year + 1);
    newMoons = countNewMoons(curr11thNewMoon, winterSolstice);
  } else {
    winterSolstice = getWinterSolstice(year - 1);
    newMoons = countNewMoons(winterSolstice, curr11thNewMoon);
    if (!isNewMoon(winterSolstice)) {
      const prevNewMoons = countNewMoons(new Date(
        winterSolstice.getFullYear(),
        winterSolstice.getMonth(),
        winterSolstice.getDate() - 30
      ), winterSolstice);

      if (prevNewMoons.length < 1) {
        throw new Error(`The last eleventh month is incorrect. ${prevNewMoons}`);
      }
      newMoons.unshift(prevNewMoons.pop()!);
    }
  }
  newMoons.pop(); // Remove the latest eleventh month.

  return newMoons;
}

export function isMissingMidTermMonth(date: Date): boolean {
  let nextDay: Date;
  let isMissing: boolean = true;
  let i: number = 0;

  if (isMissing) {
    nextDay = new Date(date);
    do {
      i++;
      if (i > 1 && isNewMoon(nextDay)) {
        break;
      }
      if (getTermOnDay(nextDay)?.isMidTerm()) {
        isMissing = false;
        break;
      }
      nextDay.setDate(nextDay.getDate() + 1);
    } while (i <= 30);
  }

  if (isMissing) {
    nextDay = new Date(date);
    do {
      i++;
      if (getTermOnDay(nextDay)?.isMidTerm()) {
        isMissing = false;
        break;
      }
      if (isNewMoon(nextDay)) {
        break;
      }
      nextDay.setDate(nextDay.getDate() - 1);
    } while (i <= 30);
  }

  return isMissing;
}

export function isLeapMonth(date: Date): boolean {
  const currentTime: number = date.getTime();
  const newMoons: Array<Date> = getWinterSolsticeRange(date);
  const countNewMoon: number = newMoons.length;
  let isLeap: boolean = false;

  if (countNewMoon === 13) {
    let leapIndex: number = newMoons.findIndex((item) => isMissingMidTermMonth(item));
    if (leapIndex < 0) {
      leapIndex = countNewMoon - 1;
    }
    const leapMonthStart: Date = newMoons[leapIndex];
    let leapMonthEnd: Date = newMoons[leapIndex + 1];

    if (!leapMonthEnd) {
      const nextNewMoons = countNewMoons(leapMonthStart, new Date(
        leapMonthStart.getFullYear(),
        leapMonthStart.getMonth(),
        leapMonthStart.getDate() + 31
      ));

      leapMonthEnd = nextNewMoons[1];
    }

    isLeap = currentTime >= leapMonthStart.getTime() && currentTime < leapMonthEnd.getTime();
  }

  return isLeap;
}



abstract class LunarDateProperty extends Number {
  public readonly nativeDate: Date;
  protected offset: number;

  constructor(value: number, nativeDate: Date) {
    super(Math.floor(value));
    this.nativeDate = nativeDate;
    this.offset = this.calcDiff(value);
  }

  sexagesimal(): string {
    const indexStem = this.calcCelestialStem();
    const indexBranch = this.calcTerrestrialBranch();

    return `${CELESTIAL_STEMS_KR[indexStem]}${TERRESTRIAL_BRANCHES_KR[indexBranch]}`;
  }

  protected abstract calcDiff(value?: number): number;

  protected calcCelestialStem(): number {
    return (this.offset + 10) % 10;
  }

  protected calcTerrestrialBranch(): number {
    return (this.offset + 12) % 12;
  }
}

export interface OLunarYear {
  readonly sexagesimal: () => string;
  readonly zodiac: () => string;
  readonly toString: () => string;
  readonly valueOf: () => number;
}

class LunarYear extends LunarDateProperty implements OLunarYear {
  toString = (): string => {
    return `${this.sexagesimal()}年 ${this.zodiac()}年`;
  };

  zodiac(): string {
    const indexBranch = this.calcTerrestrialBranch();

    return `${ZODIACS[indexBranch]}`;
  }

  protected calcDiff(): number {
    const year: number = this.nativeDate.getFullYear();
    const winterSolstice: Date = getWinterSolstice(year - 1);
    const newMoons: Array<Date> = countNewMoons(winterSolstice, this.nativeDate).filter((item) => !isLeapMonth(item));
    const firstNewMoon: Date = newMoons[1 + (isNewMoon(winterSolstice) ? 1 : 0)];
    let offset: number = year - YEAR_ORIGIN.getFullYear();

    if (!firstNewMoon) {
      offset -= 1;
    }

    return offset;
  }
}

export interface OLunarMonth {
  readonly capital: () => string;
  readonly isLeap: () => boolean;
  readonly sexagesimal: () => string;
  readonly toString: () => string;
  readonly valueOf: () => number;
}

class LunarMonth extends LunarDateProperty implements OLunarMonth {
  toString = (): string => {
    return `${this.sexagesimal()}月 ${this.capital()}月`;
  };

  isLeap(): boolean {
    return isLeapMonth(this.nativeDate);
  }

  capital(): string {
    const value = this.valueOf();

    return value > 10 ? `${CAPITALIZE_TEN_NUMBER[Math.floor(value / 10)]}${CAPITALIZE_NUMBER[value % 10 - 1]}` : `${CAPITALIZE_NUMBER[value - 1]}`;
  }

  protected calcDiff(value: number): number {
    const terms: Array<SolarTerm> = countSolarTerms(MONTH_ORIGIN, this.nativeDate);
    const nonMidTerms: Array<SolarTerm> = terms.filter((item) => {
      return !item.isMidTerm();
    });
    const offset: number = nonMidTerms.length - 1;

    return offset;
  }
}

export interface OLunarDay {
  readonly capital: () => string;
  readonly sexagesimal: () => string;
  readonly toString: () => string;
  readonly valueOf: () => number;
}

class LunarDay extends LunarDateProperty implements OLunarDay {
  toString = (): string => {
    return `${this.sexagesimal()}日 ${this.capital()}`;
  };

  capital(): string {
    const value: number = this.valueOf();
    const unit: number = value % 10;

    return `${CAPITALIZE_TEN_NUMBER[Math.floor(value / 10)]}${unit === 0 ? CAPITALIZE_NUMBER[9] : CAPITALIZE_NUMBER[unit - 1]}`;
  }

  protected calcDiff(value: number): number {
    return Math.round((this.nativeDate.getTime() - DAY_ORIGIN.getTime()) / DAY_TIME);
  }
}

/**
 * @description 8h = 28800000ms, minus 8 hours to get china time zone date.
 */
export class ChineseDate extends Date {

  /**
   * 
   * @returns A new instance of LunarYear.
   */
  getLunarYear(): OLunarYear {
    return new LunarYear(this.getFullYear(), this);
  }

  /**
   * @description A lunar month is 11 if winter solstice is in this month.
   * @returns A new instance of LunarMonth.
   */
  getLunarMonth(): OLunarMonth {
    const currentTime: number = this.getTime();
    const newMoons: Array<Date> = getWinterSolsticeRange(this);
    const countNewMoon: number = newMoons.length;
    let month: number;

    month = newMoons.findIndex((item) => item.getTime() > currentTime);
    if (month < 0) {
      month = countNewMoon - 1;
    } else {
      month--;
    }
    if (countNewMoon === 13) {
      const leap = newMoons.find((item) => isMissingMidTermMonth(item)) || newMoons[countNewMoon - 1];

      if (currentTime >= leap.getTime()) {
        month--;
      }
    }
    month = month > 1 ? ((11 + month) % 12) : 11 + month;

    return new LunarMonth(month, this);
  }

  /**
   * 
   * @returns A new instance of LunarDay.
   */
  getLunarDay(): OLunarDay {
    const testDate: Date = new Date(this);
    let i: number = 1;

    while (!isNewMoon(testDate)) {
      i++;
      if (i > 30) {
        throw new Error(`Potential infinite loop! Invalid lunar day ${i}.`);
      }
      testDate.setDate(testDate.getDate() - 1);
    };

    return new LunarDay(i, this);
  }

  toKoreanString(): string {
    return super.toLocaleString('ko-KR', { timeZone: 'UTC' });
  }

  toLunarString(): string {
    return `农历${this.getLunarYear().sexagesimal()}年${this.getLunarMonth().capital()}月${this.getLunarDay().sexagesimal()}日`;
  }
}
