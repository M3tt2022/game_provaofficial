class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = PLAYER_SIZE;
        this.height = PLAYER_SIZE;
        this.game = null; // Will be set by Game class
        this.reset();
        this.setupControls();
    }

    setGame(game) {
        this.game = game;
    }

    reset() {
        // Position player at bottom center
        this.x = (this.canvas.width - this.width) / 2;
        this.y = this.canvas.height - this.height - GRID_SIZE;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (![37, 38, 39, 40].includes(e.keyCode)) return;
            e.preventDefault(); // Prevent page scrolling

            const oldX = this.x;
            const oldY = this.y;

            switch(e.keyCode) {
                case 37: // Left
                    this.x -= PLAYER_SPEED;
                    break;
                case 38: // Up
                    this.y -= PLAYER_SPEED;
                    break;
                case 39: // Right
                    this.x += PLAYER_SPEED;
                    break;
                case 40: // Down
                    this.y += PLAYER_SPEED;
                    break;
            }

            // Check boundaries
            if (CollisionDetector.isOutOfBounds(this, this.canvas.width, this.canvas.height)) {
                this.x = oldX;
                this.y = oldY;
            } else if (this.game && (this.x !== oldX || this.y !== oldY)) {
                // Play movement sound only if position actually changed
                this.game.audioManager.playMove();
            }
        });
    }

    draw() {
        this.ctx.fillStyle = COLORS.PLAYER;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes to make it look like a frog
        const eyeSize = 6;
        const eyeOffset = 8;
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.x + eyeOffset, this.y + eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(this.x + this.width - eyeOffset, this.y + eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pupils
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.x + eyeOffset, this.y + eyeOffset, eyeSize/2, 0, Math.PI * 2);
        this.ctx.arc(this.x + this.width - eyeOffset, this.y + eyeOffset, eyeSize/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    update() {
        // Additional update logic can be added here
        // For example, animations or state changes
    }
}
