import { fakerEN } from "@faker-js/faker";

export default function generateFakeBrandData() {
  return {
    brandName: fakerEN.company.name(),
    yearFounded: fakerEN.number.int({ min: 1600, max: new Date().getFullYear() }),
    headquarters: fakerEN.location.streetAddress({ useFullAddress: true }),
    numberOfLocations: fakerEN.number.int({ min: 1, max: 1e5 }),
  };
}
