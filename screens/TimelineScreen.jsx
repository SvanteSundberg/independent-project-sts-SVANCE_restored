import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native";
import * as React from 'react';
import { Checkbox } from 'react-native-paper';
import { IconButton, Colors, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where} from "firebase/firestore";


 
const Timeline = () => {
  
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation= useNavigation(); 
   
    const [events, setevents] =React.useState([]);
    const [testEvents, settestevents] =React.useState([]);
    const [bigpost, setbigpost] =React.useState([]);
    const results = [];
    const [myEvents, setMyevents]= React.useState([]);
   
    const fetchEvents = async()=>{
      const response =firebase.firestore().collection('events');
      const data =await response.get();
      setevents([]);
      data.docs.forEach(item =>{
        setevents(events=>([...events, item.data()]));
        setbigpost(bigpost=>([...bigpost,false]));
      });
    };

    const fetchMyevents=async()=>{
      const db= firebase.firestore();
      const joinedEvents= query(collection(db,'user_event'), where('userID','==',user.uid));
      const myEventsnapshot= await getDocs(joinedEvents);
      setMyevents([]);
      myEventsnapshot.forEach((event)=> {
        setMyevents(events=>([...events,event.data().eventID]));
      })
    }


     React.useEffect(() => {
      fetchEvents();
      fetchMyevents()
     
    },[]);

    const joinEvent= async(element,index)=>{
      if(element.placesLeft>0){
      await firebase.firestore().collection('user_event').doc(user.uid+'_'+element.eventID).set({
        userID:user.uid,
        eventID:element.eventID,
      });
      let placesLeft = element.placesLeft-1;
      await firebase.firestore().collection('events').doc(element.eventID).update({placesLeft:placesLeft});
      let eventArray = [...events];
        eventArray[index].placesLeft= placesLeft;
        setevents(eventArray);
      fetchMyevents();
      console.log(myEvents);
    }
  }
  const unjoinEvent=async (element,index)=>{
    await firebase.firestore().collection('user_event').doc(user.uid+'_'+element.eventID).delete();
    let placesLeft = element.placesLeft+1;
    await firebase.firestore().collection('events').doc(element.eventID).update({placesLeft:placesLeft});
    let eventArray = [...events];
    eventArray[index].placesLeft= placesLeft;
    setevents(eventArray);
    fetchMyevents();
    console.log(myEvents.includes(element.eventID));
    }
    




let uniqueObjArray = [
  ...new Map(events.map((item) => [item["title"], item])).values(),
];
 
    return (<SafeAreaView style={styles.main}>
        <View style={{flexDirection:"row", justifyContent: "center", height:40}} >
        <IconButton
        style ={styles.profile}
        icon="account-circle"
        color={Colors.black}
        size={40}
        onPress={() => navigation.navigate("ProfileScreen")}
/>
          <Text style={styles.header}>Aktiviteter</Text></View>
        
        <ScrollView style={{alignSelf:'center'}} >
         {uniqueObjArray.map((element,index) =>{
           return(
             <View key = {element.title}>
            <TouchableOpacity  style = {styles.posts}>
              <Text style={{color:"#1b73b3"}}>{element.title} </Text>
              {!myEvents.includes(element.eventID)&&<Button onPress={()=>joinEvent(element, index)}> join event</Button>}
              {myEvents.includes(element.eventID)&&<Button onPress={()=>unjoinEvent(element, index)} color='red' > unjoin</Button>}<Text>{element.noPeople-element.placesLeft } / {element.noPeople}</Text>
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
  onPress={() => navigation.navigate("ProfileScreen", {
    userID: user.uid
  })}
/>
 
  </SafeAreaView>
    );
    }
 
 
 
 
 
const styles = StyleSheet.create({
  main:{
    flex:1,
    

  },
 
    header:{
      alignSelf: 'center',
      fontWeight: "bold",
      fontSize: 25,

      
     
    },
    
    
    profile:{
        alignSelf:'center',
        position: "absolute",
      left: 10,
        

    },

    createEvent:{
      bottom: 40, 
      right:-5, 
      position: 'absolute'


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
        backgroundColor:"#D6EAF8",
    }
});
 
export default Timeline;
 
 
 
 




