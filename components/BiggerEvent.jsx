import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getDocs, collection, query, where} from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';

function BiggerEvent({navigation, 
                    visable, 
                    changeVisable, 
                    event, 
                    participants, 
                    changeUser, 
                    ownUser, 
                    deleteEvent, 
                    setEvent, 
                    getID, 
                    setParticipants}) {
  
const auth = getAuth();
const user = auth.currentUser;  
const [joinedEvents, setJoinedEvents] = useState([]);
const isFocused = useIsFocused();

  useEffect(() => {
    fetchJoinedEvents();
  },[]);
  
  const fetchJoinedEvents=async()=>{
      setJoinedEvents([]);
      const db= firebase.firestore();
      const joinedEvents= query(collection(db,'user_event'), where('userID','==',user.uid));
      const myEventsnapshot= await getDocs(joinedEvents);
      myEventsnapshot.forEach((event)=> {
      setJoinedEvents(events=>([...events,event.data().eventID]));
      })
  }

  const joinEvent= async()=>{
    if(event.placesLeft>0){
        let placesLeft = event.placesLeft-1;
        let updateEvent = event;
        updateEvent.placesLeft= placesLeft;
        setEvent(updateEvent);

        let updateJoin = [...joinedEvents]
        updateJoin.push(event.eventID);
        setJoinedEvents(updateJoin);

        getID(event.eventID);

        await firebase.firestore().collection('user_event').doc(user.uid+'_'+event.eventID).set({
        userID:user.uid,
        eventID:event.eventID,
        });
        await firebase.firestore().collection('events').doc(event.eventID).update({placesLeft:placesLeft});
  }
}
const unjoinEvent=async ()=>{
    let placesLeft = event.placesLeft+1;
    let updateEvent = event;
    updateEvent.placesLeft= placesLeft;
    setEvent(updateEvent);

    let updateParticipants = [...participants];
    let index = updateParticipants.findIndex(x => x.userID === user.uid)
    updateParticipants.splice(index,1);
    setParticipants(updateParticipants);


    let updateJoin = [...joinedEvents]
    let i = updateJoin.indexOf(event.eventID, 0);
    updateJoin.splice(i,1);
    setJoinedEvents(updateJoin);

    await firebase.firestore().collection('user_event').doc(user.uid+'_'+event.eventID).delete();
    await firebase.firestore().collection('events').doc(event.eventID).update({placesLeft:placesLeft});
  }
  
  /*<Button
                  style={styles.button}
                  labelStyle={{fontSize: 12}}
                  onPress={() => {
                    changeVisable()
                    navigation.navigate("CreateEventScreen")}}>
                    Edit Event
                  </Button>*/
 
    return (
      <View style={styles.centeredView}>
      <Modal
        transparent={true}
        visible={visable}
        onRequestClose={() => {
          changeVisable();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
          <ScrollView 
            horizontal={false}
            style={styles.scrollView}>

          <View style={styles.background}>
            <Text style={styles.title}>
                {event.title}
            </Text>
          </View>

            <View style={styles.iconsContainer}>
            <Text
            style={[styles.iconsContainer, styles.description]}> {event.description} </Text>

            {visable && 
            <Button 
            style={styles.iconsContainer}
            icon='map-marker'
            labelStyle={{fontSize: 13,
                color:'black'}}> {event.region.place} </Button>}

            <Button 
                style={styles.iconsContainer}
                icon='calendar-today'
                labelStyle={{fontSize: 13,
                    color:'black'}}> {event.date} </Button>

            <Button 
                style={styles.iconsContainer}
                icon='clock-outline'
                labelStyle={{fontSize: 13,
                    color:'black'}}> {event.time} </Button>

            <Button 
                style={styles.iconsContainer}
                icon='human-handsdown'
                labelStyle={{fontSize: 13,
                    color:'black'}}> {event.noPeople} </Button>

            <View>
            <Text style={[styles.underTitle, styles.margins]}> MORE INFO</Text>
            <Text style={styles.margins}> There are {event.placesLeft} places left! </Text>
            <Text style={styles.margins}> {participants.length} people have joined: </Text>

            {participants.map((user, index) => (  
              <TouchableOpacity 
                  key={index}
                  onPress={() => {
                    changeVisable();
                    changeUser(user.userID);
                    navigation.navigate("ProfileScreen", {
                    userID: user.userID
                  })}}>
                  <Text> {user.name}</Text>
             </TouchableOpacity>  
           ))}
           </View>
            </View>
            </ScrollView>

              <View style={styles.myButtons}>
                <Button
                  labelStyle={{fontSize: 12}}
                  style={styles.button}
                  onPress={() => changeVisable()}>
                    Back
                  </Button>
              
              {ownUser && <View>
                <Button style={styles.button}
                  labelStyle={{fontSize: 12}}
                  color="red"
                  onPress={() => {
                    changeVisable()
                    deleteEvent(event.eventID)}}> Remove Event</Button>
                </View>}

              {!ownUser && <View> 
              {!(event.placesLeft===0) && <View> 
              {!joinedEvents.includes(event.eventID)&&<Button 
                                                        style={styles.button}
                                                        onPress={()=>{
                                                            joinEvent()}}> join event</Button>}
                </View>} 
               {joinedEvents.includes(event.eventID)&&<Button 
                                                          style={styles.button}
                                                          onPress={()=>unjoinEvent()} color='red' > unjoin</Button>}
               
                </View>}

              </View>
          </View>
        </View>
      </Modal>
    </View>
    );
}

const styles = StyleSheet.create({
  background: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%',
  }, 
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  description: {
    fontStyle: 'italic',
    margin: 10,
  },

  iconsContainer:{
    alignSelf: "flex-start",
  },

  margins: {
    marginBottom:5,
    marginTop: 5,
    flexWrap: 'wrap'
  },

  modalView: {
    padding:15,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    width: '90%',
    height: '60%',
    alignItems: 'center'
  },

  myButtons: {
    flexDirection:'row',
    flex: 1,
    position:"absolute",
    bottom:6,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center'
  },

  button: {
    borderRadius: 20,
    padding: 0,
    elevation: 2,
    margin:10,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  underTitle: {
    fontWeight: 'bold',
  },

  scrollView: {
    marginHorizontal: 0,
    backgroundColor: 'white',
  },
});

export default BiggerEvent;