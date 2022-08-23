import React, { useCallback, useEffect } from 'react';
import { Text, View, Alert, Pressable, StyleSheet } from 'react-native';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useAppDispatch } from '../store/index';
import userSlice from '../slices/user';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

function Settings() {
    const name = useSelector((state: RootState) => state.user.name);
    const money = useSelector((state: RootState) => state.user.money);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function getMoney() {
            const response = await axios.get<{ data: number }>(`${Config.API_URL}/showmethemoney`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            dispatch(userSlice.actions.setMoney(response.data.data));
        }
        getMoney();
    }, [dispatch, accessToken]);

    const onLogout = useCallback(async () => {
        try {
            await axios.post(
                `${Config.API_URL}/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            Alert.alert('알림', '로그아웃 되었습니다.');
            dispatch(
                userSlice.actions.setUser({
                    name: '',
                    email: '',
                    accessToken: '',
                }),
            );
            await EncryptedStorage.removeItem('refreshToken');
        } catch (error) {
            const errorResponse = (error as AxiosError).response;
            console.error(errorResponse);
        }
    }, [accessToken, dispatch]);

    return (
        <View>
            <View style={styles.money}>
                <Text style={styles.moneyText}>
                    {name}님의 수익금{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                        {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                    원
                </Text>
            </View>
            <View style={styles.buttonZone}>
                <Pressable
                    style={[styles.loginButton, styles.loginButtonActive]}
                    onPress={onLogout}
                >
                    <Text style={styles.loginButtonText}>로그아웃</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    money: {
        padding: 20,
    },
    moneyText: {
        fontSize: 16,
        color: 'black',
    },
    buttonZone: {
        alignItems: 'center',
        paddingTop: 20,
    },
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonActive: {
        backgroundColor: 'royalblue',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Settings;
