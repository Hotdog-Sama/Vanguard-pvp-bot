const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const botName = process.argv[2]
const botPassword = process.argv[3]
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')


createNewBot(botName, botPassword)



function createNewBot (botName) {
  const serverHost = 'bartyrealms.com'
const serverPort = '25565'
const proxyHost = '45.79.207.110'
const proxyPort = '9200'
  const bot = mineflayer.createBot({
    connect: client => {
      socks.createConnection({
        proxy: {
          host: proxyHost,
          port: parseInt(proxyPort),
          type: 5
        },
        command: 'connect',
        destination: {
          host: serverHost,
          port: parseInt(serverPort)
        }
      }, (err, info) => {
        if (err) {
          console.log(err)
          return
        }
  
        client.setSocket(info.socket)
        client.emit('connect')
      })
    },
    agent: new ProxyAgent({ protocol: 'socks5:', host: proxyHost, port: proxyPort }),
    username: botName,
  })
  
  bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  console.log('ok')
bot.chat('/login shat1223')
const mcData = require('minecraft-data')(bot.version)

  const defaultMove = new Movements(bot, mcData)
  defaultMove.allowFreeMotion = true
  bot.pathfinder.searchRadius = 1000

  bot.on('path_update', (results) => {
    console.log('[' + username + '] I can get there in ' + results.path.length + ' moves. Computation took ' + results.time.toFixed(2) + ' ms.')
  })

  bot.on('goal_reached', (goal) => {
    console.log('[' + username + '] Here I am !')
  })
  
  bot.on('chat', (username, message) => {
    if (username === '__facts__') return

    const target = bot.players['__facts__'].entity
    bot.on('chat', (username, message) => {
      if (username === '__facts__') return
      
  
  
  
      
      if (message === 'bot swarm') {
        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalFollow(target, 2), true)
        bot.chat('command detected.')
    } else if (message === 'avoid') {
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalInvert(new GoalFollow(target, 5)), true)
    } else if (message === 'stop') {
      bot.pathfinder.setGoal(null)
    }
  })
})
})
}
