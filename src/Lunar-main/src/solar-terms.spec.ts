import { sameDate } from './tool';
import { ChineseDate } from './lunar-calendar';
import { calcSunEclipticLongitude, create24SolarTerms, getTermOnDay, getTermsOnYear, SolarTerm } from './solar-terms';

describe('Lunar', (): void => {
  const solarTerms = create24SolarTerms();

  console.log(solarTerms);

  describe('Ecliptic', (): void => {
    test('Spring equinox', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 2, 20));

      expect(Math.ceil(result) % 360).toBe(solarTerms.get(1)!.longitude);
    });

    test('Fresh green', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 3, 5));

      expect(Math.ceil(result)).toBe(solarTerms.get(2)!.longitude);
    });

    test('Grain rain', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 3, 20));

      expect(Math.ceil(result)).toBe(solarTerms.get(3)!.longitude);
    });

    test('Beginning of summer', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 4, 5));

      expect(Math.ceil(result)).toBe(solarTerms.get(4)!.longitude);
    });

    test('Lesser fullness', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 4, 21));

      expect(Math.ceil(result)).toBe(solarTerms.get(5)!.longitude);
    });

    test('Grain in ear', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 5, 5));

      expect(Math.ceil(result)).toBe(solarTerms.get(6)!.longitude);
    });

    test('Summer solstice', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 5, 21));

      expect(Math.ceil(result)).toBe(solarTerms.get(7)!.longitude);
    });

    test('Lesser heat', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 6, 7));

      expect(Math.ceil(result)).toBe(solarTerms.get(8)!.longitude);
    });

    test('Greater heat', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 6, 23));

      expect(Math.ceil(result)).toBe(solarTerms.get(9)!.longitude);
    });

    test('Beginning of autumn', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 7, 7));

      expect(Math.ceil(result)).toBe(solarTerms.get(10)!.longitude);
    });

    test('End of heat', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 7, 23));

      expect(Math.ceil(result)).toBe(solarTerms.get(11)!.longitude);
    });

    test('White dew', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 8, 7));

      expect(Math.ceil(result)).toBe(solarTerms.get(12)!.longitude);
    });

    test('Autumnal equinox', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 8, 23));

      expect(Math.ceil(result)).toBe(solarTerms.get(13)!.longitude);
    });

    test('Cold dew', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 9, 8));

      expect(Math.ceil(result)).toBe(solarTerms.get(14)!.longitude);
    });

    test('First frost', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 9, 23));

      expect(Math.ceil(result)).toBe(solarTerms.get(15)!.longitude);
    });

    test('Beginning of winter', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 10, 7));

      expect(Math.ceil(result)).toBe(solarTerms.get(16)!.longitude);
    });

    test('Light snow', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 10, 22));

      expect(Math.ceil(result)).toBe(solarTerms.get(17)!.longitude);
    });

    test('Heavy snow', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 11, 7));

      expect(Math.ceil(result)).toBe(solarTerms.get(18)!.longitude);
    });

    test('Winter solstice', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 11, 22));

      expect(Math.ceil(result)).toBe(solarTerms.get(19)!.longitude);
    });

    test('Lesser cold', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 0, 5));

      expect(Math.ceil(result)).toBe(solarTerms.get(20)!.longitude);
    });

    test('Greater cold', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 0, 20));

      expect(Math.ceil(result)).toBe(solarTerms.get(21)!.longitude);
    });

    test('Beginning of spring', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 1, 4));

      expect(Math.ceil(result)).toBe(solarTerms.get(22)!.longitude);
    });

    test('Rain water', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 1, 18));

      expect(Math.ceil(result)).toBe(solarTerms.get(23)!.longitude);
    });

    test('Awakening from hibernation', (): void => {
      const result = calcSunEclipticLongitude(new ChineseDate(2005, 2, 5));

      expect(Math.ceil(result)).toBe(solarTerms.get(24)!.longitude);
    });

    test('Log ecliptic longitudes', (): void => {
      const testDate = new ChineseDate(1985, 2, 21);
      const term = getTermOnDay(testDate);

      console.log(`${testDate.toChineseString()} => ${calcSunEclipticLongitude(testDate) % 360}`);
      testDate.setHours(12, 0, 0, 0);
      console.log(`${testDate.toChineseString()} => ${calcSunEclipticLongitude(testDate) % 360}`);
      testDate.setHours(23, 59, 59, 0);
      console.log(`${testDate.toChineseString()} => ${calcSunEclipticLongitude(testDate) % 360}`);
      expect(term).not.toBeNull();
      console.log(term?.toString());
    });
  });

  describe('Solar terms', (): void => {
    test('Test the constructor', (): void => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const term = new SolarTerm(30, '');
      }).toThrowError();

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const term = new SolarTerm(-30, '');
      }).toThrowError();


      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const term = new SolarTerm(4.5, '');
      }).toThrowError();
    });

    test('The 24 terms', (): void => {
      const terms = create24SolarTerms();

      expect(terms.size).toBe(24);
    });

    test('The terms on 1984', (): void => {
      const terms = getTermsOnYear(1984);

      expect(terms.length).toBe(24);
    });

    test('The terms on 2005', (): void => {
      const terms = getTermsOnYear(2005);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new ChineseDate(2005, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new ChineseDate(2005, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new ChineseDate(2005, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new ChineseDate(2005, 1, 18))).toBe(true);
      expect(sameDate(terms[4].date!, new ChineseDate(2005, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new ChineseDate(2005, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new ChineseDate(2005, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new ChineseDate(2005, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new ChineseDate(2005, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new ChineseDate(2005, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new ChineseDate(2005, 5, 5))).toBe(true);
      expect(sameDate(terms[11].date!, new ChineseDate(2005, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new ChineseDate(2005, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new ChineseDate(2005, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new ChineseDate(2005, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new ChineseDate(2005, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new ChineseDate(2005, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new ChineseDate(2005, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new ChineseDate(2005, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new ChineseDate(2005, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new ChineseDate(2005, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new ChineseDate(2005, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new ChineseDate(2005, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new ChineseDate(2005, 11, 22))).toBe(true);
    });
  
    test('The terms on 2022', (): void => {
      const terms = getTermsOnYear(2022);

      expect(terms.length).toBe(24);

      expect(sameDate(terms[0].date!, new ChineseDate(2022, 0, 5))).toBe(true);
      expect(sameDate(terms[1].date!, new ChineseDate(2022, 0, 20))).toBe(true);
      expect(sameDate(terms[2].date!, new ChineseDate(2022, 1, 4))).toBe(true);
      expect(sameDate(terms[3].date!, new ChineseDate(2022, 1, 19))).toBe(true);
      expect(sameDate(terms[4].date!, new ChineseDate(2022, 2, 5))).toBe(true);
      expect(sameDate(terms[5].date!, new ChineseDate(2022, 2, 20))).toBe(true);
      expect(sameDate(terms[6].date!, new ChineseDate(2022, 3, 5))).toBe(true);
      expect(sameDate(terms[7].date!, new ChineseDate(2022, 3, 20))).toBe(true);
      expect(sameDate(terms[8].date!, new ChineseDate(2022, 4, 5))).toBe(true);
      expect(sameDate(terms[9].date!, new ChineseDate(2022, 4, 21))).toBe(true);
      expect(sameDate(terms[10].date!, new ChineseDate(2022, 5, 6))).toBe(true);
      expect(sameDate(terms[11].date!, new ChineseDate(2022, 5, 21))).toBe(true);
      expect(sameDate(terms[12].date!, new ChineseDate(2022, 6, 7))).toBe(true);
      expect(sameDate(terms[13].date!, new ChineseDate(2022, 6, 23))).toBe(true);
      expect(sameDate(terms[14].date!, new ChineseDate(2022, 7, 7))).toBe(true);
      expect(sameDate(terms[15].date!, new ChineseDate(2022, 7, 23))).toBe(true);
      expect(sameDate(terms[16].date!, new ChineseDate(2022, 8, 7))).toBe(true);
      expect(sameDate(terms[17].date!, new ChineseDate(2022, 8, 23))).toBe(true);
      expect(sameDate(terms[18].date!, new ChineseDate(2022, 9, 8))).toBe(true);
      expect(sameDate(terms[19].date!, new ChineseDate(2022, 9, 23))).toBe(true);
      expect(sameDate(terms[20].date!, new ChineseDate(2022, 10, 7))).toBe(true);
      expect(sameDate(terms[21].date!, new ChineseDate(2022, 10, 22))).toBe(true);
      expect(sameDate(terms[22].date!, new ChineseDate(2022, 11, 7))).toBe(true);
      expect(sameDate(terms[23].date!, new ChineseDate(2022, 11, 22))).toBe(true);
    });

    test('The term on 1984-12-21', (): void => {
      expect(getTermOnDay(new ChineseDate(1984, 11, 21))).toBeNull();
      expect(getTermOnDay(new ChineseDate(1984, 11, 22))?.order).toBe(19);
    });

    test('The term on 1985-03-21', (): void => {
      expect(getTermOnDay(new ChineseDate(1985, 2, 20))).toBeNull();
      expect(getTermOnDay(new ChineseDate(1985, 2, 21))?.order).toBe(1);
    });

    test('The term on 2018-03-21', (): void => {
      expect(getTermOnDay(new ChineseDate(2018, 2, 21))?.order).toBe(1);
    });

    test('The term on 2020-01-06', (): void => {
      expect(getTermOnDay(new ChineseDate(2020, 0, 6))?.order).toBe(20);
    });

    test('The term on 2020-02-19', (): void => {
      expect(getTermOnDay(new ChineseDate(2020, 1, 19))?.order).toBe(23);
    });

    test('The term on 2021-12-21', (): void => {
      expect(getTermOnDay(new ChineseDate(2021, 11, 21))).not.toBeNull();
    });

    test('The term on 2022-06-05', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 5, 5))).toBeNull();
    });

    test('The term on 2022-06-06', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 5, 6))).not.toBeNull();
    });

    test('The term on 2022-09-07', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 7))).not.toBeNull();
    });

    test('The term on 2022-09-08', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 8))).toBeNull();
    });

    test('The term on 2022-09-22', (): void => {
      expect(getTermOnDay(new ChineseDate(2022, 8, 22))).toBeNull();
    });
  });
});
