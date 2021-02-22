const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const { GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const pvp = require('mineflayer-pvp').plugin
const viewer = require('prismarine-viewer').mineflayer

const botName = process.argv[2]
const botPassword = process.argv[3]

createNewBot(botName, botPassword)

function createNewBot (botName, Password = 'shit1223') {
  const bot = mineflayer.createBot({
    username: botName,
    host: 'play.ccnetmc.com',
    logErrors: true,
    version: '1.16.4',
    auth: 'Tlauncher.org'
  })

  bot.once('spawn', () => {
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    bot.chat('/og')
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
        const player = bot.players['__facts__']
    
        if (!player) {
          bot.chat("I can't see you.")
          return
        }
    
        bot.chat('I will guard that location.')
        guardArea(player.entity.position)
      }

      if (message === 'swarm') {
        const player = bot.players['__facts__']
    
        if (!player) {
          bot.chat("I can't see you.")
          return
        }
    
        bot.chat('I will guard that location.')
        guardArea(player.entity.position)
        while (1) {
          moveToGuardPos()
        }
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
    
      if (message === 'hp') {
        bot.chat(bot.health)
      }
    
    })
  })
}