# JobSpark-AI

An editorial-style, AI-powered resume builder that generates tailored, ATS-friendly resumes with Google Gemini — entirely in the browser.

Paste a job description, fill in a few details, and Gemini writes your summary, experience, skills, projects, and more. Edit everything in a live preview, then export a clean A4 PDF.

![JobSpark-AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6) ![Vite](https://img.shields.io/badge/Vite-7-646CFF)

## Features

- **AI resume generation** — Gemini 2.5 Flash builds a full resume from your name, target role, experience level, skills, and optional job description
- **Live preview** — See changes instantly in a polished, two-column resume layout
- **Manual editor** — Fine-tune personal info, summary, experience, education, and skills after generation
- **ATS score** — Heuristic score based on summary length, experience depth, skills, and impact verbs
- **PDF export** — Download an ATS-clean, one-page-safe A4 PDF via `@react-pdf/renderer`
- **Local-first** — Resume data persists in `localStorage`; no backend or account required
- **Mobile-friendly** — Responsive layout with a slide-up preview drawer on smaller screens

## Tech Stack

| Layer | Tools |
|-------|-------|
| UI | React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide icons |
| AI | Google Gemini API (`@google/genai`) |
| PDF | `@react-pdf/renderer` |
| Build | Vite 7, `vite-plugin-singlefile` |
| UX | Sonner toasts |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (for AI generation)

### Installation

```bash
git clone https://github.com/your-username/Jobspark-ai-resume-builder.git
cd Jobspark-ai-resume-builder
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Restart the dev server after adding or changing the key.

> **Note:** The API key is exposed to the browser via Vite's `import.meta.env`. For production, consider proxying requests through a backend to keep the key private.

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

The build uses `vite-plugin-singlefile` to bundle the app into a single HTML file for easy deployment.

## Usage

1. **Generate** — Enter your name and target role in the AI Generator panel. Optionally paste a job description for keyword matching, then click **Generate with Gemini**.
2. **Edit** — Update personal details, summary, experience bullets, education, and skills in the left column.
3. **Preview** — Watch the live resume preview update on the right (desktop) or tap **Preview** on mobile.
4. **Export** — Click **Export PDF** in the header to download your resume.

Use **Load demo** to explore a sample resume, or **Reset** to start from a blank slate.

## Project Structure

```
Jobspark-ai-resume-builder/
├── index.html              # App entry HTML
├── vite.config.ts          # Vite + Tailwind + single-file plugin
├── src/
│   ├── main.tsx            # React root
│   ├── App.tsx             # Main app: AI generation, editor, preview, PDF
│   ├── index.css           # Tailwind imports
│   ├── vite-env.d.ts       # Vite env types (VITE_GEMINI_API_KEY)
│   └── utils/
│       └── cn.ts           # Class name utility
└── package.json
```

## Privacy

- All resume data is stored locally in the browser (`localStorage` key: `jobspark_elite_v5`)
- No server-side storage or analytics
- AI requests go directly from your browser to Google's Gemini API using your API key

## License

This project is private. Add a license file if you plan to open-source it.
