import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
    orderId: string;
    start: {
        latitude: number;
        longitude: number;
    };
    end: {
        latitude: number;
        longitude: number;
    };
    price: number;
    image?: string;
    completedAt?: string;
    rider?: string;
}

interface InitialState {
    orders: Order[];
    deliveries: Order[];
    completes: Order[];
}

const initialState: InitialState = {
    orders: [],
    deliveries: [],
    completes: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action: PayloadAction<Order>) {
            state.orders.push(action.payload);
        },
        acceptOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(v => v.orderId === action.payload);
            if (index > -1) {
                state.deliveries.push(state.orders[index]);
                state.orders.splice(index, 1);
            }
        },
        rejectOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(v => v.orderId === action.payload);
            if (index > -1) {
                state.orders.splice(index, 1);
            }
            const deliveryIndex = state.deliveries.findIndex(v => v.orderId === action.payload);
            if (deliveryIndex > -1) {
                state.deliveries.splice(deliveryIndex, 1);
            }
        },
        cleanOrder(state, action: PayloadAction<null>) {
            state.orders = [];
        },
        setCompletes(state, action) {
            state.completes = action.payload;
        },
    },
    extraReducers: builder => {},
});

export default orderSlice;
