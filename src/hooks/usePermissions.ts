import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

/*
 * Linking.openURL('웹주소'); <- 해당 url을 열어준다.
 * 주소에 tel://01012341234) 하면 전화
 * 주소에 sms://01012341234) 하면 문자
 * upbitex://account <- 업비트같은 어플은 이런식으로 열 수도 있다.(설정해 보고 싶으면 App URI Scheme 설정으로 검색)
 */

function usePermissions() {
    // 권한 관련
    useEffect(() => {
        if (Platform.OS === 'android') {
            //* 안드로이드 일때 - 위치권한
            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                .then(result => {
                    console.log('check location', result);
                    if (result === RESULTS.DENIED) {
                        return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                    } else if (result === RESULTS.BLOCKED) {
                        Alert.alert(
                            '이 앱은 위치 권한 허용이 필요합니다.',
                            '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
                            [
                                //? 이런식으로 '제목', '내용', [버튼, 버튼] 으로 사용이 가능하다!
                                {
                                    text: '네',
                                    onPress: () => Linking.openSettings(), //? 직접 폰 세팅을 열어준다!
                                    style: 'default',
                                },
                                {
                                    text: '아니오',
                                    onPress: () => console.log('No Pressed'),
                                    style: 'cancel',
                                },
                            ],
                        );
                    }
                })
                .catch(console.error);
        } else if (Platform.OS === 'ios') {
            //* 아이폰 일때 - 위치권한
            check(PERMISSIONS.IOS.LOCATION_ALWAYS)
                .then(result => {
                    if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
                        Alert.alert(
                            '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
                            '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
                            [
                                {
                                    text: '네',
                                    onPress: () => Linking.openSettings(),
                                },
                                {
                                    text: '아니오',
                                    onPress: () => console.log('No Pressed'),
                                    style: 'cancel',
                                },
                            ],
                        );
                    }
                })
                .catch(console.error);
        }
        if (Platform.OS === 'android') {
            //* 안드로이드 일때 - 카메라 권한
            check(PERMISSIONS.ANDROID.CAMERA)
                .then(result => {
                    if (result === RESULTS.DENIED || result === RESULTS.GRANTED) { // result === RESULTS.GRANTED 이거 없으면 에러로 처되어서 추가
                        return request(PERMISSIONS.ANDROID.CAMERA);
                    } else {
                        console.log(result);
                        throw new Error('카메라 지원 안 함');
                    }
                })
                .catch(console.error);
        } else {
            //* 아이폰 일때 - 카메라 권한
            check(PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    if (
                        result === RESULTS.DENIED ||
                        result === RESULTS.LIMITED ||
                        result === RESULTS.GRANTED
                    ) {
                        return request(PERMISSIONS.IOS.CAMERA);
                    } else {
                        console.log(result);
                        throw new Error('카메라 지원 안 함');
                    }
                })
                .catch(console.error);
        }
    }, []);
}

export default usePermissions;
