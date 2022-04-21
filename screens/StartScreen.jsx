import { useNavigation } from '@react-navigation/native';
import React from 'react'; 
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,  ImageBackground, Image, KeyboardAvoidingView, View, TouchableOpacity } from 'react-native';
import { Button,  TextInput, HelperText } from 'react-native-paper';
import { auth } from "../config/firebase";
import { useTranslation } from "react-i18next";


export default function MainScreen() {

  const {t,i18n}=useTranslation();

  const pickLangEn=() =>{
        i18n.changeLanguage("en")
       } 

    const pickLangSw=() =>{
        i18n.changeLanguage("sw")
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then (userCredentials => {
            const user = userCredentials.user;
            if(user.emailVerified){
            console.log("Logged in with", user.email);
            navigation.navigate("HomeScreen")
            }
            else{
              alert('Please verify your email before signing in')
              auth.signOut();
            }
        })
        .catch(error => alert(error.message))
        
    }
  
  const navigation= useNavigation();
  const handleForgotOnPress = () =>  navigation.navigate("ResetPassword")
  const handleRegisterOnPress = () =>  navigation.navigate("RegisterScreen")

  return (
<KeyboardAvoidingView style={styles.container}>     
<SafeAreaView>



         
     <ImageBackground source={{
        uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
        style={styles.backgroundImage}
        resizeMode="cover"> 
        <View>
              <View style={{alignItems:'flex-end'}}>
              <TouchableOpacity
              onPress={pickLangEn}>
              <Image source={require('../assets/united-kingdom.png')} style={styles.flags}/>
              </TouchableOpacity>
 
              <TouchableOpacity
              onPress={pickLangSw} >
              <Image source={require('../assets/sweden.png')} style={styles.flags}/>
              </TouchableOpacity>
              </View>

    <View style={styles.logoAndText}>
        <Text>{t('WelcomeText')}</Text>
     
            <Image source={require('../assets/sportaLogo.png')}  style={styles.logo}/>
            </View>
            </View>

            <View style={styles.test}> 
            <Text style={{marginLeft:10, fontWeight:'bold'}}> {t('signIN')}</Text> 
            <TextInput style={styles.textinput}
                label= {t('email')}
                mode="outlined"
                activeOutlineColor="hotpink"
                placeholder={t('email')}
                value={email}
                onChangeText = {email => setEmail(email)}/>
                
             
    
            <TextInput style={styles.textinput} secureTextEntry={true} 
                         label= {t('password')}
                         mode="outlined"
                         activeOutlineColor="hotpink"
                         placeholder={t('password')}
                        value={password}
                        onChangeText = {password => setPassword(password)}/> 


            <Button  mode="contained"
                     title="Left button"
                    onPress={handleLogin}
                    style={styles.loginBtn} >
                 {t('signIN')}
              </Button>
              
              
            <View style = {styles.forgotPasswordText}>
              <Text>{t('forgotPass')}  
              <Text onPress={handleForgotOnPress} style = {styles.pressHere}> {t('pressHere')} </Text>
              </Text>
            </View>
            
      
      
      
      <Button style={styles.registerBtn} mode="outlined" compact="true" onPress={handleRegisterOnPress} >
      {t('register')}
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
    marginTop: 250
  },

    flags:{
      height:30,
      width:55,
      margin:5,
      

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
  marginTop:5
  

}



});