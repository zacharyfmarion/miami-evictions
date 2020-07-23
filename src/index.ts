import geoEncodeAddresses from './geoEncodeAddresses';
import downloadAirtableData from './downloadAirtableData';
import joinData from './joinData';

// TODO: Replace with correct project base
const APP_BASE = 'appL8m6aGj1PkLBa4';

async function main() {
  const { records, addresses } = await downloadAirtableData(APP_BASE);
  const geoData = await geoEncodeAddresses(addresses);
  const joinedData = joinData({ records, geoData });
  console.log(joinedData);
}

main();