# Weston Village Hall — Website

Hugo + Decap CMS + Cloudflare Pages.

## Stack

| Layer    | Technology               | Cost      |
|----------|--------------------------|-----------|
| SSG      | Hugo                     | Free      |
| CMS      | Decap CMS                | Free      |
| Hosting  | Cloudflare Pages         | Free      |
| Auth     | Cloudflare Access        | Free      |
| Domain   | Your existing domain     | ~£10/yr   |

## Prerequisites

- [Hugo](https://gohugo.io/installation/) v0.147.0+
- A GitHub account and repository
- A Cloudflare account

---

## Local development

```bash
# Clone the repo
git clone https://github.com/stevenpainter/weston-village-hall
cd weston-village-hall

# Start dev server
hugo server -D

# Open http://localhost:1313
```

---

## Deployment (Cloudflare)

Cloudflare's dashboard now deploys Git-connected static sites as **Workers with static assets** rather than classic Pages projects. The build output directory is configured in `wrangler.jsonc` (`assets.directory`), not a dashboard field.

1. Push this repo to GitHub
2. In the Cloudflare dashboard: **Compute (Workers) → Create → Import a repository**
3. Select this repo and configure:
   - **Build command:** `hugo --minify`
   - **Environment variable:** `HUGO_VERSION` = `0.147.0`
   - **Path:** leave as `/` (this isn't a monorepo)
4. Deploy

Every push to `main` triggers a new build and deploy automatically.

---

## CMS setup (Decap)

Decap CMS uses GitHub as a backend — editors commit content directly to the repo via the CMS interface.

1. In `static/admin/config.yml`, `backend.repo` is already set to `stevenpainter/weston-village-hall`
2. Set up [Cloudflare Access](https://one.cloudflare.com/) to protect `/admin`:
   - Create an Access Application for `yourdomain.com/admin`
   - Add allowed email addresses for each editor
3. Editors visit `yourdomain.com/admin`, authenticate with their email, and can manage content

---

## Accessibility

The site uses accessible markup (skip link, landmark roles, keyboard-navigable nav toggle) and the Atkinson Hyperlegible font, but there is currently no published accessibility statement page.

- Run `npx axe-cli https://localhost:1313` to automated-check any page
- Test keyboard navigation manually before each release

### Automated testing in CI

Add to your Cloudflare build or a GitHub Action:

```bash
npm install -g @axe-core/cli
hugo --minify
axe http://localhost:1313 --exit
```

---

## Content management

### Adding an event

1. Go to `yourdomain.com/admin`
2. Click **Events** → **New Event**
3. Fill in title, date/time, type, and description
4. Save — it appears on the Events page automatically
5. Past events collapse into the "Past events" accordion automatically

### Editing regular activities (Coffee Morning, Craft Group, etc.)

1. Click **Pages** → **Events — Regular Activities**
2. Edit the intro text or the list of regular activities
3. Save and publish

### Editing Home, About, Facilities, or Contact

1. Click **Pages** → the page you want to edit
2. Edit the body text
3. Save and publish

---

## File structure

```
weston-village-hall/
├── config.yaml               # Hugo config and menu
├── wrangler.jsonc             # Cloudflare Workers static-assets config
├── content/                  # All CMS-managed content (Markdown + front matter)
│   ├── _index.md              # Home page
│   ├── about.md
│   ├── facilities.md
│   ├── contact.md
│   └── events/
│       ├── _index.md          # Intro + regular activities
│       └── ...                # Individual events, created via the CMS
├── layouts/                  # Hugo HTML templates
│   ├── _default/
│   ├── partials/               # Reusable fragments (head, header, footer)
│   ├── index.html              # Home page template
│   └── events/
├── assets/
│   ├── css/                    # Modular CSS (processed by Hugo Pipes)
│   └── js/                     # Accessible nav toggle
└── static/
    ├── _headers                # Cloudflare response headers (security, caching)
    ├── admin/                  # Decap CMS entry point
    └── uploads/                # Editor-uploaded images
```
