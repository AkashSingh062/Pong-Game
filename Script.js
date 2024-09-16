const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Create the pong paddle and ball
const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
const paddleSpeed = 5, ballSpeed = 4;

let leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
let rightPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, dx: ballSpeed, dy: ballSpeed };

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
    rightPaddle.y += rightPaddle.dy;
    
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

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

function update() {
    draw();
    requestAnimationFrame(update);
}

function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
            leftPaddle.dy = -paddleSpeed;
            break;
        case 's':
            leftPaddle.dy = paddleSpeed;
            break;
        case 'ArrowUp':
            rightPaddle.dy = -paddleSpeed;
            break;
        case 'ArrowDown':
            rightPaddle.dy = paddleSpeed;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            rightPaddle.dy = 0;
            break;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

update();
