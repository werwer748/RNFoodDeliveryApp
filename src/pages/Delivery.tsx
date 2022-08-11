import * as React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Complete from './Complete';
import Ing from './Ing';

const Stack = createNativeStackNavigator();

function Delivery() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Ing"
                component={Ing}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Complete"
                component={Complete}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default Delivery;
