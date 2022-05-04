import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Image, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getDocs, collection, query, where } from "firebase/firestore";
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
  photo }) {

  const auth = getAuth();
  const { t, i18n } = useTranslation();
  const user = auth.currentUser;
  const [joinedEvents, setJoinedEvents] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const fetchJoinedEvents = async () => {
    setJoinedEvents([]);
    const db = firebase.firestore();
    const joinedEvents = query(collection(db, 'user_event'), where('userID', '==', user.uid));
    const myEventsnapshot = await getDocs(joinedEvents);
    myEventsnapshot.forEach((event) => {
      setJoinedEvents(events => ([...events, event.data().eventID]));
    })
  }

  const joinEvent = async () => {
    if (event.placesLeft > 0) {
      let placesLeft = event.placesLeft - 1;
      let updateEvent = event;
      updateEvent.placesLeft = placesLeft;
      setEvent(updateEvent);

      let updateJoin = [...joinedEvents]
      updateJoin.push(event.eventID);
      setJoinedEvents(updateJoin);

      getID(event.eventID);

      await firebase.firestore().collection('user_event').doc(user.uid + '_' + event.eventID).set({
        userID: user.uid,
        eventID: event.eventID,
      });
      await firebase.firestore().collection('events').doc(event.eventID).update({ placesLeft: placesLeft });
    }
  }
  const unjoinEvent = async () => {
    let placesLeft = event.placesLeft + 1;
    let updateEvent = event;
    updateEvent.placesLeft = placesLeft;
    setEvent(updateEvent);

    let updateParticipants = [...participants];
    let index = updateParticipants.findIndex(x => x.userID === user.uid)
    updateParticipants.splice(index, 1);
    setParticipants(updateParticipants);


    let updateJoin = [...joinedEvents]
    let i = updateJoin.indexOf(event.eventID, 0);
    updateJoin.splice(i, 1);
    setJoinedEvents(updateJoin);

    await firebase.firestore().collection('user_event').doc(user.uid + '_' + event.eventID).delete();
    await firebase.firestore().collection('events').doc(event.eventID).update({ placesLeft: placesLeft });
  }


  const getAmountPart = (event) => {
    let placesLeft = parseInt(event.placesLeft);
    let placesAvail = parseInt(event.noPeople);
    let amountP = placesAvail - placesLeft;
    return <Text>{amountP}</Text>;
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
    <View style={styles.centeredView}>
      <Modal
        propagateSwipe={true}
        transparent={true}
        visible={visable}
        onRequestClose={() => {
          changeVisable();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <ScrollView
              //horizontal={false}
              style={styles.scrollView}>

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
                  {/*<Text style={styles.margins}> There are {event.placesLeft} places left! </Text>*/}

                {/*<Text style={styles.margins}> {/* {participants.length}}{t('peopleJoined')} </Text>*/}
                
                <View style={{flexDirection: 'row', }}> 
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
                      
                      {/*<Text style={styles.peopleJoined}> {user.name} </Text>*/}
                    </TouchableOpacity>
                  ))}
                  </View>
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
                  onPress={() => {
                    changeVisable()
                    deleteEvent(event.eventID)
                  }}>{t('removeEvent')}</Button>
              </View>}

              {!ownUser && <View>
                {!(event.placesLeft === 0) && <View>
                  {!joinedEvents.includes(event.eventID) && <Button
                    style={styles.button}
                    labelStyle={{ fontSize: 13 }}
                    onPress={() => {
                      joinEvent()
                    }}>{t('joinEvent')}</Button>}
                </View>}
                {joinedEvents.includes(event.eventID) && <Button
                  style={styles.button}
                  labelStyle={{ fontSize: 13 }}
                  onPress={() => unjoinEvent()} color='red' > {t('unjoinEvent')}</Button>}

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
    borderBottomColor: colors.orange,
    borderBottomWidth: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    elevation: 5,
    width: '90%',
    alignItems: 'center'
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
    width: '90%',

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