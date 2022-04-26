import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import firebase from "../config/firebase";
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Participants from "./Participants";
import { TouchableOpacity } from "react-native";

function Events({ events, setevents, owners }) {
  const [ownEvents, setOwnEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    fetchJoinedEvents();
    fetchOwnEvents();
  }, []);

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

  const checkOwner = (id) => {
    for (let obj of owners) {
      if (obj.ownerid === id) {
        return (
          <Text
            style={styles.ownerText}
            onPress={() =>
              navigation.navigate("ProfileScreen", {
                userID: id,
              })
            }
          >
            {obj.name}
          </Text>
        );
      }
    }
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
      <ScrollView style={styles.scroller}>
        {events.map((element, index) => {
          return (
            <View key={element.title} style={styles.postContainer}>
              <View style={styles.posts}>
                <View style={styles.postHeader}>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      icon="calendar-today"
                      labelStyle={{ color: "#CCDBDC" }}
                    />
                    <Text style={styles.dateText}>
                      {element.date} {element.time}
                    </Text>
                  </View>

                  <Text style={styles.noPeopleText}>
                    Participants: {getAmount(element)} / {element.noPeople}
                  </Text>
                  <View style={{ alignSelf: "baseLine" }}>
                    <Participants
                      event={element}
                      events={events}
                      getAmount={getAmount}
                    />
                  </View>
                </View>

                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={styles.title}>{element.title} </Text>
                </View>

                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.description}> {element.description}</Text>

                  <Button
                    style={styles.iconsContainer}
                    icon="map-marker"
                    labelStyle={{ fontSize: 13, color: "black" }}
                  >
                    {element.region.place}
                  </Button>

                  <View>
                    <Text> Created by: {checkOwner(element.owner)}</Text>

                    {!ownEvents.includes(element.eventID) && (
                      <View>
                        {!joinedEvents.includes(element.eventID) && (
                          <View>
                            {!(element.placesLeft === 0) && (
                              <Button
                                onPress={() => {
                                  joinEvent(element, index);
                                }}
                              >
                                join event
                              </Button>
                            )}

                            {element.placesLeft === 0 && (
                              <Text style={styles.full}>
                                This event is full!
                              </Text>
                            )}
                          </View>
                        )}
                        {joinedEvents.includes(element.eventID) && (
                          <Button
                            onPress={() => unjoinEvent(element, index)}
                            color="red"
                          >
                            unjoin
                          </Button>
                        )}
                      </View>
                    )}

                    {ownEvents.includes(element.eventID) && (
                      <Button
                        color="red"
                        onPress={() => {
                          deleteEvent(element.eventID, index);
                        }}
                      >
                        remove event
                      </Button>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconsContainer: {
    alignSelf: "flex-start",
  },

  description: {
    fontStyle: "italic",
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

  ownerContainer: {
    position: "absolute",
  },

  postContainer: {
    marginTop: 10,
  },

  header: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  owner: {
    margin: 5,
  },
  ownerText: {
    color: "#0081CF",
    textDecorationLine: "underline",
  },
  scroller: {
    alignSelf: "center",
    flex: 1,
  },

  postHeader: {
    backgroundColor: "#007EA7",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  dateText: {
    color: "#CCDBDC",
    alignSelf: "center",
  },

  noPeopleText: {
    //marginRight:10,
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
    width: Dimensions.get("window").width - 10,
    height: 200,
    borderWidth: 0.5,
    borderRadius: 10,
    //borderColor:"black",
    //backgroundColor:"#D6EAF8",
  },

  title: {
    color: "#1b73b3",
    fontWeight: "bold",
    fontSize: 18,
    margin: 5,
  },
});
export default Events;
