# Weston Village Hall — Website

Hugo + Sanity CMS + Cloudflare.

## Stack

| Layer    | Technology               | Cost      |
|----------|--------------------------|-----------|
| SSG      | Hugo                     | Free      |
| CMS      | Sanity                   | Free tier |
| Hosting  | Cloudflare (Workers)     | Free      |
| Domain   | Your existing domain     | ~£10/yr   |

## Prerequisites

- [Hugo](https://gohugo.io/installation/) v0.147.0+
- A GitHub account and repository
- A Cloudflare account
- A Sanity account (free) — already set up for this project

---

## Local development

```bash
# Clone the repo
git clone https://github.com/stevenpainter/weston-village-hall
cd weston-village-hall

# You need a Sanity read token to fetch content locally — ask the project owner,
# then put it in .env.local (gitignored, never commit this file):
echo 'HUGO_SANITY_TOKEN=your-token-here' > .env.local

# Start dev server
set -a; source .env.local; set +a
hugo server -D

# Open http://localhost:1313
```

---

## Deployment (Cloudflare)

Cloudflare's dashboard deploys Git-connected static sites as **Workers with static assets**. The build output directory is configured in `wrangler.jsonc` (`assets.directory`), not a dashboard field.

1. Push this repo to GitHub
2. In the Cloudflare dashboard: **Compute (Workers) → Create → Import a repository**
3. Select this repo and configure:
   - **Build command:** `hugo --minify`
   - **Environment variables:**
     - `HUGO_VERSION` = `0.147.0`
     - `HUGO_SANITY_TOKEN` = *(the Sanity read token — mark as Secret)*
   - **Path:** leave as `/` (this isn't a monorepo)
4. Deploy

Every push to `main`, **and every publish in Sanity Studio** (via a webhook, see below), triggers a new build and deploy.

### Sanity → Cloudflare rebuild webhook

So that publishing content actually updates the live site:

1. In Cloudflare: your Worker's settings → **Deployments** → find the **Deploy Hook** URL (or create one)
2. In Sanity: [manage.sanity.io](https://manage.sanity.io) → this project → **API** → **Webhooks** → **Create webhook**
   - URL: the Cloudflare deploy hook URL
   - Trigger on: **Create**, **Update**, **Delete**
   - Dataset: `production`
3. Save — from now on, hitting Publish in the Studio triggers a rebuild (~30–60 seconds)

---

## CMS setup (Sanity)

Content is edited at **https://weston-village-hall.sanity.studio/** — a login screen editors reach directly, with no connection to this repo or GitHub.

### Inviting an editor

1. Go to [manage.sanity.io](https://manage.sanity.io) → this project → **Members** → **Invite members**
2. Enter their email address and assign a role (**Editor** — can create/edit/publish content, can't change project settings)
3. They'll get an email invite and can sign in with email/password or Google/GitHub — no GitHub repo access needed

### How content fetching works

The dataset is **private** — Hugo fetches content at build time using a **read-only** API token (`HUGO_SANITY_TOKEN`, set as a Cloudflare build secret, never committed to the repo). This token can only read, not write, so it's safe to use in the build environment.

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

All content is edited at **https://weston-village-hall.sanity.studio/**:

- **Home, About, Facilities, Contact** — single-item pages, click through and edit the fields directly
- **Events — Regular Activities** — edit the intro text or the list of regular activities (Coffee Morning, Craft Group, etc.)
- **Events** — a normal list; click **New Event** to add a one-off event (date, type, description). It appears on the Events page automatically after the next rebuild, and past events collapse into the "Past events" accordion automatically

---

## File structure

```
weston-village-hall/
├── config.yaml                 # Hugo config, menu, Sanity project ID/dataset
├── wrangler.jsonc               # Cloudflare Workers static-assets config
├── content/                    # Minimal page stubs (routing only — actual text lives in Sanity)
│   ├── _index.md                # Home page
│   ├── about.md
│   ├── facilities.md
│   ├── contact.md
│   └── events/_index.md
├── layouts/                    # Hugo HTML templates
│   ├── _default/
│   ├── partials/                  # Reusable fragments, incl. sanity-data.html (fetches all content)
│   ├── index.html                 # Home page template
│   └── events/
├── assets/
│   ├── css/                       # Modular CSS (processed by Hugo Pipes)
│   └── js/                        # Accessible nav toggle
├── static/
│   └── _headers                   # Cloudflare response headers (security, caching)
└── studio/                     # Sanity Studio (the CMS admin app)
    ├── schemaTypes/                # Content model: home, about, facilities, contact, eventsIndex, event
    ├── structure.js                # Custom Studio navigation (singleton pages + Events list)
    └── sanity.config.js
```
