import Matter from 'matter-js';
import { getPipeSizePosPair } from './utils/random';
import { Dimensions } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

// Initialize sounds
let hitSound = null;
let dieSound = null;
let pointSound = null;

// Load sounds
const initSounds = () => {
    hitSound = new Sound('flappy_hit.mp3', Sound.MAIN_BUNDLE);
    dieSound = new Sound('flappy_die.mp3', Sound.MAIN_BUNDLE);
    pointSound = new Sound('flappy_point.mp3', Sound.MAIN_BUNDLE);
};

initSounds();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Game constants
const PIPE_SPEED = -5;
const GRAVITY = 0.6;
const JUMP_FORCE = -8;
const MAX_FALL_SPEED = 12;

const playSound = (sound) => {
    if (sound && sound.isLoaded()) {
        sound.stop();
        sound.play();
    }
};

const Physics = (entities, { touches, time, dispatch }) => {
    const engine = entities.physics.engine;
    const bird = entities.bird.body;
    const deltaTime = Math.min(time.delta, 16.666);

    // Handle jump
    if (touches.find(t => t.type === 'press')) {
        Matter.Body.setVelocity(bird, {
            x: 0,
            y: JUMP_FORCE
        });
    }

    // Apply gravity with higher max fall speed
    Matter.Body.setVelocity(bird, {
        x: 0,
        y: Math.min(MAX_FALL_SPEED, bird.velocity.y + GRAVITY)
    });

    // Move pipes faster
    if (entities.topPipe && entities.bottomPipe) {
        const movement = PIPE_SPEED * (deltaTime / 16.666);
        Matter.Body.translate(entities.topPipe.body, { x: movement, y: 0 });
        Matter.Body.translate(entities.bottomPipe.body, { x: movement, y: 0 });
    }

    // Update physics
    Matter.Engine.update(engine, deltaTime);

    // Check if pipes are off screen and reset them
    if (entities.topPipe.body.position.x <= -30) {
        const pipePair = getPipeSizePosPair();
        Matter.Body.setPosition(entities.topPipe.body, pipePair.top.pos);
        Matter.Body.setPosition(entities.bottomPipe.body, pipePair.bottom.pos);
        playSound(pointSound);
        dispatch({ type: 'score' });
    }

    // Check for collisions
    if (bird.position.y > windowHeight - 30 || bird.position.y < 0) {
        playSound(hitSound);
        setTimeout(() => {
            playSound(dieSound);
            dispatch({ type: 'game-over' });
        }, 500);
        return entities;
    }

    // Check pipe collisions
    const pipes = [entities.topPipe.body, entities.bottomPipe.body];
    for (let pipe of pipes) {
        if (Matter.Collision.collides(bird, pipe)) {
            playSound(hitSound);
            setTimeout(() => {
                playSound(dieSound);
                dispatch({ type: 'game-over' });
            }, 500);
            return entities;
        }
    }

    return entities;
};

// Cleanup function to release sounds
Physics.cleanup = () => {
    if (hitSound) {
        hitSound.release();
        hitSound = null;
    }
    if (dieSound) {
        dieSound.release();
        dieSound = null;
    }
    if (pointSound) {
        pointSound.release();
        pointSound = null;
    }
};

export default Physics; 