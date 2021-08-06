/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet,Text, View } from 'react-native';
import AppNavigator from './src/navigation/navigator'



export default class App extends React.Component{
  render(){
    return(
      <AppNavigator/>
    );
  }
}