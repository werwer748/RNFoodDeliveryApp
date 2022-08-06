import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, Button, Pressable} from 'react-native';
//? TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, Button, Pressable <- 버튼 종류
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <>
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'flex-end' }}>
      <Pressable onPress={onClick} style={{ paddingVertical: 20,paddingHorizontal: 40, backgroundColor: 'royalblue' }}>
        <Text style={{ color: 'white' }}>Home Screen</Text>
      </Pressable>
    </View>
    <View style={{ flex: 5, backgroundColor: 'pink' }}><Text>SSSSSS</Text></View>
    </>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={onClick}>
        <Text>Details Screen</Text>
      </TouchableHighlight>
    </View>
  );
}

const Stack = createNativeStackNavigator();
function App() {
  return (
    // 기본꼴
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Details">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈화면'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
