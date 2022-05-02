import { SafeAreaView, StyleSheet , Text,ScrollView, Image} from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { ImageBackground } from "react-native";
import { auth } from "../config/firebase";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
 
    function RegisterScreen(props) {
     const {t,i18n}=useTranslation();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmpassword] = useState('')
    const navigation= useNavigation();
   
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
 
        <ImageBackground source={{
                         uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
                         style={styles.image}>
        <Image source={require('../assets/sportaLogo.png')}  style={styles.logo}/>
           
             
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
      fontWeight:'bold'
 
    },
 
    input:{
      margin:7,
 
    },
    image: {
      width:'100%',
      height:'100%',
      resizeMode:'cover',
    },
    button:{
      width:200,
     alignSelf:'center',
     marginTop: 10
 
    }
  });
 
export default RegisterScreen;

