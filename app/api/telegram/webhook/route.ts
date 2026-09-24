import { NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const runtime = 'nodejs'

const telegramApi = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
type Stage = 'topic' | 'type' | 'language' | 'level' | 'slides' | 'author' | 'title'
type Session = { stage: Stage; topic?: string; type?: 'slide' | 'work'; language?: string; level?: string; slides?: number; author?: string; title?: boolean }
const sessions = new Map<number, Session>()

type Content = { title: string; subtitle: string; introduction: string; sections: { heading: string; body: string; bullets: string[] }[]; conclusion: string; sources: string[] }

async function telegram(method: string, body: FormData | Record<string, unknown>) {
  const isForm = body instanceof FormData
  return fetch(`${telegramApi()}/${method}`, { method: 'POST', headers: isForm ? undefined : { 'content-type': 'application/json' }, body: isForm ? body : JSON.stringify(body) })
}
async function sendMessage(chatId: number, text: string) { return telegram('sendMessage', { chat_id: chatId, text }) }
async function sendDocument(chatId: number, bytes: Uint8Array, name: string, caption: string) {
  const form = new FormData(); form.append('chat_id', String(chatId)); form.append('document', new Blob([bytes as unknown as BlobPart]), name); form.append('caption', caption)
  return telegram('sendDocument', form)
}

async function generateContent(session: Session): Promise<Content> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY
  const model = process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : 'gemini-2.0-flash'
  if (apiKey) {
    const endpoint = process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, temperature: 0.45, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'You are a professional Uzbek academic editor. Return valid JSON only with title, subtitle, introduction, sections array of {heading,body,bullets}, conclusion, sources. Write accurate, structured, plagiarism-safe educational content.' }, { role: 'user', content: `Mavzu: ${session.topic}. Til: ${session.language}. Daraja: ${session.level}. Bo'limlar: ${session.slides || 8}. Ish turi: ${session.type}. Har bir bo'limni mazmunli va aniq yoz.` }] }) })
    if (response.ok) { const data = await response.json(); return JSON.parse(data.choices?.[0]?.message?.content || '{}') as Content }
  }
  return { title: session.topic || 'Mavzu', subtitle: 'Tayyorlangan akademik material', introduction: `${session.topic} mavzusi bo‘yicha kirish va asosiy tushunchalar.`, sections: Array.from({ length: Math.max(4, Math.min(session.slides || 8, 12)) }, (_, i) => ({ heading: `${i + 1}-bo‘lim. Asosiy tushuncha`, body: `${session.topic} bo‘yicha ushbu bo‘limning nazariy va amaliy mazmuni.`, bullets: ['Muhim tushuncha va ta’riflar', 'Amaliy qo‘llanish sohasi', 'Tahlil va xulosa'] })), conclusion: 'Mavzu bo‘yicha asosiy fikrlar umumlashtirildi.', sources: ['O‘quv qo‘llanmalar va ilmiy manbalar'] }
}

async function createPptx(content: Content, withTitle: boolean) {
  const pptx = new PptxGenJS(); pptx.layout = 'LAYOUT_WIDE'; pptx.author = 'EduMaker Bot'; pptx.subject = content.title
  const add = (heading: string, body: string, bullets: string[] = []) => { const slide = pptx.addSlide(); slide.background = { color: 'F7FAFC' }; slide.addText(heading, { x: 0.7, y: 0.55, w: 11.8, h: 0.6, fontSize: 25, bold: true, color: '102A43' }); slide.addText(body, { x: 0.75, y: 1.45, w: 11, h: 1.1, fontSize: 16, color: '334E68', breakLine: false }); if (bullets.length) slide.addText(bullets.map((x) => ({ text: x, options: { bullet: { indent: 14 } } })), { x: 0.9, y: 2.9, w: 10.8, h: 2.2, fontSize: 18, color: '243B53', breakLine: true }); slide.addText('EduMaker Bot', { x: 0.75, y: 7.05, w: 2, h: 0.2, fontSize: 9, color: '829AB1' }) }
  if (withTitle) { const slide = pptx.addSlide(); slide.background = { color: '102A43' }; slide.addText(content.title, { x: 0.9, y: 2.2, w: 11, h: 1, fontSize: 34, bold: true, color: 'FFFFFF', align: 'center' }); slide.addText(content.subtitle, { x: 1.2, y: 3.55, w: 10.4, h: 0.5, fontSize: 18, color: 'BEE3F8', align: 'center' }) }
  add('Kirish', content.introduction); content.sections.forEach((section) => add(section.heading, section.body, section.bullets)); add('Xulosa', content.conclusion, content.sources); return pptx.write({ outputType: 'nodebuffer' }) as Promise<Uint8Array>
}
async function createDocx(content: Content, withTitle: boolean) { const children = [ ...(withTitle ? [new Paragraph({ text: content.title, heading: HeadingLevel.TITLE }), new Paragraph({ text: content.subtitle })] : []), new Paragraph({ text: 'Kirish', heading: HeadingLevel.HEADING_1 }), new Paragraph(content.introduction), ...content.sections.flatMap((s) => [new Paragraph({ text: s.heading, heading: HeadingLevel.HEADING_1 }), new Paragraph(s.body), ...s.bullets.map((b) => new Paragraph({ text: b, bullet: { level: 0 } }))]), new Paragraph({ text: 'Xulosa', heading: HeadingLevel.HEADING_1 }), new Paragraph(content.conclusion), new Paragraph({ text: 'Foydalanilgan manbalar', heading: HeadingLevel.HEADING_1 }), ...content.sources.map((s) => new Paragraph(s))]; return Packer.toBuffer(new Document({ sections: [{ children }] })) }
async function createPdf(content: Content, withTitle: boolean) { const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica); let page = pdf.addPage([595, 842]); let y = 790; const write = (text: string, size = 12) => { const words = text.split(' '); let line = ''; for (const word of words) { if ((line + ' ' + word).length > 78) { page.drawText(line, { x: 48, y, size, font, color: rgb(0.1, 0.2, 0.3) }); y -= size + 8; line = word } else line += (line ? ' ' : '') + word } if (line) { page.drawText(line, { x: 48, y, size, font, color: rgb(0.1, 0.2, 0.3) }); y -= size + 8 } if (y < 70) { page = pdf.addPage([595, 842]); y = 790 } }; if (withTitle) write(content.title, 22); write(content.introduction); for (const section of content.sections) { write(section.heading, 16); write(section.body); section.bullets.forEach((b) => write('• ' + b)) } write('Xulosa', 16); write(content.conclusion); return pdf.save() }

export async function POST(request: Request) { if (!process.env.TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: 'Bot token is not configured' }, { status: 500 }); const update = await request.json(); const message = update?.message; const chatId = message?.chat?.id as number | undefined; if (!chatId) return NextResponse.json({ ok: true }); const text = String(message.text ?? '').trim(); if (text === '/start' || text === '/new') { sessions.set(chatId, { stage: 'topic' }); await sendMessage(chatId, 'Assalomu alaykum! EduMaker Bot siz uchun professional slayd va mustaqil ish tayyorlaydi.\n\nMavzuni yuboring:'); return NextResponse.json({ ok: true }) } let session = sessions.get(chatId); if (!session) { session = { stage: 'topic' }; sessions.set(chatId, session); await sendMessage(chatId, 'Boshlash uchun mavzuni yuboring:'); return NextResponse.json({ ok: true }) }
  if (session.stage === 'topic') { session.topic = text; session.stage = 'type'; await sendMessage(chatId, 'Qaysi ish kerak?\n1 — Slayd\n2 — Mustaqil ish\n3 — Ikkalasi'); }
  else if (session.stage === 'type') { session.type = text === '2' ? 'work' : 'slide'; session.stage = 'language'; await sendMessage(chatId, 'Tilni tanlang: 1 — O‘zbek  2 — Русский  3 — English'); }
  else if (session.stage === 'language') { session.language = text === '2' ? 'Russian' : text === '3' ? 'English' : 'Uzbek'; session.stage = 'level'; await sendMessage(chatId, 'Ta’lim darajasini yuboring (masalan: 9-sinf, bakalavr, magistratura):'); }
  else if (session.stage === 'level') { session.level = text; session.stage = 'slides'; await sendMessage(chatId, 'Nechta slayd/bo‘lim kerak? (6–20)'); }
  else if (session.stage === 'slides') { session.slides = Math.max(6, Math.min(20, Number.parseInt(text, 10) || 10)); session.stage = 'author'; await sendMessage(chatId, 'Titul sahifasiga ism-familiyangizni yozaymi? Ismni yuboring yoki “yo‘q” deb yozing:'); }
  else if (session.stage === 'author') { session.author = text.toLowerCase() === 'yo‘q' ? undefined : text; session.title = Boolean(session.author); await sendMessage(chatId, 'Tayyorlanmoqda. Sifatli material va fayllar yaratilmoqda, biroz kuting...'); try { const content = await generateContent(session); if (session.author) content.subtitle += `\n${session.author}`; const [pptx, docx, pdf] = await Promise.all([createPptx(content, Boolean(session.title)), createDocx(content, Boolean(session.title)), createPdf(content, Boolean(session.title))]); await sendDocument(chatId, pptx, `${content.title}.pptx`, 'Taqdimot tayyor'); await sendDocument(chatId, docx, `${content.title}.docx`, 'Mustaqil ish tayyor'); await sendDocument(chatId, pdf, `${content.title}.pdf`, 'PDF nusxa tayyor'); await sendMessage(chatId, 'Barchasi tayyor. Yangi ish uchun /new yuboring.'); } catch (error) { console.error('[v0] Document generation failed:', error); await sendMessage(chatId, 'Fayl yaratishda xatolik yuz berdi. Iltimos, /new orqali qayta urinib ko‘ring.'); } sessions.delete(chatId) }
  return NextResponse.json({ ok: true }) }
export async function GET() { return NextResponse.json({ service: 'EduMaker Telegram webhook', configured: Boolean(process.env.TELEGRAM_BOT_TOKEN), aiConfigured: Boolean(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY) }) }

