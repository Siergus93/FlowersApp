import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store/store';
import { Provider } from 'react-redux';
import { Flower, FlowerImage } from './src/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreateScreen } from './src/screens/CreateScreen';
import { NativeBaseProvider } from 'native-base';

export type RootStackParamList = {
  Home: undefined;
  Create: {
    flower?: Flower;
    images?: FlowerImage[];
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <Stack.Navigator screenOptions={{ header: () => null }}>
            <Stack.Screen name='Home' component={HomeScreen} options={{ title: '' }} />
            <Stack.Screen name='Create' component={CreateScreen} options={{ title: '' }} />
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
}
