import { faker } from "@faker-js/faker";
import cityCoordinates from "@/resources/cityCoordinates.json";

export function pickRandomCoordinate(): number[] {
  const n = 1_000_000
  const latLongs = faker.helpers.objectValue(cityCoordinates);
  const lat = faker.helpers.rangeToNumber({
    min: latLongs.latitudes[0] * n,
    max: latLongs.latitudes[1] * n,
  })
  const long = faker.helpers.rangeToNumber({
    min: latLongs.longitudes[0] * n,
    max: latLongs.longitudes[1] * n,
  })

  return [lat / n, long / n];
}