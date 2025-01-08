import React from 'react';
import { View } from 'react-native';

const Floor = ({ body }) => {
    const widthBody = body.bounds.max.x - body.bounds.min.x;
    const heightBody = body.bounds.max.y - body.bounds.min.y;

    const xBody = body.position.x - widthBody / 2;
    const yBody = body.position.y - heightBody / 2;

    return (
        <View
            style={{
                position: 'absolute',
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody,
                backgroundColor: '#795548'
            }}
        />
    );
};

export default Floor; 