import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/home';
import Detail from '../screens/details/detail';


const Stack = createNativeStackNavigator()

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Home" screenOptions={{
            headerShown: false
        }}>
        <Stack.Screen name='Home' component={Home} /> 
        <Stack.Screen name='Detail' component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
//<Stack.Screen name='Home' component={Home} /> 

export default MainStackNavigator
