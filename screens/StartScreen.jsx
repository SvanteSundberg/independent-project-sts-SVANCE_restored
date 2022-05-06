import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ImageBackground, Image, KeyboardAvoidingView, View, TouchableOpacity, Menu } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { auth } from "../config/firebase";
import { useTranslation } from "react-i18next";
import LangMenu from "../components/LangMenu";
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import colors from '../config/colors';
import { ScrollView } from 'react-native-web';


export default function MainScreen() {

  const { t, i18n } = useTranslation();



  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (user.emailVerified) {
          console.log("Logged in with", user.email);
          findNavigate();
        }
        else {
          alert('Please verify your email before signing in')
          auth.signOut();
        }
      })
      .catch(error => alert(error.message))

  }

  const findNavigate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("nu hämtar jag info!");
    const response = firebase.firestore().collection('users');
    const info = await response.doc(user.uid).get();
    if (!info.exists) {
      navigation.navigate("CreateprofileScreen", {
        name: "",
        age: "",
        bio: "",
        photo: null,
        selectedSports: [],
        first: 'true'
      })
    }
    else {
      navigation.navigate("HomeScreen")
    }
  };

  const navigation = useNavigation();
  const handleForgotOnPress = () => navigation.navigate("ResetPassword")
  const handleRegisterOnPress = () => navigation.navigate("RegisterScreen")

  return (

   

    <KeyboardAvoidingView style={styles.container}>

      <SafeAreaView>
        <ImageBackground source={require('../assets/logoOpac.png')} style={styles.backgroundImg}>
          <View style={styles.background}>


            <View>

              <LangMenu />
              <Image source={require('../assets/sportaLogoFinal.png')} style={styles.logo} />



            </View>


            <Text style={{ color:'white', marginLeft: 10, fontWeight: 'bold' }}> {t('signIN')}</Text>

            <TextInput style={styles.textinput}
              label={t('email')}
              mode="outlined"
              activeOutlineColor="#63B5FF"
              outlineColor="white"
              placeholder={t('email')}
              value={email}
              onChangeText={email => setEmail(email)} />



            <TextInput style={styles.textinput} secureTextEntry={true}
              label={t('password')}
              mode="outlined"
              activeOutlineColor="#63B5FF"
              outlineColor="white"
              placeholder={t('password')}
              value={password}
              onChangeText={password => setPassword(password)} />



            <View style={styles.buttonsAndText}>
              <Button mode="contained"
                title="Left button"
                onPress={handleLogin}
                style={styles.loginBtn} >
                {t('signIN')}
              </Button>


              <Button style={styles.registerBtn} mode="contained" compact="true" onPress={handleRegisterOnPress} >
                <Text style={{color:'black'}}>{t('register')}</Text>
              </Button>

              <View style={styles.forgotPasswordText}>
                <Text>{t('forgotPass')}
                  <Text onPress={handleForgotOnPress} style={styles.pressHere}> {t('pressHere')} </Text>
                </Text>
              </View>
            </View>

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


  registerBtn: {
    backgroundColor: "#fff",
    width: 200,
    alignSelf: 'center',

  },
  loginBtn: {
    width: 200,
    alignSelf: 'center',
    marginBottom:15,
    //backgroundColor:colors.mediumBlue,
  },

  background: {
    //backgroundColor: '#DBF2FF' ,
    // width:'100%',
    // height:'100%',  
  },

  logo: {
    width: 350,
    height:150,
    marginBottom: 60,
    resizeMode: "contain",
    alignSelf: 'center'
  
  },
  backgroundImg: {
    width: '100%',
    height: '100%',
  },


  textinput: {
    margin: 10,

  },
  forgotPasswordText: {
    alignItems: 'center',
    margin: 10,
    color: '#fff'
  },
  /*test:{
      justifyContent:'center',
      flex:1,
      marginBottom: 110
  },*/ //såg ingen skillnad när jag tog bort denna

  pressHere: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  buttonsAndText: {
    marginTop: 15,
  }




});