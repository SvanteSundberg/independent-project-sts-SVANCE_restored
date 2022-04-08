import { useNavigation } from '@react-navigation/native';
import React from 'react'; 
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  ImageBackground, Image, KeyboardAvoidingView, View, TouchableOpacity } from 'react-native';
import { Button,  TextInput, HelperText } from 'react-native-paper';
import { auth } from "../config/firebase";


export default function MainScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
<KeyboardAvoidingView style={styles.container}>     
<SafeAreaView  >
    
         
         
     <ImageBackground source={{
        uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
        style={styles.backgroundImage}
        resizeMode="cover"> 
    <View style={styles.logoAndText}>
      <Text>Welcome to</Text>
      
            <Image source={require('../assets/sportaLogo.png')}  style={styles.logo}/>
            </View>

            <View style={styles.test}> 
            <Text style={{marginLeft:10, fontWeight:'bold'}}> SIGN IN</Text> 
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
                    onPress={handleLogin}
                    style={styles.loginBtn} >
                 Log in
              </Button>

              
            <View style = {styles.forgotPasswordText}>
              <Text>Forgot your password?   
              <Text onPress={handleForgotOnPress} style = {styles.pressHere}> Press here</Text>
              </Text>

              <Text style={{marginTop:20, fontSize:15}}>OR</Text> 
            </View>
            
      
      
      
      <Button style={styles.registerBtn} mode="outlined" compact="true" onPress={handleRegisterOnPress} >
        Register
      </Button>
      </View>
      </ImageBackground>
      
    
    </SafeAreaView>
    </KeyboardAvoidingView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  
  registerBtn:{
    backgroundColor: "#fff",
    width:200,
    alignSelf:'center'
  },
  loginBtn:{
    width:200,
    alignSelf:'center'
  },
   
  backgroundImage: {
    width:'100%',
    height:'100%',  
  },

  logo: {
    height:150,
    width:250,
    resizeMode: "contain",
    
  },
  textinput:{ 
    margin: 10,
    
},
forgotPasswordText:{
    alignItems:'center',
    margin:10,
    color:'#fff'
},
test:{
    justifyContent:'center',
    flex:3,
},

pressHere:{
     color: 'blue',
     textDecorationLine: 'underline', 
},

logoAndText:{
  alignItems:'center',
  flex:1,
  justifyContent:'space-around',
  marginTop:100

}



});