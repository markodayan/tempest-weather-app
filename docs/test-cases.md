# Testing (Described in terms of UX)

> Basically, am going to write a lot of scenarios here when using the app to potentially inspire test cases for Playwright later.

- <u>When the 'Apply and refresh' button should appear</u>: If there is no current search submitted (either page is first loaded, or the search was cancelled/reset in the search bar) and the user is toggling preferences, the 'Apply and refresh' button should not appear at all regardless of how you change the preferences. A change to preferences should compare a
  - <b>Example 1 [no preference change made before search -> `button doesnt appear after search submission`] </b>: I make no changes to preferences, then write my search term and select my location.

  - <b>Example 2 [preference change made before search -> `button doesnt appear after search submission`]</b>: I change the temperature preference, then write my search term and select my location. The 'Apply and refresh' button should not appear after submitting the search.

  - <b>Example 3 [preference change after search -> `button appears`]</b>: I make no change to preferences, then write my search term and select my location.

## Preferences behaviour

### Test Case 1: Confirm app with no cached preferences loads default preferences

Preferences are initialised with cached values on app start. If there are no cached values, they are set to the default state (`DEFAULT_PREFERENCES`).

Steps to test:

1. Load the application on the browser.
2. Confirm preferences are the same values as `DEFAULT_PREFERENCES`

### Test Case 2: Confirm app loads cached preferences (if they exist)

Preferences are initialised with cached values on app start. If there are no cached values, they are set to the default state (`DEFAULT_PREFERENCES`).

Steps to test:

1. Load the application on the browser.
2. Confirm there are cached preferences.
3. Confirm that the preferences shown in the UI match the cached preferences.

### Test Case 3: Confirm that selecting new preferences and then submitting a search for a new location after updates the new preferences.

Users can toggle preferences at any time, but they are only applied upon submitting a new search request (selecting a search option in the search bar or, in the case of wanting to change units on a location you are already viewing weather for, clicking the "Apply and refresh" button to make a request for the same location but with updated unit preferences).

Steps to test:

1. Change your preferences (e.g. changing temperature from `°C` to `°F`).
2. Search for a location (e.g. `'Bantry Bay'`).
3. Confirm the preferences match your changes made prior to submitting the search query.

### Test Case 4: Confirm that selecting new preferences after a previously-done search and clicking the 'Apply and refresh' button, updates the preferences

If a user searched for Location A with preference selections X and they now want to change their preference selections to Y, they should be able to use the 'Apply and refresh' button which will update their preferences (it also will initiate a weather API call but that is not done yet)

Steps to test:

1. Search for a location (e.g. `'Bantry Bay'`) hence resolving the location.
2. Change the preferences (e.g. changing temperature from `°C` to `°F`).
   - <b>The 'Apply and refresh' button should appear</b>.
3. Clicking the 'Apply and refresh' button.
   - <b>Clicking this should alter the state of preferences</b>

### Test Case 5: Selecting different preferences (without saving them) and then refreshing browser page does not update preferences

If a user searched for location A with preferences X and selects different preferences (without submitting) causing the 'Apply and refresh' button to appear but changes their mind and selects their same preferences again, the button should disappear therefore showing that the app sees there is no longer a change in the preferences object.

Steps to test:

1. Search for a location (e.g. `'Bantry Bay'`) and click the drop-down for it.
   - <b>No 'Apply and refresh' button should be available </b>
2. Click different radio inputs from what was previously there (e.g. changing wind speed from `km/h` to `mph`).
   - <b>This action should make the 'Apply and refresh' button appear</b>
3. Reverse the changes you did in Step 2 (e.g. changing wind speed back to `km/h` manually again)
   - <b>This action should make the 'Apply and refresh' button disappear</b>

### Test Case 7: Go through the above test cases, and for ones involving search, confirm whether updated preference state consistently yields the expected unit changes in the Weather data results.

Todo

### Todo

If I search for location A and get its weather displayed, I should be able to clear the search bar and the weather for location A still showing.

We now have an empty search bar and weather for Location A still showing. So how should we deal with preferences. What we can maybe do is update the button text from 'Apply and refesh' to 'Apply For Current Location'.

If we did not reset the search bar, we should just leave it as 'Apply and refresh'

Ideally, we want the button size to be proportionally the same for the button irrespective of the label text, so maybe we need to set some min width or something like that
