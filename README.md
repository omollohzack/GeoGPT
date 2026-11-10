# GeoGPT

An interactive, map-based AI chatbot that answers location-specific questions — ask about places, areas, and locations in natural language and get AI-generated answers grounded in real-time Google Maps data.

## What it does

- Chat interface for location-based questions ("What's near…?", "Tell me about this area")
- Combines Google Gemini AI with Google Maps data for location-aware answers
- Built as a responsive single-page web app

## Tech stack

- React 19 + TypeScript
- Vite 6
- Google Gemini API (`@google/genai`)

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set your `GEMINI_API_KEY` in `.env.local`
3. Run the app:
   `npm run dev`

Other scripts: `npm run build` (production build), `npm run preview` (preview the build).

## Status

Working prototype. Feedback and ideas welcome via Issues.

---
Built by [Zacharia Omollo](https://github.com/omollohzack) — Full-Stack & Platform Engineer.
