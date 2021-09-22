import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/home';
import Detail from '../screens/details/detail';
import Login from '../screens/Login/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator()




function MainStackNavigator() {


  const [isLogin,setLogin]  = React.useState(false);
  
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@isLogin')
      if (value !== null) {
        // value previously stored 
        setLogin((value == "true") ? true: false);
        return isLogin
      }
    } catch (e) {
      // error reading value 
      console.log(e)  
    }
  }

 

  return (
   
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
     
      {!getData() ?
        <Stack.Screen name='Login' component={Login} />
        : <Stack.Screen name='Home' component={Home} />}

         {!getData() ?
        <Stack.Screen name='Home' component={Home} />
        : <Stack.Screen name='Login' component={Login} />}
        <Stack.Screen name='Detail' component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
//<Stack.Screen name='Home' component={Home} /> 

export default MainStackNavigator
