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
    const [owners, setOwners]= React.useState([]);
   
    const fetchEvents = async()=>{
      const response =firebase.firestore().collection('events');
      const data =await response.get();
      setevents([]);
      data.docs.forEach(item =>{
        setevents(events=>([...events, item.data()]));
        setbigpost(bigpost=>([...bigpost,false]));
      });
      fetchOwners();
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

    const fetchOwners=async()=> {
      setOwners([]);
      const users =firebase.firestore().collection('users');
      events.forEach(async(event)=> {
      const name=await users.doc(event.owner).get();
      const obj={ownerid:event.owner, name:name.get('name')}
      setOwners(owners=>([...owners,obj]))
      }) 
    }


     React.useEffect(() => {
      fetchEvents();
      fetchMyevents();
     
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
//uses the the owner prop from events to get the owners name
    const checkOwner=(id)=>{
      for (let obj of owners) {
        if (obj.ownerid === id)
        return  <Text>{obj.name}</Text>
      }
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
        onPress={() => navigation.navigate("ProfileScreen", {userID: user.uid}
        )}
/>
          <Text style={styles.header}>Aktiviteter</Text></View>
        
        <ScrollView style={styles.scroller} >
         {uniqueObjArray.map((element,index) =>{
           return(
             
             <View key = {element.title} style={styles.postContainer}>
               
            <TouchableOpacity  style = {styles.posts}>

            <View style={styles.postHeader }>
              <View style={{flexDirection:'row'}}>
               <Button icon='calendar-today' labelStyle={{color:'#CCDBDC'}}/>
              <Text style={styles.dateText}>
                 {element.date} {element.time}</Text></View>
                 
                 <Text style={styles.noPeopleText}> Participants: {element.noPeople-element.placesLeft } / {element.noPeople}</Text>
              </View>
            
            <View style={{justifyContent:'center', alignItems:'center'}}>
              <Text style={{color:"#1b73b3"}}>{element.title} </Text>
              
              {checkOwner(element.owner)}
              <View>
              {!myEvents.includes(element.eventID)&&<Button onPress={()=>joinEvent(element, index)}> join event</Button>}
              {myEvents.includes(element.eventID)&&<Button onPress={()=>unjoinEvent(element, index)} color='red' > unjoin</Button>}
              </View>

              </View>
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
  </SafeAreaView>


    );
  }
 
 
 
 
 
const styles = StyleSheet.create({
  main:{
    flex:1,
  },

  postContainer:{
      marginTop:10,
  },
 
    header:{
      alignSelf: 'center',
      fontWeight: "bold",
      fontSize: 25,
    },
    
    scroller:{
      alignSelf:'center',
      flex:1,
    },

    postHeader:{
      backgroundColor:'#007EA7',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth:1,
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
      
    },

    dateText:{
      color:'#CCDBDC',
      alignSelf:'center'
    },

    noPeopleText:{
      marginRight:10,
      color:'#CCDBDC',
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
      flex:1,
      width: Dimensions.get('window').width -10,
      height:200,
      borderWidth: 0.5,
      borderRadius: 10,
        //borderColor:"black",
        //backgroundColor:"#D6EAF8",
    }
});
 
export default Timeline;
 
 
 
 




