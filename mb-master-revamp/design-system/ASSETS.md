# Assets in this bundle, and where they actually live

The Claude Design export ships an `assets/` directory. Most of it was already
in the repo, so it is not duplicated here:

| Bundle path | Already at |
|---|---|
| `assets/work/*.webp` (7 client screenshots) | `site/public/work/` |
| `assets/brand/{icon.svg,apple-icon.png}` | `site/public/` |
| `assets/fonts/{fraunces,cormorant,inter}.woff2` | `site/app/fonts/` |

Two files were genuinely new and are now in `site/public/`:

- `globe.webm` (1.2 MB) and `globe-poster.jpg`. The owner's earth footage,
  re-encoded from a 3840x2160 19 MB original to 620x620 for the homepage quote
  band. Per `readme.md`, it is the only moving image and the only photographic
  element on the site, which is what earns it the size. The 19 MB master is not
  in the repo and should be kept wherever the owner keeps originals.

When referencing an asset from a design file, point at the `site/public/` path,
not at a copy inside this directory.
