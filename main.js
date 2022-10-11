// set up canvas

let canvas
let ctx
canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
canvas.width = 400
canvas.height = 700
document.body.appendChild(canvas)

let backgroundImage, spacecraftImage, bulletImage, enemyImage, gameOverImage
function loadImage() {
  backgroundImage = new Image()
  backgroundImage.src = 'images/space shooter background.jpg'

  spacecraftImage = new Image()
  spacecraftImage.src = 'images/spacecraft.png'

  bulletImage = new Image()
  bulletImage.src = 'images/bullet.png'

  enemyImage = new Image()
  enemyImage.src = 'images/spacecraft-enemies.png'

  gameOverImage = new Image()
  gameOverImage.src = 'images/game over logo.webp'
}
// spacecraft coordinates, icon = 67 x 67, height = 700 - 67 = 633, / width = 200 - 33.5 = 166.5
let spacecraftX = canvas.width / 2 - 33.5
let spacecraftY = canvas.height - 67

let bulletContainer = []
function Bullet() {
  this.x = 0
  this.y = 0
  this.init = function () {
    this.x = spacecraftX + 20
    this.y = spacecraftY
    bulletContainer.push(this)
    console.log('new bullets in an array', bulletContainer)
  }

  this.updateBullets = function () {
    this.y -= 7
    console.log('move bullets y-axis')
  }
}

function createBullet() {
  let b = new Bullet()
  b.init()
  console.log('bulletcreated')
}

// using arrow key to change X,Y coordinates of spacecraft and render
let keysDown = {}
function arrowKeyListener() {
  document.addEventListener('keydown', function (event) {
    keysDown[event.key] = true
    console.log('key pressed', event.key)
    console.log('what value goes into keysDown', keysDown)
  })
  document.addEventListener('keyup', function (event) {
    delete keysDown[event.key]

    if (event.key == ' ') {
      createBullet()
    }
  })
}

// create bullet
// 1. shoots bullet when spacebar is pressed
// 2. shoots bullet, how to set y axis , x axis of bullets. y axis will be --, x axis will be spacecraft's x axis when bullet was shot
// 3. bullets shot should go into an array
// 4. bullets in the array will have x,y coordinates
// 5. render the array of bullets
// 6. bullet moves after fired

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
    bulletContainer[i].updateBullets()
  }
}

//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
function renderImages() {
  console.log('123')
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(spacecraftImage, spacecraftX, spacecraftY, 67, 67)

  for (let i = 0; i < bulletContainer.length; i++) {
    ctx.drawImage(bulletImage, bulletContainer[i].x, bulletContainer[i].y)
  }
}

function main() {
  update()
  renderImages()
  requestAnimationFrame(main)
}

loadImage()
arrowKeyListener()
main()
