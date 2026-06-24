# JobSpark-AI

**AI-native, editorial-grade resume builder — Gemini powered. 100% client-side capable, with an optional Express backend.**

Live studio UI: Fraunces display + Outfit UI, Tailwind CSS v4, buttery Framer Motion, @react-pdf/renderer A4 export.

> JobSpark-AI — craft-first AI resume studio. Paste a JD → Generate with Gemini → export a beautiful, ATS-perfect PDF in 45 seconds.

---


- React 19 + Vite + Tailwind CSS v4
- Framer Motion, lucide-react, sonner
- @react-pdf/renderer — true A4 PDF, in-browser
- Gemini 2.5 Flash via `@google/genai` **direct from the browser**
- LocalStorage persistence — `jobspark_elite_v5`
- Zero backend, zero tracking

```
VITE_GEMINI_API_KEY=AIza...
npm run dev
npm run build   # → dist/index.html single-file, 689kb gzip
```

API key lives in `.env` (Vite). No key input shown in the UI.

---

## Option B — Full-Stack Express (secure API key)

Keep the exact same React UI — but route Gemini through a tiny Node/Express proxy so your API key never hits the browser.

```
jobspark-ai/
├─ src/                 # React frontend (unchanged)
├─ server/
│  ├─ index.js          # Express API
│  ├─ package.json
│  └─ .env.example
├─ README.md
└─ package.json
```

### server/index.js
```js
// server/index.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { GoogleGenAI } from '@google/genai'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body
    if(!prompt) return res.status(400).json({ error: 'prompt required' })
    const r = await ai.interactions.create({
      model: 'gemini-2.5-flash',
      input: prompt
    })
    // @ts-ignore
    const text = r.output_text || r?.steps?.find(s=>s.type==='model_output')?.content?.[0]?.text || ''
    res.json({ text })
  } catch(e){
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

app.get('/health', (_,res)=>res.json({ ok:true, time:new Date().toISOString() }))

const port = process.env.PORT || 8787
app.listen(port, ()=> console.log(`JobSpark API → http://localhost:${port}`))
```

### server/package.json
```json
{
  "name": "jobspark-ai-server",
  "type": "module",
  "version": "3.2.0",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "@google/genai": "^1.7.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```

### server/.env.example
```
GEMINI_API_KEY=AIza...
PORT=8787
# FRONTEND_URL=http://localhost:5173
```

### Frontend swap (1 line)
In `src/App.tsx`, replace the `callGemini` function:

```ts
// Option B
const callGemini = async (prompt: string) => {
  const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:8787/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  if(!res.ok) throw new Error('AI proxy failed')
  const { text } = await res.json()
  return text
}
```

Remove `VITE_GEMINI_API_KEY` from the frontend `.env`. Now the key lives only in `server/.env`.

Run both:
```
# terminal 1
cd server && npm i && npm run dev
# terminal 2
VITE_API_URL=http://localhost:8787 npm run dev
```

Deploy:
- Frontend → Vercel / Netlify / Cloudflare Pages
- API → Render / Railway / Fly.io / Cloud Run
Set `VITE_API_URL=https://api.jobspark.ai` in frontend env.

---

## Features

**Generate with Gemini — Option A card**
- Fraunces display headline: *Generate your resume with Gemini*
- Fields: Your name *, Email, Target role *, Target company / industry, Experience level, Location, Core skills, Target job description (JD)
- One button: **Generate with Gemini**
- No model picker, no API key field in UI

**Editor that’s actually visible**
- Strengths: Clear career positioning • ATS-friendly structure • Impact-first bullet strategy — 3 editorial cards, always visible
- Skills: Core skills • Tools • Soft — chips + “Add your most relevant skills” / “Type skill + Enter” empty state
- Education: “Add school or program” button, “Add degree, course, or training” empty state, Degree • School • Year • GPA inputs, all responsive
- Experience: verb-first XYZ bullets, per-bullet AI refine
- Projects, Certifications, Languages — all editable

**Live Preview**
- Right-rail editorial paper on desktop, slide-up drawer on mobile
- Real-time ATS score, bullet count, keyword fit
- @react-pdf/renderer A4 export, 1-page safe

**Tech**
- React 19, Vite 7, Tailwind CSS 4.1
- Framer Motion animations
- TypeScript, fully typed ResumeData
- sonner toasts
- localStorage autosave

---

## Getting Started

### Option A – Frontend only
```bash
git clone <repo>
cd jobspark-ai
npm install
echo "VITE_GEMINI_API_KEY=AIza..." > .env
npm run dev
# http://localhost:5173
```

### Option B – Full-stack
```bash
# API
cd server
cp .env.example .env
# edit GEMINI_API_KEY
npm install
npm run dev
# → http://localhost:8787

# Web
cd ..
echo "VITE_API_URL=http://localhost:8787" > .env
npm install
npm run dev
```

Build production:
```bash
npm run build   # outputs dist/index.html ~2.24MB (690kb gzip)
```

---

## .env

Frontend (Option A):
```
VITE_GEMINI_API_KEY=AIzaSy...
```

Frontend (Option B):
```
VITE_API_URL=https://api.your-domain.com
# no GEMINI key in frontend
```

Server (Option B):
```
GEMINI_API_KEY=AIzaSy...
PORT=8787
```

---

## Project Structure

```
src/
  App.tsx              # JobSpark-AI – full UI, PDF, Gemini
  main.tsx
  index.css            # @import "tailwindcss"
  vite-env.d.ts
public/
index.html             # JobSpark-AI — Next-gen AI Resume Builder
server/                # Option B
  index.js
  package.json
  .env.example
README.md
```

---

## License

MIT — build cool things, ship fast.

---

JobSpark-AI v5 • Editorial UI • Tailwind CSS • Gemini 2.5 Flash • @react-pdf/renderer
Made for makers who ship.
