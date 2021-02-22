const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const pvp = require('mineflayer-pvp').plugin
const events = require('events').EventEmitter.defaultMaxListeners = Infinity
const socks = require('socks5').SocksClient
const ProxyAgent = require('proxy-agent')
const armorManager = require('mineflayer-armor-manager')
const mineflayerViewer = require('prismarine-viewer').mineflayer

mineflayer.multiple = (bots, constructor) => {
  const { Worker, isMainThread, workerData } = require('worker_threads')
  if (isMainThread) {
    const threads = []
    for (const i in bots) {
      threads.push(new Worker(__filename, { workerData: bots[i] }))
    }
  }
}

const bots = []
for (let i = 0; i < 10; i++) {
  bots.push({ username: `vanguard-${i}` })
}
const serverHost = 'localhost'
const serverPort = '55078'
const proxyHost = '103.66.233.149'
const proxyPort = '4145'
const password = 'shit1223'

mineflayer.multiple(bots, ({ username }) => {
  const bot = mineflayer.createBot({ 
    connect: client => {({
          proxy: {
            host: proxyHost,
            port: parseInt(proxyPort),
            type: 5
          },
          command: 'connect',
          destination: {
            host: serverHost,
            port: serverPort,
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
      agent: new ProxyAgent({ protocol: 'socks4:', host: proxyHost, port: proxyPort }),
      username: username,
      password: password,
      auth: 'tlauncher.org',
      version: false
   })

   bot.loadPlugin(pvp)
   bot.loadPlugin(armorManager)
   bot.loadPlugin(pathfinder)

   function runNextBot () {
    i++
    if (i <= i < 10 ) {
      setTimeout(() => {
        startBot(botToStart.username)
        runNextBot()
      }, 6000) //I recommended you wait for dont stuck the server they can detect too many connections at same time
    }
  };
  
  runNextBot()

























  bot.once('spawn', () => {
    // Once we've spawn, it is safe to access mcData because we know the version
    const mcData = require('minecraft-data')(bot.version)
   console.log('ok')
   bot.chat('/register shiat1223')
    bot.chat('/login shiat1223')
    bot.on('playerCollect', (collector, itemDrop) => {
      if (collector !== bot.entity) return
    
      setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')
      }, 150)
    })
    
    bot.on('playerCollect', (collector, itemDrop) => {
      if (collector !== bot.entity) return
    
      setTimeout(() => {
        const shield = bot.inventory.items().find(item => item.name.includes('shield'))
        if (shield) bot.equip(shield, 'off-hand')
      }, 250)
    })
    
    let guardPos = null
    
    function guardArea (pos) {
      guardPos = pos.clone()
    
      if (!bot.pvp.target) {
        moveToGuardPos()
      }
    }
    
    function stopGuarding () {
      guardPos = null
      bot.pvp.stop()
      bot.pathfinder.setGoal(null)
    }
    
    function moveToGuardPos () {
      const mcData = require('minecraft-data')(bot.version)
      bot.pathfinder.setMovements(new Movements(bot, mcData))
      bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }
    
    bot.on('stoppedAttacking', () => {
      if (guardPos) {
        moveToGuardPos()
      }
    })
    
    bot.on('physicTick', () => {
      if (bot.pvp.target) return
      if (bot.pathfinder.isMoving()) return
    
      const entity = bot.nearestEntity()
      if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
    })
    
    bot.on('physicTick', () => {
      if (!guardPos) return
    
      const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
                          e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?
    
      const entity = bot.nearestEntity(filter)
      if (entity) {
        bot.pvp.attack(entity)
      }
    })
    
    bot.on('chat', (username, message) => {
      if (message === 'guard') {
        const player = bot.players[username]
    
        if (!player) {
          bot.chat("I can't see you.")
          return
        }
    
        bot.chat('I will guard that location.')
        guardArea(player.entity.position)
      }
    
      if (message === 'fight me') {
        const player = bot.players[username]
    
        if (!player) {
          bot.chat("I can't see you.")
          return
        }
    
        bot.chat('Prepare to fight!')
        bot.pvp.attack(player.entity)
      }
    
      if (message === 'stop') {
        bot.chat('I will no longer guard this area.')
        stopGuarding()
      }
    })
  })


    // We create different movement generators for different type of activity
    
  })