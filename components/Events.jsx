import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image
} from "react-native";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import firebase from "../config/firebase";
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Participants from "./Participants";
import { TouchableOpacity } from "react-native";
import BiggerEvent from "../components/BiggerEvent";
import colors from "../config/colors";
import { useTranslation } from "react-i18next";
import {useIsFocused} from '@react-navigation/native';


function Events({ events, setevents, owners, joinedEvents, setJoinedEvents, onRefresh}) {
  const {t,i18n}=useTranslation();
  const [ownEvents, setOwnEvents] = useState([]);
  //const [joinedEvents, setJoinedEvents] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [visable, setVisable] = useState(false);
  const [specificEvent, setEvent] = useState({});
  const [participants, setParticipants] = useState([]); 
  const [ownUser, setOwnUser] = useState(false);
  const isFocused = useIsFocused();
  const [photo, setPhoto] = useState(null);


  useEffect(() => {
    //fetchJoinedEvents();
    fetchOwnEvents();
  }, [isFocused]);

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

  const fetchOwnEvents = async () => {
    setOwnEvents([]);
    const database = firebase.firestore();
    const userEvents = query(
      collection(database, "events"),
      where("owner", "==", user.uid)
    );
    const eventSnapshot = await getDocs(userEvents);
    eventSnapshot.forEach((item) => {
      setOwnEvents((events) => [...events, item.id]);
    });
  };

  const getAmount = (element) => {
    let placesOver = parseInt(element.placesLeft);
    let places = parseInt(element.noPeople);
    let amountParticipants = places - placesOver;

    return <Text> {amountParticipants} </Text>;
  };

  const deleteEvent = async (eventID, index) => {
    let eventArray = [...events];
    eventArray.splice(index, 1);
    setevents(eventArray);

    let updateOwn = [...ownEvents];
    let i = updateOwn.indexOf(eventID, 0);
    updateOwn.splice(i, 1);
    setOwnEvents(updateOwn);

    const db = firebase.firestore();
    await db.collection("events").doc(eventID).delete();
    const joinedEvent_query = db
      .collection("user_event")
      .where("eventID", "==", eventID);
    joinedEvent_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

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
          photo: info.get("photo"),
          name: info.get("name"),
          userID: user.data().userID }]));
    });
  }
  
    const handleOnPress = (event) =>  {
      setEvent(event);
      setVisable(true);
      getID(event.eventID);
      for (let obj of owners) {
        if (obj.ownerid === event.owner) {
          setPhoto(obj.photo)
        }
      }
    }


    const checkOwner = (id) => {
      /*for (let obj of owners) {
        if (obj.ownerid === id) {
          return (
              <TouchableOpacity 
              style={[styles.imageContainer]}
              onPress={() =>
                navigation.navigate("ProfileScreen", {
                  userID: id,
                })
              }
            >
               <Image  style={styles.ownerImage} source= {{uri: obj.photo}}/>
            </TouchableOpacity>
          );
        }
      }*/
    };

  const joinEvent = async (element, index) => {
    if (element.placesLeft > 0) {
      let placesLeft = element.placesLeft - 1;
      let eventArray = [...events];
      eventArray[index].placesLeft = placesLeft;
      setevents(eventArray);

      let updateJoin = [...joinedEvents];
      updateJoin.push(element.eventID);
      setJoinedEvents(updateJoin);

      await firebase
        .firestore()
        .collection("user_event")
        .doc(user.uid + "_" + element.eventID)
        .set({
          userID: user.uid,
          eventID: element.eventID,
        });
      await firebase
        .firestore()
        .collection("events")
        .doc(element.eventID)
        .update({ placesLeft: placesLeft });
    }
  };
  const unjoinEvent = async (element, index) => {
    let placesLeft = element.placesLeft + 1;
    let eventArray = [...events];
    eventArray[index].placesLeft = placesLeft;
    setevents(eventArray);
    if (typeof onRefresh !== 'undefined'){
      onRefresh();
    }

    let updateJoin = [...joinedEvents];
    let i = updateJoin.indexOf(element.eventID, 0);
    updateJoin.splice(i, 1);
    setJoinedEvents(updateJoin);

    await firebase
      .firestore()
      .collection("user_event")
      .doc(user.uid + "_" + element.eventID)
      .delete();
    await firebase
      .firestore()
      .collection("events")
      .doc(element.eventID)
      .update({ placesLeft: placesLeft });
  };

  return (
    <SafeAreaView style={styles.main}>

     {events.length<1 && <View style={{marginTop:30}}><Text>No events found</Text></View>}

      {visable && <BiggerEvent
                      navigation={navigation}
                      visable={visable}
                      changeVisable={changeVisable}
                      event={specificEvent}
                      participants={participants}
                  //changeUser={setUser}
                      ownUser={ownUser}
                      deleteEvent={deleteEvent}
                      setEvent={setEvent}
                      getID={getID}
                      setParticipants={setParticipants}
                      photo={photo}
                    />}

      <ScrollView style={styles.scroller}>
        <View style={styles.outer}>
        {events.map((element, index) => {
          return (
            
            
            <View key={element.eventID} style={styles.postContainer}>
            <TouchableOpacity key={element.title}
            onPress = {() => handleOnPress(element)}>
              <View style={styles.posts}>
                <View style={styles.postHeader}>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      icon="calendar-today"
                      labelStyle={{ color: "#CCDBDC" }}
                    />
                    <Text style={styles.dateText}>
                      {element.date}  kl. {element.time}
                    </Text>
                  </View>
                 
                  <Text style={styles.noPeopleText}>
                     {getAmount(element)} / {element.noPeople}
                  </Text>

                  <Image
                source={require("../assets/people.png")}
                style={[styles.peopleLogga, styles.people]}/>
                  <View>
                    {/* <Participants
                      event={element}
                      events={events}
                      getAmount={getAmount}
                    /> */}
                  </View>
                </View>

                  <Text style={styles.title}>{element.title} </Text>

                  {checkOwner(element.owner)}

                <View style={{ marginLeft: 15 }}>

               
                  
                  
                  <Button
                    style={styles.iconsContainer}
                    icon="pen"
                    uppercase={false}
                    labelStyle={{ fontSize: 13, color: "black" }}
                  >
                    <Text style={styles.description} numberOfLines={1}> {element.description}</Text>
                  </Button>

                  <Button
                    style={styles.iconsContainer}
                    icon="map-marker"
                    uppercase={false}
                    labelStyle={{ fontSize: 13, color: "black" }}
                  >
                    {element.region.place}
                  </Button>

                  <View>
                  {/* <Text> {t('createdBy')} {checkOwner(element.owner)}</Text> */}

                    {!ownEvents.includes(element.eventID) && (
                      <View>
                        {!joinedEvents.includes(element.eventID) && (
                          <View>
                            {!(element.placesLeft === 0) && (
                              <Button style={styles.joinButtons}
                                onPress={() => {
                                  joinEvent(element, index);
                                }}
                              >
                                <Text style={styles.text}>{t('joinEvent')}</Text>
                              </Button>
                            )}

                            {element.placesLeft === 0 && (
                              <Text style={styles.full}>
                                {t('fullEvent')}
                              </Text>
                            )}
                          </View>
                        )}
                        {joinedEvents.includes(element.eventID) && (
                          <Button style={styles.unjoinButtons}
                            onPress={() => unjoinEvent(element, index)}
                            color="red"
                          >
                            <Text style={styles.text}>{t('unjoinEvent')}</Text>
                          </Button>
                        )}
                      </View>
                    )}

                    {ownEvents.includes(element.eventID) && (
                      <Button
                      style={styles.removeButton}
                        color="red"
                        onPress={() => {
                          deleteEvent(element.eventID, index);
                        }}
                      >
                       <Text style={styles.text}>{t('removeEvent')}</Text> 
                      </Button>
                    )}
                  </View>
                </View>
              </View>
              </TouchableOpacity>
            </View>
          
          );
        })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconsContainer: {
    alignSelf: "flex-start",
    marginRight:5,
    marginLeft:5,
  },

  description: {
    //fontStyle: "italic",
    color:'black',
    //marginBottom:15

  },
  created: {
    bottom: 0,
    position: "absolute",
  },
  full: {
    marginTop: 5,
    alignSelf: "center",
    fontStyle: "italic",
    color: "red",
  },
  main: {
    flex: 1,
  },
  outer:{
    width: Dimensions.get("window").width,
    padding:10,
  },

  ownerContainer: {
    position: "absolute",
  },

  postContainer: {
    marginTop: 10,

  },
  text:{
  },

  // header: {
  //   alignSelf: "center",
  //   fontWeight: "bold",
  //   fontSize: 25,
  // },
  owner: {
    margin: 5,
  },
  ownerImage: {
    /*color: "#0081CF",
    textDecorationLine: "underline",*/
    width: 40,
    height: 40,
    borderRadius: 200 / 2, 
    marginTop:5,
    right: '10%',
    position: 'absolute',
    top:-42,
    right: 10,
    borderWidth: 1,
    borderColor: colors.orange
  },
  scroller: {
    alignSelf: "center",
    flex: 1,
  },

  people: {
    position: "absolute", 
},
peopleLogga:{
    bottom: 0, 
    right: 50,
    width: 20,
    height:20,
    margin:5,
},

  postHeader: {
    backgroundColor: colors.deepBlue,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  dateText: {
    color: "#CCDBDC",
    alignSelf: "center",
    left:-15
  },

  noPeopleText: {
    //marginRight:10,
    bottom: 0, 
    left: 45,
    margin:5,
    color: "#CCDBDC",

  },

  profile: {
    alignSelf: "center",
    position: "absolute",
    left: 10,
  },

  createEvent: {
    bottom: 40,
    right: -5,
    position: "absolute",
  },

  posts: {
    flex: 1,
    width: Dimensions.get("window").width - 20,
    height: 200,
    //borderWidth: 0.5,
    borderRadius: 10,
    backgroundColor:'white',//colors.lightBlue,
    //borderColor:"black",
    //backgroundColor:"#D6EAF8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    
    elevation: 6,

  },

  unjoinButtons: {
    width: 105,
    height: 35,
    alignSelf: "center",
    marginTop:5,


  }, 

  removeButton: {
    width: 160,
    height: 35,
    alignSelf: "center",
    marginTop:15,

  }, 
 
  joinButtons:{
    width: 150,
    height: 35,
    alignSelf: "center",
    marginTop:5,
  },

  title: {
    color: colors.deepBlue,
    fontWeight: "bold",
    fontSize: 18,
    margin: 10,
    alignSelf: "center",
    marginBottom: 10
  },
  imageContainer: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }

});
export default Events;
