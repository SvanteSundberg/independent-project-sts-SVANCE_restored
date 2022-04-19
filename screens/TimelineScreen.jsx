import { StyleSheet,View, Text, TextInput, SafeAreaView, Button, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import * as React from 'react';
import { Checkbox } from 'react-native-paper';
import { IconButton, Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/firebase';
 
const Timeline = () => {
    const navigation= useNavigation();
   
    const [events, setevents] =React.useState([]);
    const [bigpost, setbigpost] =React.useState([]);
    const results = [];
   
    const fetchEvents = async()=>{
     
      const response =firebase.firestore().collection('events');
      const data =await response.get();
     
      data.docs.forEach(item =>{
       
        
        setevents(events=>([...events,item.data()]));
        setbigpost(bigpost=>([...bigpost,false]));
       
 
       
        
      });
     
     
   
    };
     React.useEffect(() => {
      fetchEvents();
     
    },[]);
 
   
   
   
/*const test=[1,2,3];
events.forEach(element =>{
  console.log('for loop fungerar')
    const [bigpost, setbigpost] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    results.push(
    <View style ={styles.allposts}>
      <SafeAreaView>
         
            {bigpost?(
            <TouchableOpacity style = {styles.posts} onPress={() => {
                setbigpost(!bigpost);
              }}>
                <Text>{element}</Text>
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
         
            </TouchableOpacity>):null}
 
        </SafeAreaView>
    </View>
  );
})
*/
let uniqueObjArray = [
  ...new Map(events.map((item) => [item["title"], item])).values(),
];
 
    return (<View style={styles.main}>
        <SafeAreaView><Text style={styles.header}>Aktiviteter</Text></SafeAreaView>
        <ScrollView>
         {uniqueObjArray.map(element =>{
           return(
             <View key = {element.title}>
            <TouchableOpacity  style = {styles.posts}>
              <Text>{element.title}</Text>
          </TouchableOpacity>
          </View>
           
           
         )})}
       
    </ScrollView>
    <SafeAreaView style ={styles.createEvent}>
     
    <IconButton
  icon="pencil-circle"
  color={Colors.black}
  size={80}
  onPress={() => navigation.navigate("CreateEventScreen")}
/>
 
  </SafeAreaView>
  <SafeAreaView style ={styles.profile}>
     
    <IconButton
  icon="account-circle"
  color={Colors.black}
  size={40}
  onPress={() => navigation.navigate("ProfileScreen")}
/>
 
  </SafeAreaView>
  </View>
    );
    }
 
 
 
 
 
const styles = StyleSheet.create({
  main:{
    flex:1,
  },
 
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
        // marginLeft:'10%',
        // marginTop:'10%',
        bottom:40,
        right:-5,
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
        width: Dimensions.get('window').width -10,
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
    width: Dimensions.get('window').width -10,
        height:200,
        marginTop:5,
        padding:5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor:"black",
    }
});
 
export default Timeline;
 
 
 
 




