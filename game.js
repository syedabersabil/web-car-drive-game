const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const speedDisplay = document.getElementById('speed');
const distanceDisplay = document.getElementById('distance');

// Canvas setup
canvas.width = 600;
canvas.height = 400;

// Car object
const car = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 80,
    width: 40,
    height: 60,
    speed: 0,
    maxSpeed: 10,
    acceleration: 0.3,
    friction: 0.1,
    turnSpeed: 5,
    angle: 0,
    distance: 0
};

// Road lines
const roadLines = [];
for (let i = 0; i < 6; i++) {
    roadLines.push({
        x: canvas.width / 2 - 5,
        y: i * 100,
        width: 10,
        height: 50
    });
}

// Keyboard state
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mobile controls
document.getElementById('left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
document.getElementById('left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
document.getElementById('right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
document.getElementById('right').addEventListener('touchend', () => keys['ArrowRight'] = false);
document.getElementById('up').addEventListener('touchstart', () => keys['ArrowUp'] = true);
document.getElementById('up').addEventListener('touchend', () => keys['ArrowUp'] = false);
document.getElementById('down').addEventListener('touchstart', () => keys['ArrowDown'] = true);
document.getElementById('down').addEventListener('touchend', () => keys['ArrowDown'] = false);

function drawCar() {
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle * Math.PI / 180);
    
    // Car body
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    
    // Car windows
    ctx.fillStyle = '#3498db';
    ctx.fillRect(-car.width / 2 + 5, -car.height / 2 + 5, car.width - 10, car.height / 3);
    
    // Car wheels
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-car.width / 2 - 5, -car.height / 2 + 10, 5, 15);
    ctx.fillRect(car.width / 2, -car.height / 2 + 10, 5, 15);
    ctx.fillRect(-car.width / 2 - 5, car.height / 2 - 25, 5, 15);
    ctx.fillRect(car.width / 2, car.height / 2 - 25, 5, 15);
    
    ctx.restore();
}

function drawRoad() {
    // Road
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Road edges
    ctx.fillStyle = '#fff';
    ctx.fillRect(50, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 60, 0, 10, canvas.height);
    
    // Center lines
    ctx.fillStyle = '#ff0';
    roadLines.forEach(line => {
        ctx.fillRect(line.x, line.y, line.width, line.height);
    });
}

function updateRoadLines() {
    roadLines.forEach(line => {
        line.y += car.speed;
        if (line.y > canvas.height) {
            line.y = -50;
        }
    });
}

function updateCar() {
    // Acceleration
    if (keys['ArrowUp']) {
        car.speed = Math.min(car.speed + car.acceleration, car.maxSpeed);
    } else if (keys['ArrowDown']) {
        car.speed = Math.max(car.speed - car.acceleration, -car.maxSpeed / 2);
    } else {
        // Apply friction
        if (car.speed > 0) {
            car.speed = Math.max(0, car.speed - car.friction);
        } else if (car.speed < 0) {
            car.speed = Math.min(0, car.speed + car.friction);
        }
    }
    
    // Braking
    if (keys[' ']) {
        car.speed *= 0.9;
    }
    
    // Turning
    if (keys['ArrowLeft'] && car.speed !== 0) {
        car.angle -= car.turnSpeed;
        car.x = Math.max(70, car.x - 3);
    }
    if (keys['ArrowRight'] && car.speed !== 0) {
        car.angle += car.turnSpeed;
        car.x = Math.min(canvas.width - 70 - car.width, car.x + 3);
    }
    
    // Keep angle in range
    if (car.angle > 30) car.angle = 30;
    if (car.angle < -30) car.angle = -30;
    
    // Reset angle when not turning
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        car.angle *= 0.9;
    }
    
    // Update distance
    car.distance += Math.abs(car.speed) / 10;
    
    // Update displays
    speedDisplay.textContent = Math.round(Math.abs(car.speed) * 10);
    distanceDisplay.textContent = Math.round(car.distance);
}

function gameLoop() {
    drawRoad();
    updateRoadLines();
    updateCar();
    drawCar();
    
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();