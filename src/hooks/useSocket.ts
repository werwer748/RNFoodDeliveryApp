// import { useCallback } from 'react';
// import SocketIOClient, { Socket } from 'socket.io-client';
// import Config from 'react-native-config';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/reducer';

// let socket: Socket | undefined;

// const useSocket = (): [Socket | undefined, () => void] => {
//     const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
//     const disconnect = useCallback(() => {
//         if (socket && !isLoggedIn) {
//             console.log(socket && !isLoggedIn, '웹소켓 연결을 해제합니다.');
//             socket.disconnect();
//             socket = undefined;
//         }
//     }, [isLoggedIn]);
//     if (!socket && isLoggedIn) {
//         console.log(!socket && isLoggedIn, '웹소켓 연결을 진행합니다.');
//         socket = SocketIOClient(`${Config.API_URL}`, {
//             transports: ['websocket'],
//         });
//     }
//     return [socket, disconnect];
// };

// export default useSocket;
import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;

const useSocket = (): [Socket | undefined, () => void] => {
    const disconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
            socket = undefined;
        }
    }, []);
    if (!socket) {
        socket = io(`${Config.API_URL}`, {
            transports: ['websocket'],
        });
    }
    return [socket, disconnect];
};

export default useSocket;
