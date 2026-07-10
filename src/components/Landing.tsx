import type { Location } from '../api';

type LandingProps = {
  onSelectLocation: (location: Location) => void;
};

type SuggestedLocation = Location & { imageSrc: string };

// Verified via geocodeLocation against the real Open-Meteo API (see docs/image-guidelines.md
// for the card image sourcing/compression conventions). ids are negative so they're visibly
// distinct from real Open-Meteo geocoding ids (always positive) in case the two are ever
// compared/combined.
const SUGGESTED_LOCATIONS: SuggestedLocation[] = [
  {
    id: -1,
    latitude: -33.92584,
    longitude: 18.42322,
    timezone: 'Africa/Johannesburg',
    location_title: 'Cape Town',
    location_area: 'Western Cape',
    location_country: 'South Africa',
    imageSrc: '/suggestions/cape-town.webp',
  },
  {
    id: -2,
    latitude: 25.07725,
    longitude: 55.30927,
    timezone: 'Asia/Dubai',
    location_title: 'Dubai',
    location_area: 'Dubai',
    location_country: 'United Arab Emirates',
    imageSrc: '/suggestions/dubai.webp',
  },
  {
    id: -3,
    latitude: 51.50853,
    longitude: -0.12574,
    timezone: 'Europe/London',
    location_title: 'London',
    location_area: 'England',
    location_country: 'United Kingdom',
    imageSrc: '/suggestions/london.webp',
  },
  {
    id: -4,
    latitude: 40.71427,
    longitude: -74.00597,
    timezone: 'America/New_York',
    location_title: 'New York',
    location_area: 'New York',
    location_country: 'United States',
    imageSrc: '/suggestions/new-york-city.webp',
  },
  {
    id: -5,
    latitude: 48.85341,
    longitude: 2.3488,
    timezone: 'Europe/Paris',
    location_title: 'Paris',
    location_area: 'Île-de-France Region',
    location_country: 'France',
    imageSrc: '/suggestions/paris.webp',
  },
  {
    id: -6,
    latitude: 7.89059,
    longitude: 98.3981,
    timezone: 'Asia/Bangkok',
    location_title: 'Phuket',
    location_area: 'Phuket',
    location_country: 'Thailand',
    imageSrc: '/suggestions/phuket.webp',
  },
  {
    id: -7,
    latitude: 41.89193,
    longitude: 12.51133,
    timezone: 'Europe/Rome',
    location_title: 'Rome',
    location_area: 'Lazio',
    location_country: 'Italy',
    imageSrc: '/suggestions/rome.webp',
  },
  {
    id: -8,
    latitude: -33.86785,
    longitude: 151.20732,
    timezone: 'Australia/Sydney',
    location_title: 'Sydney',
    location_area: 'New South Wales',
    location_country: 'Australia',
    imageSrc: '/suggestions/sydney.webp',
  },
];

// Display-only shortenings for the card label - location_country itself stays the full,
// geocoding-accurate name, since it's also what shows up in the search badge/SelectedDayReport
// header if one of these gets selected, and that should stay consistent with what a real
// manual search for the same place would return.
const COUNTRY_LABEL_ABBREVIATIONS: Record<string, string> = {
  'United Arab Emirates': 'UAE',
  'United Kingdom': 'UK',
  'United States': 'USA',
};

function formatCountryLabel(country: string): string {
  return COUNTRY_LABEL_ABBREVIATIONS[country] ?? country;
}

export default function Landing({ onSelectLocation }: LandingProps) {
  return (
    <div
      id='landing-suggestions'
      className='mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 pt-1 pb-8 text-center'
    >
      <p className='text-xl font-extrabold xl:text-3xl text-user-q'>
        Unsure what to search? <span className='text-cta font-bold'>Click a place below!</span>
      </p>

      <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
        {SUGGESTED_LOCATIONS.map((location) => (
          <button
            key={location.id}
            type='button'
            onClick={() => onSelectLocation(location)}
            className='group relative aspect-4/3 cursor-pointer overflow-hidden rounded-md transition-opacity duration-300 hover:opacity-80'
          >
            <img
              src={location.imageSrc}
              alt=''
              className='h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' />
            <span className='absolute bottom-0 left-0 p-3 text-left text-[12px] xl:text-[20px] font-bold text-white opacity-90 transition-opacity duration-300 group-hover:opacity-100'>
              {location.location_title}, {formatCountryLabel(location.location_country)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
