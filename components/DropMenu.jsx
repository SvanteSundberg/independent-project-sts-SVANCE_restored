import React from 'react';
import { View } from 'react-native';
import { Menu, Divider, Provider } from 'react-native-paper';
import { getAuth, signOut } from "firebase/auth";

function DropMenu({visable, closeMenu, goToEdit}) {

    console.log(visable);
    const auth = getAuth();

    const handleSignOut = async() => {
        signOut(auth).then(() => {
            navigation.navigate("StartScreen")

          }).catch((error) => {
            console.log("Sign-out not successful");
          });

     }

    return (
    <Provider>
        <View
            style={{
            paddingTop: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            }}>
            <Menu
            visible={visable}
            onDismiss={() => {
                closeMenu();
              }}
            >
            <Menu.Item onPress={() => {
                goToEdit();
              }} title="Edit profile" />
            <Menu.Item onPress={() => {console.log("Måste fixas :))")}} title="Settings" />
            <Divider />
            <Menu.Item onPress={handleSignOut} title="Sign out" />
            </Menu>
        </View>
    </Provider>
    );
}

export default DropMenu;