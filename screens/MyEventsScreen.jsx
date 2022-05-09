import React from 'react';
import { StyleSheet, Text,RefreshControl, View, ScrollView} from 'react-native';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getDocs, collection, query, where} from "firebase/firestore";
import Events from '../components/Events';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../config/colors';


export default function MyEventsScreen() {
    const [eventsID, setEventsID] =React.useState([]);
    const [events, setEvents] =React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [owners, setOwners]= React.useState([]);
    const [myEvents, setMyEvents] = React.useState([]);
    const [name, setName] = React.useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const isFocused = useIsFocused();
    const [joinedEvents, setJoinedEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const onRefresh =()=>{ 
      setRefreshing(true);
      fetchComingEvents();
      //fetchJoinedEvents();
      setRefreshing(false);
    } 
    
    const {t,i18n}=useTranslation();

    const getName = async (myEvents) => {
      setName([]);
      const users =firebase.firestore().collection('users');
      const name=await users.doc(user.uid).get();
      myEvents.map(async (event) => {
        const obj={ownerid:event.owner, name:name.get('name')}
        setName(owners=>([...owners, obj]))
      });
    }

    const getMyEvents = async () => {
      let myEvents = [];
      setMyEvents([]);

      const database = firebase.firestore();
      const userEvents = query(collection(database, "events"), where("owner", "==", user.uid) );
          const eventSnapshot = await getDocs(userEvents);
          eventSnapshot.forEach((item) => {
              let data = item.data();
              if (typeof data !== 'undefined'){
                let id = {eventID: item.id}
                Object.assign(data, id);
                setMyEvents(events=>([...events,data]));
                myEvents.push(item.data());
              }
          });
      getName(myEvents);
  }

    const fetchOwners=async(myEvents)=> {
      setOwners([]);
      const users =firebase.firestore().collection('users');
      myEvents.map(async (event) => {
        const photo=await users.doc(event.owner).get();
        const obj={ownerid:event.owner, photo:photo.get('photo')}
        setOwners(owners=>([...owners, obj]))
      });
    }

    // getting the events id from the user_event collection
    const fetchComingEvents=async()=>{
      const idArray= [];
      const db= firebase.firestore();
      const joinedEvents= query(collection(db,'user_event'), where('userID','==',user.uid));
      const myEventsnapshot= await getDocs(joinedEvents);
      setEventsID([]);
      myEventsnapshot.forEach((event)=> {
        idArray.push(event.data().eventID);
        setEventsID(events=>([...events,event.data().eventID]));
      });
      fetchEventsfromID(idArray);
    }

    // using the event id to get the title for the events      
    const fetchEventsfromID= async(idArray)=>{
      let myEvents = [];
      setEvents([]);
      idArray.map(async(eventID)=> {
        const database = firebase.firestore();
        const info = await database.collection("events").doc(eventID).get();
        let data = info.data();
        if (typeof data !== 'undefined'){
          if((new Date(data.date)> new Date()) || (new Date(data.date).getUTCDate()== new Date().getUTCDate())){
            let id = {eventID: eventID}
            Object.assign(data, id);
            myEvents.push(data);
            myEvents.sort(function(a,b){
            return new Date(a.date) - new Date(b.date);
            });
            setEvents(myEvents);

          }
        }
        fetchOwners(myEvents);
       })
       setLoading(false);
       
  }

  const fetchJoinedEvents = async () => {
    setJoinedEvents([]);
    const db = firebase.firestore();
    const joinedEvents = query(
      collection(db, "user_event"),
      where("userID", "==", user.uid)
    );
    const myEventsnapshot = await getDocs(joinedEvents);
    myEventsnapshot.forEach((event) => {
      setJoinedEvents((events) => [...events, event.data().eventID]);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchComingEvents();
      //getMyEvents();
      //fetchJoinedEvents();
    }, [])
  );


  /*React.useEffect(() => {
    console.log("hej");
    fetchComingEvents();
    //getMyEvents();
    fetchJoinedEvents();
  },[]);*/

  /*            <Text style={styles.events}> MY OWN EVENTS</Text>
            <Events events={myEvents} setevents={setMyEvents} owners={name}/>*/

        
    return ( 
      
        <View style={styles.container}> 
        <View style={styles.header}>
             <Text style={styles.upcoming}> {t('upComEvents')} </Text>
             </View>
            <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>

            <Events events={events} setevents={setEvents} owners={owners} joinedEvents={eventsID} setJoinedEvents={setEventsID} onRefresh={onRefresh} loading={loading} refreshing={refreshing} myEvents={true}/>

            </ScrollView>
            
        </View>
        
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',   
    marginTop:30, 
  },
  events: {
    margin: 15,
    marginBottom: 0,
  },

header:{
  alignSelf: 'center',
  backgroundColor: colors.orange,
  height:'12%',
  width: '100%',
  paddingTop: 30,
  borderBottomWidth :0.5,
  borderBottomColor: 'lightgrey',
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.1,
  shadowRadius: 9,
  alignItems: 'center'
},
upcoming: {
  fontWeight: "bold",
  fontSize: 25,
  color:'white'

}
 

});
