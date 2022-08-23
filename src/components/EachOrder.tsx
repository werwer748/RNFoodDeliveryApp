import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Order } from '../slices/order';

function EachOrder({ item }: { item: Order }) {
    const toggleDetail = useCallback(() => {}, []);
    return (
        <View style={styles.orderContainer}>
            <Pressable onPress={toggleDetail} style={styles.info}>
                <Text>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</Text>
                <Text style={styles.eachInfo}>
                    {/* {getDistanceFromLatLonInKm(
                                start.latitude,
                                start.longitude,
                                end.latitude,
                                end.longitude,
                            ).toFixed(1)} */}
                    km
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    orderContainer: {
        borderRadius: 5,
        margin: 5,
        padding: 10,
        backgroundColor: 'lightgray',
    },
    info: {
        flexDirection: 'row',
    },
    eachInfo: {
        flex: 1,
    },
    buttonWrapper: {
        flexDirection: 'row',
    },
    acceptButton: {
        backgroundColor: 'blue',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        flex: 1,
    },
    rejectButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EachOrder;
