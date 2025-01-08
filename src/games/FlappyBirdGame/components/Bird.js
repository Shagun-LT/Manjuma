import React from 'react';
import { View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const Bird = ({ body }) => {
    const widthBody = body.bounds.max.x - body.bounds.min.x;
    const heightBody = body.bounds.max.y - body.bounds.min.y;

    const xBody = body.position.x - widthBody / 2;
    const yBody = body.position.y - heightBody / 2;

    const scale = 1.2;

    return (
        <View
            style={{
                position: 'absolute',
                left: xBody - (widthBody * (scale - 1)) / 2,
                top: yBody - (heightBody * (scale - 1)) / 2,
                width: widthBody * scale,
                height: heightBody * scale,
                transform: [{ scaleX: -1 }]
            }}
        >
            <LottieView
                source={require('../../../res/bird.json')}
                autoPlay
                loop
                style={{
                    width: '100%',
                    height: '100%',
                }}
                speed={1.5}
            />
        </View>
    );
};

export default Bird; 