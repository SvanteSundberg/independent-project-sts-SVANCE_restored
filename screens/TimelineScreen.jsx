import { StyleSheet,View, Text, TextInput, SafeAreaView, Button, TouchableOpacity } from "react-native";
import * as React from 'react';
import { Checkbox } from 'react-native-paper';
 
 
 
const Timeline = () => {
    const array1 = {Nils:"jag vill spela fotboll",
                    Svante: "jag vill spela volyboll",
                    Carro: "jag vill springa"};
    const results = [];
       
   
for (let element of Object.entries(array1)) {
    const [bigpost, setbigpost] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    results.push(
    <View style ={styles.allposts}>
      <SafeAreaView>
            {bigpost?(
            <TouchableOpacity style = {styles.posts} onPress={() => {
                setbigpost(!bigpost);
              }}>
                <Text>{element[0]}</Text>
                <Text>{element[1]}</Text>
                <Checkbox
      status={checked ? 'checked' : 'unchecked'}
      onPress={() => {
        setChecked(!checked);
      }}
    />
            </TouchableOpacity>):null}
           
           
            {!bigpost?(<TouchableOpacity style = {styles.smallposts} onPress={() => {
        setbigpost(!bigpost);
      }}>
            </TouchableOpacity>):null}
 
        </SafeAreaView>
    </View>
  );
}
    return ( results );
    }
 
 
 
 
 
const styles = StyleSheet.create({
    header:{
        fontSize:30,
        flex: 1,
        maxHeight:50,    
    },
    joinbutton:{
       
    },
    allposts:{
        alignItems: 'center',
    justifyContent: 'center',
    },
    smallposts:{
        alignItems: 'center',
        justifyContent: 'center',
            width:300,
            height:100,
            marginTop:5,
            padding:5,
            borderWidth: 2,
            borderRadius: 10,
            borderColor:"black",
    },
    posts:{
        alignItems: 'center',
    justifyContent: 'center',
        width:300,
        height:200,
        marginTop:5,
        padding:5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor:"black",
    }
});
 
export default Timeline;
