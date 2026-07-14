# Viewport Thinking

> Look at https://css-tricks.com/snippets/css/media-queries-for-standard-devices/ for some target viewport dimensions to test for

# Decisions and Standards to follow

- Use Tailwind breakpoints but test for other sizes too.

# Notes

### Guidelines:

- Try specifiying screen size range instead of devices, then distinguish between retina and non-retina screens.
- For tablets just find overlap between samsung and ipad

### Tailwind Defaults (smallest breakpoint = 640px)

1. <b>sm</b>: `min width = 640px (40rem)`
2. <b>md</b>: `min width = 768px (48rem)`
3. <b>lg</b>: `min width = 1024px (64rem)`
4. <b>xl</b>: `min width = 1280px (80rem)`
5. <b>2xl</b>: `min width = 1536px (96rem)`

### Responsive scheme am going to apply

Superseded for `WeatherDays` (see below) - still applies elsewhere in the app.

- Large View (1280px and larger): `xl` and beyond [example: `xl:px-4`]
- Medium View (640px-1280px): `sm` to `xl` [example: `sm:px-2`]
- Small View (0-640px): Up to `sm` [example: `px-1`]

### WeatherDays cards: continuous scaling instead of tiers

Rather than three discrete tiers, `WeatherDays` tile sizing (icon, date font-size,
vertical padding) scales continuously between `md` (768px) and `xl` (1280px) via
CSS `clamp()`-based theme tokens (`--spacing-day-card-icon`, `--spacing-day-card-py`,
`--text-day-card-label` in `src/index.css`). Each token is
`clamp(value-at-md, <linear-interpolation>, value-at-xl)` - clamp's own floor holds
every value at its md-size once the viewport drops below 768px, so no separate
breakpoint-gated CSS is needed to "freeze" sizing.

Below `md`, tile width is fixed (`--spacing-day-card-frozen-width`) and the row
becomes horizontally scrollable (`overflow-x-auto`) instead of shrinking further or
wrapping to a grid. From `md` up, tiles use `flex-1` to fill the row evenly.

The date label still swaps *content* (not size) at `md` - full "Fri 10 Jul" from
`md` up, compact "Fri 10" below `md` - since text content can't fluidly interpolate
the way a numeric size can.
