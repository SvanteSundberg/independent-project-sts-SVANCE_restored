import React from 'react';
import {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import BiggerEvent from './BiggerEvent';
import colors from '../config/colors';

function MyEvents({navigation, theUser, changeUser, name, ownUser}) {

   const [theEvents, setEvents] = useState([]);
   const [visable, setVisable] = useState(false);
   const [specificEvent, setEvent] = useState({});
   const [participants, setParticipants] = useState([]); 

    useEffect(() => {
        getMyEvents();
    }, [theUser]);

    const setUser = (userID) => {
        changeUser(userID);
    };

    const deleteEvent = async (eventID) => {
        let eventArray = [...theEvents];
        index = eventArray.findIndex(x => x.eventID ===eventID);
        eventArray.splice(index,1);
        setEvents(eventArray);
    
    
        /*const db = firebase.firestore();
        await db.collection('events').doc(eventID).delete();
        const joinedEvent_query = db.collection('user_event').where("eventID", '==', eventID);
        joinedEvent_query.get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
        });
    
        })*/
    }

    const getMyEvents = async () => {
        console.log("Hämtar");
        setEvents([]);

        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", theUser), orderBy("date") );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                let data = item.data();
                let id = {eventID: item.id}
                Object.assign(data, id);
                setEvents(events=>([...events, data]));
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
        myParticipantsnapshot.forEach(async (user)=> {
          const info =await response.doc(user.data().userID).get();
          setParticipants(users => ([...users, {
              name: info.get("name"),
              userID: user.data().userID }]));
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

        {!theEvents.length>0 &&
        <Text style={styles.eventsText}> {name} has not created any events yet! </Text>
        }
        
        <BiggerEvent navigation={navigation} visable={visable} changeVisable={changeVisable} event={specificEvent} participants={participants}
                    theUser={theUser} changeUser={setUser} ownUser={ownUser} deleteEvent={deleteEvent} setEvent={setEvent} getID={getID} setParticipants={setParticipants}/>
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
        color: colors.deepBlue
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