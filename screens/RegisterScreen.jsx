import { SafeAreaView, StyleSheet , Text,ScrollView, Image, View} from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { ImageBackground } from "react-native";
import { auth } from "../config/firebase";
import { useState } from "react";
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { color } from "react-native-elements/dist/helpers";
 
    function RegisterScreen(props) {
     const {t,i18n}=useTranslation();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmpassword] = useState('')
    const navigation= useNavigation();

    const handleBackwards = () =>  navigation.navigate("StartScreen")
   
    const handleSignUp = () => {
      if(password!=confirmPassword){
        return alert('Passwords do not match')
      }
     
      else {
        auth
        .createUserWithEmailAndPassword(email, password)
       
        .then (userCredentials => {
            const user = userCredentials.user;
            console.log("Created user with", user.email);
            user.sendEmailVerification();
            auth.signOut();
            alert("Email sent");
            navigation.navigate("StartScreen")
        })
        .catch(error => alert(error.message))
 
      }
    }
 
    return (
        <SafeAreaView style={styles.container}>
 
       <ImageBackground source={require('../assets/logoOpac.png')} style={styles.backgroundImg}>


       <Button
       style={styles.backButton}
       onPress={handleBackwards}
      icon='keyboard-backspace'
       labelStyle={{fontSize: 35,
        color: colors.lightBlue}}>
        </Button>

       <Image source={require('../assets/sportaLogoFinal.png')} style={styles.logo} />
             
       <Text style={styles.header}> {t('createAccount')}  </Text>
       <TextInput mode="outlined"
                  label={t('email')}
                  style={styles.input}
                  activeOutlineColor="#63B5FF"
                  value={email}
                  onChangeText = {email => setEmail(email)}
       />
       
       <TextInput mode="outlined"
                  label={t('password')}
                  style={styles.input}
                  activeOutlineColor="#63B5FF"
                  secureTextEntry={true}
                  value={password}
                  onChangeText = {password => setPassword(password)}
       />
       
      <TextInput mode="outlined"
                 label={t('repeatpassword')}
                 style={styles.input}
                 secureTextEntry={true}
                 value={confirmPassword}
                 onChangeText = {confirmPassword => setConfirmpassword(confirmPassword)}
      />
      <Button title={'Create account'}
              onPress={handleSignUp}
              mode="contained"
              style={styles.button}
              compact="true"
              >{t('createAccount')}
                </Button>
     
          </ImageBackground>
         
        </SafeAreaView>
    );
}
 
 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
     
    },
    backButton: {
      width:20,
      height: 35,
      top:20,
      left: 10
  },
    logo: {
      height:150,
      width:250,
      resizeMode: "contain",
      marginTop: 5,
      alignSelf:'center'
    },
 
    header:{
      marginTop:5,
      marginLeft:120,
      fontWeight:'bold',
      color: '#fff',
      right: 100
      
 
    },
 
    input:{
      margin:7,
 
    },
    backgroundImg: {
      width: '100%',
      height: '100%',
    },

    button:{
      width:200,
     alignSelf:'center',
     marginTop: 10
 
    }
  });
 
export default RegisterScreen;

