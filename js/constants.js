const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 40;

// Player constants
const PLAYER_SIZE = 38;
const PLAYER_SPEED = 40;
const INITIAL_LIVES = 3;

// Obstacle constants
const OBSTACLE_HEIGHT = 38;
const OBSTACLE_MIN_WIDTH = 60;
const OBSTACLE_MAX_WIDTH = 120;
const OBSTACLE_MIN_SPEED = 1.0;
const OBSTACLE_MAX_SPEED = 2.5;
const OBSTACLE_ROWS = 4;
const OBSTACLES_PER_ROW = 2;

// Game states
const GAME_STATES = {
    READY: 'ready',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

// Score points
const SCORE_POINTS = {
    CROSSING: 100,
    BONUS_TIME: 50,
    TIME_MULTIPLIER: 20, // Increased points per second remaining
    SPEED_THRESHOLD: 15, // Seconds threshold for "Fast completion" bonus
    SPEED_BONUS: 200    // Extra points for fast completion
};

// Timer constants
const LEVEL_TIME_LIMIT = 30; // seconds
const MAX_HIGH_SCORES = 5;   // Number of high scores to track

// Colors
const COLORS = {
    PLAYER: '#2ecc71',
    OBSTACLE: '#e74c3c',
    SAFE_ZONE: '#3498db',
    GOAL_ZONE: '#f1c40f'
};
