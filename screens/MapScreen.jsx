import * as React from "react";
import MapView, { Callout, Marker } from "react-native-maps";
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

export default function App() {
  const [events, setevents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchEvents = async () => {
    const response = firebase.firestore().collection("events");

    const data = await response.get();

    data.docs.forEach((item) => {
      setevents((events) => [...events, item.data()]);
    });
  };
  const joinEvent = () => {
    console.log("skall fixas");
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
                      onPress={joinEvent}
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
                        JOIN EVENT
                      </Text>
                    </Callout>
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
