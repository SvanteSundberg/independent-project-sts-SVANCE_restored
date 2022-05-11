import React from 'react';
import {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import BiggerEvent from './BiggerEvent';
import colors from '../config/colors';

function MyEvents({navigation, theUser, changeUser, name, ownUser, photo}) {

   const [theEvents, setEvents] = useState([]);
   const [visable, setVisable] = useState(false);
   const [specificEvent, setEvent] = useState({});
   const [participants, setParticipants] = useState([]); 
   const [joinedEvents, setJoinedEvents] = useState([]);
   const auth = getAuth();
   const user = auth.currentUser;
   const [oldEvents, setOldEvents] = useState([]);
   const [oldEventsInfo, setOldEventsInfo] = useState([]);

    useEffect(() => {
        getMyEvents();
        fetchJoinedEvents();
    }, [theUser]);

    const setUser = (userID) => {
        changeUser(userID);
    };

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

    const deleteEvent = async (eventID) => {
        let eventArray = [...theEvents];
        index = eventArray.findIndex(x => x.eventID ===eventID);
        eventArray.splice(index,1);
        setEvents(eventArray);
    
    
        const db = firebase.firestore();
        await db.collection('events').doc(eventID).delete();
        const joinedEvent_query = db.collection('user_event').where("eventID", '==', eventID);
        joinedEvent_query.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
        });
    
        })
    }

    const getMyEvents = async () => {
        setEvents([]);
        setOldEvents([]);
        setOldEventsInfo([]);

        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", theUser), orderBy("date") );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                if (!(new Date(item.data().date)> new Date())){
                    console.log(item.data(), 'data');
                    let id = item.id;
                    setOldEvents(events => ([...events, id]))
                }
                else{
                    let data = item.data();
                    let id = {eventID: item.id}
                    Object.assign(data, id);
                    setEvents(events=>([...events, data]));
                }
            });
        const pastEvents = query(collection(database, "events"), where("owner", "==", theUser), orderBy("date","desc") );
        const snapshot = await getDocs(pastEvents);
            snapshot.forEach((item) => {
                if (!(new Date(item.data().date)> new Date())){
                    let data = item.data();
                    let id = {eventID: item.id}
                    Object.assign(data, id);
                    setOldEventsInfo(events=>([...events, data]));
                }
            });
    }

    const changeVisable = () => {
        setVisable(!visable);
      }

      const getID=async(eventID)=>{
        const db= firebase.firestore();
        const response =db.collection('users');
        const participants= query(collection(db,'user_event'), where('eventID','==', eventID));
        const myParticipantsnapshot= await getDocs(participants);
        setParticipants([]);
        myParticipantsnapshot.forEach(async (User)=> {
          const info =await response.doc(User.data().userID).get();
          setParticipants(users => ([...users, {
              photo: info.get('photo'),
              name: info.get("name"),
              userID: User.data().userID }]));
        });
      }


    return (
        <SafeAreaView>
            <Text style={styles.headline}>  </Text>
        
        {theEvents.length>0 &&
        <View style={styles.container}>
            {theEvents.map((event, index) => ( 
                <TouchableOpacity 
                    style={[styles.event, styles.shadow]}
                    key={index}
                    onPress={() => {
                        setEvent(event);
                        setVisable(true);
                        getID(event.eventID);
                    }}>
                    <View style={styles.row}> 
                <Text
                style={styles.date}> {event.date} </Text>
                    </View>
                <View style={styles.header}>
                <Text style={styles.text}> {event.title}</Text>
                </View>
                <View style={styles.description}>
                <Text style={styles.smallText}
                numberOfLines={3}> {event.description} </Text>
                </View>
                <Text style={[styles.peopleText, styles.people]}> {event.noPeople} </Text>
                <Image
                source={require("../assets/people.png")}
                style={[styles.peopleLogga, styles.people]}/>
            </TouchableOpacity>
            ))}  
            </View>}
            
            {oldEvents.length>0 && <View style={{flexDirection: 'row', marginBottom: 15}}>
            <View style={{backgroundColor: colors.deepBlue, height: 2, flex: 1, alignSelf: 'center'}} />
            <Text style={styles.expired}> Expired events</Text>
            <View style={{backgroundColor: colors.deepBlue, height: 2, flex: 1, alignSelf: 'center'}} />
            </View>}
            <View style={[styles.container]}> 
                {oldEventsInfo.map((event, index) => ( 
                                <TouchableOpacity 
                                    style={[styles.event, styles.shadow]}
                                    key={index}
                                    onPress={() => {
                                        setEvent(event);
                                        setVisable(true);
                                        getID(event.eventID);
                                    }}>
                                    <View style={styles.row}> 
                                <Text
                                style={styles.date}> {event.date} </Text>
                                    </View>
                                <View style={styles.header}>
                                <Text style={styles.text}> {event.title}</Text>
                                </View>
                                <View style={styles.description}>
                                <Text style={styles.smallText}
                                numberOfLines={3}> {event.description} </Text>
                                </View>
                                <Text style={[styles.peopleText, styles.people]}> {event.noPeople} </Text>
                                <Image
                                source={require("../assets/people.png")}
                                style={[styles.peopleLogga, styles.people]}/>
                            </TouchableOpacity>
                            ))}
            </View>

        {!theEvents.length>0 && !oldEvents.length>0 &&
        <Text style={styles.eventsText}> {name} has not created any events yet! </Text>
        }
        
        <BiggerEvent navigation={navigation} 
                    visable={visable} 
                    changeVisable={changeVisable} 
                    event={specificEvent} 
                    participants={participants}
                    theUser={theUser} 
                    changeUser={setUser} 
                    ownUser={ownUser} 
                    deleteEvent={deleteEvent} 
                    setEvent={setEvent} 
                    getID={getID} 
                    setParticipants={setParticipants} 
                    photo={photo} 
                    myEvents={false}
                    joinedEvents={joinedEvents} 
                    setJoinedEvents={setJoinedEvents} 
                    oldEvents={oldEvents}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap'
    },
    description:{
        padding:10,
        paddingTop:3,
    },
    expired: {
        fontWeight: "bold",
        color: colors.deepBlue,
        fontSize: 16,
        alignSelf: "center",
        paddingHorizontal:5,

    },
    event: {
        width:160,
        height:140,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.deepBlue,
        marginLeft: 20,
        marginBottom:20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.6,
        shadowRadius: 4,

    },
    eventsText: {
        fontStyle: 'italic',
        margin: 10,
        alignSelf:'center',
    },
    header: {
        paddingTop: 10,
        width:'100%',
    },
    headline:{
        fontSize:16,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.deepBlue
    },
    row: {
        alignItems: "center",
        backgroundColor: colors.orange,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderWidth: 0,
        borderColor: colors.deepBlue,
        height: '18%',
        justifyContent: "center",
    }, 
    text: {
        alignSelf:'center',
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.deepBlue
    },
    smallText:{
        marginBottom:5,
        alignSelf:'flex-start',
    },
    people: {
        position: "absolute", 
    },
    peopleLogga:{
        bottom: 0, 
        right: 15,
        width: 15,
        height:15,
        margin:5,
    },
    peopleText: {
        fontSize:11,
        bottom: 0, 
        right: 0,
        margin:5,
        
    },
    date: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.lightBlue
    },
    shadow:{   
        backgroundColor: 'white',  
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.6,
        shadowRadius: 4,
            }, 
 
})

export default MyEvents;