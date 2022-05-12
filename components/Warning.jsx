import React, { useState } from 'react';
import { Button, Modal, Portal} from 'react-native-paper';
import { View, Text, StyleSheet} from "react-native";
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

function Warning({visable, changeVisable}) {
    const navigation= useNavigation(); 

    const hide = () => {
        changeVisable(false)
    }
    const show = () => {
        changeVisable(true);
    }

    return (
        <View style={{flex: 1}}> 
            <Portal>
                <Modal
                transparent={true}
                visible={visable}
                contentContainerStyle={styles.modalView}
                onDismiss={() => {
                  hide();
                }}> 
            <Text style={{fontWeight: "bold", margin:5, fontSize: 15}}> Welcome to the sporta community! </Text>
                <Text style={{margin:5, marginBottom: 10}}> Remember to be careful when meeting strangers and make sure to only attend events in public places.
                </Text>
                <Button 
                    style={{margin:5, backgroundColor: colors.orange,}}
                    onPress={() => {hide(); navigation.navigate("HomeScreen");}}
                    mode={'outlined'}
                    labelStyle={{ fontSize: 13, color: colors.lightBlue }}> Let's get started</Button>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
      padding: 15,
      backgroundColor: "white",
      borderRadius: 20,
      width: '85%',
      alignItems: 'center',
      alignSelf: 'center',

    },

  });

export default Warning;