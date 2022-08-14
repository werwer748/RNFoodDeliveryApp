import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleProp,
    TouchableWithoutFeedback,
    ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

const DismissKeyboardView: React.FC<{
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>; //리액트 스타일에 대한 타이핑
}> = ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {/* <KeyboardAvoidingView
            {...props}
            behavior={Platform.OS === 'android' ? 'position' : 'padding'}
            style={props.style}
        >
            {children}
        </KeyboardAvoidingView> */}
        <KeyboardAwareScrollView {...props} style={props.style}>
            {children}
        </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
