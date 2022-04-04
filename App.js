import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FetchListScreen from './components/fetchlist_screen.js'
import  MainScreen from './screens/MainScreen.jsx';

export default function App() {
  return (
    <View style = {styles.container}> 
    <FetchListScreen/>
    <NavigationContainer>
      <StatusBar style="auto" />
     </NavigationContainer>
    </View>
  
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
