const cp = require('child_process')
const path = require('path')

function startBot (botName, password) {
  const command = 'node ' + path.join(__dirname, 'start_bot') + ' ' + botName
  cp.exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(`Error: ${err}`)
      console.log(`Bot broken: ${botName}`)
      console.log(`Restarting bot ${botName}...`)
      setTimeout(() => startBot(botName, password), 1000)
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
  { username: 'Guard1' },
  { username: 'Guard2' },
  { username: 'Guard3' },
  { username: 'Guard4' },
  { username: 'Guard5' },
  { username: 'Guard6' },
  { username: 'Guard7' },
  { username: 'Guard7' },
  { username: 'Guard8' },
  { username: 'Guard9' },
  { username: 'Guard10' },
  { username: 'Guard11' },
  { username: 'Guard12' },
  { username: 'Guard13' },
  { username: 'Guard14' },
  { username: 'Guard15' },
]

let i = 0
function runNextBot () {
  const botToStart = botsToStart[i]
  i++
  if (i <= botsToStart.length) {
    setTimeout(() => {
      startBot(botToStart.username)
      runNextBot()
    }, 1000) //I recommended you wait for dont stuck the server they can detect too many connections at same time

  }
};

runNextBot()