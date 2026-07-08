# Development Notes

## Data Flow and Other

We use resolved location data for two things:

1. <b>Search UI state</b> -> Shows which location from the search suggestions the user has selected. It can be cleared but shouldn't affect our weather component's tracking of what location it is currently showing weather for.
1. <b>Weather Data state</b> -> Shows which location's weather is shown on the web page.

## API Considerations

- Maybe adjust suggestion count from 5 to 10 to cater for common names (e.g. searching Williamsburg yields many results but not Williamsburg in Brooklyn which is a very well-known place interationally).

## Responsive Design:

- Todo: Use locations with long badge text (e.g. samos international airport) to see worst case badge size to guide setting of text-size for smaller viewports
- Todo: See how various searches affect auto-populated suggestion dropdown views on smaller viewports
