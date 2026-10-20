# CEdMA Enterprise website

The public website for CEdMA Enterprise, at https://cedma-enterprise.org.

The site is static HTML and CSS, with one small script. There is no build step, framework, or database, so any web server that can serve files will run it. To preview it locally, open `index.html` in a browser or run a simple server from this folder (for example `python3 -m http.server`).

Members-only content (surveys, pulse results, newsletters, and SIG meeting pages) lives on the members site at https://members.cedma-enterprise.org, which is hosted separately on YourMembership. This site only links to it.

## Folder layout

| Path | Contents |
|---|---|
| `*.html` | One file per page (see the page list below) |
| `404.html` | Not found page. Uses root-absolute paths so it works at any URL depth |
| `css/styles.css` | All site styles. Brand colors, fonts, and spacing are variables at the top |
| `css/fonts.css` | `@font-face` rules for the self-hosted brand fonts |
| `js/main.js` | Mobile menu, calendar filter, and agenda tabs |
| `assets/fonts/` | Brand fonts as woff2 (Latin and Latin Extended subsets) |
| `assets/logomark/` | Logomark in rgb, rgb-dark, black, and white, as SVG with PNG fallbacks |
| `assets/logo/` | Full logo (logomark and wordmark) in rgb, rgb-dark, black, and white, as SVG and PNG. Not used by the site; kept here so other sites and documents can link to it |
| `assets/board/` | Board headshots |
| `assets/awards/` | Award winner photos |
| `assets/events/` | Conference and venue photos |
| `assets/speakers/` | Conference speaker photos, shown on the home page |
| `assets/sponsors/` | Sponsor logos, as supplied by each sponsor |
| `assets/share.png` | Social preview image used for LinkedIn and other link previews |
| `assets/favicon*`, `apple-touch-icon.png` | Browser and device icons |
| `robots.txt`, `sitemap.xml` | Search engine files |

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `research.html` | Research (surveys, pulse, and newsletters) |
| `events.html` | Conferences, including the agenda |
| `calendar.html` | Calendar of SIG meetings, workshops, and conferences |
| `sigs.html` | Special interest groups |
| `cttm.html` | CTTM certification |
| `about.html` | About us |
| `board.html` | The board |
| `awards.html` | Awards |
| `sponsors.html` | Sponsors |
| `membership.html` | Membership |
| `policies.html` | Policies, including contact details and the registered office |
| `code-of-conduct.html` | Member Code of Conduct |
| `terms.html` | Terms and Conditions |
| `privacy.html` | Privacy Policy |

## Deploying

Copy the whole folder to the web root. The server should:

- serve `404.html` for missing pages (in nginx, `error_page 404 /404.html;`)
- serve `.woff2` files as `font/woff2`
- send `X-Robots-Tag: noindex` on any test or staging copy, because `robots.txt` allows indexing

Redirects from the old site's URLs are handled in the nginx config, not here.

## Common updates

**Adding or changing a calendar entry.** Edit the lists in `calendar.html`. Each row has a `data-kind` of `sig`, `workshop`, or `conference`, which the filter buttons use. Move past events from the upcoming list to the past list.

**Changing conference dates or venue.** Update `events.html`, the calendar, and the home page. `events.html` also has structured data (the `application/ld+json` script in the head) listing each conference's dates and venue, which needs to match.

**Adding a newsletter or survey.** Add the link in `research.html`. Newsletter PDFs are hosted on the members site, so link to the file there.

**Changing sponsors.** Add the logo to `assets/sponsors/` and edit `sponsors.html`. Keep the section order: Annual, Booth, Conference and Innovation Award, then Tuesday drinks reception. Give each logo `width` and `height` attributes so the page doesn't shift while it loads.

**Changing board members.** Add a square headshot to `assets/board/` (named `firstname-lastname.jpg`) and edit `board.html`.

**Adding a page.** Copy an existing page so it keeps the header, footer, font links, and meta tags. Then update its `<title>`, meta description, canonical URL, and `og:url`, and add it to `sitemap.xml`.

**After any change,** update the `lastmod` date in `sitemap.xml` for the pages you changed.

**After changing CSS or JavaScript,** update the `?v=` number on that file's link in every page. Use the Unix timestamp of the change (run `date +%s`), so each update gets a new number even on the same day. Each file has its own number: `css/styles.css`, `css/fonts.css`, and `js/main.js`. A new number makes browsers fetch the new file instead of using an old copy from their cache.

## SEO

- Every page has its own title, meta description (120 to 155 characters), canonical URL, and Open Graph tags. Keep these up to date when page content changes.
- The home page has Organization structured data, including the LinkedIn page. The conferences page has Event structured data.
- Fonts are self-hosted, and the two main weights are preloaded. The site makes no requests to other servers, which keeps it fast and keeps the Privacy Policy accurate. If you add a third-party service, update `privacy.html`.
- Submit `sitemap.xml` in Google Search Console after launch.

## Brand

The site follows the CEdMA Enterprise Brand Guidelines (v2.2).

- **Colors.** Deep Slate for the header, footer, and dark panels. Warm White for the page background. Aged Amber for every call to action. Sage, Signal Blue, and Warm Grey as secondary colors. No pure black or pure white.
- **Type.** Cormorant Garamond for headings and the logotype, Albert Sans for body text and the interface, and DM Mono for dates, statistics, tags, and labels.
- **Logo.** The header and footer use the rgb-dark logomark on Deep Slate.
- **Writing.** Sentence case for headings, with proper names capitalized. US spelling with British grammar and punctuation, and the Oxford comma. Punctuation goes inside quotation marks only when it is part of the quote. No em or en dashes, and no emoji. Plain words.

### Accessibility adjustments

- Aged Amber buttons use Deep Slate text, because Warm White on amber is too low in contrast.
- Small amber text on Warm White uses a darker amber (`#8C6420`), and muted text uses `#5A6472`, because Aged Amber and Warm Grey are too light for text on Warm White.
- Inline links use Signal Blue. Call-to-action links use Deep Slate with an Aged Amber underline.

## Content rules

- No prices anywhere on the site.
- Contact is by email only, at community@cedma-enterprise.org. The only postal address is the registered office on the Policies page.
- There are no forms. Membership applications and sponsor enquiries go by email.
- The Terms and Conditions and the Member Code of Conduct are legal text. Change them only when the approved wording changes.
