There are 3 main components in this application:

1. `SearchBar`

- Designed to accept location terms allowing the user to query a 7-day weather reading for the location (3 days before current day, current day, 3 days after current day).
- Provides query options in real-time while user is typing in search terms, allowing the user to click on an option to finish their query request quicker.
- Allows users to toggle preferences like units for temperature, wind speed, and precipitation, as well as preferences to enable automatic refresh if they wish to keep the application open in a window.

2. `DetailedWeatherReport`

- Displays a detailed weather report of the whatever day's weather tile is selected.

3. `WeatherGrid`

- Contains 7 weather tiles (3 previous days, current day, next 3 days). Each can be selected to view a more detailed report of their weather data.
