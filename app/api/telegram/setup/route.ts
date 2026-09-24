import { NextResponse } from 'next/server'

const telegramApi = () => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN sozlanmagan.' }, { status: 500 })
  const { action = 'status' } = await request.json().catch(() => ({}))
  const origin = new URL(request.url).origin
  const webhookUrl = `${origin}/api/telegram/webhook`
  const method = action === 'setup' ? 'setWebhook' : action === 'remove' ? 'deleteWebhook' : 'getWebhookInfo'
  const body = action === 'setup' ? { url: webhookUrl, allowed_updates: ['message'] } : undefined
  const response = await fetch(`${telegramApi()}/${method}`, { method: body ? 'POST' : 'GET', headers: body ? { 'content-type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
  const result = await response.json()
  if (!result.ok) return NextResponse.json({ error: result.description || 'Telegram API xatosi' }, { status: 502 })
  if (action === 'remove') return NextResponse.json({ configured: false, webhookUrl: '' })
  const info = action === 'setup' ? (await fetch(`${telegramApi()}/getWebhookInfo`, { cache: 'no-store' }).then((res) => res.json())).result : result.result
  return NextResponse.json({ configured: Boolean(info?.url), webhookUrl: info?.url || '', pending: info?.pending_update_count || 0 })
}

export async function GET(request: Request) {
  return POST(new Request(request.url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'status' }) }))
}
