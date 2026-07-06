# Strategy and Planning

## Technology Stack

- React SPA (using Vite, Tailwind, TypeScript).
- Open-Meteo APIs used for fetching location and weather data (Geocoding API, Weather API).
- Vitest for unit and component testing.
- Playwright for E2E testing.
- Zod for validation (search params etc)
- Postman for API testing

## Features

- <b>Search and User Preferences</b>:
  - As a user, I should be able to get suggested locations while I am typing my search term that I can click on shorten the time taken for the app to understand my query.
  - As a user, I should be able to adjust unit preferences for temperature, precipitation and wind speed.
  - As a user, I should be able to view the weather for the current day, 3 days before, and 3 days after (forecast) for any surburb, town, city, state or country.
  - As a user, I should be able to select any one of the 7 day cards and observe a more detailed report about the weather on that day.
  - As a user, my most recent locations should be available to select (query term caching).
  - As a user, I want to be informed if the location I am looking for can't be found.
  - As a user, I should be able to toggle preferences for weather data including temperature scales (Celsius, Fahrenheit), wind speed (km/h, mph, m/s, kt), precipation preferred units (mm, in).
  - [TBC]As a user, I should be able to leave the window open and have the application update autonomously.
  - As a user, my preferences should be able to be persisted across sessions on my device (preference caching)
  - As a user, I should be able to productively use this app on PC, mobile and tablet browsers.
- <b> Weather Data (Weather Tiles and Selected Day Weather Report) </b>:
  - Submitting a query for an existing location should populate a 7-day weather card grid (3 days weather prior to current day, the current day, the forecast for the next 3 days), with the default highlighted card being the current day.
  - Any day's weather card selected in the grid will become highlighted and will cause the detailed view component to display its weather data.
  - If looking at weather of current day, the weather information should be as fresh as possible.
  - If looking at weather of current day, UI should visually show whether it is day or night-time.
  - Weather and other contextual data for the 7-day window should include a weather condition, wind-speed, temperature, feels-like temperature, humidity (tbc), precipitation measurements, time at location, further-normalised location labels etc. Weather cards will display less-detailed data. a selected day, will cause a detailed view of the weather to be populated with the verbose data regarding the specific day.
  - The detailed view of the current day will differ from the detailed views of the past days and future days.
- <b>Content Experience UX </b>:
  - Provide input elements to allow user to refresh their current query to fetch the latest data available from the information source.
  - Visually show (next to refresh element) how long it has been since the response was served to the user (seconds, minutes, hours, days)
  - [TBC] Potential idea -> give user the option to set automated refresh (e.g. every 5 min, 10 min, 30 min, hourly etc) and manage this functionality with timers driving polling frequency.
    - Potentially introduces a DoS vector (so need to think more about this potential scope creep)
- <b> Responsive Design </b>:
  - Application should be able to cater for multiple client views (web, mobile, tablet)

## Implementation and Architectural Decisions

- [TBC] Use a custom hook for managing data retrieval and synchronisation. The application is not being built with any further extensibility in mind therefore this seems appropriate in comparison. TBC as there are a couple of preferences further shaping the application state.
