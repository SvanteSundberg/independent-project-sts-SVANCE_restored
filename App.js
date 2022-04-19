import { StyleSheet, Text, View } from 'react-native';
import React from 'react'; 
import AppNavigator from './AppNavigator.jsx';
import i18n from "./lanuages/i18n";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import CreateEventScreen from './screens/CreateEventScreen.jsx';


const theme = {
  ...DefaultTheme,
  roundness: 10,
  // Specify custom property
  btnStyle:{
    width:200,
    margin:10,
    alignSelf:'center'
  },
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: 'dodgerblue',
    accent: 'red',
  },
};

export default function App() {
  return (
  <PaperProvider theme={theme}>
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


