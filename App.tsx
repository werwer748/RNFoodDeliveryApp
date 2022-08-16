import * as React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

function App() {
    // const isLoggedIn = false;

    return (
        <Provider store={store}>
            <AppInner />
        </Provider>
    );
}

export default App;
