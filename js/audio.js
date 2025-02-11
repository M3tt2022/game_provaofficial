class AudioManager {
    constructor() {
        // Create distinct sounds for different game events
        const moveSound = this.createBeepSound(600, 0.1); // Short high beep
        const collisionSound = this.createCrashSound(); // Sharp crash sound
        const gameOverSound = this.createGameOverSound(); // Sad descending tone
        const victorySound = this.createVictorySound(); // Happy ascending melody
        const scoreSound = this.createScoreSound(); // Achievement sound

        this.sounds = {
            move: new Audio(moveSound),
            collision: new Audio(collisionSound),
            gameOver: new Audio(gameOverSound),
            victory: new Audio(victorySound),
            score: new Audio(scoreSound)
        };

        // Configure sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });

        // Debug flag
        this.debug = true;
    }

    createBeepSound(frequency, duration) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const sampleRate = 44100;
        const samples = duration * sampleRate;
        
        const audioData = new Float32Array(samples);
        for(let i = 0; i < samples; i++) {
            audioData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
        }
        
        const buffer = audioCtx.createBuffer(1, samples, sampleRate);
        buffer.getChannelData(0).set(audioData);
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        return this.bufferToBase64(buffer);
    }

    createCrashSound() {
        // Create a harsh, metallic crash sound
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = 44100;
        const duration = 0.3;
        const samples = duration * sampleRate;
        
        const buffer = audioCtx.createBuffer(1, samples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for(let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 10);
        }
        
        return this.bufferToBase64(buffer);
    }

    createGameOverSound() {
        // Create a sad descending tone
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = 44100;
        const duration = 1.0;
        const samples = duration * sampleRate;
        
        const buffer = audioCtx.createBuffer(1, samples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for(let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            const frequency = 400 - 200 * (t / duration);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2);
        }
        
        return this.bufferToBase64(buffer);
    }

    createVictorySound() {
        // Create a happy ascending arpeggio
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = 44100;
        const duration = 1.0;
        const samples = duration * sampleRate;
        
        const buffer = audioCtx.createBuffer(1, samples, sampleRate);
        const data = buffer.getChannelData(0);
        
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        const noteTime = duration / notes.length;
        
        for(let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            const noteIndex = Math.floor(t / noteTime);
            if (noteIndex < notes.length) {
                const frequency = notes[noteIndex];
                data[i] = Math.sin(2 * Math.PI * frequency * t) * 0.5;
            }
        }
        
        return this.bufferToBase64(buffer);
    }

    createScoreSound() {
        // Create a short happy chime
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = 44100;
        const duration = 0.2;
        const samples = duration * sampleRate;
        
        const buffer = audioCtx.createBuffer(1, samples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for(let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            const frequency = 800 + Math.sin(2 * Math.PI * 10 * t) * 50;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5);
        }
        
        return this.bufferToBase64(buffer);
    }

    bufferToBase64(buffer) {
        const wavData = this.audioBufferToWav(buffer);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(wavData)));
        return `data:audio/wav;base64,${base64}`;
    }

    audioBufferToWav(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;
        
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        
        const data = new DataView(new ArrayBuffer(44 + buffer.length * bytesPerSample));
        
        // WAV header
        data.setUint32(0, 0x52494646, false); // "RIFF"
        data.setUint32(4, 36 + buffer.length * bytesPerSample, true);
        data.setUint32(8, 0x57415645, false); // "WAVE"
        data.setUint32(12, 0x666D7420, false); // "fmt "
        data.setUint32(16, 16, true);
        data.setUint16(20, format, true);
        data.setUint16(22, numChannels, true);
        data.setUint32(24, sampleRate, true);
        data.setUint32(28, sampleRate * blockAlign, true);
        data.setUint16(32, blockAlign, true);
        data.setUint16(34, bitDepth, true);
        data.setUint32(36, 0x64617461, false); // "data"
        data.setUint32(40, buffer.length * bytesPerSample, true);
        
        // Audio data
        const samples = buffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < samples.length; i++) {
            const sample = Math.max(-1, Math.min(1, samples[i]));
            data.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
        
        return data.buffer;
    }

    playSound(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                const playPromise = sound.play();
                if (playPromise) {
                    playPromise.catch(error => {
                        if (this.debug) {
                            console.log(`Audio play failed for ${soundName}:`, error);
                        }
                    });
                }
                // Add visual feedback for debugging
                if (this.debug) {
                    console.log(`Playing sound: ${soundName}`);
                    this.showVisualFeedback(soundName);
                }
            }
        } catch (error) {
            if (this.debug) {
                console.log(`Error playing ${soundName}:`, error);
            }
        }
    }

    showVisualFeedback(soundName) {
        // Create temporary visual feedback element
        const feedback = document.createElement('div');
        feedback.style.position = 'fixed';
        feedback.style.top = '10px';
        feedback.style.right = '10px';
        feedback.style.padding = '10px';
        feedback.style.background = 'rgba(0,0,0,0.8)';
        feedback.style.color = '#fff';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '9999';
        feedback.textContent = `Sound: ${soundName}`;
        
        document.body.appendChild(feedback);
        
        // Remove after 1 second
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 1000);
    }

    playMove() {
        this.playSound('move');
    }

    playCollision() {
        this.playSound('collision');
    }

    playGameOver() {
        this.playSound('gameOver');
    }

    playVictory() {
        this.playSound('victory');
    }

    playScore() {
        this.playSound('score');
    }
}
