const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const armorManager = require('mineflayer-armor-manager')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const inventoryViewer = require('mineflayer-web-inventory')
const events = require('events').EventEmitter.defaultMaxListeners = Infinity



mineflayer.multiple = (bots, constructor) => {
    const { Worker, isMainThread, workerData } = require('worker_threads')
    if (isMainThread) {
      const threads = []
      for (const i in bots) {
        threads.push(new Worker(__filename, { workerData: bots[i] }))
      }
    } else {
      constructor(workerData)
    }
}
  
  const bots = []
  for (let i = 0; i < 1; i++) {
    bots.push({ username: `bot${i}` })
  }
  
  mineflayer.multiple(bots, ({ username }) => {
    const bot = mineflayer.createBot({ username,  host: 'play.ultimismc.com', auth: 'tlauncher.org' })

    

    
bot.once('spawn', () => {
    bot.loadPlugin(pvp)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pathfinder)
  // Once we've spawn, it is safe to access mcData because we know the version
  const mcData = require('minecraft-data')(bot.version)
  bot.chat('/login shaaat1223')
  console.log('ok')
  // We create different movement generators for different type of activity
  const defaultMove = new Movements(bot, mcData, pvp)
  defaultMove.allowFreeMotion = true
  bot.pathfinder.searchRadius = 100

  bot.on('path_update', (results) => {
    console.log('[' + username + '] I can get there in ' + results.path.length + ' moves. Computation took ' + results.time.toFixed(2) + ' ms.')
  })

  bot.on('goal_reached', (goal) => {
    console.log('[' + username + '] Here I am !')
  })



  
  bot.on('chat', (username, message) => {
    if (username === bot.players['__facts__']) return
    const target = bot.players['__facts__'].entity

    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
    e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

const entity = bot.nearestEntity(filter)

    
    if (message === 'bot.swarm') {
      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalFollow(target, 3), true)
      bot.chat('command detected.')
    } if (message === 'avoid') {
      bot.pathfinder.setMovements (defaultMove)
      bot.pathfinder.setGoal (new GoalInvert(new GoalFollow(target, 5)), true)
    } else if (message === 'stop') {
      bot.pathfinder.setGoal(null)
    }
  
    
    
   

 
  })
  })
  })
