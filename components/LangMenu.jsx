import * as React from 'react';
import { View, TouchableOpacity, Image} from 'react-native';
import {  Button, Menu, Divider } from 'react-native-paper';
import { useTranslation } from "react-i18next";

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
            backgroundColor: 'lightblue',
            width:'130%'}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}> Switch Language
          </Button>}>
          <Menu.Item onPress={pickLangSw} title="Svenska" />
          <Divider />
          <Menu.Item onPress={pickLangEn} title="English" />
          
        </Menu>
      </View>
    
  );
};

export default LangMenu;