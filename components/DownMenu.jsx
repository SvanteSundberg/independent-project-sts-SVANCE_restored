import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Divider, IconButton, Button } from 'react-native-paper';
import {useState} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';
import { color } from 'react-native-elements/dist/helpers';

const TestMenu = ({goToEdit}) => {
  const [visible, setVisible] = useState(false);

  const handleBackwards = () =>  navigation.navigate("HomeScreen")

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const auth = getAuth();
  const navigation= useNavigation();

    const handleSignOut = async() => {
        signOut(auth).then(() => {
            navigation.navigate("StartScreen")

          }).catch((error) => {
            console.log("Sign-out not successful");
          });

     }

     /* <Menu.Item  titleStyle={{color: colors.lightBlue}}
            icon='account-settings' onPress={() => {console.log("Måste fixas :))")}} title="Settings" />*/

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

          
          <View style={styles.menuWrapper}>

          
        <Menu

          contentStyle={{opacity: 0.9,
                          backgroundColor: colors.deepBlue,
                          width:'105%',
                          borderRadius: 20,
                          }}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton color={colors.lightBlue}
            labelStyle={{fontSize: 30}}
            icon='menu'
            onPress={openMenu}/>}>
        <View style={styles.positioning}> 
        <Menu.Item
        style={{ marginLeft: 30}} 
        titleStyle={{alignSelf:'center', fontWeight:'bold', color: colors.lightBlue}}
        title="Menu"> </Menu.Item>
          <Menu.Item titleStyle={{color: colors.lightBlue}}
          icon='account-edit'
            onPress={() => {
                goToEdit();
                closeMenu();
              }} title="Edit profile" />
              <Divider />
            <Menu.Item titleStyle={{color: colors.lightBlue}} icon='logout' onPress={handleSignOut} title="Sign out" />
            </View>
        </Menu>
        
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
    top:35,
},

    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
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
      menuWrapper: {
        alignSelf: 'flex-end',
      },
      header: {
        alignSelf: 'center', 
        top: -30,
        color: colors.lightBlue,
        fontSize:16,
        fontWeight: 'bold',

      }

  
 })

export default TestMenu;