import React, { useCallback, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import orderSlice, { Order } from '../slices/order';
import { useAppDispatch } from '../store';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { LoggedInParamList } from '../../AppInner';
import NaverMapView, { Marker, Path } from 'react-native-nmap';
import getDistanceFromLatLonInKm from '../util';
import EncryptedStorage from 'react-native-encrypted-storage';

function EachOrder({ item }: { item: Order }) {
    //? screen에 연결된 컴포넌트들만 props로 navigation을 가진다.
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [detail, setDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const { start, end } = item;

    const toggleDetail = useCallback(() => {
        setDetail(!detail);
    }, [detail]);

    const onAccept = useCallback(async () => {
        try {
            console.log('클릭감지!');
            setLoading(false);
            await axios.post(
                `${Config.API_URL}/accept`,
                { orderId: item.orderId },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            dispatch(orderSlice.actions.acceptOrder(item.orderId));
            setLoading(true);
            navigation.navigate('Delivery');
        } catch (error) {
            let errorResponse = (error as AxiosError<{ message: string }>).response;
            if (errorResponse?.status === 400) {
                //타인이 이미 수락한 경우
                Alert.alert('알림', errorResponse.data.message);
                dispatch(orderSlice.actions.rejectOrder(item.orderId));
            }
            setLoading(true);
        }
    }, [dispatch, item.orderId, accessToken, navigation]);

    const onReject = useCallback(() => {
        console.log('클릭감지!');
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
    }, [dispatch, item.orderId]);

    return (
        <View style={styles.orderContainer}>
            <Pressable onPress={toggleDetail} style={styles.info}>
                <Text>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</Text>
                <Text style={styles.eachInfo}>
                    {getDistanceFromLatLonInKm(
                        start.latitude,
                        start.longitude,
                        end.latitude,
                        end.longitude,
                    ).toFixed(1)}
                    km
                </Text>
                <Text>삼성동</Text>
                <Text>왕십리동</Text>
            </Pressable>
            {detail && (
                <View>
                    <View
                        style={{
                            width: Dimensions.get('window').width - 30,
                            height: 200,
                            marginTop: 10,
                        }}
                    >
                        <NaverMapView
                            style={{ width: '100%', height: '100%' }}
                            zoomControl={false}
                            center={{
                                zoom: 10,
                                tilt: 50,
                                latitude: (start.latitude + end.latitude) / 2,
                                longitude: (start.longitude + end.longitude) / 2,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: start.latitude,
                                    longitude: start.longitude,
                                }}
                                pinColor="blue"
                            />
                            <Path
                                coordinates={[
                                    {
                                        latitude: start.latitude,
                                        longitude: start.longitude,
                                    },
                                    { latitude: end.latitude, longitude: end.longitude },
                                ]}
                            />
                            <Marker
                                coordinate={{ latitude: end.latitude, longitude: end.longitude }}
                            />
                        </NaverMapView>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Pressable
                            onPress={onAccept}
                            // disabled={loading}
                            style={styles.acceptButton}
                        >
                            <Text style={styles.buttonText}>수락</Text>
                        </Pressable>
                        <Pressable
                            onPress={onReject}
                            // disabled={loading}
                            style={styles.rejectButton}
                        >
                            <Text style={styles.buttonText}>거절</Text>
                        </Pressable>
                    </View>
                </View>
            )}
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
        justifyContent: 'space-between',
    },
    eachInfo: {},
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
