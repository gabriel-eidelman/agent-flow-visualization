// App.tsx
import React from 'react';
// import { createStaticNavigation } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import type { StaticScreenProps } from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import WebsocketChat from './WebsocketChat';
import AgentChat from './AgentChat'
import AgentFlow from './AgentFlow'

export type RootStackParamList = {
  Home: undefined;
  AgentChat: undefined;
  Websocket: undefined;
  AgentFlow: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F0F1A', // match background
          },
          headerTitleStyle: {
            color: '#00FFF7',           // neon text
            fontFamily: 'Courier New', // match font
            fontSize: 18,
          },
          headerTintColor: '#00FFF7',  // back button color
          headerShadowVisible: false,  // remove iOS bottom border
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AgentChat" component={AgentChat} />
        <Stack.Screen name="Websocket" component={WebsocketChat} />
        <Stack.Screen name="AgentFlow" component={AgentFlow} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const RootStack = createNativeStackNavigator({
//     initialRouteName: 'Home',
//     screens: {
//         Home: HomeScreen,
//         Curriculum: AgentChat,
//         Websocket: WebsocketChat
//     },
// });
// const Navigation = createStaticNavigation(RootStack);

// export default function App() {
//   return <Navigation />;
// }