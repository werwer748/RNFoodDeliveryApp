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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
    const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
    // 프로바이더 밖에서는 유즈셀렉터 호출이 불가능(당연한건데 왜 까먹...?)
    return (
        <NavigationContainer>
            {isLoggedIn ? ( // 스크린 묶어주라는 에러가 뜨면 <Tab.Group></Tab.Group>으로 묶는다.
                <Tab.Navigator>
                    <Tab.Screen
                        name="Orders"
                        component={Orders}
                        options={{ title: '오더 목록' }}
                    />
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
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn}
                        options={{ title: '로그인' }}
                    />
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
