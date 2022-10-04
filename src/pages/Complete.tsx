import React, { useCallback, useEffect, useState } from 'react';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    Alert,
    Dimensions,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAppDispatch } from '../store/index';
import { LoggedInParamList } from '../../AppInner';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import ImageResizer from 'react-native-image-resizer';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import orderSlice from '../slices/order';

function Complete() {
    const dispatch = useAppDispatch();

    //? props가 아닌 hook으로 사용 - { route, navigation }
    const route = useRoute<RouteProp<LoggedInParamList>>();
    const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
    const [image, setImage] = useState<{ uri: string; name: string; type: string }>();
    const [preview, setPreview] = useState<{ uri: string }>();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    //* 파일의 모양: { uri: 경로, name: '파일이름', type: '확장자' }
    //* mutipart/form-data 통해서 업로드

    const onResponse = useCallback(async (response: any) => {
        console.log('%c리스판스 ::::', 'backgorund-color: yellow', response);
        console.log(response.width, response.height, response.exif);
        setPreview({ uri: `data:${response.mime};base64, ${response.data}` });
        const orientation = (response.exif as any)?.Orientation;
        console.log('orientation', orientation);
        return ImageResizer.createResizedImage(
            response.path, // 파일 경로
            600, // width
            600, // height
            response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
            100, // 화질
            0, // rotation <- orientation
        ).then(r => {
            console.log(r.uri, r.name);

            setImage({
                uri: r.uri,
                name: r.name,
                type: response.mime,
            });
        });
    }, []);

    const onTakePhoto = useCallback(() => {
        return ImageCropPicker.openCamera({
            includeBase64: true, // 미리보기를 위해서 추가
            includeExif: true, // 넣어주면 좋은 옵션
            //? 폰을 어떻게 들고 찍었느냐에 따라 다른 숫자가 나온다! (exif orientation으로 검색)
            saveToPhotos: true, // 원래 없는 옵션 (라이브러리 뜯어고칠 꺼)
        })
            .then(onResponse)
            .catch(console.log);
    }, [onResponse]);

    const onChangeFile = useCallback(() => {
        return ImageCropPicker.openPicker({
            includeBase64: true,
            includeExif: true,
            mediaType: 'photo',
        })
            .then(onResponse)
            .catch(console.log);
    }, [onResponse]);

    const orderId = route.params?.orderId;

    const onComplete = useCallback(async () => {
        console.log('컴플리트 터치!');
        if (!image) {
            Alert.alert('알림', '파일을 업로드해주세요.');
            return;
        }
        if (!orderId) {
            Alert.alert('알림', '유효하지 않은 주문입니다.');
            return;
        }
        console.log('컴플리트 터치!222');
        setLoading(true);
        const formData = new FormData();
        formData.append('orderId', orderId);
        console.log('컴플리트 터치!333');
        // formData.append('image', {
        //     name: image.name,
        //     type: image.type || 'image/jpeg',
        //     uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        // });
        formData.append('image', image);
        console.log('컴플리트 터치!4444');
        try {
            await axios.post(`${Config.API_URL}/complete`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setLoading(false);
            console.log('컴플리트 터치!555');
            Alert.alert('알림', '완료처리 되었습니다.');
            //? 화면 갱신을 위해 goBack 후에 navigate 처리함
            navigation.goBack();
            navigation.navigate('Settings');
            dispatch(orderSlice.actions.rejectOrder(orderId));
        } catch (error) {
            const errorResponse = (error as AxiosError<{ message: string }>).response;
            if (errorResponse) {
                Alert.alert('알림', errorResponse.data.message);
            }
        }
    }, [accessToken, dispatch, image, navigation, orderId]);

    return (
        <SafeAreaView>
            <View style={styles.orderId}>
                <Text style={{ color: 'black' }}>주문번호: {orderId}</Text>
            </View>
            <View style={styles.preview}>
                {preview && <Image style={styles.previewImage} source={preview} />}
            </View>
            <View style={styles.buttonWrapper}>
                <Pressable style={styles.button} onPress={onTakePhoto}>
                    <Text style={styles.buttonText}>이미지 촬영</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={onChangeFile}>
                    <Text style={styles.buttonText}>이미지 선택</Text>
                </Pressable>
                <Pressable
                    style={
                        image
                            ? styles.button
                            : StyleSheet.compose(styles.button, styles.buttonDisabled)
                    }
                    onPress={onComplete}
                    // disabled={loading}
                >
                    <Text style={styles.buttonText}>완료</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    orderId: {
        padding: 20,
    },
    preview: {
        marginHorizontal: 10,
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height / 3,
        backgroundColor: '#D2D2D2',
        marginBottom: 10,
    },
    previewImage: {
        height: Dimensions.get('window').height / 3,
        resizeMode: 'contain',
        // cover, contain, repeat, center, stretch
    },
    buttonWrapper: { flexDirection: 'row', justifyContent: 'center' },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 120,
        alignItems: 'center',
        backgroundColor: 'yellow',
        borderRadius: 5,
        margin: 5,
    },
    buttonText: {
        color: 'black',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
    },
});

export default Complete;
