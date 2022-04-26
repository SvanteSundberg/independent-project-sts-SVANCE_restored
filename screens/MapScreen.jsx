import * as React from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "@firebase/auth";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import firebase from "../config/firebase";
import { Button } from "react-native-paper";
import colors from "../config/colors.js";
import BiggerEvent from "../components/BiggerEvent";
import { collection, query, where, getDocs } from "firebase/firestore";


export default function App() {
  const [events, setevents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [visable, setVisable] = React.useState(false);
  const [specificEvent, setEvent] = React.useState({});
  const [participants, setParticipants] = React.useState([]); 
  const navigation = useNavigation();
  const [ownUser, setOwnUser] = React.useState(false);
  const auth = getAuth();
    const user = auth.currentUser;

  const changeVisable = () => {
    setVisable(!visable);
  }

  const deleteEvent = async (eventID) => {
    let eventArray = [...events];
    index = eventArray.findIndex(x => x.eventID ===eventID);
    eventArray.splice(index,1);
    setevents(eventArray);


    /*const db = firebase.firestore();
    await db.collection('events').doc(eventID).delete();
    const joinedEvent_query = db.collection('user_event').where("eventID", '==', eventID);
    joinedEvent_query.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
    });

    })*/
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



  const fetchEvents = async () => {
    const response = firebase.firestore().collection("events");

    const data = await response.get();

    data.docs.forEach((item) => {
      //setevents((events) => [...events, item.data()]);
      let data = item.data();
                let id = {eventID: item.id}
                Object.assign(data, id);
                setevents(events=>([...events, data]));
    });
  };
  

  React.useEffect(() => {
    fetchEvents();
    setLoading(false);
  }, []);

  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 59.856667,
          longitude: 17.642583,
          latitudeDelta: 0.1022,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        {!loading
          ? events.map((event, index) => (
              <Marker
                key={index}
                coordinate={{
                  longitude: event.region.longitude,
                  latitude: event.region.latitude,
                }}
                title={event.title}
                description={event.description}
                pinColor={colors.blue}
                tracksInfoWindowChanges={true}
                zIndex={100}
              >
                <Callout key={index} tooltip>
                  <View style={styles.calloutHeader}>
                    <View style={styles.title}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {event.title}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight: "bold", fontSize: 13 }}>
                        {event.description}
                      </Text>
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          color: colors.blue,
                        }}
                      >
                        Number of available slots:{" "}
                        <Text style={{ color: "red" }}>
                          {" "}
                          {event.placesLeft}{" "}
                        </Text>
                      </Text>
                    </View>

                    <Callout
                      onPress={() => {
                        setVisable(true);
                        setEvent(event);
                        getID(event.eventID);
                        setOwnUser(event.owner == user.uid);
                      }}
                      style={styles.calloutButton}
                      mode="contained"
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          alignSelf: "center",
                        }}
                      >
                        open event
                      </Text>
                    </Callout>
                    <BiggerEvent
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
                    />
                  </View>
                  <View style={styles.calloutArrowBorder} />
                  <View style={styles.calloutArrow} />
                </Callout>
              </Marker>
            ))
          : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  title: {
    marginBottom: 7,
  },
  calloutHeader: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "lightblue",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 230,
  },
  calloutArrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "lightblue",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  calloutArrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  calloutButton: {
    backgroundColor: colors.blue,
    shadowColor: "white",
    alignSelf: "center",
    position: "relative",
    width: 140,
    height: 25,
    margin: 10,
    paddingTop: 3,
    borderRadius: 6,
  },
});
