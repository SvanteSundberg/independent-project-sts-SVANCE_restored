import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, ImageBackground, SafeAreaView, Image } from 'react-native';
import { Button, TextInput} from 'react-native-paper';
import { auth } from "../config/firebase";
import colors from '../config/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from 'react-native-paper';
import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';

const ResetPassword = (props) => {

    const { btnStyle } = useTheme();
    
    const [isSent, setIsSent]= useState(false);
    const [email, setEmail] = useState('');
    const {t,i18n}=useTranslation();
    const navigation= useNavigation();
    const handleBackwards = () =>  navigation.navigate("StartScreen")

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
                <Text>{t('linkPass')}</Text>
            </View>)
        }
        else {
            return(
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
                <Text style={{ color:'white', marginLeft: 5, fontWeight: 'bold', left: 10 }}>{t('resPassword')}</Text>
            <TextInput
                    style={styles.textInput}
                    placeholder={t('yourEmail')}
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    activeOutlineColor="hotpink"/>
                    <Button
                    style={{width: btnStyle.width, alignSelf: btnStyle.alignSelf, marginTop: 20}}
                    mode="contained"
                    onPress={() => reset()}> 
                     {t('reset')}
                    </Button>     
                    </ImageBackground>
        </SafeAreaView>
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

    backButton: {
        width:20,
        height: 35,
        top:20,
        left: 10
    },

    textInput:{
        margin:10,
        
    },
    btn:{
        width:200,
        alignSelf:'center',
        marginTop: 20
    },
    emailSent:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    }, 
    backgroundImg: {
        width: '100%',
        height: '100%',
      },
      logo: {
        width: 350,
        height:150,
        marginBottom: 15,
        marginTop: 25,
        resizeMode: "contain",
        alignSelf: 'center'
      
      },
    
})
  
  export default ResetPassword;