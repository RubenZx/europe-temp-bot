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

export interface User {
  id: number
  chatid: number
  city: string
}

export interface Cities{
  fecha: string
  lon: string
  zrh: string
  ams: string
  lis: string
  ber: string
  cdg: string
  mow: string
  mad: string
}

export interface NotifyPayload {
  users: User[]
  cities: Cities
}
