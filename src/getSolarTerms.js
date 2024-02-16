import { julian, solstice, planetposition } from 'astronomia';
import vsop87earth from 'astronomia/data/vsop87Bearth';

const planet = new planetposition.Planet(vsop87earth);

export const DEGS = [
    240,
    255,
    270,
    285,
    300,
    315,
    330,
    345,
    0,
    15, 
    30,
    45,
    60,
    75,
    90,
    105,
    120,
    135,
    150,
    165,
    180,
    195,
    210,
    225
];

export const SOLAR_TERMS_KO = [
    '소설',
    '대설',
    '동지',
    '소한',
    '대한',
    '입춘',
    '우수',
    '경칩',
    '춘분',
    '청명',
    '곡우',
    '입하',
    '소만',
    '망종',
    '하지',
    '소서',
    '대서',
    '입추',
    '처서',
    '백로',
    '추분',
    '한로',
    '상강',
    '입동'
];

function getSolarTerms(year) {
    const solarTerms = new Map();

    DEGS.forEach((deg, index) => {
        let y = year;
        if(deg >= 240) --y;
        const lon = deg * Math.PI / 180;
        const jde = solstice.longitude(y, planet, lon);
        const date = julian.JDEToDate(jde);

        solarTerms.set(SOLAR_TERMS_KO[index], date);
    });    

    return solarTerms;
}

export default getSolarTerms;