/**
 * Script to download eviction data from airtable, geo-encode it, and then
 * upload the result to a google sheet so that it can be ingested by arcGIS
 */
import Airtable from 'airtable';

const API_KEY = process.env.AIRTABLE_API_KEY;

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: API_KEY,
});

type ReturnType = Promise<{ addresses: string[], records: Record<string, string>[] }>

export default async function downloadAirtableData(appBase: string): ReturnType {
  const addresses = [];
  const allRecords = [];

  return new Promise((resolve, reject) => {
    const base = Airtable.base(appBase);

    base('Imported table').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 3,
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach((record) => {
        allRecords.push(record.fields as Record<string, string>);
        const address = record.get('Street Address');
        const zipCode = record.get('Zip Code');
        const city = record.get('City');
        const state = record.get('State');

        if (!address || !zipCode || !city || !state) addresses.push(undefined);
        else addresses.push(`${address}, ${city} ${state}, ${zipCode}`);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) reject(err);
      resolve({ addresses, records: allRecords });
    });
  })
}