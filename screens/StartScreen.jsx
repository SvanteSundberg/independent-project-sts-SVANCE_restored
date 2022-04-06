import { useNavigation } from '@react-navigation/native';
import React from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  ImageBackground, Image } from 'react-native';
import { Button } from 'react-native-paper';
//import VectorImage from 'react-native-vector-image';


export default function MainScreen() {
  
  const navigation= useNavigation();
  const handleOnPress = () =>  navigation.navigate("LoginScreen")
  
  //<VectorImage source={require('../assets/sporta_logo_blue_filled 1.svg')} /> funkar ej
  //<Image source={require('../assets/sportaLogo.png')} style={styles.logo}/>
  return (
    <SafeAreaView style={styles.test}>
     <ImageBackground source={{
        uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
        style={styles.image}> 
      <Text>Mainscreen</Text>
      
      <Image source={require('../assets/sportaLogoBlue.png')} style={styles.logo}/>
      <Text>[insert logo]</Text>
      
      <Button style={[styles.button, styles.loginBtn]} mode="contained" onPress= {handleOnPress}>
        Sign in
      </Button>
      <Button style={[styles.button, styles.registerBtn]} mode="outlined" compact="true" >
        Register
      </Button>
      </ImageBackground>
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
  button:{
    width:100,
    margin:10,
  },
  registerBtn:{
    backgroundColor: "#fff"
  },
  loginBtn:{

  },
   
  image: {
    width:'100%',
    height:'100%',
    resizeMode:'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height:120,
    width:'100%',
  }
});
