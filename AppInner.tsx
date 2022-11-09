import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import SplashScreen from 'react-native-splash-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { RootState } from './src/store/reducer';
import { useAppDispatch } from './src/store/index';
import userSlice from './src/slices/user';
import orderSlice from './src/slices/order';

import useSocket from './src/hooks/useSocket';
import usePermissions from './src/hooks/usePermissions';

import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

export type LoggedInParamList = {
    Order: undefined; // 주문 화면
    Settings: undefined; // 정산?
    Delivery: undefined; // 배달
    Complete: { orderId: string };
    //* 파라미터를 넣어준 페이지에서 변수처럼 자유롭게 사용할 수 있다.
    //* 파라미터 넣는건 자유!
    //* 다른 페이지에서 지금 페이지로 값을 전달해야 하는 경우 사용하면 좋다.
};

export type RootStackParamList = {
    SignIn: undefined; // 로그인
    SignUp: undefined; // 회원가입
};

// 타입을 지정해서 로그인 전, 후 조건문에서 오류가 나지 않게 할 수 있다.

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email); //!! 써서 boolean 값으로 변환
    // 프로바이더 밖에서는 유즈셀렉터 호출이 불가능(당연한건데 왜 까먹...?)
    const [socket, disconnect] = useSocket();
    const [modal, setModal] = useState(true);

    usePermissions();

    useEffect(() => {
        axios.interceptors.response.use(
            response => response,
            async error => {
                const {
                    config,
                    response: { status },
                } = error;
                if (status === 419) {
                    console.log('에러리스폰에 데이타에 코드', error.response.data.code);
                    if (error.response.data.code === 'expired') {
                        console.log('리프레쉬 과정 1', error.response.data.code);
                        const originalRequest = config;
                        console.log('리프레쉬 과정 2', config);
                        const refreshToken = await EncryptedStorage.getItem('refreshToken');
                        console.log('리프레쉬 과정 3', refreshToken);
                        // token refresh  요청
                        const { data } = await axios.post(
                            `${Config.API_URL}/refreshToken`,
                            { headers: { Authoriation: `Bearer ${refreshToken}` } },
                        );
                        console.log('리프레쉬 과정 4', data);
                        // 새로운 토큰 저장
                        dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
                        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log('리프레쉬 과정 5', originalRequest);
                        return axios(originalRequest);
                    }
                }
                return Promise.reject(error);
            },
        );
    }, [dispatch]);

    //소켓 데이터 -> 키 = 값
    // 'userInfo', { name: 'hugoK', birth: 1993 }
    // 'order', { orderId: '1312s', price: 9000, ...}
    useEffect(() => {
        const callback = (data: any) => {
            console.log(data);
            dispatch(orderSlice.actions.addOrder(data));
        };
        if (socket && isLoggedIn) {
            socket.emit('acceptOrder', 'hello');
            socket.on('order', callback);
        }

        return () => {
            if (socket) {
                socket.off('order', callback);
            }
        };
    }, [dispatch, isLoggedIn, socket]);

    useEffect(() => {
        if (!isLoggedIn) {
            console.log('!isLoggedIn', !isLoggedIn);
            disconnect();
        }
    }, [isLoggedIn, disconnect]);

    //* 앱 실행시 토큰 있으면 로그인 유지해주는 함수.
    useEffect(() => {
        const getTokenAndRefresh = async () => {
            try {
                const token = await EncryptedStorage.getItem('refreshToken');
                if (!token) {
                    SplashScreen.hide();
                    return;
                }
                const response = await axios.post(
                    `${Config.API_URL}/refreshToken`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                dispatch(
                    userSlice.actions.setUser({
                        name: response.data.data.name,
                        email: response.data.data.email,
                        accessToken: response.data.data.accessToken,
                    }),
                );
            } catch (error) {
                console.error(error);
                if ((error as AxiosError<{ code: string }>).response?.data.code === 'expired') {
                    Alert.alert('알림', '다시 로그인 해주세요.');
                }
            } finally {
                //TODO: 스플래시 스크린 없애기
                SplashScreen.hide();
            }
        };
        getTokenAndRefresh();
    }, [dispatch]); //? 전부터 왜 dispatch넣는지 이해안됐었는데 eslint가 넣으라고 시킨다 함

    return (
        <NavigationContainer>
            {/* 아래쪽에 위치한 컴포넌트들이 중요도가 높다. */}
            {isLoggedIn ? ( // 스크린 묶어주라는 에러가 뜨면 <Tab.Group></Tab.Group>으로 묶는다.
                <Tab.Navigator>
                    <Tab.Screen
                        name="Orders"
                        component={Orders}
                        options={{
                            title: '오더 목록',
                            tabBarIcon: ({ color: string }) => (
                                <FontAwesome5Icon name="list" size={20} />
                            ),
                            // tabBarActiveTintColor: 'yellowgreen',
                        }}
                    />

                    <Tab.Screen
                        name="Delivery"
                        component={Delivery}
                        options={{
                            headerShown: false,
                            title: '지도',
                            tabBarIcon: () => <FontAwesome5Icon name="map" size={20} />,
                        }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={Settings}
                        options={{
                            title: '내 정보',
                            unmountOnBlur: true,
                            tabBarIcon: () => <FontAwesomeIcon name="gear" size={20} />,
                        }}
                    />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="SignIn" component={SignIn} options={{ title: '로그인' }} />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{ title: '회원가입' }}
                    />
                </Stack.Navigator>
            )}
            {/* 탭, 스크린 네비게이터들 보다 아래위치시킴 (바텀 텝바아래에 컴포넌트가 찍힌다. ) */}
            {modal && (
            <Pressable
                onPress={() => setModal(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <View>
                        <Text style={{ color: 'white' }}>모달 본문</Text>
                    </View>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 30 }}>
                        <Pressable style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>네</Text>
                        </Pressable>
                        <Pressable style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>아니오</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        position: 'absolute',
        top: 50,
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 20,
    },
});

export default AppInner;
