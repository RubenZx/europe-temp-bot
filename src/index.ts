import Telegraf from 'telegraf'
import commandArgs from './middleware/arguments'
import { config } from 'dotenv'
import { ContextMessageUpdateArgs } from './types'
import request = require('request')
import express = require('express')
import bodyParser = require('body-parser')
import { NotifyPayload } from './types'
const app = express()

app.use(bodyParser())

const dotenv = config()
const BOT_TOKEN = `${dotenv.parsed.BOT_TOKEN}`
const USERNAME = dotenv.parsed.USERNAME

const bot = new Telegraf(BOT_TOKEN, { username: USERNAME })
const cities = ['mad', 'lon', 'mow', 'zrh', 'ams', 'cdg', 'lis', 'ber', 'avg']

bot.use(commandArgs)
bot.start(ctx => ctx.reply('Welcome to the global warming!'))
bot.help(ctx => {
  let help = ""
  const command = "/subscribe "
  cities.forEach(city => {
    help += command + city + "\n"
  })
  ctx.reply(help)
})

bot.command('subscribe', (ctx: ContextMessageUpdateArgs) => {
  if (ctx.command.args.length < 1) {
    ctx.reply('Try /help')
  } else {
    const city = ctx.command.args[0]
    if (cities.includes(city)) {
      request.post(
        'http://127.0.0.1:8081/subscribe',
        { json: { id: ctx.from.id, chatid: ctx.chat.id, city: city } },
        (error, resp, body) => {
          console.log(body)
          if (error) {
            ctx.reply('An error ocurred')
            return
          }
          if (body.exists) {
            ctx.reply(`${city} is already registered`)
            return
          }
          if (resp.statusCode == 200) {
            ctx.reply(`Your preference ${city} has been registered`)
            return
          }
        },
      )
    } else {
      ctx.reply(`Try with this values: ${cities.join(', ')}`)
    }
  }
})

const average = (array: number[]) => {
  let average = 0
  for(let i = 1; i < array.length; i++){
    average += +array[i]
  }
  return average = average/(array.length-1)
}

app.post('/', (req, res) => {
  const body = req.body as NotifyPayload

  body.users.forEach(user => {
    if (user.city == 'avg') {
      const avg = average(Object.values(body.cities))
      bot.telegram.sendMessage(
        user.chatid,
        `The medium temperature of Europe is ${avg}`,
      )
    } else {
      bot.telegram.sendMessage(
        user.chatid,
        `The temperature of ${user.city} is ${body.cities[user.city]}`,
      )
    }
  })
  console.log(body)
  res.writeHead(200)
  res.end()
})

bot.telegram.deleteWebhook()
bot.startPolling()
app.listen(3000)
