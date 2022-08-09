import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, View, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, Button, Pressable} from 'react-native';
//? TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, Button, Pressable <- 버튼 종류
//!  동일한 화면을 원할 경우 TouchableWithoutFeedback, Pressable
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

//? navigation 타입정의, 연결
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 5, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'flex-end' }}>
      <Pressable onPress={onClick} style={{ paddingVertical: 20, paddingHorizontal: 40, backgroundColor: 'royalblue' }}>
        <Text style={{ color: 'white' }}>Home Screen</Text>
      </Pressable>
    </View>
    <View style={{ flex: 2, backgroundColor: 'pink' }}><Text>SSSSSS</Text></View>
    </View>
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
    <NavigationContainer>{/* safe-aria-view 적용되어있다고 함 */}
      <Stack.Navigator initialRouteName="Details">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '홈화면'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        {/* {(props: {navigation: any, route: RouteProp<PramListBase, RouteName>}) => <DetailScreen {...props} />} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
