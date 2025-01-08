import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getPipeSizePosPair = (addToPosX = 0) => {
    const gapHeight = 200; // Gap between pipes
    const pipeWidth = 60;
    
    // Random height for top pipe
    const minHeight = 50;
    const maxHeight = windowHeight - gapHeight - minHeight;
    const height1 = getRandom(minHeight, maxHeight);
    const height2 = windowHeight - height1 - gapHeight;

    const pipeX = windowWidth + addToPosX;

    return {
        top: {
            pos: { x: pipeX, y: height1 / 2 },
            size: { height: height1, width: pipeWidth }
        },
        bottom: {
            pos: { x: pipeX, y: windowHeight - height2 / 2 },
            size: { height: height2, width: pipeWidth }
        }
    };
}; 