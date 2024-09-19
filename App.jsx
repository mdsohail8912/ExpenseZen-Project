import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './home';
import RecentExpenses from './RecentExpenses';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RecentExpenses" component={RecentExpenses} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
