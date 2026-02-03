import { tool } from "@opencode-ai/plugin"

const TELEGRAM_API = "https://api.telegram.org/bot"
const BOT_TOKEN = ""
const CHAT_ID = ""

interface TelegramResponse {
  ok: boolean
  description?: string
  result?: {
    message_id: number
    chat: { id: number }
    text: string
  }
}

export default tool({
  description:
    "Send a message to Simon via Telegram. Use this to notify about completed tasks, important updates, or when you need his attention.",
  args: {
    message: tool.schema.string().describe("The message to send"),
    parse_mode: tool.schema
      .enum(["Markdown", "MarkdownV2", "HTML"])
      .optional()
      .describe("Optional formatting mode for the message"),
  },
  async execute(args) {
    const url = `${TELEGRAM_API}${BOT_TOKEN}/sendMessage`

    const body: Record<string, string> = {
      chat_id: CHAT_ID,
      text: args.message,
    }

    if (args.parse_mode) {
      body.parse_mode = args.parse_mode
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data: TelegramResponse = await response.json()

    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description || "Unknown error"}`)
    }

    return `Message sent successfully (message_id: ${data.result?.message_id})`
  },
})
