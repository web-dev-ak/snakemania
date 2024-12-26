const btnLeft = document.getElementById('btn-left');
const btnUp = document.getElementById('btn-up');
const btnRight = document.getElementById('btn-right');
const btnDown = document.getElementById('btn-down');

const score = document.getElementById('score');
const time = document.getElementById('time');
const sprite = document.getElementById('sprite');
const food = document.getElementById('food');

const playBox = document.getElementById('game-box');
const gameOverScreen = document.getElementById('game-over-end-screen');
const gameOverRestartBtn = document.getElementById('game-over-restart-btn');
const restartBtn = document.getElementById('score-box-restart-btn');
const gameStartBtn = document.getElementById('game-start-btn');
const gameStartBtnBox = document.getElementById('game-start-btn-box');
const gameOverFinalScore = document.getElementById('game-over-final-score');

let timer = 5000; // Default timer duration (in milliseconds)
let timeoutId;
let countdownIntervalId;
// Initialize sprite position
let spriteX = 0;
let spriteY = 0;
let intervalId; // Store interval ID for movement

// Function to control element visibility
function controlVisibility(element, visibility) {
    element.style.display = visibility;
}

// Show Game Over screen and update final score
function gameOver() {
    gameOverFinalScore.textContent = score.textContent;
    controlVisibility(gameOverScreen, 'grid');
}

// Reset the game to the initial state
function resetGame() {
    clearTimeout(timeoutId);
    clearInterval(countdownIntervalId);

    score.textContent = '000';
    spriteX = 0;
    spriteY = 0;

    sprite.style.left = `${spriteX}px`;
    sprite.style.top = `${spriteY}px`;

    generateAndPlace();
    startCountdown();
    controlVisibility(gameOverScreen, 'none');
}

// Start the countdown and timeout for the game
function startCountdown() {
    clearTimeout(timeoutId);
    clearInterval(countdownIntervalId);

    let remainingTime = timer / 1000; // Convert milliseconds to seconds
    time.textContent = `00:${remainingTime < 10 ? "0" : ""}${remainingTime}`;

    countdownIntervalId = setInterval(() => {
        remainingTime -= 1;
        time.textContent = `00:${remainingTime < 10 ? "0" : ""}${remainingTime}`;
        if (remainingTime <= 0) {
            clearInterval(countdownIntervalId);
        }
    }, 1000);

    timeoutId = setTimeout(gameOver, timer);
}

// Generate random coordinates for placing food
function getRandomCoordinates() {
    const foodWidth = food.offsetWidth;
    const foodHeight = food.offsetHeight;
    const playBoxWidth = playBox.offsetWidth;
    const playBoxHeight = playBox.offsetHeight;

    const x = Math.floor(Math.random() * (playBoxWidth - foodWidth));
    const y = Math.floor(Math.random() * (playBoxHeight - foodHeight));

    return [x, y];
}

// Place the food at a random position
function generateAndPlace() {
    const [x, y] = getRandomCoordinates();
    food.style.top = `${y}px`;
    food.style.left = `${x}px`;
    startCountdown(); // Reset the countdown each time food is placed
}

// Function to move sprite
function moveSprite(direction) {
    clearInterval(intervalId); // Stop previous movement
    intervalId = setInterval(() => {
        const step = 5; // Step size
        if (direction === "right" && spriteX < playBox.offsetWidth - sprite.offsetWidth) spriteX += step;
        if (direction === "left" && spriteX > 0) spriteX -= step;
        if (direction === "up" && spriteY > 0) spriteY -= step;
        if (direction === "down" && spriteY < playBox.offsetHeight - sprite.offsetHeight) spriteY += step;

        sprite.style.left = `${spriteX}px`;
        sprite.style.top = `${spriteY}px`;

        // Check for collision with food
        if (checkCollision()) {
            generateAndPlace(); // Place new food
            incrementScore();   // Update score
        }
    }, 20);
}

// Attach movement event listeners to buttons
function addMovementListeners(button, direction) {
    button.addEventListener("pointerdown", () => moveSprite(direction));
    button.addEventListener("pointerup", () => clearInterval(intervalId));
    button.addEventListener("pointerleave", () => clearInterval(intervalId));
}

addMovementListeners(btnRight, "right");
addMovementListeners(btnLeft, "left");
addMovementListeners(btnUp, "up");
addMovementListeners(btnDown, "down");

// Check collision between sprite and food
function checkCollision() {
    const spriteRect = sprite.getBoundingClientRect();
    const foodRect = food.getBoundingClientRect();

    return !(
        spriteRect.right < foodRect.left ||  // Sprite is left of the food
        spriteRect.left > foodRect.right || // Sprite is right of the food
        spriteRect.bottom < foodRect.top || // Sprite is above the food
        spriteRect.top > foodRect.bottom    // Sprite is below the food
    );
}

// Increment score by 10 points
function incrementScore() {
    let currentScore = parseInt(score.textContent, 10);
    currentScore += 10;
    score.textContent = currentScore.toString().padStart(3, "0");
}

// Event listeners for restarting and starting the game
restartBtn.addEventListener('click', resetGame);
gameOverRestartBtn.addEventListener('click', resetGame);

gameStartBtn.addEventListener('click', () => {
    generateAndPlace();
    startCountdown();
    controlVisibility(gameStartBtnBox, 'none');
});

// Initialize the game
controlVisibility(gameOverScreen, 'none');
controlVisibility(gameStartBtnBox, 'block');