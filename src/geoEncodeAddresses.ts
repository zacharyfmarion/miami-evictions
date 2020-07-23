import Geocodio from 'geocodio-library-node';
import { LatLong } from './types';

const geocoder = new Geocodio(process.env.GEOCODIO_API_KEY);

type ReturnType = Promise<LatLong[]>

export default async function geoEncodeAddresses(addresses: string[]): ReturnType {
  return new Promise((resolve, reject) => {
    geocoder.geocode(addresses)
      .then(response => {
        resolve(response.results.map(data => {
          const results = data.response.results;
          if (!results || !results.length) return undefined;
          return results[0].location;
        }));
      })
      .catch(err => {
        reject(err);
      })
  })
}