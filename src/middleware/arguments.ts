import { ContextMessageUpdateArgs } from '../types'

const commandArgs = (ctx: ContextMessageUpdateArgs, next) => {
  if (ctx.updateType === 'message' && ctx.update.message.text !== undefined) {
    const text = ctx.update.message.text.toLowerCase()
    if (text.startsWith('/')) {
      const match = text.match(/^\/([^\s]+)\s?(.+)?/)
      let args = [] as string[]
      let command: string
      if (match !== null) {
        if (match[1]) {
          command = match[1]
        }
        if (match[2]) {
          args = match[2].split(' ')
        }
      }
      ctx.command = {
        raw: text,
        command,
        args,
      }
      console.log(ctx.command)
    }
  }
  return next()
}

export default commandArgs
