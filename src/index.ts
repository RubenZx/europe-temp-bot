import Telegraf from 'telegraf'
import commandArgs from './middleware/arguments'
import * as dotenv from 'dotenv'
import { ContextMessageUpdateArgs } from './types'
import request = require('request')
import express = require('express')
import bodyParser = require('body-parser')
//import { NotifyPayload } from './types'
const app = express()

app.use(bodyParser())
dotenv.config()
const BOT_TOKEN = `${process.env.BOT_TOKEN}`
const USERNAME = process.env.USERNAME

const bot = new Telegraf(BOT_TOKEN, { username: USERNAME })
const cities = ['mad', 'lon', 'mow', 'zrh', 'ams', 'cdg', 'lis', 'ber']

bot.use(commandArgs)
bot.start(ctx => ctx.reply('Welcome to the global warming!'))
bot.help(ctx => ctx.reply('/subscribe city\n'))

bot.command('subscribe', (ctx: ContextMessageUpdateArgs) => {
  if (ctx.command.args.length < 1) {
    ctx.reply('Try /help')
  } else {
    const city = ctx.command.args[0]
      if (cities.includes(city)) {        
        request.post(
          'http://127.0.0.1:8081/subscribe',
          { json: { id: ctx.from.id, chatid: ctx.chat.id, city: city} },
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
/*
app.post('/', (req, res) => {
  //const body = req.body as NotifyPayload[]
  /*body.forEach(tempcit => {
    bot.telegram.sendMessage(tempcit.user, `Temperature of ${tempcit.city}: ${tempcit.temp}`)
  })
  console.log(req.body)
  res.writeHead(200)
  res.end()
})*/

bot.telegram.deleteWebhook()
bot.startPolling()
app.listen(3000)
