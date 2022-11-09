import React from 'react';
import { Dimensions } from 'react-native';
import Config from 'react-native-config';
import FastImage from 'react-native-fast-image';
import { Order } from '../slices/order';

function CompleteOrder({ item }: {item: Order}) {
    return (
        <FastImage
            source={{ uri: `${Config.API_URL}/${item.image}`}}
            resizeMode="contain"
            style={{
                width: Dimensions.get('window').width / 3 - 10,
                height: Dimensions.get('window').width / 3 - 10,
                margin: 5,
            }}
        />
    );
}

export default CompleteOrder;
