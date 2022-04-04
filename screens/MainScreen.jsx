import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';



export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Sign in" ></Button>
      <StatusBar style="auto" />
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  test: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});