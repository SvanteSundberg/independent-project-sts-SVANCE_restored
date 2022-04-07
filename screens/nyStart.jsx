import { useNavigation } from '@react-navigation/native';
import React from 'react'; 
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  ImageBackground, Image, KeyboardAvoidingView } from 'react-native';
import { Button,  TextInput, HelperText } from 'react-native-paper';
import { auth } from "../config/firebase";
//import VectorImage from 'react-native-vector-image';


export default function MainScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const onPressText = () => {
        console.log("text pressed");
      };

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then (userCredentials => {
            const user = userCredentials.user;
            console.log("Logged in with", user.email);
        })
        .catch(error => alert(error.message))
    }
  
  const navigation= useNavigation();
  const handleForgotOnPress = () =>  navigation.navigate("ResetPassword")
  const handleRegisterOnPress = () =>  navigation.navigate("RegisterScreen")
  //<VectorImage source={require('../assets/sporta_logo_blue_filled 1.svg')} /> funkar ej
  //<Image source={require('../assets/sportaLogo.png')} style={styles.logo}/>
  return (
<KeyboardAvoidingView style={styles.test}>
    
         
         
     <ImageBackground source={{
        uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
        style={styles.image}> 
      <Text>ny startsida</Text>
      <Text style={styles.header}> SIGN IN</Text> 
            <Image source={require('../assets/sportaLogo.png')} style={styles.logo}/>
            <TextInput style={styles.textinput}
                label= "Email"
                mode="outlined"
                activeOutlineColor="hotpink"
                placeholder="Email"
                value={email}
                onChangeText = {email => setEmail(email)}/>
                
             
    
            <TextInput style={styles.textinput} secureTextEntry={true} 
                         label= "Password"
                         mode="outlined"
                         activeOutlineColor="hotpink"
                         placeholder="Password"
                        value={password}
                        onChangeText = {password => setPassword(password)}/> 


            <Button  mode="contained"
                     title="Left button"
                    onPress={handleLogin} >
                 Log in
              </Button>
            
              <Text style = {styles.forgotPasswordText}>Forgot your password? <Text onPress={handleForgotOnPress} style = {{ color: 'blue' }}>Press here</Text></Text> 
              
            
      
      
      
      <Button style={[styles.button, styles.registerBtn]} mode="outlined" compact="true" onPress={handleRegisterOnPress} >
        Register
      </Button>
      </ImageBackground>
      
    
    </KeyboardAvoidingView>
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
    
  },

  logo: {
    height:120,
    width:'100%',
    
  },
  textinput:{
    margin: 10,
    
},
forgotPasswordText:{
    margin:10,
    justifyContent:'center',
    alignItems: 'center'
}

});