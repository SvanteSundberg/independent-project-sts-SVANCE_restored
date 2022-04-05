import { StyleSheet, Text, TextInput, KeyboardAvoidingView, Button } from "react-native";
import { useState } from "react";
import { auth } from "../config/firebase";

function LoginScreen(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then (userCredentials => {
            const user = userCredentials.user;
            console.log("Created user with", user.email);
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then (userCredentials => {
            const user = userCredentials.user;
            console.log("Logged in with", user.email);
        })
        .catch(error => alert(error.message))
    }

    const handleSignout = () => {
        auth
        .signOut
    }

    return (
        <KeyboardAvoidingView
            behavior="padding">
            <Text style={styles.header}> SIGN IN</Text> 
            <Text> Email: {auth.currentUser?.email}</Text>
            <Text style={styles.text}> Email </Text>
            <TextInput 
                style={styles.textbox} 
                value={email}
                onChangeText = {email => setEmail(email)}/>
            <Text style={styles.text}> Password </Text>
            <TextInput style={styles.textbox} 
                        value={password}
                        onChangeText = {password => setPassword(password)}/>
            <Text> {password} </Text>

            <Text style={styles.header}> Not a member?
            </Text> 

            <Button title={'Create account'}
                    onPress={handleSignUp}/>
            <Button style={styles.loginbutton} 
                    title={'Continue'}
                    onPress={handleLogin}/>
            <Button title={'Sign out'}
                    onPress={handleSignout}/>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
    },
    loginbutton: {
        backgroundColor:'blue',
    },
    text: {
        marginTop:20,
        marginBottom:3,
    },
    textbox: {
        borderColor: 'grey',
        height: '11%',
        width: 200,
        borderWidth: 1,
        padding: 10,
        borderRadius:10,
      },
});

export default LoginScreen;