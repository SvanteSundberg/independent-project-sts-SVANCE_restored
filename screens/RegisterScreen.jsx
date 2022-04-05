import { SafeAreaView, StyleSheet, TextInput , Text} from "react-native";
import React from 'react';


    function registerScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
       <Text> Enter email: </Text>
       <TextInput style={styles.input}> </TextInput>
       <TextInput style={styles.input}> </TextInput>
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
    input:{
        borderWidth: 1,
        borderColor:'#777',
        padding: 8, 
        margin: 10,
        width:200,

    }
  });

export default registerScreen;