import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Button, Modal, Portal, ActivityIndicator, Colors} from 'react-native-paper';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getDocs, collection, query, where, doc, runTransaction } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import { getFixedT } from "i18next";
import { useTranslation } from "react-i18next";
import { Icon } from "react-native-elements";
import colors from "../config/colors";


function BiggerEvent({ navigation,
  visable,
  changeVisable,
  event,
  participants,
  changeUser,
  ownUser,
  deleteEvent,
  setEvent,
  getID,
  owners,
  setParticipants,
  photo,
  myEvents,
  onRefresh,
  joinedEvents,
  setJoinedEvents,
  oldEvents
}) {

  const auth = getAuth();
  const { t, i18n } = useTranslation();
  const user = auth.currentUser;
  //const [joinedEvents, setJoinedEvents] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const unJoinAlert = () => {
    Alert.alert(
      "Unjoin",
      "Do you really want to unjoin the event "+`${event.title}`+"? ",
      [{text: "No",},
      {text: "Yes",
      onPress: () => unjoinEvent()},
      ]
    );
  }

  const checkOldEvents = (eventID) => {
    if (typeof oldEvents !== "undefined"){
      if (oldEvents.includes(event.eventID)){
        return true
      }
    }
    return false
  }

  console.log(oldEvents);
 

  useEffect(() => {
    setLoading(false);
  }, []);

  /*const fetchJoinedEvents = async () => {
    setJoinedEvents([]);
    const db = firebase.firestore();
    const joinedEvents = query(collection(db, 'user_event'), where('userID', '==', user.uid));
    const myEventsnapshot = await getDocs(joinedEvents);
    myEventsnapshot.forEach((event) => {
      setJoinedEvents(events => ([...events, event.data().eventID]));
    })
  }*/

  const joinEvent = async () => {
    if (event.placesLeft > 0 && !joinedEvents.includes(event.eventID)) {
      setLoading(true);
      let placesLeft = event.placesLeft - 1;
      const db= firebase.firestore();
      const sfDocRef = doc(db, "events", event.eventID);
      const sfPartRef = doc(db, "user_event", user.uid + '_' + event.eventID)
      let update = false;

      try {
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(sfDocRef);
          const left = sfDoc.data().placesLeft;
          console.log(left);
          if (left>0){
            transaction.update(sfDocRef, { placesLeft: placesLeft });
            transaction.set(sfPartRef, {userID: user.uid, eventID: event.eventID,})
            update = true;
              }
            else{
              update = false;

            }
            console.log("Transaction successfully committed!");
        });
          
      } catch (e) {
        update= false;
        console.log("Transaction failed: ", e);
      }
      if (update){
        let updateEvent = event;
            updateEvent.placesLeft = placesLeft;
            setEvent(updateEvent);

            let updateJoin = [...joinedEvents]
            updateJoin.push(event.eventID);
            setJoinedEvents(updateJoin);
            
            //Not update locally instead??
            getID(event.eventID);
            /*await firebase.firestore().collection('user_event').doc(user.uid + '_' + event.eventID).set({
              userID: user.uid,
              eventID: event.eventID,
            });*/
            setLoading(false);
            showJoinAlert();
      }
      else {
        setLoading(false);
        showUnjoinAlert();
        let updateEvent = event;
        updateEvent.placesLeft = placesLeft;
        setEvent(updateEvent);
        getID();
        if (typeof onRefresh !== "undefined") {
          onRefresh();
        }
      }
    }
  }

  const showJoinAlert = () => {
    Alert.alert(
      "How exciting!",
      "You have joined the event "+`${event.title}`+"!",
      [
      {text: "OK",},
      ]
    );

    console.log("steg 4")
  }

  const showUnjoinAlert = () => {
    Alert.alert(
      "Sorry!",
      "Someone was faster than you! ",
        [{ text: "OK" }]
      
    );

  }

  const unjoinEvent = async () => {
      if (joinedEvents.includes(event.eventID)){
        setLoading(true);
        let placesLeft = event.placesLeft + 1;
        const db= firebase.firestore();
        const sfDocRef = doc(db, "events", event.eventID);
        const sfPartRef = doc(db, "user_event", user.uid + '_' + event.eventID)

        try {
          await runTransaction(db, async (transaction) => {
            const sfPart = await transaction.get(sfPartRef);
            if (sfPart.exists()) {
              transaction.update(sfDocRef, { placesLeft: placesLeft });
              transaction.delete(sfPartRef);

              let updateEvent = event;
              updateEvent.placesLeft = placesLeft;
              setEvent(updateEvent);
        
              let updateParticipants = [...participants];
              let index = updateParticipants.findIndex(x => x.userID === user.uid)
              updateParticipants.splice(index, 1);
              setParticipants(updateParticipants);
        
        
              let updateJoin = [...joinedEvents];
              let i = updateJoin.indexOf(event.eventID, 0);
              updateJoin.splice(i, 1);
              setJoinedEvents(updateJoin);
                
                //Not update locally instead??
                getID(event.eventID);
                /*await firebase.firestore().collection('user_event').doc(user.uid + '_' + event.eventID).set({
                  userID: user.uid,
                  eventID: event.eventID,
                });*/
            }
            setLoading(false);
          });
            console.log("Transaction successfully committed!");
        } catch (e) {
          setLoading(false);
          console.log("Transaction failed: ", e);
        }
        if (myEvents){
          onRefresh();
          changeVisable();
        }

      /*await firebase.firestore().collection('user_event').doc(user.uid + '_' + event.eventID).delete();
      await firebase.firestore().collection('events').doc(event.eventID).update({ placesLeft: placesLeft });*/
    }
  }


  const getAmountPart = (event) => {
    let placesLeft = parseInt(event.placesLeft);
    let placesAvail = parseInt(event.noPeople);
    let amountP = placesAvail - placesLeft;
    return <Text>{amountP}</Text>;
  };

const AlertFunction = () => {
  return Alert.alert(
    "Delete?",
    "Are you sure you want to remove this event",
    [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          changeVisable()
          deleteEvent(event.eventID)
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]
  );
};


  /*<Button
                  style={styles.button}
                  labelStyle={{fontSize: 12}}
                  onPress={() => {
                    changeVisable()
                    navigation.navigate("CreateEventScreen")}}>
                    Edit Event
                  </Button>*/

  return (
    <View> 
      <Portal>
      <Modal
        transparent={true}
        visible={visable}
        onDismiss={() => {
          changeVisable();
        }}
        contentContainerStyle={styles.modalView}
      >
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
              <View style={styles.background}>
                <Text style={styles.title}>
                  {event.title}
                </Text>
                <Text
                  style={[styles.iconsContainer, styles.description]}> {event.description} </Text>
              </View>

              <View style={styles.iconsContainer}>
                <View style={{flexDirection:'row'}}>
                
                
                </View>
                {visable &&


                  // <Button
                  //   style={styles.iconsContainer}
                  //   icon="pen"
                  //   uppercase={false}
                  //   labelStyle={{ fontSize: 13, color: "black" }}
                  // >
                  //   <Text style={styles.iconsContainer}> {event.description}</Text>
                  // </Button>}
                <Button
                  style={styles.iconsContainer}
                  icon='map-marker'
                  labelStyle={{
                    fontSize: 13,
                    color: 'black'
                  }}> <Text style={styles.text}>{event.region.place} </Text></Button>}

                <Button
                  style={styles.iconsContainer}
                  icon='calendar-today'
                  labelStyle={{
                    fontSize: 13,
                    color: 'black'
                  }}> {event.date} </Button>

                <Button
                  style={styles.iconsContainer}
                  icon='clock-outline'
                  labelStyle={{
                    fontSize: 13,
                    color: 'black'
                  }}> {event.time} </Button>

                <Button
                  style={styles.iconsContainer}
                  icon='human-handsdown'
                  labelStyle={{
                    fontSize: 13,
                    color: 'black'
                  }}> <Text>{getAmountPart(event)}/{event.noPeople}</Text> </Button>

                {/*<Image
                source={require("../assets/people.png")}
                style={[styles.peopleLogga, styles.people]}/>* EVENTUELLT LÄGGA TILL ISTÄLLET FÖR OVAN*/}



                <View>

                {/*
                UNCOMMENT TO SEE OWNER AND PARTICIPANTS
                <View style={{flexDirection: "row", alignItems: "center"}}> 
                <Text style={[styles.margins]}> Creator: </Text>
                    <TouchableOpacity 
                  style={[styles.imageContainer]}
                  onPress={() =>{
                    changeVisable();
                    navigation.navigate("ProfileScreen", {
                      userID: event.owner,
                  })}
                  }
                >
                  <Image  style={styles.ownerImage} source= {{uri: photo}}/>
                </TouchableOpacity>
                </View>

                  <Text style={[styles.underTitle, styles.margins, {alignSelf: "center"}]}> {t('peopleJoined').toUpperCase()}</Text>
                
                <View style={{flexDirection: "row"}}> 
                  {participants.map((user, index) => (
                    <TouchableOpacity
                      style={[styles.imageContainer]}
                      key={index}
                      onPress={() => {
                        changeVisable();
                        if (typeof changeUser !== 'undefined') {
                          changeUser(user.userID);
                        }
                        navigation.navigate("ProfileScreen", {
                          userID: user.userID
                        })
                      }}>
               <Image  style={styles.ownerImage} source= {{uri: user.photo}}/>
                      
                      
                    </TouchableOpacity>
                  ))}
                    </View>
                  */}
                  <View style={{height:50}}/>
                </View>
              </View>
              </ScrollView>

            <View style={styles.myButtons}>
              <Button
                labelStyle={{ fontSize: 13 }}
                style={styles.button}
                onPress={() => changeVisable()}>
                {t('back')}
              </Button>

              {ownUser && <View>
                <Button style={styles.button}
                  labelStyle={{ fontSize: 13 }}
                  color="red"
                  onPress={ AlertFunction }>
                    {t('removeEvent')}</Button>
              </View>}

              {!ownUser && !checkOldEvents(event.eventID) && <View>
                {!(event.placesLeft === 0) && <View>
                  {!loading && !joinedEvents.includes(event.eventID) && <Button
                    style={styles.button}
                    labelStyle={{ fontSize: 13 }}
                    onPress={() => {
                      joinEvent()
                    }}>{t('joinEvent')}</Button>}
                </View>}
                {(event.placesLeft === 0) && <Text style={{margin: 10, marginTop: 17, color: "red"}}> Event is full!</Text>

                }
                {!loading && joinedEvents.includes(event.eventID) && <Button
                  style={styles.button}
                  labelStyle={{ fontSize: 13 }}
                  onPress={() => unJoinAlert()} color='red' > {t('unjoinEvent')}</Button>}

                  {loading &&<View style={{top:10, margin: 10, width:100}}> 
                   <ActivityIndicator animating={true} color={colors.deepBlue} />
                  </View>}

              </View>}

              {!ownUser && checkOldEvents(event.eventID) && <Text style={{margin: 10, marginTop: 17, color: "red"}}> Event has expired! </Text>}

            </View>
      </Modal>
      </Portal>
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    borderBottomColor: colors.orange,
    borderBottomWidth: 1,
    width: '100%',
  },

  description: {
    margin:5,
    marginTop:15,
    marginBottom: 15,
    alignSelf:'center'
  },

  iconsContainer: {
    alignSelf: "flex-start",
  },

  peopleJoined: {
    color: "#0081CF",
    textDecorationLine: "underline",

  },

  margins: {
    marginBottom: 5,
    marginTop: 5,
    flexWrap: 'wrap'
  },

  modalView: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center'
  },

  myButtons: {
    borderTopWidth: 1,
    borderTopColor: colors.orange,
    flexDirection: 'row',
    flex: 1,
    position: "absolute",
    bottom: 6,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'center'
  },

  button: {
    padding: 0,
    margin: 10,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  // text:{
  //   fontSize:10,

  // },

  title: {
    marginBottom: 5,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepBlue
  },
  underTitle: {
    fontWeight: 'bold',
    color: colors.deepBlue
  },

  scrollView: {
    backgroundColor: 'white',
    height:"60%",
    width: "90%",

  },
  ownerImage: {
    /*color: "#0081CF",
    textDecorationLine: "underline",*/
    width: 40,
    height: 40,
    borderRadius: 200 / 2, 
    marginTop:5,
    margin:5,
    borderWidth: 1,
    borderColor: colors.orange
  },
  imageContainer: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});

export default BiggerEvent;