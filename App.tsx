import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { store } from './src/store/store'
import { Provider } from 'react-redux'
import { Flower } from "./src/types";
import { HomeScreen } from "./src/components/HomeScreen";
import { CreateScreen } from "./src/components/CreateScreen";
import { SettingsScreen } from "./src/components/SettingsScreen";

export type RootStackParamList = {
  Home: undefined,
  Create: {
    addFlower: (flower: Flower, image: string | undefined) => void,
    flower?: Flower,
    initImage?: string,
  },
  Settings: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Create' component={CreateScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  )
}
