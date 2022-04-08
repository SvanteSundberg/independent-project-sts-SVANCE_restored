import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Button, TextInput} from 'react-native-paper';
import { auth } from "../config/firebase";
import Ionicons from '@expo/vector-icons/Ionicons';

const ResetPassword = () => {
    
    const [isSent, setIsSent]= useState(false);
    const [email, setEmail] = useState('');

    const reset = async() => {
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('email sent');
            setIsSent(!isSent); 
            console.log(isSent)   
        } 
        catch (e) {
            Alert.alert(
                e.message
            );
        }
    };

    const renderView =() =>{
        if(isSent){
            return(
            <View style={styles.emailSent}>
                <Ionicons name="md-checkmark-circle" size={50} color="green" />
                <Text>Link to reset your password sent. Please check your inbox.</Text>
            </View>)
        }
        else {
            return(
            <View style={styles.container}>
            <Text style={{ fontSize: 28, height: 50, alignSelf:'center'}}>Reset your password</Text>
            <TextInput
                    style={styles.textInput}
                    placeholder='Your Email'
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    activeOutlineColor="hotpink"/>
                    <Button
                    style={styles.btn}
                    mode="contained"
                    onPress={() => reset()}> 
                    Reset
                    </Button>     
        </View>
            )

        }

    }

    return (
        <React.Fragment>

        {renderView()}
        
        </React.Fragment>

    );
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    },
    textInput:{
        margin:20
    },
    btn:{
        width:200,
        alignSelf:'center'
    },
    emailSent:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    }
    
})
  
  export default ResetPassword;