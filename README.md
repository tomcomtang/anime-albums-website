# Anime Albums Website Template

A modern, responsive anime album collection website template built with Next.js. This template provides a beautiful and interactive way to showcase your anime collection with features like video backgrounds, weather effects, and Live2D character interactions.

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
git clone https://github.com/tomcomtang/anime-albums-website.git
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

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 tomcomtang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- [AniList](https://anilist.co/) for providing the anime data API
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget) for the Live2D integration
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
