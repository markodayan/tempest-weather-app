// Common country names a user might type after a comma (e.g. "Glenwood, South Africa"),
// mapped to their ISO-3166-1 alpha-2 code for Open-Meteo's `countryCode` filter.
// Not exhaustive — covers commonly searched countries; unrecognised names are simply
// dropped rather than breaking the search (see resolveCountryCode).
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  afghanistan: 'AF',
  albania: 'AL',
  algeria: 'DZ',
  argentina: 'AR',
  australia: 'AU',
  austria: 'AT',
  bangladesh: 'BD',
  belgium: 'BE',
  brazil: 'BR',
  canada: 'CA',
  chile: 'CL',
  china: 'CN',
  colombia: 'CO',
  croatia: 'HR',
  'czech republic': 'CZ',
  czechia: 'CZ',
  denmark: 'DK',
  egypt: 'EG',
  finland: 'FI',
  france: 'FR',
  germany: 'DE',
  ghana: 'GH',
  greece: 'GR',
  india: 'IN',
  indonesia: 'ID',
  iran: 'IR',
  iraq: 'IQ',
  ireland: 'IE',
  israel: 'IL',
  italy: 'IT',
  jamaica: 'JM',
  japan: 'JP',
  kenya: 'KE',
  malaysia: 'MY',
  mexico: 'MX',
  morocco: 'MA',
  netherlands: 'NL',
  'new zealand': 'NZ',
  nigeria: 'NG',
  norway: 'NO',
  pakistan: 'PK',
  peru: 'PE',
  philippines: 'PH',
  poland: 'PL',
  portugal: 'PT',
  romania: 'RO',
  russia: 'RU',
  'saudi arabia': 'SA',
  singapore: 'SG',
  'south africa': 'ZA',
  'south korea': 'KR',
  spain: 'ES',
  'sri lanka': 'LK',
  sweden: 'SE',
  switzerland: 'CH',
  taiwan: 'TW',
  thailand: 'TH',
  turkey: 'TR',
  ukraine: 'UA',
  'united arab emirates': 'AE',
  'united kingdom': 'GB',
  'united states': 'US',
  'united states of america': 'US',
  vietnam: 'VN',
  zimbabwe: 'ZW',
};

const COUNTRY_ALIASES: Record<string, string> = {
  usa: 'US',
  us: 'US',
  uk: 'GB',
  america: 'US',
  holland: 'NL',
};

const ISO_ALPHA_2_PATTERN = /^[a-zA-Z]{2}$/;

// longest country name we recognise, in words (e.g. "united states of america" -> 4);
// bounds how many trailing words extractCountryHint tries as a country suffix
const MAX_COUNTRY_NAME_WORDS = Math.max(
  ...Object.keys(COUNTRY_NAME_TO_CODE).map((name) => name.split(' ').length),
);

/**
 * Resolves a user-typed country hint (a full name or an ISO-3166-1 alpha-2 code)
 * to an alpha-2 code, or undefined if it isn't recognised.
 */
export function resolveCountryCode(hint: string): string | undefined {
  const trimmed = hint.trim();

  if (ISO_ALPHA_2_PATTERN.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const key = trimmed.toLowerCase();

  return COUNTRY_NAME_TO_CODE[key] ?? COUNTRY_ALIASES[key];
}

/**
 * Splits a search query into a place name and an optional trailing country hint,
 * e.g. "Glenwood, South Africa" or "Glenwood South Africa" -> { name: "Glenwood", countryCode: "ZA" }.
 * An explicit comma is tried first (unambiguous); otherwise this tries progressively
 * shorter trailing word-groups against known country names/codes, preferring the
 * longest match. Falls back to treating the whole query as the place name.
 */
export function extractCountryHint(query: string): { name: string; countryCode?: string } {
  const commaIndex = query.indexOf(',');

  if (commaIndex !== -1) {
    const name = query.slice(0, commaIndex);
    const countryCode = resolveCountryCode(query.slice(commaIndex + 1));
    return { name, countryCode };
  }

  const words = query.trim().split(/\s+/).filter(Boolean);

  for (
    let suffixLen = Math.min(MAX_COUNTRY_NAME_WORDS, words.length - 1);
    suffixLen >= 1;
    suffixLen--
  ) {
    const suffix = words.slice(words.length - suffixLen).join(' ');
    const countryCode = resolveCountryCode(suffix);

    if (countryCode) {
      return { name: words.slice(0, words.length - suffixLen).join(' '), countryCode };
    }
  }

  return { name: query };
}
