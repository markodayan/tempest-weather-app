# Image Guidelines

Guidelines for the `Landing` component's city suggestion card images and the
`DayPreview` mood-background banners (and any similar photographic/graphic
assets added later). These two sets have different aspect ratios/dimensions
(see below) but share the same format/compression conventions.

## Landing suggestion cards

### Aspect ratio

Use one consistent ratio across every card image — **4:3 or 3:2 (landscape)**.
Most city/skyline photography is naturally composed in landscape, so this
avoids cropping off too much vertically the way a very wide 16:9 banner
would.

Cards render via `background-image` + `bg-cover` (or an `<img>` with
`object-cover`), which crops/scales to fit the card's CSS size regardless of
the source image's exact dimensions — mismatched source sizes won't break
the layout. But `bg-cover` isn't content-aware; it just crops whatever
overflows the target box. So picking photos that already roughly match the
target ratio still matters, to avoid accidentally cropping out the
skyline/landmark that makes each photo recognizable.

### Dimensions

These are small thumbnail cards, so source images don't need to be huge.
Target roughly **800x600px at 4:3** (or the equivalent at 3:2) — about 2x the
size the card actually renders at on screen, which covers retina/high-DPI
displays without wastefully oversized files.

## DayPreview mood-background banners

### Aspect ratio

**5:2 (2.5:1)** — matches the `aspect-5/2` set on the component. Doesn't need
to be pixel-exact the way the Landing cards do, since these are abstract
gradient/mood images rather than literal landmark photos - there's nothing
specific `bg-cover` could crop out by accident here.

### Dimensions

This renders as a full-width banner, not a small tile - it can be up to
~1280px wide on large desktop screens (`max-w-7xl` at the `xl:` breakpoint).
Following the same "roughly 2x for retina" rule as above puts the target
source size at roughly **2400x960 to 2560x1024px**. That's bigger than the
Landing card images, but since these are smooth gradients rather than busy
photographic detail, they should compress to a much smaller file size at
that resolution than a real photo would - likely well under 30KB each even
at full size.

### Mood categories

Six buckets, mapped from Open-Meteo's WMO weather codes in
`src/lib/weatherBackground.ts` - see that file for the exact code → bucket
mapping and the reasoning behind each grouping. Live in `public/day-preview/`:

- `clear.webp`
- `partly-cloudy.webp`
- `cloudy.webp`
- `rainy.webp`
- `snowy.webp`
- `stormy.webp`

## Format: WebP, not PNG

**Use WebP.** PNG is a lossless format best suited for flat-color
graphics/icons/screenshots, not photographs — for photos, PNG produces
needlessly large files (often 300KB-1MB+) for detail differences the human
eye can't actually distinguish from a well-compressed lossy format. WebP
gives better compression than JPEG at equivalent visual quality.

**Browser support is not a concern.** As of 2026, WebP has ~96-97% global
browser support; the only non-supporters are Internet Explorer and
pre-2020 (pre-Big Sur) Safari versions. No `<picture>`/fallback needed for
this project.

If WebP tooling is ever inconvenient, JPEG is a reasonable fallback —
still lossy and universally supported, just somewhat larger files than WebP
for the same visual quality. Avoid PNG for photographic content either way.

## Compression

Compress every image before adding it to the repo — these load on the very
first thing a visitor sees, so slow images here directly undercut the first
impression the landing page is meant to create.

[Squoosh](https://squoosh.app) (Google's browser-based tool, no
upload/account needed) is the easiest way to do this by hand for a small,
fixed set of images like these 6-8 city photos. Target roughly **30-80KB per
image** at the dimensions above — very achievable without visible quality
loss.

**Converting to WebP *is* the compression step — they aren't two separate
passes.** Tools like Squoosh take the original image and encode it directly
to WebP with a quality setting in one operation; that single step does both
the format conversion and the lossy compression at once (the same way a
JPEG encoder compresses and formats simultaneously). Always start from the
highest-quality, least-processed version of the source image you have, not
one that's already been compressed by something else first — stacking two
rounds of lossy compression (e.g. re-encoding an already-compressed JPEG
into WebP) compounds artifacts for no benefit, instead of just costing you
once. One image → one WebP export at the target quality/size → done.

## Sourcing

Not yet decided: whether images come from a stock source with a license
already confirmed, or are sourced fresh. Whichever it is, keep the license
terms compatible with a public portfolio project - update this doc with the
source/license once settled.
