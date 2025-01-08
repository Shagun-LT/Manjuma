import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import LottieView from 'lottie-react-native';
import Matter from 'matter-js';
import Physics from './physics';
import Bird from './components/Bird';
import Floor from './components/Floor';
import Obstacle from './components/Obstacle';
import { getPipeSizePosPair } from './utils/random';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const FlappyBirdGame = () => {
    const [gameEngine, setGameEngine] = useState(null);
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [entities, setEntities] = useState(null);
    const [gameOver, setGameOver] = useState(true);

    useEffect(() => {
        setEntities(setupWorld());
        
        // Cleanup sounds when component unmounts
        return () => {
            Physics.cleanup();
        };
    }, []);

    const setupWorld = () => {
        let engine = Matter.Engine.create({
            enableSleeping: false,
            constraintIterations: 2,
            positionIterations: 2,
            velocityIterations: 1
        });

        let world = engine.world;
        engine.gravity.y = 0;

        const BIRD_SIZE = 40;
        let bird = Matter.Bodies.circle(50, windowHeight / 2, BIRD_SIZE, {
            restitution: 0,
            friction: 0.5,
            density: 0.0005,
            label: 'bird',
            collisionFilter: {
                category: 0x0001,
                mask: 0x0002
            }
        });

        const pipePair = getPipeSizePosPair();
        
        let topPipe = Matter.Bodies.rectangle(
            pipePair.top.pos.x,
            pipePair.top.pos.y,
            pipePair.top.size.width,
            pipePair.top.size.height,
            { 
                isStatic: true,
                label: 'pipe',
                collisionFilter: {
                    category: 0x0002
                }
            }
        );

        let bottomPipe = Matter.Bodies.rectangle(
            pipePair.bottom.pos.x,
            pipePair.bottom.pos.y,
            pipePair.bottom.size.width,
            pipePair.bottom.size.height,
            { 
                isStatic: true,
                label: 'pipe',
                collisionFilter: {
                    category: 0x0002
                }
            }
        );

        Matter.World.add(world, [bird, topPipe, bottomPipe]);

        return {
            physics: { engine: engine, world: world },
            bird: { 
                body: bird, 
                size: [BIRD_SIZE * 2, BIRD_SIZE * 2],
                renderer: Bird 
            },
            topPipe: { body: topPipe, color: 'green', renderer: Obstacle },
            bottomPipe: { body: bottomPipe, color: 'green', renderer: Obstacle }
        };
    };

    const resetGame = () => {
        if (gameEngine) {
            gameEngine.swap(setupWorld());
        }
        setGameOver(false);
        setScore(0);
        setRunning(true);
    };

    const handleGamePress = () => {
        if (!gameOver && gameEngine) {
            gameEngine.dispatch({ type: "jump" });
        }
    };

    const onEvent = (e) => {
        switch(e.type) {
            case "game-over":
                setRunning(false);
                setGameOver(true);
                break;
            case "score":
                setScore(prevScore => prevScore + 1);
                break;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleGamePress}>
            <View style={styles.container}>
                <View style={[styles.cloudsContainer, styles.topClouds]}>
                    <LottieView
                        source={require('../../res/clouds.json')}
                        autoPlay
                        loop
                        style={[styles.clouds, { transform: [{ scale: 1.2 }] }]}
                        speed={0.5}
                        resizeMode="cover"
                    />
                </View>

                <View style={[styles.cloudsContainer, styles.bottomClouds]}>
                    <LottieView
                        source={require('../../res/clouds.json')}
                        autoPlay
                        loop
                        style={[styles.clouds, { transform: [{ scale: 1.2 }, { scaleY: -1 }] }]}
                        speed={0.5}
                        resizeMode="cover"
                    />
                </View>

                {entities ? (
                    <GameEngine
                        ref={(ref) => setGameEngine(ref)}
                        style={styles.gameContainer}
                        systems={[Physics]}
                        entities={entities}
                        running={running}
                        onEvent={onEvent}
                    >
                        <Text style={styles.score}>{score}</Text>
                    </GameEngine>
                ) : null}
                
                {gameOver && 
                    <View style={styles.gameOverContainer}>
                        <View style={styles.fullscreen}>
                            <Text style={styles.gameOverText}>
                                {score > 0 ? 'Game Over' : 'Start Game'}
                            </Text>
                            {score > 0 && (
                                <Text style={styles.scoreText}>Score: {score}</Text>
                            )}
                            <TouchableOpacity 
                                style={styles.startButton}
                                onPress={resetGame}
                            >
                                <Text style={styles.startButtonText}>
                                    Tap to {score > 0 ? 'Restart' : 'Start'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
    },
    cloudsContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        opacity: 0.7,
    },
    topClouds: {
        top: -100,
    },
    bottomClouds: {
        bottom: -100,
    },
    clouds: {
        width: '100%',
        height: '100%',
    },
    gameContainer: {
        flex: 1,
        zIndex: 2,
    },
    score: {
        position: 'absolute',
        top: 50,
        width: '100%',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        zIndex: 3,
    },
    gameOverContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 4,
    },
    fullscreen: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreText: {
        color: 'white',
        fontSize: 32,
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
    },
    startButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default FlappyBirdGame; 