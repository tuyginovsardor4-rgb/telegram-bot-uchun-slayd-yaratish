'use client'

import { useState } from 'react'
import { Bot, Check, ChevronRight, FileText, LayoutTemplate, Paperclip, Play, Send, Settings, ShieldCheck, Zap } from 'lucide-react'

const steps = [
  { number: '01', title: 'Mavzuni yuboring', description: 'Fan va mavzu nomini yozing' },
  { number: '02', title: 'Formatni tanlang', description: 'PPTX, DOCX yoki PDF' },
  { number: '03', title: 'Faylni oling', description: 'Tayyor ish Telegramga keladi' },
]

const outputs = [
  { icon: LayoutTemplate, title: 'Taqdimot slaydlari', type: 'PPTX', color: 'blue', detail: '10–20 ta zamonaviy slayd' },
  { icon: FileText, title: 'Mustaqil ish', type: 'DOCX', color: 'violet', detail: 'Reja, xulosa va manbalar bilan' },
  { icon: FileText, title: 'PDF hujjat', type: 'PDF', color: 'orange', detail: 'Yuklashga tayyor format' },
]

export default function Page() {
  const [topic, setTopic] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#17243d]">
      <header className="border-b border-[#e6ebf2] bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1463ff] text-white shadow-lg shadow-blue-200"><Bot size={23} /></div>
            <div><p className="text-[15px] font-bold tracking-tight">EduMaker Bot</p><p className="text-[11px] font-medium text-slate-400">Telegram assistant</p></div>
          </div>
          <div className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex"><a href="#qanday" className="hover:text-[#1463ff]">Qanday ishlaydi?</a><a href="#formatlar" className="hover:text-[#1463ff]">Formatlar</a><a href="#sozlash" className="hover:text-[#1463ff]">Sozlash</a></div>
          <button className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm font-semibold text-slate-600"><Settings size={16} /> Sozlamalar</button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1463ff]"><span className="size-1.5 rounded-full bg-emerald-500" /> Bot faol va tayyor</div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-[-.04em] text-[#17243d] md:text-6xl">Mustaqil ishni <span className="text-[#1463ff]">bir necha daqiqada</span> yarating.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">EduMaker Bot mavzuingiz asosida sifatli slayd, mustaqil ish va PDF hujjat tayyorlab, Telegram orqali yuboradi.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#sinab-koring" className="flex items-center gap-2 rounded-xl bg-[#1463ff] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700"><Send size={17} /> Botni ishga tushirish <ChevronRight size={16} /></a><a href="#qanday" className="flex items-center gap-2 rounded-xl border border-[#dce4ef] bg-white px-5 py-3.5 text-sm font-bold text-slate-600"><Play size={15} fill="currentColor" /> Qanday ishlaydi?</a></div>
          <div className="mt-10 flex items-center gap-7 text-xs font-semibold text-slate-400"><span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> Ma&apos;lumotlar xavfsiz</span><span className="flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Tezkor natija</span></div>
        </div>
        <div id="sinab-koring" className="relative rounded-3xl bg-[#17243d] p-5 shadow-2xl shadow-slate-300/50 md:p-7"><div className="absolute -right-4 -top-5 hidden rounded-2xl bg-white p-3 shadow-lg md:block"><div className="flex items-center gap-2 text-xs font-bold"><span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500"><Check size={15} /></span> Fayl tayyor!</div></div><div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5"><div className="flex size-10 items-center justify-center rounded-xl bg-[#2b75ff] text-white"><Bot size={21} /></div><div><p className="font-bold text-white">EduMaker Bot</p><p className="text-xs text-slate-400">online · odatda bir necha soniyada javob beradi</p></div></div><div className="space-y-4"><div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm leading-6 text-slate-200">Assalomu alaykum! Men sizga slayd va mustaqil ish tayyorlashda yordam beraman. Avval mavzuni yozing.</div>{sent && <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#1463ff] p-4 text-sm text-white">{topic}</div>}<div className="flex items-center gap-2 rounded-2xl bg-white p-2"><input value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229 && topic.trim()) { setSent(true) } }} placeholder="Masalan: Alisher Navoiy hayoti..." className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400" aria-label="Mavzu" /><button aria-label="Fayl biriktirish" className="p-2 text-slate-400"><Paperclip size={18} /></button><button onClick={() => topic.trim() && setSent(true)} aria-label="Yuborish" className="rounded-xl bg-[#1463ff] p-2.5 text-white"><Send size={17} /></button></div>{sent && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"><p className="font-bold">Mavzu qabul qilindi.</p><p className="mt-1 text-emerald-100/70">Keyingi qadam: format va sahifalar sonini tanlang.</p></div>}</div><p className="mt-5 text-center text-[11px] text-slate-500">Telegram bot bilan ishlash uchun webhook sozlangan bo&apos;lishi kerak</p></div>
      </section>

      <section id="qanday" className="border-y border-[#e6ebf2] bg-white px-6 py-14 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-9 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#1463ff]">Oddiy jarayon</p><h2 className="text-3xl font-extrabold tracking-tight">Qanday ishlaydi?</h2></div><p className="hidden max-w-sm text-right text-sm leading-6 text-slate-500 md:block">Hech qanday murakkab sozlamalar kerak emas. Bot sizni bosqichma-bosqich yo&apos;naltiradi.</p></div><div className="grid gap-4 md:grid-cols-3">{steps.map((step, index) => <div key={step.number} className="rounded-2xl border border-[#e7edf5] bg-[#fbfcfe] p-6"><div className="mb-8 flex items-center justify-between"><span className="text-3xl font-black text-[#dbe7ff]">{step.number}</span><div className="flex size-9 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1463ff]"><ChevronRight size={18} /></div></div><h3 className="font-bold">{step.title}</h3><p className="mt-2 text-sm text-slate-500">{step.description}</p></div>)}</div></div></section>

      <section id="formatlar" className="mx-auto max-w-7xl px-6 py-16 lg:px-10"><div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#1463ff]">Natijalar</p><h2 className="text-3xl font-extrabold tracking-tight">Sizga kerakli formatda</h2></div><div className="grid gap-4 md:grid-cols-3">{outputs.map(({ icon: Icon, title, type, color, detail }) => <div key={type} className="group rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`mb-5 flex size-11 items-center justify-center rounded-xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600'}`}><Icon size={21} /></div><div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">{type}</span></div><p className="mt-2 text-sm text-slate-500">{detail}</p></div>)}</div></section>
      <footer id="sozlash" className="border-t border-[#e6ebf2] bg-white"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-7 text-sm text-slate-400 md:flex-row lg:px-10"><span>© 2026 EduMaker Bot</span><span className="flex items-center gap-4"><a href="#" className="hover:text-[#1463ff]">Yordam</a><a href="#" className="hover:text-[#1463ff]">Telegram kanal</a><span className="size-2 rounded-full bg-[#1463ff]" /></span></div></footer>
    </main>
  )
}
