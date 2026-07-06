# Geocoding API Requests and Responses and Desired Tempest Normalisation

> These queries will take a text string as input and return a list of 5 different locations with spherical coordinates and other useful metadata required for querying location weather with the Weather API.

### Example 1: Anchorage,Alaska, United States

Request:

```
https://geocoding-api.open-meteo.com/v1/search?name=Anchorage&count=5
```

Response:

```json
{
  "results": [
    {
      "id": 5879400,
      "name": "Anchorage",
      "latitude": 61.21806,
      "longitude": -149.90028,
      "elevation": 31.0,
      "feature_code": "PPLA2",
      "country_code": "US",
      "admin1_id": 5879092,
      "admin2_id": 5879348,
      "timezone": "America/Anchorage",
      "population": 289600,
      "postcodes": [
        "99501",
        "99502",
        "99503",
        "99504",
        "99507",
        "99508",
        "99509",
        "99510",
        "99511",
        "99513",
        "99514",
        "99515",
        "99516",
        "99517",
        "99518",
        "99519",
        "99520",
        "99521",
        "99522",
        "99523",
        "99524",
        "99599",
        "99695"
      ],
      "country_id": 6252001,
      "country": "United States",
      "admin1": "Alaska",
      "admin2": "Anchorage Municipality"
    },
    {
      "id": 4282497,
      "name": "Anchorage",
      "latitude": 38.26674,
      "longitude": -85.53302,
      "elevation": 217.0,
      "feature_code": "PPL",
      "country_code": "US",
      "admin1_id": 6254925,
      "admin2_id": 4296212,
      "timezone": "America/Kentucky/Louisville",
      "population": 2420,
      "country_id": 6252001,
      "country": "United States",
      "admin1": "Kentucky",
      "admin2": "Jefferson"
    },
    {
      "id": 4314787,
      "name": "Anchorage",
      "latitude": 30.48269,
      "longitude": -91.21039,
      "elevation": 7.0,
      "feature_code": "PPL",
      "country_code": "US",
      "admin1_id": 4331987,
      "admin2_id": 4345713,
      "timezone": "America/Chicago",
      "country_id": 6252001,
      "country": "United States",
      "admin1": "Louisiana",
      "admin2": "West Baton Rouge"
    },
    {
      "id": 4347203,
      "name": "Anchorage",
      "latitude": 38.944,
      "longitude": -76.47357,
      "elevation": 9.0,
      "feature_code": "PPL",
      "country_code": "US",
      "admin1_id": 4361885,
      "admin2_id": 4347283,
      "timezone": "America/New_York",
      "country_id": 6252001,
      "country": "United States",
      "admin1": "Maryland",
      "admin2": "Anne Arundel County"
    },
    {
      "id": 4347204,
      "name": "Anchorage",
      "latitude": 38.79567,
      "longitude": -76.13828,
      "elevation": 4.0,
      "feature_code": "PPL",
      "country_code": "US",
      "admin1_id": 4361885,
      "admin2_id": 4370904,
      "timezone": "America/New_York",
      "country_id": 6252001,
      "country": "United States",
      "admin1": "Maryland",
      "admin2": "Talbot County"
    }
  ],
  "generationtime_ms": 2.299428
}
```

## Normalisation from here

We normalise every element in the raw location array from the response into objects of the following form. These will be used to auto-populate search suggestions.

```ts
/* Normalised location object */
interface Location {
  id: number;
  latitude: number;
  longitude: number;
  timezone: string;
  location_title: string;
  location_area: string;
  location_country: string;
}

/* Pre-populated search suggestions */
type LocationResults = Location[];
```

Following this, the location that gets selected from this list will be used by the Weather API to conduct its querying.

Example normalisation:

```ts
{
  id: 5879400,
  lat: 61.21806,
  lon: -149.90028,
  timezone: 'America/Anchorage',
  location_title: 'Anchorage',
  location_area: 'Alaska',
  location_country: 'United States'
}
```
