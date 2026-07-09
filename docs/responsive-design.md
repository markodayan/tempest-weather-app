# Viewport Thinking

> Look at https://css-tricks.com/snippets/css/media-queries-for-standard-devices/ for some target viewport dimensions to test for

# Decisions and Standards to follow

- Use Tailwind breakpoints but test for other sizes too.

# Notes

### Guidelines:

- Try specifiying screen size range instead of devices, then distinguish between retina and non-retina screens.
- For tablets just find overlap between samsung and ipad

Views to nail:

1. <b>Laptop</b>
   - Both retina and non-retina screens share same breakpoints, just different pixel ratios
2. <b>Tablet (portrait)</b>
   - potentially have different targets
3. <b>Tablet (landscape)</b>
   - potentially have different targets
4. <b>Phone (potrait)</b>
5. <b>Phone (landscape)</b>

### Tailwind Defaults (smallest breakpoint = 640px)

1. <b>sm<b>: `min width = 640px (40rem)`
2. <b>md<b>: `min width = 768px (48rem)`
3. <b>lg<b>: `min width = 1024px (64rem)`
4. <b>xl<b>: `min width = 1280px (80rem)`
5. <b>2xl<b>: `min width = 1536px (96rem)`

### Anecdotal Width Design Constraints

- <b>Mobile (portrait)</b>: Up to `767px`
- <b>Tablet (portrait)</b>: Between `768-1024px`
- <b>Laptop</b>: Between `1025-1440px`
- <b>Large Desktop</b>: `Larger than 1441px`

### CSSTricks other break points (just some more for specific viewport dimensions)

1. <b>Mobile</b>:
   - Potrait and Landscape: `min width = 375px` | `max width = 812px`
2. <b>Tablet (smaller)</b>:
   - Potrait: `width = 834px`
   - Landscape: `width = 1112px`
3. <b>Tablet (larger)</b>:
   - Potrait: `width = 1024px`
   - Landscape: `width = 1366px`

- <b></b>:
- <b></b>:
