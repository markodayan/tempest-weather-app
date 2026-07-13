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

- Large View (1280px and larger): `xl` and beyond [example: `xl:px-4`]
- Medium View (640px-1280px): `sm` to `xl` [example: `sm:px-2`]
- Small View (0-640px): Up to `sm` [example: `px-1`]
