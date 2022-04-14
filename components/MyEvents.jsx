import React from 'react';
import {useState, useEffect} from 'react';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { Button } from 'react-native-paper';
import { collection, query, where, getDocs } from "firebase/firestore";
import style from 'react-native-common-date-picker/src/datePicker/style';

function MyEvents(props) {

   const [theEvents, setEvents] = useState([]);
   const auth = getAuth();
   const user = auth.currentUser;

    useEffect(() => {
        getMyEvents();
    }, []);

    const getMyEvents = async () => {
        console.log("Hämtar");
        if (!(theEvents.length>0)){

        const database = firebase.firestore();
        const userEvents = query(collection(database, "events"), where("owner", "==", user.uid) );
            const eventSnapshot = await getDocs(userEvents);
            eventSnapshot.forEach((item) => {
                setEvents(events=>([...events,item.data()]));
            });
        }
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
        
           /* {theEvents.map((event, index) => ( 
            <Text key={index}> {event.title} {event.description} {event.noPeople}</Text>
        ))}*/


    return (
        <SafeAreaView>
            <Text style={styles.headline}> My recent events </Text>
        
        <View style={styles.container}>
            {theEvents.map((event, index) => ( 
                <View style={styles.event}
                key={index}>
                    <View style={styles.row}> 
                <Button 
                icon='calendar-today'
                labelStyle={{fontSize: 12,
                    color:'black',}}> {event.date} </Button>
                    </View>
                <View style={styles.header}>
                <Text style={styles.text}> {event.title}</Text>
                </View>
                <View style={styles.description}>
                <Text style={styles.smallText}> {event.description}</Text>
                </View>
            </View>
            ))}

            
        </View>
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
    }
 
})

export default MyEvents;