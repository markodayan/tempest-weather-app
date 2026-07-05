# Open-Meteo API Utilisation

There are 2 key endpoints that I will be making us of from Open-Meteo:

1. <b>Geocoding API</b>
2. <b>Forecast API</b>

## Geocoding API

This API will be used to power the search functionality of Tempest. Its core functionality covers the following:

- Obtaining latitude and longitude coordinates required for leveraging the Forecast API.
- Enhancing the searchbar UX by providing the user with immediate feedback as they are typing their search terms so that they can click on the locations they are precisely looking for.

## Forecast API

This API will be used to retrieve the current day weather conditions, as well as the weather conditions for the last 3 days, and the forecast for the next 3 days.
