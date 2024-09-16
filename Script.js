const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Create the pong paddle and ball
const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
const paddleSpeed = 5, ballSpeed = 4, aiSpeed = 7;

let leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
let rightPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, dx: ballSpeed, dy: ballSpeed };

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Move paddles
    leftPaddle.y += leftPaddle.dy;
    moveAIPaddle();
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }
    
    // Ball collision with paddles
    if (
        (ball.x - ball.size < leftPaddle.x + leftPaddle.width && 
        ball.y > leftPaddle.y && 
        ball.y < leftPaddle.y + leftPaddle.height) ||
        (ball.x + ball.size > rightPaddle.x && 
        ball.y > rightPaddle.y && 
        ball.y < rightPaddle.y + rightPaddle.height)
    ) {
        ball.dx *= -1;
    }
    
    // Ball out of bounds
    if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        resetBall();
    }
}

// Reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

// Function to move AI paddle
function moveAIPaddle() {
    // Predictive AI movement
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    const ballCenter = ball.y;
    
    // Move AI paddle based on ball's position and speed
    if (ball.dx < 0) {
        const predictedY = ballCenter + ball.dy * (Math.abs(leftPaddle.x - ball.x) / ballSpeed);
        if (predictedY < rightPaddle.y + rightPaddle.height / 2 - 35) {
            rightPaddle.y -= aiSpeed;
        } else if (predictedY > rightPaddle.y + rightPaddle.height / 2 + 35) {
            rightPaddle.y += aiSpeed;
        }
    }

    // Keep the AI paddle within bounds
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y > canvas.height - rightPaddle.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

// Update the game state
function update() {
    draw();
    requestAnimationFrame(update);
}

// Handle keyboard input for the player paddle
function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
            leftPaddle.dy = -paddleSpeed;
            break;
        case 's':
            leftPaddle.dy = paddleSpeed;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

update();
