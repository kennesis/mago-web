import { sameDate } from './tool';
import { ChineseDate, countNewMoons, countDaysOnYear, isNewMoon, OLunarMonth, getWinterSolsticeRange } from './lunar-calendar';
import { calcDiffOfSunAndMoon } from './solar-terms';

describe('Lunar calendar', (): void => {
  describe('Chinese date', (): void => {
    test('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);

      expect(testDate.toISOString()).toBe('2022-09-25T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2022/9/26 00:00:00');
    });

    test('2014-09-24', (): void => {
      const testDate = new ChineseDate(2014, 8, 24);

      expect(testDate.toISOString()).toBe('2014-09-23T16:00:00.000Z');
      expect(testDate.toChineseString()).toBe('2014/9/24 00:00:00');
    });
  });

  describe('Count days on year', (): void => {
    test('2000', (): void => {
      expect(countDaysOnYear(2000)).toBe(366);
    });

    test('2010', (): void => {
      expect(countDaysOnYear(2010)).toBe(365);
    });

    test('2020', (): void => {
      expect(countDaysOnYear(2020)).toBe(366);
    });
  });

  describe('New moon', (): void => {
    const logDiffOfSunAndMoon = (testDate: Date): void => {
      const startTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() - 1);
      const endTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 23, 59, 59);
      const diffs: Array<string> = [];
      let result: number;
      let i: number = 0;

      do {
        if (i > 100) {
          console.warn(`Infinite loop!`);
          break;
        }
        result = calcDiffOfSunAndMoon(endTime);
        diffs.push(`${endTime.toLocaleString()} | ${endTime.getTimezoneOffset()} => ${result}`);

        endTime.setTime(endTime.getTime() - (result / 2 / (360 / 30)) * (24 * 60 * 60 * 1000));
        if (endTime.getTime() <= startTime.getTime()) {
          break;
        }
        i++;
      } while (endTime.getTime() >= startTime.getTime());
      console.log(diffs);
    };

    test('Threshold dates', (): void => {
      const data: Array<[Date, boolean]> = [
        [new Date(1944, 0, 25), true],
        [new Date(1944, 0, 26), false],
        [new Date(1947, 2, 22), false],
        [new Date(1947, 2, 23), true],
        [new Date(1985, 1, 19), false],
        [new Date(1985, 1, 20), true]
      ];
      let row: [Date, boolean];
      let i: number = 0;

      do {
        row = data[i];
        try {
          expect(isNewMoon(row[0])).toBe(row[1]);
        }
        catch (error) {
          console.info(`
            --> New moon -> error -> ${row[0].toLocaleString()} <--------------------------------------
            |
            |  ${isNewMoon(row[0])} --- expect ${row[1]}
            |
            |
          `);
          logDiffOfSunAndMoon(row[0]!);
          throw error;
        }
        i++;
      } while (i < data.length);
    });

    test('Leap lunar months', () => {
      const testResult = new ChineseDate(1984, 10, 23).getLunarMonth();
      const testDateMonthB = new ChineseDate(1985, 1, 20).getLunarMonth();
      expect(new ChineseDate(1984, 9, 24).getLunarMonth().capital()).toBe('十');
      expect(testResult.isLeap()).toBe(true);
      expect(testResult.capital()).toBe('十');
      expect(new ChineseDate(1984, 11, 22).getLunarMonth().capital()).toBe('十一');
      expect(testDateMonthB.capital()).toBe('一');
      expect(testDateMonthB.isLeap()).toBe(false);

      // Total: 55
      const rows: Array<[[number, number, number], [number, number, number], string]> = [
        [[1900, 9, 24], [1900, 10, 22], '八'],
        [[1903, 6, 25], [1903, 7, 23], '五'],
        [[1906, 5, 23], [1906, 6, 21], '四'],
        [[1909, 3, 22], [1909, 4, 19], '二'],
        [[1911, 7, 26], [1911, 8, 23], '六'],
        [[1914, 6, 23], [1914, 7, 22], '五'],
        [[1917, 3, 23], [1917, 4, 20], '二'],
        [[1919, 8, 25], [1919, 9, 23], '七'],
        [[1922, 6, 25], [1922, 7, 23], '五'],
        [[1925, 5, 22], [1925, 6, 20], '四'],
        [[1928, 3, 22], [1928, 4, 19], '二'],
        [[1930, 7, 26], [1930, 8, 23], '六'],
        [[1933, 6, 23], [1933, 7, 22], '五'],
        [[1936, 4, 21], [1936, 5, 20], '三'],
        [[1938, 8, 25], [1938, 9, 23], '七'],
        [[1941, 7, 24], [1941, 8, 22], '六'],
        [[1944, 5, 22], [1944, 6, 20], '四'],
        [[1947, 3, 23], [1947, 4, 20], '二'],
        [[1949, 8, 24], [1949, 9, 21], '七'],
        [[1952, 6, 22], [1952, 7, 21], '五'],
        [[1955, 4, 22], [1955, 5, 21], '三'],
        [[1957, 9, 24], [1957, 10, 22], '八'],
        [[1960, 7, 24], [1960, 8, 21], '六'],
        [[1963, 5, 23], [1963, 6, 20], '四'],
        [[1966, 4, 21], [1966, 5, 19], '三'],
        [[1968, 8, 24], [1968, 9, 21], '七'],
        [[1971, 6, 23], [1971, 7, 21], '五'],
        [[1974, 5, 22], [1974, 6, 19], '四'],
        [[1976, 9, 24], [1976, 10, 22], '八'],
        [[1979, 7, 24], [1979, 8, 22], '六'],
        [[1982, 5, 23], [1982, 6, 20], '四'],
        [[1984, 11, 23], [1984, 12, 21], '十'],
        [[1987, 7, 26], [1987, 8, 23], '六'],
        [[1990, 6, 23], [1990, 7, 21], '五'],
        [[1993, 4, 22], [1993, 5, 20], '三'],
        [[1995, 9, 25], [1995, 10, 23], '八'],
        [[1998, 6, 24], [1998, 7, 22], '五'],
        [[2001, 5, 23], [2001, 6, 20], '四'],
        [[2004, 3, 21], [2004, 4, 18], '二'],
        [[2006, 8, 24], [2006, 9, 21], '七'],
        [[2009, 6, 23], [2009, 7, 21], '五'],
        [[2012, 5, 21], [2012, 6, 18], '四'],
        [[2014, 10, 24], [2014, 11, 21], '九'],
        [[2017, 7, 23], [2017, 8, 21], '六'],
        [[2020, 5, 23], [2020, 6, 20], '四'],
        [[2023, 3, 22], [2023, 4, 19], '二'],
        [[2025, 7, 25], [2025, 8, 22], '六'],
        [[2028, 6, 23], [2028, 7, 21], '五'],
        [[2031, 4, 22], [2031, 5, 20], '三'],
        [[2033, 12, 22], [2034, 1, 19], '十一'],
        [[2036, 7, 23], [2036, 8, 21], '六'],
        [[2039, 6, 22], [2039, 7, 20], '五'],
        [[2042, 3, 22], [2042, 4, 19], '二'],
        [[2044, 8, 23], [2044, 9, 20], '七'],
        [[2047, 6, 23], [2047, 7, 22], '五']
      ];
      const total = rows.length - 1;
      let testDate: ChineseDate;
      let month: OLunarMonth;
      let i: number = 0;
      let row: [[number, number, number], [number, number, number], string];

      do {
        row = rows[i];
        try {
          testDate = new ChineseDate(row[0][0], row[0][1] - 1, row[0][2]);
          month = testDate.getLunarMonth();
          expect(month.isLeap()).toBe(true);
          expect(month.capital()).toBe(row[2]);
          expect(testDate.getLunarDay().capital()).toBe('初一');
        }
        catch (error) {
          console.info(`
            --> Leap lunar month -> error -> ${row[0].join(', ')} <--------------------------------------
            |
            |  isLeap: ${month!.isLeap()}
            |  isNewMoon: ${isNewMoon(testDate!)}
            |
            |
          `);
          logDiffOfSunAndMoon(testDate!);
          console.log(getWinterSolsticeRange(testDate!).map(item => item.toLocaleString()));
          throw error;
        }
        i++;
      } while (i <= total);
    });

    test('Celestial stem & branch of days', (): void => {
      expect(new ChineseDate(1949, 9, 1).getLunarDay().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1949, 9, 2).getLunarDay().sexagesimal()).toBe('乙丑');
      expect(new ChineseDate(1949, 8, 30).getLunarDay().sexagesimal()).toBe('癸亥');
    });

    test('Celestial stem & branch of years', (): void => {
      expect(new ChineseDate(1982, 2, 9).getLunarYear().sexagesimal()).toBe('壬戌');

      expect(new ChineseDate(1983, 7, 1).getLunarYear().sexagesimal()).toBe('癸亥');

      expect(new ChineseDate(1984, 1, 1).getLunarYear().sexagesimal()).toBe('癸亥');
      expect(new ChineseDate(1984, 1, 2).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1984, 1, 3).getLunarYear().sexagesimal()).toBe('甲子');

      expect(new ChineseDate(1985, 1, 19).getLunarYear().sexagesimal()).toBe('甲子');
      expect(new ChineseDate(1985, 1, 20).getLunarYear().sexagesimal()).toBe('乙丑');
      expect(new ChineseDate(1985, 1, 21).getLunarYear().sexagesimal()).toBe('乙丑');
    });

    test('甲子年 1984-02-02 00:00:00 <-> 1985-02-19 23:59:59', (): void => {
      let testDate = new ChineseDate(1984, 1, 2);

      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
      testDate = new ChineseDate(1984, 1, 1, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('癸亥');
      testDate = new ChineseDate(1985, 1, 19, 23, 59, 59);
      expect(testDate.getLunarYear().sexagesimal()).toBe('甲子');
    });

    test('2022-09-26', (): void => {
      const testDate = new ChineseDate(2022, 8, 26);
      const newMoons = countNewMoons(testDate, testDate);

      expect(newMoons.length).toBe(1);
      expect(sameDate(newMoons[0], testDate)).toBe(true);
    });

    test('form 2013-11-01 to 2022-09-28', (): void => {
      const toDate = new ChineseDate(2022, 8, 28);
      const newMoons = countNewMoons(new ChineseDate(2013, 11, 1), toDate);

      expect(newMoons.length).toBeGreaterThan(1);
      expect(sameDate(newMoons[0], new ChineseDate(2013, 11, 3))).toBe(true);
    });

    test('Chinese day on 2013-12-07', (): void => {
      const testDate = new ChineseDate(2013, 11, 7);

      expect(testDate.getLunarMonth().sexagesimal()).toBe('甲子');
      expect(testDate.toLunarString()).toBe('农历癸巳年十一月丁未日');
    });

    test('Chinese day on 2022-09-28', (): void => {
      const lunarDate = new ChineseDate(2022, 8, 28);

      expect(lunarDate.getLunarMonth().sexagesimal()).toBe('己酉');
      expect(lunarDate.toLunarString()).toBe('农历壬寅年九月甲申日');
    });
  });
});
