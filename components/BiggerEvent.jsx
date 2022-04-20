import React, { useState } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from "react-native-web";

function BiggerEvent({visable, changeVisable, event, participants, theUser}) {
    const navigation= useNavigation();

    /*useEffect(() => {
      getID();
     }, []);

    const getID = async () => {
      const database = firebase.firestore();
      setParticipants([]);
      const ID = query(collection(database, "user_events"), where("eventID", "==", event.eventID) );
            const IDSnapshot = await getDocs(ID);
            IDSnapshot.forEach(async(item) => {
              const participants = query(collection(database, "user_events"), where("eventID", "==", item.data().userID));
              const participantSnapshot = await getDocs(participants);
              participantSnapshot.forEach((user) => {
                  setParticipants(users=>([...users,user.data()]));
              });
            });
      console.log(participants);      
      
    }*/
 
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

          <View style={styles.background}>
            <Text style={styles.title}>
                {event.title}
            </Text>
          </View>

            <View  style={styles.iconsContainer}>
            <Text
            style={[styles.iconsContainer, styles.description]}> {event.description} </Text>

            {visable && 
            <Button 
            style={styles.iconsContainer}
            icon='map-marker'
            labelStyle={{fontSize: 13,
                color:'black'}}> {event.region.place}</Button>}

            <Button 
                style={styles.iconsContainer}
                icon='calendar-today'
                labelStyle={{fontSize: 13,
                    color:'black'}}> {event.date} </Button>

            <Button 
                style={styles.iconsContainer}
                icon='clock-outline'
                labelStyle={{fontSize: 13,
                    color:'black'}}> 14:50 </Button>

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
                    console.log("navigerar");
                    changeVisable();
                    changeUser();
                    navigation.navigate("ProfileScreen", {
                    userID: theUser
                  })}}>
                  <Text> {user.name}</Text>
             </TouchableOpacity>  
           ))}
           </View>
            </View>


              <View style={styles.myButtons}>
                <Button
                  labelStyle={{fontSize: 12}}
                  style={styles.button}
                  onPress={() => changeVisable()}>
                    Back
                  </Button>

                  <Button
                  style={styles.button}
                  labelStyle={{fontSize: 12}}
                  onPress={() => {
                    changeVisable()
                    navigation.navigate("CreateEventScreen")}}>
                    Edit Event
                  </Button>
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
    padding:20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    width: '80%',
    height: '60%',
  },

  myButtons: {
    flexDirection:'row',
    flex: 1,
    position:"absolute",
    bottom:6,
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
  }
});

export default BiggerEvent;