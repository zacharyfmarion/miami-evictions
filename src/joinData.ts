import { LatLong } from './types';

type Params = {
  records: Record<string, string>[],
  geoData: LatLong,
}

export default function joinData({ records, geoData }): Params {
  return records.map((record: Record<string, string>, i: number) => ({
    ...record,
    ...geoData[i]
  }));
}