const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const resetButton = document.querySelector("#reset")
const score = document.querySelector("#score")
const gameOverDiv = document.querySelector("#gameOver")

const CANVAS_WIDTH = 510
const CANVAS_HEIGHT = 450
const BLOCK_SIZE = 30
const GAME_SPEED = {
    SLOW: 300,
    MEDIUM: 200,
    FAST: 100
}
let counter = 0

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

// Snake variables
let snakeSpeedX = 0
let snakeSpeedY = 0

const snake = [
    {x: BLOCK_SIZE * 3, y: BLOCK_SIZE * 7},
    {x: BLOCK_SIZE * 2, y: BLOCK_SIZE * 7},
    {x: BLOCK_SIZE * 1, y: BLOCK_SIZE * 7},
]

let gameOver = false

// Food Variables
let foodX 
let foodY 
placeFoodCorrectly()

// UI
resetButton.addEventListener("click", () => {
    document.location.reload()
})


// Game functions
function placeFoodCorrectly() {
    while(true) { 
        let isColliding = false
        const x = Math.floor(Math.random() * 17) * BLOCK_SIZE
        const y = Math.floor(Math.random() * 15) * BLOCK_SIZE 
        for (let i = 0; i < snake.length; i++) {
            const current = snake[i]
            if(current.x === x && current.y === y) {
                isColliding = true
                break
            } 
        }
        if(isColliding) continue
        foodX = x
        foodY = y
        break
    }
}
function cleanCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawFood () {
    ctx.fillStyle = "red"
    ctx.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE)
    ctx.fill() 
}
function drawSnake () {
    for(let i = 0; i < snake.length; i++) {
        const { x, y } = snake[i]
        
        ctx.fillStyle = "#333"
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    }
}
function growBody () {
    const {x, y} = snake[0]
    if(x === foodX && y === foodY) {
        counter++
        score.innerHTML = counter
        const tail = snake[snake.length - 1]
        snake.push({x: tail.x, y: tail.y})
        placeFoodCorrectly()
    }
}

function moveSnake () {
    if(snakeSpeedX === 0 && snakeSpeedY === 0) return
    const head = {
        x: snake[0].x + snakeSpeedX * BLOCK_SIZE,
        y: snake[0].y + snakeSpeedY * BLOCK_SIZE
    }
    snake.unshift(head)
    snake.pop()
}
function checkCollision () {
    const {x, y} = snake[0]
    if(
        x  === CANVAS_WIDTH ||
        x < -1 ||
        y  === CANVAS_HEIGHT ||
        y < -1

    ) { 
        gameOver = true
    }
    for(let i = 1; i < snake.length; i++) {
        const body = snake[i]
        if(x === body.x && y === body.y) {
            gameOver = true
        }
    }
    
}

function snakeEvents () {
    document.addEventListener("keydown", handleKeyDown)
    function handleKeyDown (e) {
        const { key } = e
        
        // Right 
        if(
            (key === "ArrowRight" 
            || key === "d"
            || key === "D") &&
            snakeSpeedX !== -1
        ) {            
            snakeSpeedX = 1
            snakeSpeedY = 0
        } 

        // Left
        else if(
            (key === "ArrowLeft" 
            || key === "a"
            || key === "A") &&
            snakeSpeedX !== 1
         ) {
            snakeSpeedX = -1
            snakeSpeedY = 0
        } 

        // Up
        else if(
            (key === "ArrowUp"
            || key === "w"
            || key === "W") &&
            snakeSpeedY !== 1
        ) {
            snakeSpeedX = 0
            snakeSpeedY = -1
        } 

        // Down
        else if(
            (key === "ArrowDown" 
            || key === "s"
            || key === "S") &&
            snakeSpeedY !== -1
        ) {
            snakeSpeedX = 0
            snakeSpeedY = 1
        } 
    
    }  
 
}

function draw () {
    if(gameOver) {
        gameOverDiv.style.width = "516px"
        gameOverDiv.style.height = "456px"
        return
    }
    cleanCanvas()

    snakeEvents()
    moveSnake()
    growBody()
    drawSnake()
    drawFood()
    checkCollision()

}

setInterval(draw, GAME_SPEED.MEDIUM)
