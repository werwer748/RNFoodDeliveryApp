import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from './src/store/reducer';

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
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email); //!! 써서 boolean 값으로 변환
    // 프로바이더 밖에서는 유즈셀렉터 호출이 불가능(당연한건데 왜 까먹...?)
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
