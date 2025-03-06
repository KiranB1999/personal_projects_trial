const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
canvas.width = 600;
canvas.height = 600;

let snake = [{x: gridSize * 5, y: gridSize * 5}];
let direction = {x: gridSize, y: 0};
let food = {x: gridSize * 10, y: gridSize * 10};
let score = 0;
let gameOver = false;
let visitedCells = new Set();  // Set to keep track of visited cells

// Q-learning parameters
let Q = {};  // Q-table
const learningRate = 0.1;
const discountFactor = 0.9;
let explorationRate = 1.0; // Initial exploration rate (epsilon)
const explorationDecay = 0.995;
const minExplorationRate = 0.01;

// Load snake head image
const snakeHeadImage = new Image();
snakeHeadImage.src = 'snake.png';  // Update the path if necessary

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.strokeRect(x, y, gridSize, gridSize);
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(snakeHeadImage, segment.x, segment.y, gridSize, gridSize);
        } else {
            drawRect(segment.x, segment.y, 'green');
        }
    });
}

function drawFood() {
    const gradient = ctx.createRadialGradient(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 4, food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'darkred');
    drawRect(food.x, food.y, gradient);
}

function moveSnake() {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check for wall collision and restart the game
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        // Reset game state
        restartGame();
        return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
        snake.unshift(newHead);
        placeFood();
        score += 10;
        document.getElementById('score').innerText = score;
    } else {
        snake.pop();
        snake.unshift(newHead);
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver = true;
        }
    }
}

function update() {
    if (gameOver) {
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('restartButton').style.display = 'block';
        return;
    } else {
        moveSnakeQLearning(); // Use Q-learning to move the snake
        checkCollision();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawSnake();
        drawFood();
    }
}

// Q-learning functions
function getState() {
    return `${snake[0].x},${snake[0].y},${food.x},${food.y}`;
}

function getAction(state) {
    if (Math.random() < explorationRate) {
        // Random action for exploration
        const actions = ['left', 'up', 'right', 'down'];
        return actions[Math.floor(Math.random() * actions.length)];
    } else {
        // Greedy action based on Q-values
        if (!Q[state]) {
            Q[state] = {left: 0, up: 0, right: 0, down: 0};
        }
        return Object.keys(Q[state]).reduce((a, b) => Q[state][a] > Q[state][b] ? a : b);
    }
}

function getNextPosition(head, action) {
    let newX = head.x;
    let newY = head.y;

    if (action === 'left') newX -= gridSize;
    if (action === 'right') newX += gridSize;
    if (action === 'up') newY -= gridSize;
    if (action === 'down') newY += gridSize;

    return { x: newX, y: newY };
}

function moveSnakeQLearning() {
    const state = getState();
    const action = getAction(state);

    const oldHead = { ...snake[0] };
    const nextPosition = getNextPosition(oldHead, action);

    // Temporarily set the direction based on the chosen action
    direction = { x: nextPosition.x - snake[0].x, y: nextPosition.y - snake[0].y };

    moveSnake();

    const nextState = getState();
    const reward = calculateReward(oldHead);

    updateQValue(state, action, reward, nextState);

    // Add the new position to visited cells
    visitedCells.add(`${snake[0].x},${snake[0].y}`);

    // Decay exploration rate
    if (explorationRate > minExplorationRate) {
        explorationRate *= explorationDecay;
    }
}

function calculateReward(oldHead) {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        return 10; // Reward for eating food
    } else if (gameOver) {
        return -10; // Penalty for losing
    } else {
        return -0.1; // Small penalty for each step taken
    }
}

function updateQValue(state, action, reward, nextState) {
    if (!Q[state]) {
        Q[state] = {left: 0, up: 0, right: 0, down: 0};
    }
    if (!Q[nextState]) {
        Q[nextState] = {left: 0, up: 0, right: 0, down: 0};
    }
    const maxNextQValue = Math.max(...Object.values(Q[nextState]));
    Q[state][action] += learningRate * (reward + discountFactor * maxNextQValue - Q[state][action]);
}

function restartGame() {
    snake = [{x: gridSize * 5, y: gridSize * 5}];
    direction = {x: gridSize, y: 0};
    score = 0;
    gameOver = false;
    document.getElementById('score').innerText = score;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    visitedCells.clear();  // Reset visited cells on game restart
    placeFood();
}

// Set up initial game state
placeFood();
setInterval(update, 100);