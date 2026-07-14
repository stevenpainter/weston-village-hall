# Weston Parish Council — Website

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
git clone https://github.com/your-org/weston-parish
cd weston-parish

# Start dev server
hugo server -D

# Open http://localhost:1313
```

---

## Deployment (Cloudflare Pages)

1. Push this repo to GitHub
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create a new project → Connect to Git → select your repo
4. Set build settings:
   - **Build command:** `hugo --minify`
   - **Build output directory:** `public`
   - **Environment variable:** `HUGO_VERSION` = `0.147.0`
5. Deploy

Every push to `main` triggers a new build and deploy automatically (~30 seconds).

---

## CMS setup (Decap)

Decap CMS uses GitHub as a backend — editors commit content directly to the repo via the CMS interface.

1. In `static/admin/config.yml`, set `backend.repo` to your GitHub repo (`your-org/weston-parish`)
2. In the Cloudflare Pages dashboard, add the domain to your Cloudflare account
3. Set up [Cloudflare Access](https://one.cloudflare.com/) to protect `/admin`:
   - Create an Access Application for `yourdomain.com/admin`
   - Add allowed email addresses for each editor
4. Editors visit `yourdomain.com/admin`, authenticate with their email, and can manage content

For more granular roles (e.g. hall committee can only see events), Decap CMS supports this via Netlify Identity — switch the backend to `netlify` and configure roles there if needed.

---

## Accessibility

This site is built to WCAG 2.2 AA and GDS accessibility standards.

- Run `npx axe-cli https://localhost:1313` to automated-check any page
- Test keyboard navigation manually before each release
- Test with VoiceOver (macOS: Cmd+F5) on key journeys:
  - Homepage → Minutes → open a year → download a PDF
  - Homepage → Village Hall → Events
  - Mobile nav toggle
- The accessibility statement lives at `/accessibility/` and must be updated when the site changes

### Automated testing in CI

Add to your Cloudflare Pages build or a GitHub Action:

```bash
npm install -g @axe-core/cli
hugo --minify
axe http://localhost:1313 --exit
```

---

## Content management

### Adding meeting minutes

1. Go to `yourdomain.com/admin`
2. Click **Minutes & Agendas** → **New Meeting**
3. Set the date, meeting type, and status (Agenda Only)
4. Upload the agenda PDF
5. Save and publish — the page rebuilds in ~30 seconds
6. After the meeting, come back to the same entry, upload the minutes PDF, change status to **Draft Minutes**, save
7. Once approved at the next meeting, change status to **Minutes Approved**

### Adding village hall events

1. Click **Village Hall Events** → **New Event**
2. Fill in title, date/time, type, and description
3. Save — it appears on the events page automatically
4. Past events collapse into the "Past events" accordion automatically

---

## File structure

```
weston-parish/
├── config.yaml              # Hugo config and menus
├── content/                 # All CMS-managed content (Markdown + front matter)
│   ├── _index.md            # Home page
│   ├── village-hall/
│   ├── minutes/
│   ├── news/
│   ├── notices/
│   ├── councillors/
│   ├── finance/
│   ├── publications/
│   └── accessibility.md
├── layouts/                 # Hugo HTML templates
│   ├── _default/
│   ├── partials/            # Reusable fragments (head, header, footer, pdf-link)
│   ├── minutes/
│   ├── village-hall/
│   └── news/
├── assets/
│   ├── css/                 # Modular CSS (processed by Hugo Pipes)
│   └── js/                  # Accessible nav toggle
└── static/
    ├── admin/               # Decap CMS entry point
    └── uploads/             # Editor-uploaded PDFs and images
```
