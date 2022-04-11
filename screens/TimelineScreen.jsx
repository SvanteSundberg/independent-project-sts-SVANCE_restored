import { StyleSheet,View, Text, TextInput, SafeAreaView, Button, TouchableOpacity, ScrollView } from "react-native";
import * as React from 'react';
import { Checkbox } from 'react-native-paper';
import { IconButton, Colors } from 'react-native-paper';
 
 
 
const Timeline = () => {
    const array1 = {Nils:"jag vill spela fotboll",
                    Svante: "jag vill spela volyboll",
                    Carro: "jag vill springa",
                    Vilma:"jag vill spela fotboll",
                    Alice: "jag vill spela volyboll",
                    Emelie: "jag vill springa"};
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
               <View style = {styles.joinbutton}><Checkbox
      status={checked ? 'checked' : 'unchecked'}
      color="black"
      uncheckedColor="black"
      onPress={() => {
        setChecked(!checked);
      }}
               
    /></View>
            </TouchableOpacity>):null}
           
           
            {!bigpost?(<TouchableOpacity style = {styles.smallposts} onPress={() => {
        setbigpost(!bigpost);
      }}>
          <Text>{element[0]}</Text>
            </TouchableOpacity>):null}
 
        </SafeAreaView>
    </View>
  );
}
 
/*results.push(
    <SafeAreaView style ={styles.createEvent}>
     
      <IconButton
    icon="pencil-circle-outline"
    color={Colors.black}
    size={40}
    onPress={() => console.log('Pressed')}
  />
   
    </SafeAreaView>
   
); */
 
    return (<View>
        <SafeAreaView><Text style={styles.header}>Aktiviteter</Text></SafeAreaView>
        <ScrollView>{results}</ScrollView>
    <SafeAreaView style ={styles.createEvent}>
     
    <IconButton
  icon="pencil-circle"
  color={Colors.black}
  size={40}
  onPress={() => console.log('Pressed')}
/>
 
  </SafeAreaView>
  <SafeAreaView style ={styles.profile}>
     
    <IconButton
  icon="account-circle"
  color={Colors.black}
  size={40}
  onPress={() => console.log('Pressed')}
/>
 
  </SafeAreaView>
  </View>);
    }
 
 
 
 
 
const styles = StyleSheet.create({
    header:{
        fontSize:30,
        maxHeight:50,
        marginTop:15,
        marginLeft:130,
        alignItems: 'center',
       
    },
    joinbutton:{
        borderWidth: 2,
            borderRadius: 10,
            borderColor:"black",
    },
    createEvent:{
        marginLeft:320,
        marginTop:700,
        position: 'absolute',
    },
    profile:{
        marginLeft:5,
        marginTop:0,
        position: 'absolute',
    },
   
    allposts:{
        alignItems: 'center',
    justifyContent: 'center',
    },
    smallposts:{
        alignItems: 'center',
        justifyContent: 'center',
            width:250,
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
        width:250,
        height:200,
        marginTop:5,
        padding:5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor:"black",
    }
});
 
export default Timeline;
 


