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
  TouchableHighlight,
  Linking, Platform 
} from "react-native";
import firebase from "../config/firebase";
import { Button } from "react-native-paper";
import colors from "../config/colors.js";
import BiggerEvent from "../components/BiggerEvent";
import { collection, query, where, getDocs } from "firebase/firestore";
import { color } from "react-native-elements/dist/helpers";
import { Menu, Divider } from "react-native-paper";


export default function App() {
  const [events, setevents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dates, setDates] = React.useState([])
  const [visibleFilter, setVisibleFilter] = React.useState(false);
  const [visable, setVisable] = React.useState(false);
  const [specificEvent, setEvent] = React.useState({});
  const [participants, setParticipants] = React.useState([]); 
  const navigation = useNavigation();
  const [ownUser, setOwnUser] = React.useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [filter, setFilter] = React.useState("");
  
  

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

  
  const openMenu = () => setVisibleFilter(true);

  const closeMenu = () => setVisibleFilter(false);

  const openGps = (lat, lng) => {
      {Platform.OS === "ios"
        ? Linking.openURL(
            `maps://app?saddr=enter the+startposition&daddr=${lat}+${lng}`
          )
        : console.log("android")}
  };

 



  const fetchEvents = async () => {
    console.log('fetching....')
    const response = firebase.firestore().collection("events");

    const data = await response.get();

    data.docs.forEach((item) => {
      //setevents((events) => [...events, item.data()]);
      let data = item.data();
      let id = { eventID: item.id };
      Object.assign(data, id);
      setevents((events) => [...events, data]);
      setLoading(false);
      
    });
    
    
  };
  /* let tempDates = []
  const getDates = () => {
    
    events.forEach((event) => {
      tempDates.push(event.date)
    })
    tempDates.filter((v, i, a) => a.indexOf(v) === i)
    console.log("inga dubletter", tempDates)
    //tempDates.filter(x => x !== undefined)
  } */

 


  React.useEffect(() => {
    fetchEvents(); 
    
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
        showsUserLocation={true}
        followsUserLocation={true}
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
                pinColor={colors.orange}
                tracksInfoWindowChanges={true}
                zIndex={100}
                style={styles.markerStyle}
              >
                <Callout key={index} tooltip>
                  <View
                    style={styles.calloutHeader}
                    backgroundColor={colors.lightBlue}
                  >
                    <View style={styles.title}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.deepBlue,
                          fontSize: 18,
                        }}
                      >
                        {event.title}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 15 }}>{event.description}</Text>
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        Number of available slots:{" "}
                        <Text style={{ color: colors.orange, fontSize: 17 }}>
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
                          color: colors.lightBlue,
                          fontSize: 14,
                          alignSelf: "center",
                        }}
                      >
                        OPEN EVENT
                      </Text>
                    </Callout>
                    <Callout
                      onPress={() => openGps(event.region.latitude, event.region.longitude)}
                      style={styles.filterButton}
                      style={styles.directionsButton}
                    >
                      <Text
                        style={{
                          color: colors.lightBlue,
                          fontSize: 14,
                          alignSelf: "center",
                        }}
                      >
                        Get directions!
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
  markerStyle:{
    shadowColor:"black",
    shadowOffset: {
      width:10,
      height:10
    },
    shadowOpacity:2
  },

  calloutHeader: {
    flexDirection: "column",
    alignSelf: "flex-start",
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 230,
  },
  calloutArrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: '#DBF2FF',
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
    shadowColor: "white",
    shadowRadius:5,
    alignSelf: "center",
    position: "relative",
    width: 190,
    height: 30,
    marginTop: 10,
    marginBottom:5,
    paddingTop: 5,
    borderRadius: 15,
    borderWidth:1, 
    borderColor: colors.mediumBlue,
    backgroundColor: colors.mediumBlue,
    elevation:4,

  },
  directionsButton:{
    shadowColor: "white",
    shadowRadius:5,
    alignSelf: "center",
    position: "relative",
    width: 190,
    height: 30,
    margin: 5,
    paddingTop: 5,
    borderRadius: 15,
    borderWidth:1, 
    borderColor: colors.mediumBlue,
    backgroundColor: colors.orange,
    elevation:4,
  },
  filterButton:{
    backgroundColor: colors.lightBlue,
    borderColor:colors.deepBlue,
    borderWidth:1,
    width:300,
    height:40,
  }
});
