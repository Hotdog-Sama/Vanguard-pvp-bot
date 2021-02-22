const cp = require('child_process')
const path = require('path')
const assert = require('assert')
const { Vec3 } = require('vec3')
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8')
const events = require('events').EventEmitter.defaultMaxListeners = Infinity


function startBot (botName, Password) {
  const command = 'node ' + path.join(__dirname, 'start_bot') + ' ' + botName
  cp.exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(`Error: ${err}`)
      console.log(`Bot broken: ${botName}`)
      console.log(`Restarting bot ${botName}...`)
      setTimeout(() => startBot(botName, Password), 5000)
      return
    }

    if (stdout) {
      console.log(`Stdout: ${stdout}`)
    }

    if (stderr) {
      console.log(`Stderr: ${stderr}`)
    }
  })  
}

const botsToStart = [
  { username: 'someone.lol123456@gmail.com' },
  { username: 'idk.johnson.uno@gmail.com' },
  { username: 'epicaa534@gmail.com' },
  { username: 'hotdogsama22@gmail.com' },
  { username: 'villzy.bizz@gmail.com' },
  { username: 'doyoulovemeimasong@gmail.com' },
  
]

let i = 0
function runNextBot () {
  const botToStart = botsToStart[i]
  i++
  if (i <= botsToStart.length) {
    setTimeout(() => {
      startBot(botToStart.username)
      runNextBot()
    }, 6000) //I recommended you wait for dont stuck the server they can detect too many connections at same time
  }
};

runNextBot()