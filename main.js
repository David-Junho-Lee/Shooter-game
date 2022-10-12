// set up canvas

let canvas
let ctx
canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
canvas.width = 400
canvas.height = 700
document.body.appendChild(canvas)

// create a start button
let startGame = document.createElement('h3')
let description = document.createElement('h3')
startGame.innerHTML = "To start, please press 'Ctrl + Q'"
description.innerHTML = 'use arrow key to move and spacebar to shoot'
document.body.appendChild(startGame)
document.body.appendChild(description)

let backgroundImage, spacecraftImage, bulletImage, alienImage, gameOverImage
let gameOver = false
function loadImage() {
  backgroundImage = new Image()
  backgroundImage.src = 'images/space shooter background.jpg'

  spacecraftImage = new Image()
  spacecraftImage.src = 'images/spacecraft.png'

  bulletImage = new Image()
  bulletImage.src = 'images/bullet.png'

  alienImage = new Image()
  alienImage.src = 'images/alien.png'

  gameOverImage = new Image()
  gameOverImage.src = 'images/game over logo.webp'
}
// spacecraft coordinates, icon = 67 x 67, height = 700 - 67 = 633, / width = 200 - 33.5 = 166.5
let spacecraftX = canvas.width / 2 - 33.5
let spacecraftY = canvas.height - 67
let score = 0
let bulletContainer = []
function Bullet() {
  this.x = 0
  this.y = 0
  this.init = function () {
    this.x = spacecraftX + 20
    this.y = spacecraftY
    this.active = true
    bulletContainer.push(this)
    console.log('new bullets in an array', bulletContainer)
  }

  this.updateBullets = function () {
    this.y -= 5
  }

  this.checkHit = function () {
    for (let i = 0; i < alienContainer.length; i++) {
      if (
        this.y <= alienContainer[i].y &&
        this.x >= alienContainer[i].x - 12 &&
        this.x <= alienContainer[i].x + 48
      ) {
        score++
        this.active = false
        alienContainer.splice(i, 1)
        let aliendeath = new Audio('sounds/aliendeath.wav')
        aliendeath.play()
      }
    }
  }
  this.outOfCanvas = function () {
    if (this.y <= 0) {
      this.active = false
    }
  }
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNum
}
let alienContainer = []
function Alien() {
  this.x = 0
  this.y = 0
  this.init = function () {
    this.x = generateRandomValue(0, canvas.width - 48)
    this.y = 0
    alienContainer.push(this)
  }
  this.updateAliens = function () {
    this.y += 1

    if (this.y >= canvas.height - 48) {
      gameOver = true
      let gameOverSound = new Audio('sounds/GameOver.wav')
      gameOverSound.play()
    }
  }
}

function createBullet() {
  let b = new Bullet()
  b.init()
  console.log('bulletcreated')
}
let delay = 1000
function createAlien() {
  let a = new Alien()
  a.init()
  if (score !== 0 && score % 50 === 0 && delay > 200) {
    delay -= 200
  }
  setTimeout(createAlien, delay)
}
// using arrow key to change X,Y coordinates of spacecraft and render
let keysDown = {}
function arrowKeyListener() {
  document.addEventListener('keydown', function (event) {
    keysDown[event.key] = true
    if (event.key == ' ') {
      createBullet()
      let shootingsound = new Audio('sounds/shootingsound.WAV')
      shootingsound.play()
    }
  })
  document.addEventListener('keyup', function (event) {
    delete keysDown[event.key]
  })
}

// create bullet
// 1. shoots bullet when spacebar is pressed
// 2. shoots bullet, how to set y axis , x axis of bullets. y axis will be --, x axis will be spacecraft's x axis when bullet was shot
// 3. bullets shot should go into an array
// 4. bullets in the array will have x,y coordinates
// 5. render the array of bullets
// 6. bullet moves after fired

// create alien
// 1. aliens spawn on random x axis
// 2. once aliens spawn, they move down on y axis
// 3. how often do they spawn
// 4. if aliens reach the bottom, game is over
// 5. if bullet hit alien, they die

// how to make interaction between bullet and alien
// 1. if bullet.y <= alien.y
// 2. if bullet.x >= alien.x && bullet.x <= alien.x + width of alien(48)
// 3. bullet and alien should both disappear

function update() {
  if ('ArrowLeft' in keysDown) {
    spacecraftX -= 3
  }
  if ('ArrowRight' in keysDown) {
    spacecraftX += 3
  }

  if (spacecraftX <= 0) {
    spacecraftX = 0
  }
  if (spacecraftX >= canvas.width - 67) {
    spacecraftX = canvas.width - 67
  }

  for (let i = 0; i < bulletContainer.length; i++) {
    if (bulletContainer[i].active) {
      bulletContainer[i].updateBullets()
      bulletContainer[i].outOfCanvas()
      bulletContainer[i].checkHit()
    }
  }

  for (let i = 0; i < alienContainer.length; i++) {
    alienContainer[i].updateAliens()
  }
}

//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
function renderImages() {
  console.log('123')
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(spacecraftImage, spacecraftX, spacecraftY, 67, 67)
  ctx.fillText(`Score: ${score}`, 0, 30)
  ctx.font = '20px Arial'
  ctx.fillStyle = 'yellow'

  for (let i = 0; i < bulletContainer.length; i++) {
    if (bulletContainer[i].active) {
      ctx.drawImage(bulletImage, bulletContainer[i].x, bulletContainer[i].y)
    }
  }

  for (let i = 0; i < alienContainer.length; i++) {
    ctx.drawImage(alienImage, alienContainer[i].x, alienContainer[i].y, 48, 48)
  }
}

function main() {
  if (!gameOver) {
    update()
    renderImages()
    requestAnimationFrame(main)
  } else {
    ctx.drawImage(gameOverImage, 0, 200, 400, 200)
  }
}

let backgroundMusic = [
  'sounds/alone-against-enemy.ogg',
  'sounds/battle-in-the-stars.ogg',
  'sounds/space-heroes',
  'sounds/without-fear.ogg',
]
let randomizeBGM = Math.floor(Math.random() * backgroundMusic.length)
console.log(randomizeBGM)
// let playBGM = new Audio(`${randomizeBGM}`)
let playBGM = new Audio()
playBGM.src = backgroundMusic[randomizeBGM]
playBGM.volume = 0.2
document.addEventListener('keydown', function (event) {
  keysDown[event.key] = true
  if (event.ctrlKey && event.key == 'q') {
    loadImage()
    arrowKeyListener()
    createAlien()
    main()
    playBGM.play()
  }
})
