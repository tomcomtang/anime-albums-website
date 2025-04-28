# Anime Albums Website Template

A modern, responsive anime album collection website template built with Next.js. This template provides a beautiful and interactive way to showcase your anime collection with features like video backgrounds, weather effects, and Live2D character interactions.

## Quick Deploy

[![Deploy to EdgeOne](https://camo.githubusercontent.com/6a94a67f6a020d5810ef905549fc5255bf99ccd09f17881b6855b332b579a364/68747470733a2f2f63646e7374617469632e74656e63656e7463732e636f6d2f656467656f6e652f70616765732f6465706c6f792e737667)](https://edgeone.ai/pages/new?template=anime-blog-demo1)

[More Templates](https://edgeone.ai/pages/templates)

You can quickly deploy this template to EdgeOne with just one click. The deployment process will automatically:
- Set up the Next.js environment
- Install all dependencies
- Configure the build settings
- Deploy to a production-ready environment

## Features

- 🎥 Dynamic video background carousel
- 🌤️ Interactive weather effects (rain, snow, sunny)
- 🎭 Live2D character with interactive responses
- 📱 Fully responsive design
- 🌐 Multi-language support
- 🎨 Dark/Light theme support
- 📂 Category-based gallery layouts
- 🔄 Infinite scroll loading
- 🖼️ Beautiful image modal with navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Live2D**: Live2D Widget
- **Data Source**: AniList GraphQL API

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TencentEdgeOne/pages-templates/examples/anime-albums-website.git
cd anime-albums-website
```

2. Install dependencies:
```bash
yarn install
```

3. Fetch initial anime data:
```bash
node scripts/fetch-anilist-data.js
```
This script will fetch anime data from AniList API and generate configuration files in the `public/data` directory.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

If you want to update the anime data every time you deploy, you can modify the build script in `package.json`:

```json
{
  "scripts": {
    "build": "node scripts/fetch-anilist-data.js && next build"
  }
}
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
```

## Customization

### Anime Data

The website uses JSON configuration files in the `public/data` directory for anime data. You can customize the content by:

1. Modifying the existing JSON files in `public/data`
2. Running the `fetch-anilist-data.js` script with different parameters
3. Creating your own JSON files following the same structure

### Live2D Character

The Live2D character configuration can be found in:
- `components/live2d/live2d-wrapper.tsx`
- `public/waifu-tips.json`

### Weather Effects

Weather effects can be customized in:
- `components/weather/weather-effects.tsx`
- `app/globals.css` (weather-related styles)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalization routes
│   ├── gallery/           # Gallery pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── gallery/          # Gallery components
│   ├── live2d/           # Live2D components
│   └── weather/          # Weather effect components
├── lib/                   # Utility functions
├── public/               # Static files
│   ├── data/            # Anime data JSON files
│   └── videos/          # Background videos
└── scripts/             # Utility scripts
    └── fetch-anilist-data.js  # Data fetching script
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Commercial Use

Before using this template for commercial purposes, please be aware of the following:

1. **AniList API Usage**:
   - The AniList API is free to use but has rate limits
   - For commercial use, review the [AniList API Terms of Service](https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting)
   - Consider implementing proper caching and rate limiting in your application

2. **Live2D Usage**:
   - Live2D models and technology are subject to their own licensing terms
   - For commercial use, you must comply with [Live2D's licensing terms](https://www.live2d.com/en/terms/)
   - You may need to obtain appropriate licenses for the Live2D models you use
   - Consider using your own Live2D models or obtaining proper commercial licenses

3. **Content Rights**:
   - Ensure you have the right to use any anime images, videos, or other content
   - Respect copyright holders' rights and obtain necessary permissions
   - Consider using only content you have the rights to use commercially

## License

This project is licensed under the MIT License. For commercial use, please refer to the licensing terms of [Live2D](https://www.live2d.com/en/terms/) and [AniList](https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting).

## References

- [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/) - Anime data source
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget) - Live2D integration
