import React from 'react';
import { StyleSheet, Text, Dimensions, RefreshControl, KeyboardAvoidingView, View, ScrollView} from 'react-native';
import { Button,  TextInput, HelperText } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getDocs, collection, query, where} from "firebase/firestore";


export default function MyEventsScreen() {
    const [eventsID, setEventsID] =React.useState([]);
    const [events, setEvents] =React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

    const onRefresh =()=>{ 
      setRefreshing(true);
      fetchComingEvents();
      setRefreshing(false);
    } 

    // getting the events id from the user_event collection
    const fetchComingEvents=async()=>{
      const db= firebase.firestore();
      const joinedEvents= query(collection(db,'user_event'), where('userID','==',user.uid));
      const myEventsnapshot= await getDocs(joinedEvents);
      setEventsID([]);
      myEventsnapshot.forEach((event)=> {
        setEventsID(events=>([...events,event.data().eventID]));
      });
      fetchEventsfromID();
    }

    // using the event id to get the title for the events      
    const fetchEventsfromID= async()=>{
      setEvents([]);
      eventsID.map(async(eventID)=> {
        const database = firebase.firestore();
        const upcoming = query(collection(database, "events"), where(("eventID"), "==", eventID));
        const eventSnapshot = await getDocs(upcoming);
        eventSnapshot.forEach((item)=> {
          setEvents(events => ([...events, item.data()]));
        });
       })
  }


  React.useEffect(() => {
      fetchComingEvents();
    },[]);

    const list = () => {
      return events.map((element,index) => {
        return (
          
          <View key={index} style={styles.box}>
            <Text>{element.title}</Text>
            <Text>{element.description}</Text>
          </View>
          
        );
      });
    };

        
    return ( 
        <View style={styles.container}> 
            <Text>My upcoming events</Text>
            <Button onPress={fetchComingEvents} mode='outlined'> Get events</Button>
            <ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }>

            <View>{list()}</View>

            </ScrollView>
            
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',    
  },
  box: {
    width: Dimensions.get('window').width -100,
    height:200,
    marginTop:5,
    padding:5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor:"black",
},
 

});
