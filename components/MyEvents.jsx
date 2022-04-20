import React from 'react';
import {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs } from "firebase/firestore";
import BiggerEvent from './BiggerEvent';

function MyEvents({theUser}) {

   const [theEvents, setEvents] = useState([]);
   const auth = getAuth();
   const user = auth.currentUser;
   const [visable, setVisable] = useState(false);
   const [specificEvent, setEvent] = useState({});
   const [participants, setParticipants] = useState([]); 
   const [userID, setUserID] = useState([]);

    useEffect(() => {
        getMyEvents();
    }, []);

    const getMyEvents = async () => {
        console.log("Hämtar");
        if (!(theEvents.length>0)){

        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", theUser) );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                setEvents(events=>([...events,item.data()]));
            });
        }
    }

    const changeVisable = () => {
        setVisable(!visable);
      }

    /*const getID = async (eventID) => {
        const database = firebase.firestore();
        setParticipants([]);
        const ID = query(collection(database, "user_events"), where("eventID", "==", eventID) );
              const IDSnapshot = await getDocs(ID);
              console.log(IDSnapshot);
              IDSnapshot.forEach(async(item) => {
                console.log("HEJ");
                console.log(item.data().userID);
                const response = await database.collection('users').doc(item.data().userID).get();
                if (response.exists){
                    setParticipants(users=>([...users,response.get("name")]));
                }
              });
      }*/

      const getID=async(eventID)=>{
        const db= firebase.firestore();
        const response =db.collection('users');
        console.log(eventID);
        const participants= query(collection(db,'user_event'), where('eventID','==', eventID));
        const myParticipantsnapshot= await getDocs(participants);
        setUserID([]);
        setParticipants([]);
        myParticipantsnapshot.forEach(async (user)=> {
          const info =await response.doc(user.data().userID).get();
          console.log(info.get("name"));
          setParticipants(users => ([...users, {
              name: info.get("name"),
              userID: user.data().userID }]));
        });
      }


    return (
        <SafeAreaView>
            <Text style={styles.headline}> My recent events </Text>
        
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

            
        </View>
        
        <BiggerEvent visable={visable} changeVisable={changeVisable} event={specificEvent} participants={participants}
                    theUser={theUser}/>
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
    header: {
        paddingTop: 10,
        width:'100%',
    },
    headline:{
        fontSize: 15,
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