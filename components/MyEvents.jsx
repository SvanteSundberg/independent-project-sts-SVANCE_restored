import React from 'react';
import {useState, useEffect} from 'react';
import { View } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button, Text } from 'react-native-paper';
import { collection, query, where, getDocs } from "firebase/firestore";

function MyEvents(props) {

   const [theEvents, setEvents] = useState([]);
   const auth = getAuth();
   const user = auth.currentUser;

    useEffect(() => {
        getMyEvents();
    }, []);

    const getMyEvents = async () => {
        console.log("Hämtar");
        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", user.uid) );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                setEvents(events=>([...events,item.data()]));
            });
    }

    /* {theEvents.map((event, index) => { 
                console.log(event.title);
                <View key={index}>
                    <Text> {event.title} </Text>
                    <Text> {event.description} </Text>
                    <Text> {event.noPeople} </Text>
                    <Text> Created by {props.name} </Text>
                    </View>
            })}*/


    return (
        <View >
        {theEvents.map((event, index) => ( 
            <Text key={index}> {event.title} {event.description} {event.noPeople}</Text>
        ))}
        </View>
    );
}

export default MyEvents;