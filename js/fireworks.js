class Firework {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.particles = [];
        this.particleCount = 50;
        this.colors = ['#ff0', '#f00', '#0ff', '#0f0', '#ff69b4'];
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const angle = (Math.PI * 2 * i) / this.particleCount;
            const speed = 2 + Math.random() * 2;
            const size = 2 + Math.random() * 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                alpha: 1,
                life: 1
            });
        }
    }

    update() {
        let isAlive = false;
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                isAlive = true;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.05; // gravity
                particle.life -= 0.01;
                particle.alpha = particle.life;
            }
        });
        return isAlive;
    }

    draw() {
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
    }
}

class FireworksManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'fireworks-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.isActive = false;
        this.animationFrame = null;
    }

    init(container) {
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        container.appendChild(this.canvas);
    }

    start() {
        this.isActive = true;
        this.animate();
        this.spawnFireworks();
    }

    stop() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.fireworks = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    spawnFireworks() {
        if (!this.isActive) return;

        const x = Math.random() * this.canvas.width;
        const y = Math.random() * (this.canvas.height * 0.6);
        this.fireworks.push(new Firework(this.canvas, x, y));

        // Spawn another firework after a random delay
        setTimeout(() => {
            if (this.isActive) {
                this.spawnFireworks();
            }
        }, 200 + Math.random() * 1000);
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.fireworks = this.fireworks.filter(firework => {
            firework.update();
            firework.draw();
            return firework.update();
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Create a single instance that can be used throughout the game
const fireworksManager = new FireworksManager();
