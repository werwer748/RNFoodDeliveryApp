import * as React from 'react';
import { useCallback, useState, useRef } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { RootStackParamList } from '../../AppInner';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({ navigation }: SignInScreenProps) {
    const dispatch = useAppDispatch(); //타입 잡아놓은걸 불러다 쓴다.
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<TextInput | null>(null); // generic
    const passwordRef = useRef<TextInput | null>(null); // 연결 되기 전 초기값 null

    const onChangeEmail = useCallback((text: string) => {
        setEmail(text);
    }, []);

    const onChangePassword = useCallback((text: string) => {
        setPassword(text);
    }, []);

    const onSubmit = useCallback(async () => {
        if (loading) {
            return;
        }
        if (!email || !email.trim()) {
            return Alert.alert('알림', '이메일을 입력해주세요.');
        }
        if (!password || !password.trim()) {
            return Alert.alert('알림', '비밀번호를 입력해주세요.');
        }
        try {
            setLoading(true);
            const response = await axios.post(`${Config.API_URL}/login`, { email, password });
            console.log(response.data.data);
            Alert.alert('알림', '로그인 되었습니다!');
            await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken); // promise임
            dispatch(
                userSlice.actions.setUser({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    accessToken: response.data.data.accessToken, // 유효기간 10분, 5분, 1시간
                }),
            );
        } catch (error) {
            const errorResponse = (error as AxiosError<{ message: string }>).response;
            if (errorResponse) {
                Alert.alert('알림', errorResponse.data.message);
            }
        } finally {
            setLoading(false);
        }
    }, [loading, email, password, dispatch]);

    const toSignUp = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    const canGoNext = email && password;

    return (
        <DismissKeyboardView>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeEmail}
                    placeholder="이메일을 입력해 주세요."
                    placeholderTextColor="#666"
                    importantForAutofill="yes" // 로그인 자동완성 관려 부
                    autoComplete="email"
                    textContentType="emailAddress"
                    value={email}
                    returnKeyType="next"
                    clearButtonMode="while-editing" // 한번에 지우기 IOS만 적용(공식문서 ㄱㄱ)
                    keyboardType="email-address"
                    ref={emailRef}
                    onSubmitEditing={() => {
                        //입력완료후 동작
                        passwordRef.current?.focus();
                    }}
                    blurOnSubmit={false} // 입력 완료후 키보드 유지
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="비밀번호를 입력해 주세요."
                    placeholderTextColor="#666"
                    importantForAutofill="yes"
                    onChangeText={onChangePassword}
                    value={password}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="send"
                    secureTextEntry
                    clearButtonMode="while-editing" // 한번에 지우기 IOS만 적용(공식문서 ㄱㄱ)
                    ref={passwordRef}
                    onSubmitEditing={onSubmit}
                />
            </View>
            <View style={styles.buttonZone}>
                <Pressable
                    onPress={onSubmit}
                    style={
                        !canGoNext
                            ? styles.loginButton
                            : // : [styles.loginButton, styles.loginButtonActive]
                              StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
                    }
                    disabled={!canGoNext || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="violet" />
                    ) : (
                        <Text style={styles.loginButtonText}>로그인</Text>
                    )}
                </Pressable>
                <Pressable onPress={toSignUp} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>회원가입</Text>
                </Pressable>
            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        padding: 20,
    },
    textInput: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        color: 'black',
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
    buttonZone: {
        alignItems: 'center',
    },
    loginButtonActive: {
        backgroundColor: 'royalblue',
    },
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SignIn;
