import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';

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
                    console.log('에러 리스폰', error.response);
                    console.log('에러리스폰에 데이타', error.response.data);
                    console.log('에러리스폰에 데이타에 코드', error.response.data.code);
                    if (error.response.data.code === 'expired') {
                        const originalRequest = config;
                        const refreshToken = await EncryptedStorage.getItem('refreshToken');
                        // token refresh  요청
                        const { data } = await axios.post(
                            `${Config.API_URL}/refreshToken`,
                            {},
                            { headers: { Authoriation: `Bearer ${refreshToken}` } },
                        );
                        // 새로운 토큰 저장
                        dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
                        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
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
            }
        };
        getTokenAndRefresh();
    }, [dispatch]); //? 전부터 왜 dispatch넣는지 이해안됐었는데 eslint가 넣으라고 시킨다 함

    return (
        <NavigationContainer>
            {isLoggedIn ? ( // 스크린 묶어주라는 에러가 뜨면 <Tab.Group></Tab.Group>으로 묶는다.
                <Tab.Navigator>
                    <Tab.Screen name="Orders" component={Orders} options={{ title: '오더 목록' }} />
                    <Tab.Screen
                        name="Delivery"
                        component={Delivery}
                        options={{ headerShown: false }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={Settings}
                        options={{ title: '내 정보' }}
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
        </NavigationContainer>
    );
}

export default AppInner;
