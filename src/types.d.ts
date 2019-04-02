import { ContextMessageUpdate } from 'telegraf'

export interface ContextMessageUpdateArgs extends ContextMessageUpdate {
  command?: { raw: string; command: string; args: string[] }
}

export interface NotifyUsers {
  id: string
  username: string
  campus: string
  chatid: number
}

export interface NotifyPayload {
  city: string
  temp: string
  user: string
}
