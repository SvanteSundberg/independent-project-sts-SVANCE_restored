import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Button, Input , Icon, TextInput} from 'react-native-paper';
import { auth } from "../config/firebase";

const ResetPassword = () => {

    const [email, setEmail] = useState('');
    const [showLoading, setShowLoading] = useState(false);

    const reset = async() => {
        setShowLoading(true);
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('email sent');
            setShowLoading(false);
        } catch (e) {
            setShowLoading(false);
            Alert.alert(
                e.message
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 28, height: 50}}>Reset Password!</Text>
            <TextInput
                    style={styles.textInput}
                    placeholder='Your Email'
                    value={email}
                    onChangeText={setEmail}
                />
                        <Button
                    style={styles.textInput}
                    mode="contained"
                    onPress={() => reset()}> Reset</Button>  
        
        </View>

    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        justifyContent:'center'
    },
    textInput:{
        margin:20
    }
    
})
  
  export default ResetPassword;