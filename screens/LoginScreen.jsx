import { StyleSheet, Text, TextInput, SafeAreaView, Button } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


function LoginScreen(props) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
        const user = userCredential.user;
    // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
    // https://github.com/firebase/snippets-web/blob/509769a817d7437616bcfcb816f783b29aaca843/snippets/auth-next/email/auth_signin_password.js#L8-L20

    return (
        <SafeAreaView>
            <Text style={styles.header}> SIGN IN</Text> 
            <Text style={styles.text}> Username </Text>
            <TextInput 
                style={styles.textbox} 
                placeholder={"Name"}
                onChangeText={(name)=> setName(name)}/>
            <Text style={styles.text}> Password </Text>
            <TextInput style={styles.textbox} 
                maxLength={5}/>

            <Text style={styles.header}> Not a member?
            <Button title={'Create account'}/>
            </Text> 

            <Button style={styles.loginbutton} title={'Continue'}/>
        </SafeAreaView>
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