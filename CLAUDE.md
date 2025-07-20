# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm install` - Install dependencies

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your Gemini API key to the `GEMINI_API_KEY` variable
3. Server runs on port 3001 by default (configurable via PORT env var)

## Architecture Overview

This is a full-stack web application for translating song lyrics to Italian and generating Instagram posts:

### Backend (server.js)
- Express server with two main API endpoints:
  - `POST /translate` - Uses Google Gemini AI to translate lyrics with special formatting
  - `POST /generate-metadata` - Creates Instagram captions with hashtags
- Integrates with Google's Generative AI (@google/generative-ai) using gemini-2.0-flash model
- Translation prompt format expects `[ORIGINAL]...[/ORIGINAL][ITALIAN]...[/ITALIAN]` sections separated by `|||`

### Frontend (public/)
- Vanilla JavaScript SPA with component-based architecture
- **app.js**: Main UI component with theme selector, input forms, and post preview grid
- **actions.js**: API calls, image generation (html2canvas), and slide editing functionality
- **index.html**: Base HTML structure with external dependencies (html2canvas, JSZip)
- **style.css**: Responsive CSS with gradient themes and Instagram-optimized styling

### Key Features
- 5 predefined gradient themes (sunset, ocean, forest, night, rose)
- Generates up to 10 Instagram post slides (1080x1080px)
- Inline slide editing with save/cancel functionality
- Dual-language display (original + Italian translation)
- ZIP download with numbered files
- Canvas-based image export using html2canvas

### Data Flow
1. User inputs lyrics and artist info
2. Frontend sends to `/translate` endpoint
3. Gemini AI returns formatted translation with original/Italian pairs
4. Frontend parses response and populates 10 post slides
5. Users can edit individual slides inline
6. Export generates high-res images via html2canvas

### External Dependencies
- Google Generative AI for translation
- html2canvas for image generation
- JSZip for bulk downloads (loaded via CDN)
- Inter font from Google Fonts

## Important Implementation Notes

- Translation responses are parsed using regex to extract `[ORIGINAL]` and `[ITALIAN]` sections
- Slide editing maintains separate textareas for original and translated content
- Export functionality temporarily clones slides with modified styling for optimal image quality
- Theme switching updates all slides in real-time using CSS custom properties