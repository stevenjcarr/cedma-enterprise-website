# CEdMA Enterprise website

Static HTML and CSS with one small script (mobile menu and calendar filter), styled to the CEdMA Enterprise Rebrand Plan (V1, April 2026). Open index.html in a browser; no build step is needed.

## Brand implementation

- Colours: Deep Slate header, footer, and dark panels; Warm White body; Aged Amber for every call to action; Sage, Signal Blue, and Warm Grey as secondary colours. No pure black or pure white is used.
- Type: Cormorant Garamond for headings and the logotype, Albert Sans for body text and interface, DM Mono for dates, statistics, tags, and labels.
- assets/share.png is the LinkedIn and social preview image. The og:image tags point to https://cedma-enterprise.org/assets/share.png; change the domain if the site moves.
- Images: board headshots in assets/board/, award photos in assets/awards/, conference and venue photos in assets/events/, sponsor logos in assets/sponsors/.
- The agenda's "Print the full agenda" button prints every day with all session details, without the site header and footer.
- Sponsor logos are in assets/sponsors/, as supplied by each sponsor.
- Logo: the logomark variants are in assets/logomark/ (rgb, rgb-dark, black, white; SVG with PNG fallbacks). The site uses rgb-dark on its dark header and footer.
- All colours and fonts are variables at the top of css/styles.css.

## Accessibility adjustments to the palette

- Aged Amber buttons use Deep Slate text, since Warm White on amber is too low in contrast.
- Small amber text on Warm White uses a darker amber (#8C6420), and muted text uses #5A6472, because Aged Amber and Warm Grey are too light for text on Warm White.
- Inline links use Signal Blue; call-to-action links use Deep Slate with an Aged Amber underline.

## Before going live

- Search for "[" to find every placeholder.
- There are no forms: membership applications go by email to community@cedma-enterprise.org, and members-only content lives on the members site.
- Links set to href="#" need real destinations.
