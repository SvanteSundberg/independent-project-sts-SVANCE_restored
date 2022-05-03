import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Divider, IconButton, Button } from 'react-native-paper';
import {useState} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';
import { color } from 'react-native-elements/dist/helpers';

const HeaderProfile = () => {

  const handleBackwards = () =>  navigation.navigate("HomeScreen")

  const auth = getAuth();
  const navigation= useNavigation();



  return (
      <View style={styles.container}> 
          <View style={styles.row}>

          <View style={{alignSelf:"flex-start"}}>

          <Button
          style={styles.backButton}
          onPress={handleBackwards}
          icon='keyboard-backspace'
          labelStyle={{fontSize: 30,
          color: colors.lightBlue}}>
            </Button>
          </View>

      <Text style={styles.header}> PROFILE</Text>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width:20,
    height: 25,
},

    container: {
        flex: 1,
        flexDirection: 'row',
      },

      row: {
        width: '100%',
        height: '80%',
        borderWidth: 1,
        borderBottomColor: colors.mediumBlue,
        borderBottomWidth: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: colors.deepBlue
      },

      header: {
        alignSelf: 'center', 
        color: colors.lightBlue,
        fontSize:16,
        fontWeight: 'bold',
        top: -22
      }

  
 })

export default HeaderProfile;