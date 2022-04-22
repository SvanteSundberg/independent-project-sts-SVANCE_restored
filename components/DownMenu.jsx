import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Divider, IconButton } from 'react-native-paper';
import {useState} from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const TestMenu = ({goToEdit}) => {
  const [visible, setVisible] = useState(false);

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

  return (
      <View style={styles.container}>
          <View style={styles.row}>
          <View style={styles.menuWrapper}>
            
        <Menu

          contentStyle={{opacity: 0.8,
                          backgroundColor: 'lightblue',
                          width:'300%'}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton
            labelStyle={{fontSize: 30,
            color:'black'}}
            icon='menu'
            onPress={openMenu}/>}>
        <View style={styles.positioning}> 
        <Menu.Item
        style={{ marginLeft: 30}} 
        titleStyle={{alignSelf:'center', fontWeight:'bold'}}
        title="Menu"> </Menu.Item>
          <Menu.Item
          icon='account-edit'
            onPress={() => {
                goToEdit();
                closeMenu();
              }} title="Edit profile" />
              <Divider />
            <Menu.Item 
            icon='account-settings' onPress={() => {console.log("Måste fixas :))")}} title="Settings" />
            <Divider />
            <Menu.Item icon='logout' onPress={handleSignOut} title="Sign out" />
            </View>
        </Menu>
      </View>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      row: {
        width: '100%',
        backgroundColor: 'lightblue',
      },
      menuWrapper: {
        alignSelf: 'flex-end',
      },
      positioning: {
        marginBottom: 10,
      }

  
 })

export default TestMenu;