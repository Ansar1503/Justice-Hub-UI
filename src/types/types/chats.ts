export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: ChatAttachment[]
}

export interface ChatAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface ChatConversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messages: ChatMessage[]
}
