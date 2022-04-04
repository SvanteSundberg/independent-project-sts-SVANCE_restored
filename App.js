import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FetchListScreen from './components/fetchlist_screen.js'



export default function App() {
  return (
    <View style = {styles.container}> 
    <FetchListScreen/>
    <NavigationContainer><View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
