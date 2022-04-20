import * as React from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import firebase from "../config/firebase";

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
                pinColor="blue"
              />
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
});
