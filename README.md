# Stillroom

Stillroom is a finished, all-English comfort-character response website. A visitor enters a character name, presses Enter or **Get a reply**, and receives one to three carefully written lines.

## Content library

- 88 character profiles across anime, games, and animation
- 30 character-specific responses per profile (2,640 total)
- 640 complete universal responses
- Common aliases, case-insensitive matching, diacritic normalization, and conservative typo tolerance
- If a character is found, replies blend that character’s pool with the universal pool. If not, replies use only the universal pool.

The complete library and profile schema live in `app/data.ts`. All generation happens in the browser; names and replies are not sent anywhere or saved.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify a production build

```bash
npm run build
```

## Deploy

The project is ready for OpenAI Sites and Cloudflare Worker-compatible hosting. Its deployment configuration is in `.openai/hosting.json`. It can also be adapted to any host that supports the included vinext/Vite build.

## Accessibility and behavior

- Fully keyboard-operable form and suggestions
- Visible semantic labels and live reply announcements
- Responsive layouts for phone, tablet, and desktop
- Honors the operating system’s reduced-motion preference
- No emoji, accounts, tracking, or local storage

## Important note

Stillroom is a creative comfort tool, not professional mental health support. The interface includes a crisis-support reminder and does not represent or reproduce official character dialogue.
