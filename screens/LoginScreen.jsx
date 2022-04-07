import { StyleSheet, Text, KeyboardAvoidingView, ImageBackground, Image, ScrollView } from "react-native";
import { useState } from "react";
import { Button, TextInput } from 'react-native-paper';
import { auth } from "../config/firebase";

function LoginScreen(props) {
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


    return (
        
        <KeyboardAvoidingView  style={styles.pos}>
            <ImageBackground source={{
        uri:'https://cdn.discordapp.com/attachments/955769691975065633/957929103665811456/photo-1562552052-af5955fe5ba2.png'}}  
        style={styles.image}> 
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


            <Button style={[styles.button, styles.loginbutton]} 
                     mode="contained"
                    onPress={handleLogin} >
                 Log in
              </Button>
              </ImageBackground>
              </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({

    pos:{
        alignItems: 'center',
        justifyContent: 'center',

    },
    
    header: {
        fontSize: 20,
        marginBottom: 30,
       
        
    },
     
    button:{
        width:100,
        margin:10,
    },
    loginBtn:{

    },

      image: {
        width:'100%',
        height:'100%',
        resizeMode:'cover',
        
      },
      textinput:{
          margin: 10,
          
      }
});

export default LoginScreen;