class Obstacle {
    constructor(canvas, row) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.row = row;
        this.height = OBSTACLE_HEIGHT;
        this.width = this.randomWidth();
        this.speed = this.randomSpeed() * (row % 2 === 0 ? 1 : -1); // Alternate direction per row
        this.reset();
    }

    randomWidth() {
        return Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) + OBSTACLE_MIN_WIDTH;
    }

    randomSpeed() {
        return Math.random() * (OBSTACLE_MAX_SPEED - OBSTACLE_MIN_SPEED) + OBSTACLE_MIN_SPEED;
    }

    reset() {
        // Distribute obstacles evenly across the canvas height
        const playableHeight = this.canvas.height - (GRID_SIZE * 3); // Remove safe zones
        const spacing = playableHeight / (OBSTACLE_ROWS + 1);
        this.y = GRID_SIZE + ((this.row + 1) * spacing) - (OBSTACLE_HEIGHT / 2);
        
        if (this.speed > 0) {
            this.x = -this.width; // Start from left
        } else {
            this.x = this.canvas.width; // Start from right
        }
    }

    update() {
        this.x += this.speed;

        // Reset position when obstacle goes off screen
        if (this.speed > 0 && this.x > this.canvas.width) {
            this.x = -this.width;
        } else if (this.speed < 0 && this.x + this.width < 0) {
            this.x = this.canvas.width;
        }
    }

    draw() {
        // Different colors for each row
        const rowColors = [
            '#e74c3c', // Red
            '#e67e22', // Orange
            '#f1c40f', // Yellow
            '#2ecc71', // Green
            '#3498db'  // Blue
        ];
        
        this.ctx.fillStyle = rowColors[this.row % rowColors.length];
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add some visual detail to the obstacles
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 10, this.y + 5);
        this.ctx.lineTo(this.x + this.width - 10, this.y + 5);
        this.ctx.stroke();
    }
}

class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.initObstacles();
    }

    initObstacles() {
        // Create obstacles for each row with better spacing
        for (let row = 0; row < OBSTACLE_ROWS; row++) {
            const spacing = this.canvas.width / (OBSTACLES_PER_ROW + 1);
            for (let i = 0; i < OBSTACLES_PER_ROW; i++) {
                const obstacle = new Obstacle(this.canvas, row);
                obstacle.x = spacing * (i + 1) - (obstacle.width / 2);
                this.obstacles.push(obstacle);
            }
        }
    }

    update() {
        this.obstacles.forEach(obstacle => obstacle.update());
    }

    draw() {
        this.obstacles.forEach(obstacle => obstacle.draw());
    }

    reset() {
        this.obstacles.forEach(obstacle => obstacle.reset());
    }
}
