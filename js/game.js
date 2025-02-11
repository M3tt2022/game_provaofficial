class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        this.state = GAME_STATES.READY;
        this.scoreManager = new ScoreManager();
        this.audioManager = new AudioManager();
        this.player = new Player(this.canvas);
        this.player.setGame(this);
        this.obstacleManager = new ObstacleManager(this.canvas);
        
        // Show welcome message first
        this.showWelcomeScreen();
        
        // Then setup event listeners and start game loop
        this.setupEventListeners();
        this.startGameLoop();
    }

    showWelcomeScreen() {
        this.scoreManager.showWelcomeScreen();
        this.state = GAME_STATES.READY;
    }

    setupEventListeners() {
        // Space key to start
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.state === GAME_STATES.READY || 
                    this.state === GAME_STATES.GAME_OVER) {
                    this.startGame();
                }
            }
        });

        // Start button click - using event delegation for better reliability
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'startButton') {
                if (this.state === GAME_STATES.READY || 
                    this.state === GAME_STATES.GAME_OVER) {
                    this.startGame();
                }
            }
        });
    }

    startGame() {
        this.state = GAME_STATES.PLAYING;
        this.player.reset();
        this.obstacleManager.reset();
        this.scoreManager.hideMessage();
        this.scoreManager.startLevel();
        
        // Only reset score manager if game over
        if (this.state === GAME_STATES.GAME_OVER) {
            this.scoreManager.reset();
        }
    }

    update() {
        if (this.state !== GAME_STATES.PLAYING) return;

        this.player.update();
        this.obstacleManager.update();

        // Check collisions with obstacles
        if (CollisionDetector.checkObstaclesCollision(this.player, this.obstacleManager.obstacles)) {
            this.audioManager.playCollision();
            if (this.scoreManager.loseLife()) {
                this.audioManager.playGameOver();
                this.state = GAME_STATES.GAME_OVER;
            } else {
                this.player.reset();
            }
        }

        // Check if player reached the goal
        if (this.player.y < GRID_SIZE) {
            this.audioManager.playVictory();
            this.scoreManager.addCrossingPoints();
            this.player.reset();
            // Add a pause before continuing
            this.state = GAME_STATES.READY;
            setTimeout(() => {
                if (this.state === GAME_STATES.READY) {
                    this.startGame();
                }
            }, 1500);
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw goal zone
        this.ctx.fillStyle = COLORS.GOAL_ZONE;
        this.ctx.fillRect(0, 0, this.canvas.width, GRID_SIZE);

        // Draw safe zones
        this.ctx.fillStyle = COLORS.SAFE_ZONE;
        this.ctx.fillRect(0, this.canvas.height - GRID_SIZE, this.canvas.width, GRID_SIZE);

        // Draw game elements only if playing
        if (this.state === GAME_STATES.PLAYING) {
            this.obstacleManager.draw();
            this.player.draw();
        }

        // Draw grid lines
        this.drawGrid();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    startGameLoop() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
