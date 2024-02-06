declare module 'ephemeris' {
  export type Planet =
    | 'earth'
    | 'sun'
    | 'mercury'
    | 'venus'
    | 'moon'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune'
    | 'pluto'
    | 'chiron'
    | 'sirius';

  export interface Time {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }

  export interface JulianDate extends Time {
    julian: number;
    year: number;
    month: number;
    day: number;
  }

  export interface UniversalDate extends JulianDate {
    delta: number;
    b1950: number;
    j1900: number;
    j2000: number;
    julianDate: number;
    julianTime: number;
    universal: number;
    universalDate: JulianDate;
    universalDateString: string;
    terrestrial: number;
  }

  export interface EquinoxEclipticLonLat {
    degree: number;
    minutes: number;
    seconds: number;
  }

  export interface Diurnal {
    dec: number;
    dRA: number;
    dDec: number;
    ra: number;
  }

  export interface PlanetRaw {
    weight: number;
    key: Planet;
    position: {
      equinoxEclipticLonLat: {
        '0': number;
        '1': number;
        '2': number;
        '3': EquinoxEclipticLonLat;
        '4': EquinoxEclipticLonLat;
      };
      date: UniversalDate;
      lightTime: number;
      aberration: {
        dRA: number;
        dDec: number;
      };
      constellation: number;
      apparent: {
        dRA: number;
        dDec: number;
        dec: EquinoxEclipticLonLat;
        ra: Time;
      };
      apparentLongitude: number;
      apparentLongitudeString: string;
      apparentLongitude30String: string;
      geocentricDistance: -1;
      altaz: {
        dLocalApparentSiderealTime: number;
        localApparentSiderealTime: Time;
        diurnalAberration: Diurnal;
        transit: {
          approxLocalMeridian: Time;
          approxRiseUT: Time;
          approxSetUT: Time;
          approxSanatanRiseUT: Time;
          approxSanatanSetUT: Time;
          dApproxRiseUT: number;
          dApproxSetUT: number;
          dApproxSanatanRiseUT: number;
          dApproxSanatanSetUT: number;
          UTdate: number;
        };
        atmosphericRefraction: {
          deg: number;
          dRA: number;
          dDec: number;
        };
        diurnalParallax: Diurnal;
        topocentric: {
          altitude: number;
          azimuth: number;
          ra: number;
          dec: number;
          dRA: Time;
          dDec: EquinoxEclipticLonLat;
        };
      };
    };
  }

  export interface Result<P extends Planet> {
    date: {
      gregorianTerrestrial: string;
      gregorianTerrestrialRaw: UniversalDate;
      gregorianUniversal: string;
      gregorianDelta: string;
      julianTerrestrial: number;
      julianUniversal: number;
      julianDelta: number;
    };
    observer: {
      name: 'earth';
      heightGeodetic: number;
      heightGeodecentric: number;
      longitudeGeodetic: number;
      longitudeGeodecentric: number;
      latitudeGeodetic: number;
      latitudeGeodecentric: number;
    };
    observed: Record<
      P,
      {
        name: P;
        raw: PlanetRaw;
        apparentLongitudeDms30: string;
        apparentLongitudeDms360: string;
        apparentLongitudeDd: number;
        geocentricDistanceKm: number;
      }
    >;
  }

  export function getPlanet<P extends Planet>(
    planetName: P,
    date: Date,
    longitude: number,
    latitude: number,
    height: number,
  ): Result<P>;

  export function getAllPlanets(date: Date, longitude: number, latitude: number, height: number): Result<Planet>;
}
