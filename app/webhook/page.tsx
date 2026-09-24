'use client'

import { useState } from 'react'
import { ArrowLeft, Bot, CheckCircle2, Copy, Globe2, Loader2, RefreshCw, ShieldCheck, Unplug, Webhook } from 'lucide-react'

export default function WebhookPage() {
  const [status, setStatus] = useState<{ configured?: boolean; webhookUrl?: string; pending?: number; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function run(action: 'status' | 'setup' | 'remove') {
    setLoading(true)
    const response = await fetch('/api/telegram/setup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) })
    const data = await response.json()
    setStatus(data)
    setLoading(false)
  }

  const url = status?.webhookUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api/telegram/webhook` : '/api/telegram/webhook')

  return <main className="min-h-screen bg-[#f7f9fc] px-5 py-8 text-[#17243d] md:px-10">
    <div className="mx-auto max-w-4xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1463ff]"><ArrowLeft size={16} /> Bosh sahifaga qaytish</a>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div><div className="mb-3 flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-[#1463ff] text-white"><Bot size={23} /></div><span className="text-sm font-bold text-[#1463ff]">EduMaker Bot</span></div><h1 className="text-4xl font-extrabold tracking-tight">Webhook sozlash</h1><p className="mt-3 max-w-xl leading-7 text-slate-500">Telegram botni shu sahifadan avtomatik ulang. Tizim domeningizni aniqlaydi, webhook manzilini o‘rnatadi va holatini tekshiradi.</p></div>
        <div className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 md:flex md:items-center md:gap-2"><ShieldCheck size={15} /> Xavfsiz ulanish</div>
      </div>
      <section className="rounded-3xl bg-[#17243d] p-6 text-white shadow-2xl shadow-slate-300/50 md:p-8">
        <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-6"><div className="flex items-center gap-3"><Webhook className="text-[#80aaff]" /><div><h2 className="font-bold">Telegram webhook</h2><p className="text-xs text-slate-400">BotFather tokeni orqali avtomatik boshqariladi</p></div></div><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">Avtomatik</span></div>
        <div className="space-y-4"><div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Webhook URL</label><div className="flex items-center gap-2 rounded-xl bg-white/10 p-3"><Globe2 size={17} className="shrink-0 text-slate-400" /><code className="min-w-0 flex-1 truncate text-sm text-slate-200">{url}</code><button onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500) }} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" aria-label="URL nusxalash">{copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}</button></div></div>
          <div className="flex flex-wrap gap-3 pt-3"><button onClick={() => run('setup')} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#1463ff] px-5 py-3 text-sm font-bold hover:bg-blue-500 disabled:opacity-60">{loading ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle2 size={17} />} Webhookni o‘rnatish</button><button onClick={() => run('status')} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"><RefreshCw size={17} /> Holatni tekshirish</button><button onClick={() => run('remove')} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 px-5 py-3 text-sm font-bold text-red-200 hover:bg-red-400/10"><Unplug size={17} /> O‘chirish</button></div>
        </div>
      </section>
      {status && <section className="mt-5 rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-sm"><p className="mb-3 text-sm font-bold">Natija</p>{status.error ? <p className="text-sm text-red-600">{status.error}</p> : <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3"><p><span className="block text-xs text-slate-400">Holat</span><strong className="text-emerald-600">{status.configured ? 'Ulangan' : 'Ulanmagan'}</strong></p><p><span className="block text-xs text-slate-400">Kutilayotgan xabarlar</span><strong>{status.pending ?? 0}</strong></p><p><span className="block text-xs text-slate-400">Manzil</span><strong className="block truncate">{status.webhookUrl || 'Sozlanmagan'}</strong></p></div>}</section>}
      <p className="mt-6 text-center text-xs leading-5 text-slate-400">Webhook o‘rnatilgandan so‘ng Telegram botga <b>/start</b> yuboring. Token brauzerga chiqarilmaydi.</p>
    </div>
  </main>
}
