import * as React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

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

function App() {
    // const isLoggedIn = false;

    return (
        <Provider store={store}>
            <AppInner />
        </Provider>
    );
}

export default App;
