There are 3 main components in this application:

1. `SearchBar`

- Consists of an input field for query terms (for location) as well as options for changing unit preferences.
- Location results should auto-populate as the user types (via debounced search triggering Geocoding API requests).

2. `SelectedDayWeatherReport`

- Displays a detailed weather report of the whatever day's weather tile is selected.

3. `WeatherTiles`

- Contains 7 weather tiles (3 previous days, current day, next 3 days). Each can be selected to view a more detailed report of their weather data.
