# Paris Exhibitions

A Next.js website showing current & upcoming exhibitions across Paris's top museums and galleries, powered by Claude AI with live web search.

## Features

- Live exhibition data fetched via Claude + web search
- Filter by museum and status (Ongoing / Upcoming)
- Elegant editorial design with serif typography
- Links directly to official exhibition pages
- One-click refresh to re-fetch latest data

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env.local
```

Then open `.env.local` and replace `your_api_key_here` with your key from [console.anthropic.com](https://console.anthropic.com).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` as an environment variable in Vercel's project settings
4. Deploy

## Tech Stack

- **Next.js 15** — App Router
- **TypeScript**
- **Anthropic SDK** — Claude with web search tool
- **CSS Modules** — scoped styles, no dependencies

## Museums covered

- Louvre
- Musée d'Orsay
- Centre Pompidou
- Palais de Tokyo
- Musée Rodin
- Fondation Louis Vuitton
- Grand Palais
- Musée de l'Orangerie
- Musée Picasso
- Jeu de Paume
