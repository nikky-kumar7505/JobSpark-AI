import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import {
  Sparkles, Wand2, Download, Eye, Briefcase, GraduationCap,
  Mail, Phone, MapPin, Globe, Link2, Trash2, Check, X,
  Zap, Layers, User2, Lightbulb, Target, BadgeCheck, ShieldCheck
} from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

/* ── Seed ── */
const blankResume = {
  personal: { fullName:'', title:'', email:'', phone:'', location:'', website:'', linkedin:'', github:'' },
  summary:'', experience:[], education:[], projects:[],
  skills:{ technical:[], tools:[], soft:[] },
  certifications:[], languages:[]
}

const demo = {
  personal: {
    fullName: 'Aria Chen',
    title: 'Senior Product Designer • AI-Native Systems',
    email: 'aria@jobspark.ai',
    phone: '+1 (415) 552-0194',
    location: 'San Francisco, CA',
    website: 'ariachen.studio',
    linkedin: 'linkedin.com/in/ariachen',
    github: 'github.com/ariachen'
  },
  summary: 'Product designer with 7+ years shipping 0→1 B2B SaaS used by 4.2M people. Led design systems at two Series-B companies, launched AI workflow tooling lifting activation +31%, cut time-to-value by 4.2 days. Obsessed with crisp, measurable impact.',
  experience: [
    { id:'r1', role:'Senior Product Designer', company:'Vercelion', location:'San Francisco, CA', start:'Mar 2022', end:'', current:true, bullets:[
      'Owned AI workflow builder end-to-end; activation +31%, TTFV −4.2 days',
      'Launched “Orbit” design system; 38 engineers adopted, ~1,120 dev-hrs saved / quarter',
      'Shipped contextual onboarding with ML; Day-7 retention +18%'
    ]},
    { id:'r2', role:'Product Designer', company:'Lune Labs', location:'Remote', start:'Jan 2020', end:'Feb 2022', current:false, bullets:[
      'Redesigned billing & analytics; NRR 103% → 118% in two quarters',
      'Built first a11y audit in Figma; WCAG AA across 92% core flows'
    ]},
    { id:'r3', role:'UI / UX Designer', company:'Threadline', location:'Austin, TX', start:'Jun 2018', end:'Dec 2019', current:false, bullets:[
      'Mobile commerce app — 840k shoppers, 4.7★ App Store sustained'
    ]}
  ],
  education: [{ id:'ed1', degree:'B.F.A. Interaction Design', school:'California College of the Arts', year:'2018', gpa:'3.9' }],
  skills: {
    technical:['Design Systems','AI-native UX','Prototyping','User Research','Information Architecture','Motion','Design Tokens','Usability Testing'],
    tools:['Figma','Framer','Rive','Linear','Notion','Maze'],
    soft:['Roadmapping','Stakeholder Alignment','Workshops','Mentoring','Narrative']
  },
  projects: [
    { id:'p1', name:'Flowkit — AI Component Atlas', link:'flowkit.dev', tech:'Figma • Framer • Tailwind', desc:'Open-source library used by 2.4k teams. Featured in Figma Community 3×.' },
    { id:'p2', name:'Field Notes', link:'fieldnotes.design', tech:'Research • Writing', desc:'22k-subscriber newsletter on AI-native design patterns.' }
  ],
  certifications:['NN/g UX Certified','Google Analytics IQ'],
  languages:['English (Native)','Mandarin (Fluent)','Spanish (Conversational)']
}

/* ── PDF ── */
const P = StyleSheet.create({
  page:{ paddingTop:44, paddingBottom:44, paddingHorizontal:50, fontFamily:'Helvetica', fontSize:10.6, color:'#181818', lineHeight:1.55 },
  name:{ fontSize:26, fontWeight:'bold', letterSpacing:-0.35 },
  title:{ fontSize:11.2, color:'#e1461a', marginTop:3, marginBottom:5 },
  contact:{ fontSize:8.8, color:'#5a5a5a', marginBottom:12 },
  hair:{ height:1.35, width:58, backgroundColor:'#e1461a', marginBottom:16 },
  h:{ fontSize:9, textTransform:'uppercase', letterSpacing:2.0, fontWeight:'bold', marginTop:13, marginBottom:6 },
  rule:{ height:0.65, backgroundColor:'#ddd3c5', marginBottom:8 },
  row:{ flexDirection:'row', justifyContent:'space-between' },
  job:{ fontSize:11.6, fontWeight:'bold' },
  when:{ fontSize:9, color:'#6c6c6c' },
  co:{ fontSize:10.1, color:'#d33b14', marginBottom:3 },
  b:{ fontSize:10, color:'#2d2d2d', marginBottom:3.2 },
  two:{ flexDirection:'row', gap:22 },
  left:{ width:'63%' },
  right:{ width:'37%' },
  pill:{ fontSize:8.4, borderWidth:0.55, borderColor:'#d8cdc0', borderRadius:4, paddingHorizontal:5, paddingVertical:2.5, marginRight:4, marginBottom:4, color:'#444' }
})
function PdfDoc({ data }){
  return (
    <Document title={`${data.personal.fullName} Resume`}>
      <Page size="A4" style={P.page}>
        <Text style={P.name}>{data.personal.fullName || 'Your Name'}</Text>
        <Text style={P.title}>{data.personal.title || 'Target Role'}</Text>
        <Text style={P.contact}>
          {data.personal.email} • {data.personal.phone} • {data.personal.location}{data.personal.website ? ` • ${data.personal.website}`:''}
        </Text>
        <View style={P.hair} />
        <View style={P.two}>
          <View style={P.left}>
            <Text style={P.h}>Profile</Text><View style={P.rule}/>
            <Text style={{fontSize:10.4, lineHeight:1.6, color:'#2b2b2b'}}>{data.summary}</Text>
            <Text style={P.h}>Experience</Text><View style={P.rule}/>
            {data.experience.map(e=>(
              <View key={e.id} style={{marginBottom:10}}>
                <View style={P.row}>
                  <Text style={P.job}>{e.role}</Text>
                  <Text style={P.when}>{e.start} — {e.current?'Present':e.end}</Text>
                </View>
                <Text style={P.co}>{e.company} • {e.location}</Text>
                {e.bullets.filter(Boolean).map((b,i)=> <Text key={i} style={P.b}>• {b}</Text>)}
              </View>
            ))}
            {data.projects.length>0 && <>
              <Text style={P.h}>Selected Work</Text><View style={P.rule}/>
              {data.projects.map(pr=>(
                <View key={pr.id} style={{marginBottom:7}}>
                  <Text style={{fontSize:10.7, fontWeight:'bold'}}>{pr.name}</Text>
                  <Text style={{fontSize:8.6, color:'#777'}}>{pr.tech} • {pr.link}</Text>
                  <Text style={{fontSize:9.9, color:'#333'}}>{pr.desc}</Text>
                </View>
              ))}
            </>}
          </View>
          <View style={P.right}>
            <Text style={P.h}>Core Stack</Text><View style={P.rule}/>
            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              {data.skills.technical.map((s,i)=><Text key={i} style={P.pill}>{s}</Text>)}
            </View>
            <Text style={P.h}>Tools</Text><View style={P.rule}/>
            {data.skills.tools.map((t,i)=><Text key={i} style={{fontSize:9.6, marginBottom:2}}>› {t}</Text>)}
            <Text style={P.h}>Education</Text><View style={P.rule}/>
            {data.education.map(ed=>(
              <View key={ed.id} style={{marginBottom:7}}>
                <Text style={{fontSize:10.1, fontWeight:'bold'}}>{ed.degree}</Text>
                <Text style={{fontSize:9.3, color:'#555'}}>{ed.school}</Text>
                <Text style={{fontSize:8.9, color:'#777'}}>{ed.year}{ed.gpa?` • ${ed.gpa} GPA`:''}</Text>
              </View>
            ))}
            {data.certifications.length>0 && <>
              <Text style={P.h}>Certifications</Text><View style={P.rule}/>
              {data.certifications.map((c,i)=><Text key={i} style={{fontSize:9.2, marginBottom:2}}>• {c}</Text>)}
            </>}
            <Text style={P.h}>Languages</Text><View style={P.rule}/>
            {data.languages.map((l,i)=><Text key={i} style={{fontSize:9.2, marginBottom:2}}>{l}</Text>)}
          </View>
        </View>
        <View style={{position:'absolute', bottom:22, left:50, right:50, flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{fontSize:7.6, color:'#a3927e'}}>JobSpark-AI • ATS Optimized</Text>
          <Text style={{fontSize:7.6, color:'#a3927e'}}>{new Date().toLocaleDateString('en-US',{month:'short', year:'numeric'})}</Text>
        </View>
      </Page>
    </Document>
  )
}

/* ── App ── */
export default function App(){
  const [resume, setResume] = useState(()=> {
    const s = localStorage.getItem('jobspark_elite_v5')
    return s ? JSON.parse(s) : demo
  })

  // spark / AI intake
  const [spark, setSpark] = useState({
    name:'', email:'', targetRole:'', targetCompany:'', level:'Senior', location:'', jd:'', skills:''
  })
  const [gen, setGen] = useState(false)
  const [mobilePrev, setMobilePrev] = useState(false)

  const GEMINI_KEY = import.meta.env?.VITE_GEMINI_API_KEY || ''

  useEffect(()=> localStorage.setItem('jobspark_elite_v5', JSON.stringify(resume)), [resume])

  const ats = useMemo(()=>{
    let s=62
    if(resume.summary.length>130) s+=8
    if(resume.experience.length>=2) s+=8
    if(resume.skills.technical.length>=5) s+=6
    const t = resume.experience.flatMap(e=>e.bullets).join(' ').toLowerCase()
    const v = ['led','launched','built','owned','shipped','increased','improved','reduced']
    s += Math.min(v.filter(x=>t.includes(x)).length*2, 14)
    return Math.min(97,s)
  },[resume])

  const callGemini = async (prompt)=>{
    if(!GEMINI_KEY){ toast.error('Add VITE_GEMINI_API_KEY in .env'); throw new Error('no-key') }
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY })
    const r = await ai.interactions.create({ model:'gemini-2.5-flash', input: prompt })
    return r.output_text || r?.steps?.find((s)=>s.type==='model_output')?.content?.[0]?.text || ''
  }

  const generate = async ()=>{
    if(!spark.name.trim() || !spark.targetRole.trim()){
      toast.error('Add your name and target role')
      return
    }
    setGen(true)
    try{
      const prompt = `You are JobSpark-AI, elite FAANG-level resume architect.

CANDIDATE INTAKE:
Name: ${spark.name}
Email: ${spark.email||'—'}
Target Role: ${spark.targetRole}
Target Company/Industry: ${spark.targetCompany||'Top tech'}
Level: ${spark.level}
Location: ${spark.location||'US/Remote'}
Skill hints: ${spark.skills||'infer'}
Job Description:
${spark.jd||'none — infer best practice for role'}

Return ONLY valid JSON:
{
  "personal":{"fullName":"…","title":"Target Role • crisp differentiator","email":"…","phone":"+1 …","location":"…","website":"…","linkedin":"linkedin.com/in/…","github":"github.com/…"},
  "summary":"2–3 sentences, 190–260 chars, outcome-dense",
  "experience":[
    {"id":"e1","role":"…","company":"…","location":"…","start":"…","end":"…","current":true,"bullets":["…","…","…"]},
    {"id":"e2","role":"…","company":"…","location":"…","start":"…","end":"…","current":false,"bullets":["…","…"]},
    {"id":"e3","role":"…","company":"…","location":"…","start":"…","end":"…","current":false,"bullets":["…"]}
  ],
  "education":[{"id":"ed1","degree":"…","school":"…","year":"…","gpa":"…"}],
  "skills":{"technical":["8-14 ranked"],"tools":["5-8"],"soft":["5-7"]},
  "projects":[
    {"id":"p1","name":"…","link":"…","tech":"…","desc":"…"},
    {"id":"p2","name":"…","link":"…","tech":"…","desc":"…"}
  ],
  "certifications":["…","…"],
  "languages":["English (Native)","…"]
}
Rules: XYZ bullets, verb-first, quantify, mirror JD keywords if provided. No placeholders. JSON only.`
      const txt = await callGemini(prompt)
      const json = txt.match(/\{[\s\S]*\}/)?.[0]
      if(!json) throw new Error('Bad AI response')
      const r = JSON.parse(json)
      if(spark.email) r.personal.email = spark.email
      if(spark.name) r.personal.fullName = spark.name
      if(spark.location) r.personal.location = spark.location
      setResume(r)
      toast.success('Resume generated ✨', { description:'AI wrote your full tailored resume.'})
      window.scrollTo({ top: 580, behavior:'smooth' })
    }catch(e){
      if(e.message!=='no-key') toast.error('Generation failed', { description: e?.message })
    }finally{ setGen(false) }
  }

  const pdfDoc = useMemo(()=> <PdfDoc data={resume} />, [resume])

  // helper mutators
  const addSkill = (group, v)=>{
    if(!v.trim()) return
    setResume(r=>({...r, skills: {...r.skills, [group]: [...r.skills[group], v.trim()] }}))
  }
  const removeSkill = (group, i)=>{
    setResume(r=>({...r, skills:{...r.skills, [group]: r.skills[group].filter((_,ix)=>ix!==i)}}))
  }

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-zinc-900 antialiased"
      style={{ fontFamily: `"Outfit", "Instrument Sans", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`}}>
      <Toaster richColors position="top-center" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=Outfit:wght@400;500;600;700;800&display=swap');
        .display { font-family: "Fraunces", "Times New Roman", serif; }
        .ui { font-family: "Outfit", system-ui, sans-serif; }
        .elev { background: #fffdf9; border:1px solid #e7d9c6; box-shadow: 0 1px 0 #f3e7d3 inset, 0 18px 44px rgba(48,31,9,.07), 0 2px 6px rgba(0,0,0,.03); }
        .muted { color:#6f6558 }
        .input { width:100%; background:#fffefc; border:1.45px solid #d8c8b2; border-radius:16px; padding: 13px 15px; font-size:15.2px; line-height:1.45; outline:none; transition: box-shadow .16s, border-color .16s; font-family: "Outfit", system-ui, sans-serif; }
        .input:focus{ border-color:#ff5c2b; box-shadow:0 0 0 4px #ffe1d2; }
        .input::placeholder{ color:#a89882 }
        .label { font-size:11.2px; letter-spacing:.11em; text-transform:uppercase; color:#7f7260; margin-bottom:7px; font-weight:700; font-family:"Outfit",system-ui,sans-serif; }
        .hair{ height:1px; background:linear-gradient(90deg,#eadcc7 0%, rgba(234,220,199,.15) 100%); }
        .chip{ display:inline-flex; align-items:center; gap:6px; background:#f4e9d6; border:1px solid #e2cfb5; padding:8px 12px; border-radius:9999px; font-size:13.5px; font-weight:560; }
        ::-webkit-scrollbar{ width:10px; height:10px } ::-webkit-scrollbar-thumb{ background:#d9c6ad; border-radius:9px }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-[#e4d5c0] bg-[#f7f2e8]/92">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-[0_7px_20px_rgba(0,0,0,.13)]">
              <Sparkles className="w-5 h-5 text-[#ff6a36]" />
            </div>
            <div className="min-w-0">
              <div className="display text-[22px] sm:text-[24px] leading-none tracking-[-0.018em] font-[700]">JobSpark<span className="text-[#ef4720]">-AI</span></div>
              <div className="hidden sm:block text-[11.5px] text-zinc-500 -mt-[1px]">Editorial resume studio • ATS-native • client-side</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[13.2px] text-zinc-600">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-[15px] h-[15px] text-emerald-600"/>Local only</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-[15px] h-[15px] text-amber-600"/>ATS {ats}</span>
            <span className="inline-flex items-center gap-1.5"><Target className="w-[15px] h-[15px] text-zinc-500"/>{resume.experience.flatMap(e=>e.bullets).length} impact bullets</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={()=>setMobilePrev(true)} className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#dec9ad] text-[13px] font-[620]"><Eye className="w-4 h-4"/> Preview</button>
            <PDFDownloadLink document={pdfDoc} fileName={`${(resume.personal.fullName||'JobSpark_Resume').replace(/\s+/g,'_')}.pdf`}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-[#fff4e4] px-4 sm:px-5 py-[10px] text-[13.6px] sm:text-[14px] font-[700] hover:bg-black shadow-[0_8px_24px_rgba(0,0,0,.12)]">
              {({loading})=> loading ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>PDF…</> : <><Download className="w-[16px] h-[16px]"/><span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span></>}
            </PDFDownloadLink>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 lg:py-11">
        <div className="xl:grid xl:grid-cols-12 xl:gap-9">

          {/* LEFT COLUMN */}
          <div className="xl:col-span-5 space-y-5">

            {/* AI GENERATOR – Option A – polished typography */}
            <section className="elev rounded-[30px] overflow-hidden">
              <div className="px-6 sm:px-8 pt-7 pb-6 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8f0_100%)] border-b border-[#f0dfc8]">
                <div className="inline-flex items-center gap-2 text-[11px] font-[800] tracking-[.18em] text-[#d9471b] uppercase">
                  <Wand2 className="w-3.5 h-3.5"/> JobSpark AI Generator
                </div>
                <h2 className="display text-[30px] sm:text-[36px] leading-[1.07] tracking-[-0.019em] mt-2 font-[700] text-zinc-900">
                  Generate your <span className="text-[#e6451b]">resume</span><br/>with Gemini
                </h2>
                <p className="ui text-[15.3px] leading-relaxed text-zinc-600 mt-3 max-w-[520px]">
                  Tell us your target role. Paste the job description. Gemini writes your summary, experience, skills, projects — fully quantified, keyword-matched, and ATS-optimized.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 text-[11.6px]">
                  {[
                    ['Clear career positioning', <Target key="a" className="w-3 h-3"/>],
                    ['ATS-friendly structure', <BadgeCheck key="b" className="w-3 h-3"/>],
                    ['Impact-first bullet strategy', <Zap key="c" className="w-3 h-3"/>],
                  ].map(([label, icon], i)=>(
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-full bg-white border border-[#ecdbc1] text-zinc-700 font-[560]">
                      {icon}{label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 sm:px-8 py-6 space-y-5 bg-white/55">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="label">Your name *</div>
                    <input className="input" placeholder="Aria Chen"
                      value={spark.name} onChange={e=>setSpark(s=>({...s, name:e.target.value}))}/>
                  </div>
                  <div>
                    <div className="label">Email</div>
                    <input className="input" placeholder="you@email.com"
                      value={spark.email} onChange={e=>setSpark(s=>({...s, email:e.target.value}))}/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="label">Target role *</div>
                    <input className="input" placeholder="Product Manager • Senior IC"
                      value={spark.targetRole} onChange={e=>setSpark(s=>({...s, targetRole:e.target.value}))}/>
                  </div>
                  <div>
                    <div className="label">Target company / industry</div>
                    <input className="input" placeholder="Fintech, SaaS, healthcare…"
                      value={spark.targetCompany} onChange={e=>setSpark(s=>({...s, targetCompany:e.target.value}))}/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="label">Experience level</div>
                    <select className="input" value={spark.level} onChange={e=>setSpark(s=>({...s, level:e.target.value}))}>
                      {['Entry','Mid','Senior','Staff','Lead','Director','VP'].map(l=> <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="label">Location</div>
                    <input className="input" placeholder="San Francisco, CA • Remote"
                      value={spark.location} onChange={e=>setSpark(s=>({...s, location:e.target.value}))}/>
                  </div>
                </div>

                <div>
                  <div className="label">Core skills (optional)</div>
                  <input className="input" placeholder="TypeScript, Product Strategy, SQL, Figma, Growth…"
                    value={spark.skills} onChange={e=>setSpark(s=>({...s, skills:e.target.value}))}/>
                </div>

                <div>
                  <div className="label">Target job description</div>
                  <textarea className="input min-h-[150px]" placeholder="Paste the job post to help Gemini mirror the right keywords and priorities…"
                    value={spark.jd} onChange={e=>setSpark(s=>({...s, jd:e.target.value}))}/>
                  <div className="flex items-center justify-between mt-[10px] text-[12.4px] text-zinc-500">
                    <span>{spark.jd ? `${spark.jd.length} chars • keyword-aware AI` : 'Paste JD for +12–28% keyword fit'}</span>
                    <span className="hidden sm:inline text-zinc-600">Gemini 2.5 Flash • <b className="text-zinc-800">one-click</b></span>
                  </div>
                </div>

                <button onClick={generate} disabled={gen}
                  className="w-full rounded-[18px] bg-[#ff4a18] hover:bg-[#e83f12] text-white py-[15px] text-[16.5px] font-[750] tracking-[-0.01em] flex items-center justify-center gap-2 shadow-[0_12px_30px_rgba(255,58,16,.24)] disabled:opacity-60">
                  {gen ? <span className="w-[18px] h-[18px] border-[3px] border-white/35 border-t-white rounded-full animate-spin"/> : <Wand2 className="w-[18px] h-[18px]"/>}
                  {gen ? 'Generating with Gemini…' : 'Generate with Gemini'}
                </button>

                {!GEMINI_KEY && (
                  <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-3 text-[12.7px] text-amber-900">
                    AI is ready but the API key is not. Add <code className="bg-amber-100 px-1.5 py-[1px] rounded text-[11.5px]">VITE_GEMINI_API_KEY</code> to <b>.env</b> and restart.
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.6px] text-zinc-600">
                  <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600"/> Client-side</span>
                  <span>•</span>
                  <span>ATS {ats}</span>
                  <span>•</span>
                  <span>{resume.experience.flatMap(e=>e.bullets).length} impact bullets</span>
                  <span className="ml-auto flex items-center gap-3">
                    <button onClick={()=> setResume(demo)} className="text-[#c73514] font-[680]">Load demo</button>
                    <button onClick={()=> { setResume(blankResume); toast('Cleared') }} className="text-zinc-600">Reset</button>
                  </span>
                </div>
              </div>
            </section>

            {/* STRENGTHS – clearly visible */}
            <section className="elev rounded-[26px] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[12px] font-[800] tracking-[.13em] text-[#d3471d] uppercase mb-4">
                <Lightbulb className="w-[15px] h-[15px]"/> Strengths
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Target className="w-[17px] h-[17px]"/>, t:'Clear career positioning', s:'Role-aligned headline + summary optimized for the 6-second scan.' },
                  { icon: <ShieldCheck className="w-[17px] h-[17px]"/>, t:'ATS-friendly structure', s:'One-column content, clean hierarchy, no tables — parses perfectly.' },
                  { icon: <Zap className="w-[17px] h-[17px]"/>, t:'Impact-first bullet strategy', s:'XYZ formula: Action → Outcome → Metric on every line.' },
                ].map((c,i)=>(
                  <div key={i} className="rounded-[18px] bg-white border border-[#ead7bc] p-[16px] shadow-[0_8px_24px_rgba(67,42,10,.045)]">
                    <div className="w-9 h-9 rounded-xl bg-[#fff2e7] border border-[#ffd8bf] flex items-center justify-center text-[#e24a1f] mb-2">{c.icon}</div>
                    <div className="text-[15px] font-[720] text-zinc-900 leading-snug">{c.t}</div>
                    <div className="text-[13.2px] text-zinc-600 mt-1 leading-relaxed">{c.s}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SKILLS – always visible */}
            <section className="elev rounded-[26px] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[13.5px] font-[720] text-zinc-900">
                  <Layers className="w-[16px] h-[16px] text-[#d8431b]"/> Skills
                </div>
                <span className="text-[11.5px] text-zinc-500">Core skills • Tools • Soft</span>
              </div>

              {['technical','tools','soft'].map(group=>(
                <div key={group} className="mb-4 last:mb-0">
                  <div className="text-[12px] font-[700] tracking-[.08em] text-zinc-600 uppercase mb-2">
                    {group === 'technical' ? 'Core skills' : group}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills[group].length===0 && (
                      <span className="text-[13.2px] text-zinc-500 bg-[#fff9f0] border border-dashed border-[#e4cfb6] px-3 py-[8px] rounded-full">
                        Add your most relevant skills
                      </span>
                    )}
                    {resume.skills[group].map((s,i)=>(
                      <span key={i} className="chip">
                        {s}
                        <button onClick={()=>removeSkill(group,i)} className="text-zinc-500 hover:text-rose-600 ml-1">
                          <X className="w-3 h-3"/>
                        </button>
                      </span>
                    ))}
                    <input
                      onKeyDown={(e)=>{
                        const el=e.currentTarget
                        if(e.key==='Enter' && el.value.trim()){ addSkill(group, el.value); el.value='' }
                      }}
                      placeholder="Type skill + Enter"
                      className="px-3 py-[7px] text-[13.3px] rounded-full border border-dashed border-[#d7c1a3] bg-white outline-none w-[190px]"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* EDUCATION – clearly visible */}
            <section className="elev rounded-[26px] p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[13.5px] font-[720] text-zinc-900">
                  <GraduationCap className="w-[16px] h-[16px] text-[#d8431b]"/> Education
                </div>
                <button onClick={()=> setResume(r=>({...r, education:[...r.education, { id:'ed'+Math.random().toString(36).slice(2,5), degree:'', school:'', year:'', gpa:'' }]}))}
                  className="text-[12.6px] text-[#c83313] font-[650]">+ Add school or program</button>
              </div>

              {resume.education.length===0 && (
                <div className="rounded-[16px] border border-dashed border-[#e2cfb6] bg-[#fffaf2] px-4 py-4 text-[13.5px] text-zinc-600">
                  Add degree, course, or training — it will appear clearly here and in your PDF.
                </div>
              )}

              <div className="space-y-3">
                {resume.education.map(ed=>(
                  <div key={ed.id} className="rounded-[16px] border border-[#e4d3bc] bg-white p-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <div className="label">Degree / Program</div>
                        <input className="input" placeholder="B.F.A. Interaction Design"
                          value={ed.degree} onChange={e=> setResume(r=>({...r, education:r.education.map(x=>x.id===ed.id?{...x, degree:e.target.value}:x)}))}/>
                      </div>
                      <div>
                        <div className="label">School / Institution</div>
                        <input className="input" placeholder="California College of the Arts"
                          value={ed.school} onChange={e=> setResume(r=>({...r, education:r.education.map(x=>x.id===ed.id?{...x, school:e.target.value}:x)}))}/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="label">Year</div>
                          <input className="input" placeholder="2018"
                            value={ed.year} onChange={e=> setResume(r=>({...r, education:r.education.map(x=>x.id===ed.id?{...x, year:e.target.value}:x)}))}/>
                        </div>
                        <div>
                          <div className="label">GPA</div>
                          <input className="input" placeholder="3.9"
                            value={ed.gpa||''} onChange={e=> setResume(r=>({...r, education:r.education.map(x=>x.id===ed.id?{...x, gpa:e.target.value}:x)}))}/>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button onClick={()=> setResume(r=>({...r, education: r.education.filter(x=>x.id!==ed.id)}))}
                        className="text-zinc-500 hover:text-rose-600 text-[12.5px] flex items-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUICK EDITOR: Experience */}
            <section className="elev rounded-[26px] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[13.5px] font-[720] text-zinc-900 mb-3">
                <Briefcase className="w-[16px] h-[16px] text-[#d8431b]"/> Experience
              </div>
              <div className="space-y-4">
                {resume.experience.map((ex, ei)=>(
                  <div key={ex.id} className="rounded-[18px] border border-[#e4d3bc] bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[11.5px] text-zinc-500 tracking-wide">ROLE {ei+1}</div>
                      <button onClick={()=> setResume(r=>({...r, experience: r.experience.filter(x=>x.id!==ex.id)}))}
                        className="text-zinc-400 hover:text-rose-600"><Trash2 className="w-[15px] h-[15px]"/></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><div className="label">Title</div><input className="input" value={ex.role} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, role:e.target.value}:x)}))}/></div>
                      <div><div className="label">Company</div><input className="input" value={ex.company} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, company:e.target.value}:x)}))}/></div>
                      <div><div className="label">Start</div><input className="input" value={ex.start} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, start:e.target.value}:x)}))}/></div>
                      <div>
                        <div className="label">End</div>
                        <input className="input" disabled={ex.current} value={ex.end} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, end:e.target.value}:x)}))}/>
                      </div>
                      <div><div className="label">Location</div><input className="input" value={ex.location} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, location:e.target.value}:x)}))}/></div>
                      <label className="flex items-center gap-2 pt-[28px] text-[13.4px]"><input type="checkbox" checked={ex.current} onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=>x.id===ex.id?{...x, current:e.target.checked, end:e.target.checked?'':x.end}:x)}))}/> Present</label>
                    </div>
                    <div className="mt-3">
                      <div className="label">Impact bullets</div>
                      {ex.bullets.map((b, bi)=>(
                        <textarea key={bi} className="input mb-2 min-h-[66px]" value={b}
                          onChange={e=> setResume(r=>({...r, experience:r.experience.map(x=> x.id===ex.id ? {...x, bullets: x.bullets.map((bb, i)=> i===bi ? e.target.value : bb)} : x)}))}/>
                      ))}
                      <button onClick={()=> setResume(r=>({...r, experience:r.experience.map(x=> x.id===ex.id ? {...x, bullets:[...x.bullets,'']}:x)}))}
                        className="text-[12.7px] text-[#c83312] font-[630]">+ Add bullet</button>
                    </div>
                  </div>
                ))}
                <button onClick={()=> setResume(r=>({...r, experience:[...r.experience, { id:'ex'+Math.random().toString(36).slice(2,6), role:'', company:'', location:'', start:'', end:'', current:false, bullets:[''] }]}))}
                  className="w-full py-[13px] rounded-[16px] border border-dashed border-[#d6c2a5] bg-white text-[13.6px] text-zinc-700 hover:bg-[#fff8f0]">+ Add role</button>
              </div>
            </section>

            {/* Personal quick tune */}
            <section className="elev rounded-[26px] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[13.5px] font-[720] text-zinc-900 mb-3">
                <User2 className="w-[16px] h-[16px] text-[#d8431b]"/> Personal
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {[
                  ['Full name', resume.personal.fullName, (v)=> setResume(r=>({...r, personal:{...r.personal, fullName:v}}))],
                  ['Title / headline', resume.personal.title, (v)=> setResume(r=>({...r, personal:{...r.personal, title:v}}))],
                  ['Email', resume.personal.email, (v)=> setResume(r=>({...r, personal:{...r.personal, email:v}}))],
                  ['Phone', resume.personal.phone, (v)=> setResume(r=>({...r, personal:{...r.personal, phone:v}}))],
                  ['Location', resume.personal.location, (v)=> setResume(r=>({...r, personal:{...r.personal, location:v}}))],
                  ['Website', resume.personal.website, (v)=> setResume(r=>({...r, personal:{...r.personal, website:v}}))],
                  ['LinkedIn', resume.personal.linkedin, (v)=> setResume(r=>({...r, personal:{...r.personal, linkedin:v}}))],
                  ['GitHub', resume.personal.github, (v)=> setResume(r=>({...r, personal:{...r.personal, github:v}}))],
                ].map(([label, val, fn])=>(
                  <div key={label}>
                    <div className="label">{label}</div>
                    <input className="input" value={val} onChange={e=>fn(e.target.value)} />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="label">Professional summary</div>
                <textarea className="input min-h-[120px]" value={resume.summary}
                  onChange={e=> setResume(r=>({...r, summary:e.target.value}))}/>
                <div className="text-[12.2px] text-zinc-500 mt-1">{resume.summary.length} chars • aim 190–260</div>
              </div>
            </section>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="xl:col-span-7 mt-6 xl:mt-0">
            <div className="hidden lg:block sticky top-[88px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-[11.5px] tracking-[.16em] text-zinc-500 uppercase font-[750]">Live resume preview</div>
                <div className="text-[12.6px] text-zinc-600">ATS {ats} • {resume.experience.flatMap(e=>e.bullets).length} bullets</div>
              </div>

              <div className="elev rounded-[30px] overflow-hidden">
                <div className="bg-[#fffcf6] px-8 sm:px-10 pt-9 pb-6 border-b border-[#ecdcc6]">
                  <div className="display text-[30px] sm:text-[34px] leading-[1.04] tracking-[-0.018em] font-[700]">
                    {resume.personal.fullName || 'Your Name'}
                  </div>
                  <div className="text-[#d9421b] text-[14.6px] sm:text-[15.5px] mt-1 font-[560]">
                    {resume.personal.title || 'Target Role • Differentiator'}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.6px] sm:text-[13.2px] text-zinc-600 mt-3">
                    <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/>{resume.personal.email || 'email@domain.com'}</span>
                    <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/>{resume.personal.phone || '+1 …'}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/>{resume.personal.location || 'City, Country'}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[11.8px] text-zinc-500 mt-[6px]">
                    {resume.personal.website && <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3"/>{resume.personal.website}</span>}
                    {resume.personal.linkedin && <span className="inline-flex items-center gap-1"><Link2 className="w-3 h-3"/>{resume.personal.linkedin.replace(/^https?:\/\//,'')}</span>}
                    {resume.personal.github && <span className="inline-flex items-center gap-1"><Link2 className="w-3 h-3"/>{resume.personal.github.replace(/^https?:\/\//,'')}</span>}
                  </div>
                  <div className="w-[56px] h-[2px] bg-[#ff4a1c] rounded-full mt-4" />
                </div>

                <div className="px-8 sm:px-10 py-7 text-[14.6px] leading-[1.68]">
                  <Preview title="Profile">
                    <p className="text-zinc-700">{resume.summary || 'Your AI-crafted professional summary will appear here after generation.'}</p>
                  </Preview>

                  <Preview title="Experience">
                    <div className="space-y-5">
                      {resume.experience.length===0 && <div className="text-zinc-500 text-[13.5px]">No roles yet — run “Generate with Gemini”.</div>}
                      {resume.experience.map(exp=>(
                        <div key={exp.id}>
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="font-[680] text-[16.5px] tracking-[-0.01em]">{exp.role}</div>
                            <div className="text-[11.6px] text-zinc-500 whitespace-nowrap">{exp.start} — {exp.current ? 'Present' : exp.end}</div>
                          </div>
                          <div className="text-[#c93a16] text-[13.4px] font-[560]">{exp.company} <span className="text-zinc-500 font-[480]">• {exp.location}</span></div>
                          <ul className="mt-2 space-y-[7px]">
                            {exp.bullets.filter(Boolean).map((b,i)=>(
                              <li key={i} className="flex gap-2 text-zinc-700 text-[14px] leading-[1.6]">
                                <span className="text-[#e14a20] mt-[2px]">›</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Preview>

                  <div className="grid md:grid-cols-12 gap-7 mt-1">
                    <div className="md:col-span-7">
                      <Preview title="Selected Work">
                        <div className="space-y-4">
                          {resume.projects.length===0 && <div className="text-zinc-500 text-[13.5px]">Projects will populate after AI generation.</div>}
                          {resume.projects.map(p=>(
                            <div key={p.id}>
                              <div className="font-[680] text-[14.4px]">{p.name}</div>
                              <div className="text-[11.8px] text-zinc-500">{p.tech} • {p.link}</div>
                              <div className="text-[13.6px] text-zinc-700">{p.desc}</div>
                            </div>
                          ))}
                        </div>
                      </Preview>
                    </div>
                    <div className="md:col-span-5">
                      <Preview title="Core Stack">
                        <div className="flex flex-wrap gap-[7px]">
                          {resume.skills.technical.length===0 ? (
                            <span className="text-zinc-500 text-[13px]">Add your most relevant skills</span>
                          ) : resume.skills.technical.map((s,i)=>(
                            <span key={i} className="px-[9px] py-[5px] text-[11.8px] rounded-full bg-[#fff7ea] border border-[#e5d2b8] text-zinc-700 font-[540]">{s}</span>
                          ))}
                        </div>
                      </Preview>
                      <Preview title="Education" className="mt-6">
                        {resume.education.length===0 ? (
                          <div className="text-[13.3px] text-zinc-500">Add school or program</div>
                        ) : resume.education.map(ed=>(
                          <div key={ed.id} className="text-[13.4px] mb-2">
                            <div className="font-[640]">{ed.degree}</div>
                            <div className="text-zinc-600">{ed.school}</div>
                            <div className="text-zinc-500 text-[12px]">{ed.year}{ed.gpa?` • ${ed.gpa}`:''}</div>
                          </div>
                        ))}
                      </Preview>
                    </div>
                  </div>
                </div>

                <div className="px-8 sm:px-10 pb-5 text-[11px] text-zinc-500 flex items-center justify-between border-t border-[#eee1cf]">
                  <span>JobSpark-AI • ATS {ats}</span>
                  <span>{new Date().toLocaleDateString('en-US',{ month:'long', year:'numeric'})}</span>
                </div>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  ['Bullets', resume.experience.flatMap(e=>e.bullets).length],
                  ['Skills', resume.skills.technical.length],
                  ['ATS', ats]
                ].map(([l,v])=>(
                  <div key={l} className="elev rounded-[18px] px-4 py-3">
                    <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-[700]">{l}</div>
                    <div className="text-[21px] display font-[700]">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE PREVIEW DRAWER */}
      <AnimatePresence>
        {mobilePrev && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 bg-black/45 lg:hidden" onClick={()=>setMobilePrev(false)}>
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}
              transition={{type:'spring', damping:26, stiffness:240}}
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-auto rounded-t-[28px] bg-[#fffdf9]"
              onClick={e=>e.stopPropagation()}>
              <div className="sticky top-0 bg-[#fffdf9] px-5 py-4 border-b border-[#eadcc7] flex items-center justify-between rounded-t-[28px]">
                <div className="font-[700] text-zinc-800">Live Preview</div>
                <button onClick={()=>setMobilePrev(false)} className="p-2 -mr-2"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-5">
                <div className="display text-[24px] font-[700]">{resume.personal.fullName || 'Your Name'}</div>
                <div className="text-[#d9411b]">{resume.personal.title}</div>
                <div className="text-[12.7px] text-zinc-600 mt-2">{resume.personal.email} • {resume.personal.phone}</div>
                <div className="h-px bg-[#e7d9c5] my-4"/>
                <p className="text-[14.6px] leading-relaxed text-zinc-700">{resume.summary}</p>
                <div className="h-px bg-[#e7d9c5] my-4"/>
                {resume.experience.map(e=>(
                  <div key={e.id} className="mb-5">
                    <div className="font-[650]">{e.role}</div>
                    <div className="text-[13px] text-[#b83818]">{e.company}</div>
                    <ul className="mt-2 space-y-1 text-[13.8px] text-zinc-700 list-disc pl-5">
                      {e.bullets.map((b,i)=> <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
                <PDFDownloadLink document={pdfDoc} fileName={`${(resume.personal.fullName||'Resume').replace(/\s+/g,'_')}.pdf`}>
                  {({loading})=>(
                    <div className="w-full text-center py-3 rounded-full bg-zinc-900 text-amber-50 font-[650]">
                      {loading ? 'Preparing…' : 'Download PDF'}
                    </div>
                  )}
                </PDFDownloadLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-[#e2d5c2] bg-[#f0e5d2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-7 text-[13.6px] text-zinc-600 ui">
          <div>
            <div className="display text-[19px] text-zinc-900 font-[700]">JobSpark-AI</div>
            <p className="mt-1.5 leading-relaxed">Craft-first AI resume studio. Paste a JD → Gemini writes the whole resume. 100% client-side.</p>
          </div>
          <div><div className="font-[700] text-zinc-800 mb-1">Engine</div>Gemini 2.5 Flash<br/>@react-pdf/renderer<br/>Tailwind CSS • Framer Motion</div>
          <div><div className="font-[700] text-zinc-800 mb-1">Privacy</div>Local only • No backend<br/>Key via .env (VITE_GEMINI_API_KEY)<br/>Zero tracking</div>
          <div><div className="font-[700] text-zinc-800 mb-1">Export</div>A4 PDF • ATS clean • 1-page safe<br/>{GEMINI_KEY ? 'AI enabled ✓' : 'Set VITE_GEMINI_API_KEY to enable AI'}</div>
        </div>
        <div className="text-center text-[11px] text-zinc-500 pb-7 ui">© {new Date().getFullYear()} JobSpark-AI — built for makers who ship.</div>
      </footer>
    </div>
  )
}

/* ── small ── */
function Preview({title, children, className=''}){
  return (
    <div className={`mb-6 ${className}`}>
      <div className="text-[10.8px] tracking-[.18em] text-zinc-500 uppercase font-[750]" style={{fontFamily:'"Outfit",system-ui,sans-serif'}}>{title}</div>
      <div className="h-px bg-[#e6d7c2] mt-[7px] mb-[12px]" />
      {children}
    </div>
  )
}