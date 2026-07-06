function toDegreesMinutes(value: number): { degrees: number; minutes: number } {
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.round((absolute - degrees) * 60);

  if (minutes === 60) {
    return { degrees: degrees + 1, minutes: 0 };
  }

  return { degrees, minutes };
}

export function formatLatitude(latitude: number): string {
  const { degrees, minutes } = toDegreesMinutes(latitude);
  return `${degrees}°${minutes}'${latitude >= 0 ? 'N' : 'S'}`;
}

export function formatLongitude(longitude: number): string {
  const { degrees, minutes } = toDegreesMinutes(longitude);
  return `${degrees}°${minutes}'${longitude >= 0 ? 'E' : 'W'}`;
}
