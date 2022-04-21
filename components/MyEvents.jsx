import React from 'react';
import {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs } from "firebase/firestore";
import BiggerEvent from './BiggerEvent';

function MyEvents({navigation, theUser, changeUser, name}) {

   const [theEvents, setEvents] = useState([]);
   const auth = getAuth();
   const user = auth.currentUser;
   const [visable, setVisable] = useState(false);
   const [specificEvent, setEvent] = useState({});
   const [participants, setParticipants] = useState([]); 

    /*useEffect(() => {
        getMyEvents();
    }, [theUser]);*/

    const setUser = (userID) => {
        changeUser(userID);
    };

    const getMyEvents = async () => {
        console.log("Hämtar");
        setEvents([]);

        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", theUser) );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                setEvents(events=>([...events,item.data()]));
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
            <Text style={styles.headline}> Created Events </Text>
        
        {theEvents.length>0 &&
        <View style={styles.container}>
            {theEvents.map((event, index) => ( 
                <TouchableOpacity 
                    style={styles.event}
                    key={index}
                    onPress={() => {
                        setEvent(theEvents[index]);
                        setVisable(true);
                        getID(theEvents[index].eventID);
                    }}>
                    <View style={styles.row}> 
                <Button 
                icon='calendar-today'
                labelStyle={{fontSize: 12,
                    color:'black'}}> {event.date} </Button>
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
                    theUser={theUser} changeUser={setUser}/>
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
        width:150,
        height:130,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "black",
        marginLeft: 20,
        marginBottom:20,
        marginTop:20,
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
        marginTop:10,
    },
    row: {
        flexDirection:'row',
        backgroundColor: 'lightblue',
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
 
})

export default MyEvents;