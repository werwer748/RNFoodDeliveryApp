import * as React from 'react';
import { useCallback, useState, useRef } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardView';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({ navigation }: SignInScreenProps) {
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

    const onSubmit = useCallback(() => {
        if (!email || !email.trim()) {
            return Alert.alert('알림', '이메일을 입력해주세요.');
        }
        if (!password || !password.trim()) {
            return Alert.alert('알림', '비밀번호를 입력해주세요.');
        }
        Alert.alert('알림', '로그인 되었습니다.');
    }, [email, password]);

    const toSignUp = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    const canGoNext = email && password;

    return (
        <DismissKeyboardView>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                    placeholder="이메일을 입력해 주세요."
                    placeholderTextColor="black"
                    style={styles.textInput}
                    value={email}
                    onChangeText={onChangeEmail}
                    importantForAutofill="yes" // 로그인 자동완성 관려 부
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    returnKeyType="next"
                    ref={emailRef}
                    onSubmitEditing={() => {
                        //입력완료후 동작
                        passwordRef.current?.focus();
                    }}
                    blurOnSubmit={false} // 입력 완료후 키보드 유지
                    clearButtonMode="while-editing" // 한번에 지우기 IOS만 적용(공식문서 ㄱㄱ)
                />
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    placeholder="비밀번호를 입력해 주세요."
                    placeholderTextColor="black"
                    value={password}
                    style={styles.textInput}
                    onChangeText={onChangePassword}
                    secureTextEntry
                    importantForAutofill="yes"
                    autoComplete="password"
                    textContentType="password"
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
                              StyleSheet.compose(
                                  styles.loginButton,
                                  styles.loginButtonActive,
                              )
                    }
                    disabled={!canGoNext}
                >
                    <Text style={styles.loginButtonText}>로그인</Text>
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
