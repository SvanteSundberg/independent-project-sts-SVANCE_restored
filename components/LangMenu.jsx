import * as React from 'react';
import { View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {  Button, Menu, Divider } from 'react-native-paper';
import { useTranslation } from "react-i18next";
import colors from '../config/colors';

const LangMenu = () => {

  const {t,i18n}=useTranslation();

  const pickLangEn=() =>{
    i18n.changeLanguage("en")
    //18n.language för att få nuvarande 
   } 

const pickLangSw=() =>{
    i18n.changeLanguage("sw")
}

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
      <View
        style={{
          paddingTop:5,
          flexDirection: 'row',
          alignSelf: 'flex-end',
          
        }}>
        <Menu
         contentStyle={{opacity: 0.8,
            backgroundColor: colors.mediumBlue,
            width:'130%'}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<TouchableOpacity onPress={openMenu}><Image source={require('../assets/language.png')} style={styles.langImg}/></TouchableOpacity>}> 
          <Menu.Item onPress={pickLangSw} title="Svenska" />
          <Divider />
          <Menu.Item onPress={pickLangEn} title="English" />
          
        </Menu>
      </View>
    
  );
};

const styles = StyleSheet.create({
  langImg:{
    margin:5,
    height:30,
    width:30,
  }
});

export default LangMenu;