# Components & Hooks

Key actions:

- <b>Search</b>: Triggers a fresh weather fetch request (search bar transitions to view-mode state).
- <b>Reset</b>: Resets the search bar to write-mode state
- <b>Apply</b>: Triggers a weather fetch request with updated preferences

## `Search` Component

> Where the user enters text to search for a location that they want to know the weather about. This will send a request to the Weather API to get the weather information for the location.

- Uses debounced search to provide user with location recommendations to select while typing location names.
- Once a location is selected (from the auto-populated suggestions powered by the Geocoding API), a request to the Weather API is made.

<br>
Local State:

- Todo
- Todo

<br>

## `Preferences` Component

> Where a user can configure their preferences for units of measure in the weather data.

- The Weather API accepts unit preferences, therefore this component enables users to specify options therefore expanding how useful the weather application can be in serving users with different preferences for speed, temperature, precipitation units.
- The preferences controlled by this component are bundled with resolved location data to allow a user to query the weather for any location.
- It also has a apply button that allows a user to repeat a weather request for the location they already have searched for without requiring them to write the location again in the search bar, therefore adding convenience and contributing to better and more intuitive UX.

<br>

## `SelectedDayReport` Component (TODO)

> A detailed weather report of any selected day in the 7 day window. It changes when the user clicks on any one of the seven available weather days in the `WeatherDays` component.

<br>

## `WeatherDays` Component (TODO)

> A list/grid view of the 7-day weather period of a location. 3 days before present day, the present day, 3 days after present day (forecast).

<br>
