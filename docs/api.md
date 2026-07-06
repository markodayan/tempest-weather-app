# How 3rd Party APIs are used

There are 2 key endpoints that I will be making us of from Open-Meteo:

1. <b>Geocoding API</b>: returns location data given search terms
2. <b>Weather API</b>: returns weather data given location data

## Geocoding API

This API will be used to power the search functionality of Tempest. Its core functionality covers the following:

- Obtaining latitude and longitude coordinates required for leveraging the Forecast API.
- Enhancing the searchbar UX by providing the user with immediate feedback as they are typing their search terms so that they can click on the locations they are precisely looking for.

### Normalised Geocoding Payload

> We will be using this API to take query strings being written by the user and auto-populating the top 5 options to narrow down the user's search. 5 options of resolved locations will be presented to the user from which they can click on of them to trigger a weather search (otherwise if they just press enter or click the search button, the top-ranked match will be assigned for the search).

`LocationResults` is what the data will look like in the debounced search suggestions, while a single, normalised `Location` object is what will be used to build the query params for our weather fetching functionality.

```ts
/* Normalised location object */
export type Location = {
  id: number;
  latitude: number;
  longitude: number;
  timezone: string;
  location_title: string;
  location_area: string;
  location_country: string;
};

/* Location suggestions (array of normalised location objects) */
export type LocationResults = Location[];
```

### Disambiguating common place names

Open-Meteo ranks matches primarily by feature type and population, so a small suburb sharing
a name with larger, more populous places elsewhere (e.g. Glenwood, a Durban suburb, vs. the many
US towns named Glenwood) can be buried far past the requested `count` — verified: it ranked
81st of 100 for a bare `Glenwood` query. Appending free text to `name` (e.g. `"Glenwood South
Africa"`) doesn't help either; Open-Meteo does name matching, not free-text parsing, and returns
zero results for a compound string like that.

To work around this, `geocodeLocation` (via `extractCountryHint` in `countryCodes.ts`) recognises
an optional trailing country name or code and passes it through as Open-Meteo's documented
`countryCode` filter param — either comma-separated (`"Glenwood, South Africa"`) or, since users
naturally type it that way, plain trailing words (`"Glenwood South Africa"`, tried against
progressively shorter trailing word-groups from a small curated country-name list). Falls back to
searching the whole string as the place name if nothing matches, so it never behaves worse than
before this existed.

**Non-obvious gotcha**: `count` limits the raw name-matched pool *before* `countryCode` filtering
is applied, not the final filtered result count — requesting `count=5` with a country filter can
filter down to zero even when matches exist, if none of the top 5 population-ranked matches
happen to be in that country. `geocodeLocation` works around this by requesting the API's max
pool size (100) whenever a country hint is present, then slicing down to the display count
itself after filtering.

## Weather API

This API will be used to retrieve the current day weather conditions, as well as the weather conditions for the last 3 days, and the forecast for the next 3 days.

To request the weather for a location we need to provide:

- Location data (latitude, longitude, a timezone string)
- Amount of days in the past we want data on (3 in our case)
- Amount of days from present we want data on (4 in our case - 1 in present, 3 in future)
- Unit preferences (for temperature, wind speed, precipitation)
- Weather data field query strings

Using the API requires you to specify which weather data fields you would like. There are two query strings you can append called `daily` and `current` to specify what weather data fields you want from the API.

- `daily` params = time-series data for a range of days. Here we will be using this for a 7 day window (3 days in the past, present day, 3 days in the future).
- `current` params = these are metrics specifically for the present day because it is currently being measured and new insights are being derived by the service.

The `daily` fields we will be requesting are described by this string value (which willr return time-series data for the 7 days we want):

```bash
temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m
```

The `current` fields we are requesting for the present day additional weather readings are described by this string value (which will be returned to us as an object in the response):

```
weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_mean,precipitation_sum,precipitation_hours
```

### Normalised Weather Payload

> We will be using the Weather API to return a flat array of weather data objects (each object corresponding to a day in the 7-day window)

Each `WeatherDay` of the `WeaterReadings` will contain all the necessary data to render the weather cards as well as populate detailed views for different days selected by the user.

```ts
export type WeatherDay = {
  date: string;
  isToday: boolean;
  [field: string]: WeatherApiValue | undefined;
};

export type WeatherReadings = {
  days: WeatherDay[];
};
```
