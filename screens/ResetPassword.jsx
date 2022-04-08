import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Button, Input , Icon, TextInput} from 'react-native-paper';
import { auth } from "../config/firebase";

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

    const renderBtn =() =>{
        if( isSent){
            return(
            <View>
                <Text> hej</Text>
            </View>)
        }
        else {
            return(
            <View style={styles.container}>
            <Text style={{ fontSize: 28, height: 50}}>Reset Password!</Text>
            <TextInput
                    style={styles.textInput}
                    placeholder='Your Email'
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    activeOutlineColor="hotpink"
                
                />
                        <Button
                    style={styles.textInput}
                    mode="contained"
                    onPress={() => reset()}> Reset</Button>  
        
        </View>
            )

        }

    }

    return (
        <React.Fragment>
         
        
        {renderBtn()}
        

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
    }
    
})
  
  export default ResetPassword;