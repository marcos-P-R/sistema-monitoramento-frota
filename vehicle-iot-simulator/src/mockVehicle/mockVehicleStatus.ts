export interface MockVehicleStatus {
  vehicleId: string;
  name: string;
  destination: MockVehicleLocation;
  origin: MockVehicleLocation;
}

export interface MockVehicleLocation {
  latitude: number;
  longitude: number;
}

const locations: MockVehicleLocation[] = [
  { latitude: -15.793889, longitude: -47.882778 }, // Brasília-DF
  { latitude: -30.034647, longitude: -51.217658 }, // Porto Alegre-RS
  { latitude: -1.296389, longitude: -47.921389 },  // Castanhal-PA
];

export const mockVehicles: MockVehicleStatus[] = [
  { vehicleId: '1', name: 'Caminhão Alpha', origin: locations[0], destination: locations[1] },
  { vehicleId: '2', name: 'Caminhão Beta', origin: locations[1], destination: locations[2] },
  { vehicleId: '3', name: 'Caminhão Gamma', origin: locations[2], destination: locations[0] },
  { vehicleId: '4', name: 'Caminhão Delta', origin: locations[0], destination: locations[2] },
  { vehicleId: '5', name: 'Caminhão Epsilon', origin: locations[1], destination: locations[0] },
  { vehicleId: '6', name: 'Caminhão Zeta', origin: locations[2], destination: locations[1] },
  { vehicleId: '7', name: 'Caminhão Eta', origin: locations[0], destination: locations[1] },
  { vehicleId: '8', name: 'Caminhão Theta', origin: locations[1], destination: locations[2] },
  { vehicleId: '9', name: 'Caminhão Iota', origin: locations[2], destination: locations[0] },
  { vehicleId: '10', name: 'Caminhão Kappa', origin: locations[0], destination: locations[2] },
  { vehicleId: '11', name: 'Caminhão Lambda', origin: locations[1], destination: locations[0] },
  { vehicleId: '12', name: 'Caminhão Mu', origin: locations[2], destination: locations[1] },
  { vehicleId: '13', name: 'Caminhão Nu', origin: locations[0], destination: locations[1] },
  { vehicleId: '14', name: 'Caminhão Xi', origin: locations[1], destination: locations[2] },
  { vehicleId: '15', name: 'Caminhão Omicron', origin: locations[2], destination: locations[0] },
  { vehicleId: '16', name: 'Caminhão Pi', origin: locations[0], destination: locations[2] },
  { vehicleId: '17', name: 'Caminhão Rho', origin: locations[1], destination: locations[0] },
  { vehicleId: '18', name: 'Caminhão Sigma', origin: locations[2], destination: locations[1] },
  { vehicleId: '19', name: 'Caminhão Tau', origin: locations[0], destination: locations[1] },
  { vehicleId: '20', name: 'Caminhão Upsilon', origin: locations[1], destination: locations[2] },
];

export function getNextLocation(
  current: MockVehicleLocation,
  destination: MockVehicleLocation,
  stepMeters: number = 1000
): MockVehicleLocation {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;

  const earthRadiusMeters = 6371000;

  const currentLatRad = toRadians(current.latitude);
  const currentLonRad = toRadians(current.longitude);
  const destLatRad = toRadians(destination.latitude);
  const destLonRad = toRadians(destination.longitude);

  const deltaLat = destLatRad - currentLatRad;
  const deltaLon = destLonRad - currentLonRad;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(currentLatRad) * Math.cos(destLatRad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = earthRadiusMeters * c;

  if (distanceMeters <= stepMeters) {
    return { latitude: destination.latitude, longitude: destination.longitude };
  }

  // Calculate bearing
  const y = Math.sin(destLonRad - currentLonRad) * Math.cos(destLatRad);
  const x =
    Math.cos(currentLatRad) * Math.sin(destLatRad) -
    Math.sin(currentLatRad) * Math.cos(destLatRad) * Math.cos(destLonRad - currentLonRad);
  const bearingRad = Math.atan2(y, x);

  // Move stepMeters towards bearing
  const newLatRad = Math.asin(
    Math.sin(currentLatRad) * Math.cos(stepMeters / earthRadiusMeters) +
      Math.cos(currentLatRad) * Math.sin(stepMeters / earthRadiusMeters) * Math.cos(bearingRad)
  );
  const newLonRad =
    currentLonRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(stepMeters / earthRadiusMeters) * Math.cos(currentLatRad),
      Math.cos(stepMeters / earthRadiusMeters) - Math.sin(currentLatRad) * Math.sin(newLatRad)
    );

  return {
    latitude: toDegrees(newLatRad),
    longitude: toDegrees(newLonRad),
  };
}