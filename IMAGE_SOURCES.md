# IMAGE_SOURCES.md - NOIRVALE Fragrances

This ledger tracks the local, self-hosted fragrance imagery currently used by the NOIRVALE storefront.

All catalogue and editorial assets are local files under `public/noirvale/`. The source assets were generated for the project, kept as PNG originals, and then optimized to WebP for runtime use. No remote Unsplash catalogue URLs remain in the live code path.

## Live Product Assets

| Product | Source PNG | Runtime WebP | Source note |
| --- | --- | --- | --- |
| Noir Reserve | `public/noirvale/noir-reserve.png` | `public/noirvale/products/noir-reserve/main.webp` | Original local generated asset used for the flagship dark bottle; WebP derivative serves the storefront |
| Imperial Oud | `public/noirvale/imperial-oud.png` | `public/noirvale/products/imperial-oud/main.webp` | Original local generated asset used for the oud hero; WebP derivative serves the storefront |
| Azure Night | `public/noirvale/products/azure-night/main.png` | `public/noirvale/products/azure-night/main.webp` | Original local generated asset for the cool blue profile; optimized for runtime delivery |
| Ember Woods | `public/noirvale/products/ember-woods/main.png` | `public/noirvale/products/ember-woods/main.webp` | Original local generated asset for the warm woody profile; optimized for runtime delivery |
| Atlas Noir | `public/noirvale/products/atlas-noir/main.png` | `public/noirvale/products/atlas-noir/main.webp` | Original local generated asset for the dark stone-and-spice profile; optimized for runtime delivery |
| Royal Vetiver | `public/noirvale/products/royal-vetiver/main.png` | `public/noirvale/products/royal-vetiver/main.webp` | Original local generated asset for the clean vetiver profile; optimized for runtime delivery |
| Midnight Saffron | `public/noirvale/products/midnight-saffron/main.png` | `public/noirvale/products/midnight-saffron/main.webp` | Original local generated asset for the saffron-forward evening profile; optimized for runtime delivery |
| Silver Coast | `public/noirvale/products/silver-coast/main.png` | `public/noirvale/products/silver-coast/main.webp` | Original local generated asset for the fresh aquatic profile; optimized for runtime delivery |
| Cedar Dominion | `public/noirvale/products/cedar-dominion/main.png` | `public/noirvale/products/cedar-dominion/main.webp` | Original local generated asset for the cedar profile; optimized for runtime delivery |
| Amber Code | `public/noirvale/products/amber-code/main.png` | `public/noirvale/products/amber-code/main.webp` | Original local generated asset for the amber profile; optimized for runtime delivery |
| Black Cypress | `public/noirvale/products/black-cypress/main.png` | `public/noirvale/products/black-cypress/main.webp` | Original local generated asset for the green/dark profile; optimized for runtime delivery |
| Velvet Smoke | `public/noirvale/products/velvet-smoke/main.png` | `public/noirvale/products/velvet-smoke/main.webp` | Original local generated asset for the smoke/tobacco profile; optimized for runtime delivery |

## Live Collection Assets

| Collection | Source PNG | Runtime WebP | Source note |
| --- | --- | --- | --- |
| Oud & Amber | `public/noirvale/collections/oud-amber.png` | `public/noirvale/collections/oud-amber.webp` | Original local generated asset; WebP derivative serves the storefront |
| Fresh & Aquatic | `public/noirvale/collections/fresh-aquatic.png` | `public/noirvale/collections/fresh-aquatic.webp` | Original local generated asset; WebP derivative serves the storefront |
| Woods & Earth | `public/noirvale/collections/woody-earthy.png` | `public/noirvale/collections/woody-earthy.webp` | Original local generated asset; WebP derivative serves the storefront |
| Spice & Oriental | `public/noirvale/collections/spicy-oriental.png` | `public/noirvale/collections/spicy-oriental.webp` | Original local generated asset; WebP derivative serves the storefront |
| Evening Intense | `public/noirvale/collections/evening-intense.png` | `public/noirvale/collections/evening-intense.webp` | Original local generated asset; WebP derivative serves the storefront |

## Supporting Editorial Assets

| Usage | Source PNG | Runtime WebP | Note |
| --- | --- | --- | --- |
| Homepage hero | `public/noirvale/noir-reserve.png` | `public/noirvale/products/noir-reserve/main.webp` | The hero reuses the optimized Noir Reserve image at runtime |
| Editorial banner | `public/noirvale/products/velvet-smoke/main.png` | `public/noirvale/products/velvet-smoke/main.webp` | The banner reuses the optimized Velvet Smoke image at runtime |
| Social / OG fallback | `public/noirvale/products/imperial-oud/main.png` | `public/noirvale/products/imperial-oud/main.webp` | The default share image reuses the optimized Imperial Oud image at runtime |

## Audit Notes

- The live runtime image set is self-hosted and now served from optimized WebP files.
- Original PNG source files are retained for provenance and future asset iteration.
- No external attribution file is required for these generated originals.