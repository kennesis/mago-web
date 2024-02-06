# Lunar (Chinese calendar)

<br />

> The standard mentioned below which means [GB/T 33661-2017 - Calculation and promulgation of the Chinese calendar](http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296).
The lunar mentioned below which means this library.

<br />

All algorithms in the package are according to the standard to be implemented. And used [ephemeris](https://www.npmjs.com/package/ephemeris) to calculate sun ecliptic longitude and moon ecliptic longitude.

> Some earlier dates might not are satisfied with the outputs of the lunar, the lunar use astronomy algorithms to reach high-precision results. Like 8/25/1919 and 1/25/1944, these dates were the first dates of the lunar months in the real history, but they are not new moons according to astronomy algorithms. and 8/26/1919 and 1/26/1944 were new moons, they should were the first dates.

<br />

Including:
1. Calculate the solar term of a day, solar terms of year, 24 solar terms;
2. Calculate month and day of Chinese calendar, and leap months;
3. Calculate sexagesimal(celestial stem with terrestrial branch) of day, month and year;
4. Calculate zodiac of year.

<br />
<br />

## API

### class ChineseDate(inherit native Date)

#### Methods

- getLunarYear(): OLunarYear
- getLunarMonth(): OLunarMonth
- getLunarDay(): OLunarDay
- toChineseString(): string | A date locale string in zh-CN language in PRC time zone
- toLunarString(): string | example: 农历壬寅年九月甲申日

<br />

#### inteface OLunarYear
- sexagesimal(): string | example: 壬寅
- zodiac(): string | example: 虎
- toString(): string | example: 壬寅年 虎年

#### inteface OLunarMonth
- capital(): string | example: 九
- isLeap(): boolean
- sexagesimal(): string | example: 己酉
- toString(): string | example: 己酉月 九月

#### inteface OLunarDay
- capital(): string | example: 初十
- sexagesimal(): string | example: 甲申
- toString(): string | example: 癸亥日 初九

<br />

---

### Calendar tools

- countDaysOnYear(year: number): number
- isNewMoon(date: Date): boolean
- countNewMoons(fromDate: Date, toDate: Date): Array<Date>
- getWinterSolstice(year: number): Date
- isMissingMidTermMonth(date: Date): boolean
- isLeapMonth(date: Date): boolean

<br />

---

### Solar terms

#### class SolarTerm


##### Constructor
_constructor(public readonly order: number, public readonly longitude: number, public label: string)_<br /><br />
The parameter "order" must be an integer from 1 to 24.
The parameter "longitude" must be an integer from 0 to 360, and must be in multiples of 15.

##### Properties

- date: ChineseDate | undefined
- label: string
- readonly order: number
- readonly longitude: number

##### Methods

- isMidTerm(): boolean
- toString(): string
- _static_ create(index: number[, lang: Array<string>]): SolarTerm | index is an integer from 1 to 24.

#### create24SolarTerms([lang: Array<string>]): Map<number, SolarTerm>

#### getTermOnDay(date: Date[, coordinate: GeoJSON.Position]): SolarTerm | null

#### countSolarTerms(fromDate: Date, toDate: Date): Array<SolarTerm>

#### getTermsOnYear(year: number[, coordinate: GeoJSON.Position]): Array<SolarTerm>

---

#### calcSunEclipticLongitude(time: Date[, coordinate: GeoJSON.Position]): number
Calculate sun ecliptic longitude at the time.

#### calcMoonEclipticLongitude(time: Date[, coordinate: GeoJSON.Position]): number
Calculate moon ecliptic longitude at the time.

#### calcDiffOfSunAndMoon(time: Date[, coordinate: GeoJSON.Position]): number
Calculate different value between sun ecliptic longitude at the time and moon ecliptic longitude at the time.

<br />

> Note: the default coordinate parameter is [120, 0].

<br />

## References

1. [GB/T 33661-2017 - Calculation and promulgation of the Chinese calendar](http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=E107EA4DE9725EDF819F33C60A44B296)

2. [Leap months](https://www-ws.gov.taipei/Download.ashx?u=LzAwMS9VcGxvYWQvNDM5L3JlbGZpbGUvNDc1NTcvNzk3MDY5OS9jMGZiN2JhMC1iNTU1LTQyNjctYWUwMi0zNzIyNTU3ZDhjMTgucGRm&n=6ZaP5pyI56%2BA5rCj6KGoLnBkZg%3D%3D&icon=..pdf)

3. [计算二十四节气](https://zhuanlan.zhihu.com/p/514651439)

