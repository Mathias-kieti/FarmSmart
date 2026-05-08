export interface CountyCoordinates {
  latitude: number;
  longitude: number;
}

export const COUNTY_COORDINATES: Record<string, CountyCoordinates> = {
  Baringo: { latitude: 0.4897, longitude: 35.7412 },
  Bomet: { latitude: -0.7813, longitude: 35.3416 },
  Bungoma: { latitude: 0.5635, longitude: 34.5606 },
  Busia: { latitude: 0.4608, longitude: 34.1115 },
  "Elgeyo-Marakwet": { latitude: 0.8035, longitude: 35.508 },
  Embu: { latitude: -0.5311, longitude: 37.4506 },
  Garissa: { latitude: -0.4536, longitude: 39.6401 },
  "Homa Bay": { latitude: -0.5273, longitude: 34.4571 },
  Isiolo: { latitude: 0.3546, longitude: 37.5822 },
  Kajiado: { latitude: -1.8524, longitude: 36.7768 },
  Kakamega: { latitude: 0.2827, longitude: 34.7519 },
  Kericho: { latitude: -0.3677, longitude: 35.2831 },
  Kiambu: { latitude: -1.0314, longitude: 36.8681 },
  Kilifi: { latitude: -3.5107, longitude: 39.9093 },
  Kirinyaga: { latitude: -0.4989, longitude: 37.2803 },
  Kisii: { latitude: -0.6817, longitude: 34.7667 },
  Kisumu: { latitude: -0.1022, longitude: 34.7617 },
  Kitui: { latitude: -1.3741, longitude: 38.0106 },
  Kwale: { latitude: -4.1741, longitude: 39.4521 },
  Laikipia: { latitude: 0.3975, longitude: 36.9541 },
  Lamu: { latitude: -2.2717, longitude: 40.902 },
  Machakos: { latitude: -1.5177, longitude: 37.2634 },
  Makueni: { latitude: -2.2559, longitude: 37.8937 },
  Mandera: { latitude: 3.9366, longitude: 41.867 },
  Marsabit: { latitude: 2.3379, longitude: 37.9899 },
  Meru: { latitude: 0.047, longitude: 37.6498 },
  Migori: { latitude: -1.0634, longitude: 34.4731 },
  Mombasa: { latitude: -4.0435, longitude: 39.6682 },
  "Murang'a": { latitude: -0.7839, longitude: 37.0401 },
  Nairobi: { latitude: -1.2864, longitude: 36.8172 },
  Nakuru: { latitude: -0.3031, longitude: 36.08 },
  Nandi: { latitude: 0.1836, longitude: 35.1269 },
  Narok: { latitude: -1.0906, longitude: 35.8711 },
  Nyamira: { latitude: -0.5667, longitude: 34.9333 },
  Nyandarua: { latitude: -0.3833, longitude: 36.5333 },
  Nyeri: { latitude: -0.4167, longitude: 36.9511 },
  Samburu: { latitude: 1.2155, longitude: 36.9541 },
  Siaya: { latitude: 0.0612, longitude: 34.2882 },
  "Taita-Taveta": { latitude: -3.3161, longitude: 38.485 },
  "Tana River": { latitude: -1.6518, longitude: 39.6518 },
  "Tharaka-Nithi": { latitude: -0.2965, longitude: 37.7238 },
  "Trans Nzoia": { latitude: 1.0567, longitude: 34.9507 },
  Turkana: { latitude: 3.1167, longitude: 35.6 },
  "Uasin Gishu": { latitude: 0.5143, longitude: 35.2698 },
  Vihiga: { latitude: 0.0768, longitude: 34.7229 },
  Wajir: { latitude: 1.7471, longitude: 40.0573 },
  "West Pokot": { latitude: 1.621, longitude: 35.3905 },
};

export function getCountyCoordinates(county: string): CountyCoordinates {
  return COUNTY_COORDINATES[county] ?? COUNTY_COORDINATES.Nairobi;
}
