import { StyleSheet, Text, View } from 'react-native';
import React from 'react'; 
import AppNavigator from './AppNavigator.jsx';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
  <PaperProvider>
   <AppNavigator
   />
   </PaperProvider>

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
