class ScoreManager {
    constructor() {
        this.score = 0;
        this.lives = INITIAL_LIVES;
        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        this.levelStartTime = 0;
        this.currentLevelTime = 0;
        
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.messageElement = document.getElementById('gameMessage');
        this.highScoreElement = document.getElementById('highScore');
        
        // Initialize high scores if empty
        if (this.highScores.length === 0) {
            this.highScores = Array(MAX_HIGH_SCORES).fill({ score: 0, time: 0 });
            this.saveHighScores();
        }
        
        // Initialize fireworks
        this.gameContainer = document.querySelector('.game-canvas-container');
        fireworksManager.init(this.gameContainer);
        
        this.updateDisplay();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.levelStartTime > 0) {
                this.currentLevelTime = this.getLevelTime();
                this.updateTimerDisplay();
            }
        }, 100);
    }

    updateTimerDisplay() {
        const timeLeft = Math.max(0, LEVEL_TIME_LIMIT - this.currentLevelTime);
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = timeLeft.toFixed(1);
            if (timeLeft <= 5) {
                timerElement.classList.add('warning');
            } else {
                timerElement.classList.remove('warning');
            }
        }
    }

    startLevel() {
        this.levelStartTime = Date.now();
    }

    getLevelTime() {
        return (Date.now() - this.levelStartTime) / 1000; // Convert to seconds
    }

    addPoints(points) {
        this.score += points;
        this.updateDisplay();
        
        // Add animation effect
        const statItem = this.scoreElement.closest('.stat-item');
        statItem.classList.add('updated');
        setTimeout(() => {
            statItem.classList.remove('updated');
        }, 300);
    }

    loseLife() {
        this.lives--;
        this.updateDisplay();
        
        // Add animation effect
        const statItem = this.livesElement.closest('.stat-item');
        statItem.classList.add('updated');
        setTimeout(() => {
            statItem.classList.remove('updated');
        }, 300);
        
        if (this.lives <= 0) {
            this.showGameOver();
            return true; // Game over
        }
        return false;
    }

    reset() {
        // Only reset lives and score if it's a new game (score is 0)
        if (this.score === 0) {
            this.lives = INITIAL_LIVES;
        }
        this.updateDisplay();
        this.hideMessage();
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.highScoreElement.textContent = this.highScores[0].score;
        
        // Highlight score when approaching high score
        if (this.score > this.highScores[0].score * 0.8) {
            this.scoreElement.closest('.stat-item').classList.add('high-score-approaching');
        } else {
            this.scoreElement.closest('.stat-item').classList.remove('high-score-approaching');
        }
    }

    showGameOver() {
        const currentTime = this.getLevelTime();
        this.updateHighScores(this.score, currentTime);
        
        const isNewHighScore = this.highScores[0].score === this.score;
        const highScoresList = this.highScores
            .map((hs, index) => hs.score > 0 ? 
                `<li>${index + 1}. Score: ${hs.score} (Time: ${hs.time.toFixed(1)}s)</li>` : '')
            .filter(item => item !== '')
            .join('');

        this.messageElement.innerHTML = `
            <h2>${isNewHighScore ? '🏆 New High Score! 🏆' : 'Game Over!'}</h2>
            <p>Final Score: ${this.score}</p>
            <p>Time: ${currentTime.toFixed(1)}s</p>
            <div class="high-scores">
                <h3>High Scores:</h3>
                <ul>${highScoresList}</ul>
            </div>
            <div class="play-again-btn">Play Again</div>
            <p class="play-again-hint">(Press Space)</p>
        `;
        this.messageElement.style.display = 'block';
        
        if (isNewHighScore) {
            this.messageElement.classList.add('new-high-score');
            setTimeout(() => {
                this.messageElement.classList.remove('new-high-score');
            }, 3000);
        }
    }

    updateHighScores(score, time) {
        this.highScores.push({ score, time });
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, MAX_HIGH_SCORES);
        this.saveHighScores();
    }

    saveHighScores() {
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }

    showWinMessage() {
        const timeBonus = this.calculateTimeBonus();
        const totalBonus = SCORE_POINTS.CROSSING + timeBonus;

        this.messageElement.innerHTML = `
            <h2>Level Complete!</h2>
            <p>+${SCORE_POINTS.CROSSING} Points!</p>
            <p>Time Bonus: +${timeBonus} Points!</p>
            <p>Total Score: ${this.score}</p>
            <div class="play-again-btn">Continue to Next Level</div>
            <p class="play-again-hint">(Press Space)</p>
        `;
        this.messageElement.style.display = 'block';
        
        // Start fireworks celebration
        fireworksManager.start();
        
        // Stop fireworks after 3 seconds
        setTimeout(() => {
            fireworksManager.stop();
        }, 3000);
    }

    hideMessage() {
        this.messageElement.style.display = 'none';
        this.messageElement.innerHTML = '';
        fireworksManager.stop();
    }

    showWelcomeScreen() {
        this.messageElement.innerHTML = `
            <h2>Welcome to Frogger!</h2>
            <p>Are you ready for the fun?</p>
            <button class="play-again-btn" id="startButton">Start Game</button>
            <p class="play-again-hint">or press SPACE to start</p>
        `;
        this.messageElement.style.display = 'block';
    }

    calculateTimeBonus() {
        const timeElapsed = this.getLevelTime();
        const timeRemaining = Math.max(0, LEVEL_TIME_LIMIT - timeElapsed);
        let bonus = Math.floor(timeRemaining * SCORE_POINTS.TIME_MULTIPLIER);
        
        // Add speed bonus if completed quickly
        if (timeElapsed < SCORE_POINTS.SPEED_THRESHOLD) {
            bonus += SCORE_POINTS.SPEED_BONUS;
        }
        
        return bonus;
    }

    addCrossingPoints() {
        const timeBonus = this.calculateTimeBonus();
        this.addPoints(SCORE_POINTS.CROSSING + timeBonus);
        this.showWinMessage();
    }
}
