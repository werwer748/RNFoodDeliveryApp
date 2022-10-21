import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import EachOrder from '../components/EachOrder';
import orderSlice, { Order } from '../slices/order';
import { RootState } from '../store/reducer';
import { useAppDispatch } from '../store/index';

function Orders() {
    const orders = useSelector((state: RootState) => state.order.orders);
    const dispatch = useAppDispatch();
    const [refresh, setRefresh] = useState(false);

    const renderItem = useCallback(({ item }: { item: Order }) => {
        return <EachOrder item={item} />;
    }, []);

    const refreshItem = useCallback(() => {
        dispatch(
            orderSlice.actions.cleanOrder(null),
        );
    }, [dispatch]);

    const getRefreshData = () => {
        setRefresh(true);
        refreshItem();
        setRefresh(false);
    };

    const onRefresh = () => {
        if (!refresh) {
            getRefreshData();
        }
    };

    return (
        <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={refresh}
        />
    );
}

export default Orders;
