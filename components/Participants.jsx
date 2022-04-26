import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Menu, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import firebase from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const Participants = ({ event, events, getAmount }) => {
  const [visible, setVisible] = useState(false);

  const openMenu = (visable) => {
    fetchParticipants();
    if (visable) {
      setVisible(true);
    }
  };

  const closeMenu = () => setVisible(false);

  const navigation = useNavigation();

  const [participant, setParticipant] = useState([]);
  const [participants, setParticipants] = useState([]);

  /*useEffect(() => {
    fetchParticipants();
  }, []);*/

  const fetchParticipants = async () => {
    const db = firebase.firestore();
    const response = db.collection("users");
    console.log("hämtar deltagare");
    setParticipants([]);
    let allParticipants = [...participants];
    events.map(async (event, index) => {
      allParticipants[index] = [event.eventID];
      const part = query(
        collection(db, "user_event"),
        where("eventID", "==", event.eventID)
      );
      const myParticipantsnapshot = await getDocs(part);
      myParticipantsnapshot.forEach(async (user) => {
        const info = await response.doc(user.data().userID).get();
        let participant = {
          name: info.get("name"),
          userID: user.data().userID,
        };
        allParticipants[index].push(participant);
        setParticipants((p) => [...p, allParticipants]);
        getParticipant(allParticipants);
      });
    });
  };

  const getParticipant = (allParticipants) => {
    let findParticipants = [...allParticipants];
    findParticipants.map((p, index) => {
      if (p[0] == event.eventID) {
        let info = [...findParticipants[index]];
        info.splice(0, 1);
        setParticipant(info);
      }
    });
  };

  const goToParticipant = (userID) => {
    navigation.navigate("ProfileScreen", { userID: userID });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Menu
          contentStyle={{
            opacity: 0.95,
            backgroundColor: "lightgrey",
            width: "100.5%",
            height: 198,
          }}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.touch} onPress={openMenu}>
              <Image
                style={styles.noPeopleText}
                source={require("../assets/p.png")}
              />
            </TouchableOpacity>
          }
        >
          <View style={styles.positioning}>
            <Text style={styles.header}> Participants</Text>
            <Divider />
            {participant.length == 0 && (
              <View>
                <Menu.Item
                  titleStyle={{ fontSize: 13 }}
                  title="No participants yet"
                />
              </View>
            )}

            {participant.map((p, index) => (
              <View key={p.userID}>
                <Menu.Item
                  titleStyle={{ fontSize: 13 }}
                  onPress={() => {
                    goToParticipant(p.userID);
                    closeMenu();
                  }}
                  title={p.name}
                />
                <Divider />
              </View>
            ))}
          </View>
        </Menu>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  noPeopleText: {
    width: 26,
    height: 26,
  },
  container: {
    justifyContent: "center",
  },
  header: {
    paddingRight: 50,
    paddingLeft: 12,
    paddingBottom: 7,
  },
  touch: {
    backgroundColor: "#CCDBDC",
    borderTopRightRadius: 8,
    borderLeftWidth: 1,
    padding: 3,
    shadowColor: "white",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default Participants;
