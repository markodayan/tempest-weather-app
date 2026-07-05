# Strategy and Planning

## Technology Stack

- Implementing as React SPA using Vite and Tailwind.

- Leveraging <b>Open-Meteo</b> as a data source. After reviewing all the options available publically, their APIs provide me with the best path to acquiring the data needed for this app.

- Due to this being a new project, will opt to use <b>Vitest</b> for unit and component testing, while using <b>Playwright</b> for E2E testing.

## Features

- <b>Search and Desired Search UX</b>:
  - As a user, I should be able to write locations in the search bar and receive immediate feedback for locations matching the emerging search term. The top 5 matches should pop up as clickable options to trigger a query for the 7 day window of weather (current day, past 3 days, and next 3 days forecast).
  - As a user, I should be able to quickly select locations previously queried thereby reducing effort for commonly repeated locations (query caching)
  - As a user, I want to be informed if the location I am looking for can't be found.
  - [TBC] As a user, I should be able to see additional results if the predictive search does not yield my specific location
  - As a user, I should be able to toggle preferences for weather data including temperature scales (Celsius, Fahrenheit), wind speed (km/h, mph, m/s, kn), precipation preferred units (mm, in).
  - As a user, I should be able to set a preference for automatic refresh of my query if I want updates throughout my session/day.
  - As a user, my preferences should be able to be persisted across sessions (preference caching)
- <b> Weather Data (Weather Cards and Detailed View) </b>:
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
