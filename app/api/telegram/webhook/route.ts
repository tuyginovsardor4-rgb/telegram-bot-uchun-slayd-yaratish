import { NextResponse } from 'next/server'

const telegramApi = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

async function sendMessage(chatId: number, text: string) {
  return fetch(`${telegramApi()}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: 'Bot token is not configured' }, { status: 500 })
  const update = await request.json()
  const message = update?.message
  const chatId = message?.chat?.id
  if (!chatId) return NextResponse.json({ ok: true })

  const text = String(message.text ?? '').trim()
  if (text === '/start') {
    await sendMessage(chatId, 'Assalomu alaykum! Men EduMaker Botman.\n\nSizga slayd, mustaqil ish va PDF tayyorlab beraman.\n\nBoshlash uchun mavzuni yozing:')
  } else if (text) {
    await sendMessage(chatId, `Mavzu qabul qilindi: ${text}\n\nQaysi format kerak?\n1) PPTX — taqdimot\n2) DOCX — mustaqil ish\n3) PDF — hujjat\n\nRaqamni yuboring.`)
  }
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ service: 'EduMaker Telegram webhook', configured: Boolean(process.env.TELEGRAM_BOT_TOKEN) })
}
