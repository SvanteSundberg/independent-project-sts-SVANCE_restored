import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Image,
  TouchableHighlight,
  Pressable,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { TextInput, Button, Portal, Provider } from "react-native-paper";
import React from "react";
import colors from "../config/colors.js";
import firebase from "../config/firebase";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { DatePicker } from "react-native-common-date-picker";
import { useNavigation } from "@react-navigation/native"; //uncomment to use navigation
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "../config";
import DateTimePicker from "@react-native-community/datetimepicker";

function CreateEventScreen(props) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [date, setDate] = React.useState(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );
  const [time, setTime] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [noPeople, setNoPeople] = React.useState("");
  const [dateOpen, setdateOpen] = React.useState("false");
  const [isVisible, setVisible] = React.useState(false);
  const [region, setRegion] = React.useState({
    place: "",
    latitude: 59.856667,
    longitude: 17.642583,
    latitudeDelta: 0.1022,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();

  const setMaxDate = (monthInterval) => {
    let current_datetime = new Date();
    current_datetime.setMonth(current_datetime.getMonth() + monthInterval);
    let formatted_date;
    if (current_datetime.getMonth() < 10) {
      formatted_date =
        current_datetime.getFullYear() +
        "-0" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate();
    } else {
      formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate();
    }
    return formatted_date;
  };
  const changeTime = (event, selectedDate) => {
    const currentDate = selectedDate || time;
    setTime(currentDate);
    setShow(false);
  };
  const showTimepicker = () => {
    setShow(true);
  };

  const pressSend = () => {
    checkInput();
  };

  const checkInput = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !region.place.trim() ||
      !(time.getHours() + ":" + time.getMinutes()).trim() ||
      !date.trim() ||
      !noPeople.trim()
    ) {
      alert("Please fill out all fields");
      return;
    }
    toggleModal();
    sendEvent(); //uncomment to send to database
  };
  const toggleModal = () => {
    setVisible(!isVisible);
  };
  const sendEvent = () => {
    firebase
      .firestore()
      .collection("events")
      .add({
        title: title,
        description: description,
        region: region,
        date: date,
        time: time.getHours() + ":" + time.getMinutes(),
        noPeople: noPeople,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });

    setTitle("");
    setDescription("");
    setNoPeople("");
    setRegion({
      place: "",
      latitude: 59.856667,
      longitude: 17.642583,
      latitudeDelta: 0.1022,
      longitudeDelta: 0.0421,
    });

    setDate(
      new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate()
    );
    setTime(new Date());
  };

  const onBackToTimeline = () => {
    toggleModal();
    navigation.push("TimelineScreen");
  };

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        style={styles.ScrollView}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always"
        listViewDisplayed={false}
        horizontal={false}
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <Text style={styles.header}> SPORTA EVENT </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            label="Event title"
            value={title}
            onChangeText={(title) => setTitle(title)}
            mode="outlined"
            activeOutlineColor={colors.accentColor}
            placeholder="Title of your event"
          />
          <TextInput
            label="Event Description"
            value={description}
            onChangeText={(description) => setDescription(description)}
            mode="outlined"
            activeOutlineColor={colors.accentColor}
            placeholder="Describe your event in a few words"
            maxLength={100}
          />
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            GooglePlacesSearchQuery={{
              rankby: "distance",
            }}
            onPress={(details, data = null) => {
              // 'details' is provided when fetchDetails = true
              setRegion({
                place: details.description,
                latitude: data.geometry.location.lat,
                longitude: data.geometry.location.lng,
                latitudeDelta: 0.1022,
                longitudeDelta: 0.0421,
              });
            }}
            query={{
              key: config.GOOGLE_MAPS_API_KEY,
              language: "en",
              components: "country:SE",
              location: `${region.latitude},${region.longitude}`,
            }}
            styles={{
              textInput: {
                height: 60,
                backgroundColor: "transparent",
                borderColor: "black",
                marginTop: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "grey",
                color: "grey",
              },
              listView: {},
              row: {
                backgroundColor: "#FFF",
                padding: 13,
                height: 44,
                flexDirection: "row",
              },
              textInputContainer: {
                flexDirection: "row",
              },
            }}
          />
          <TextInput
            label="Number of people"
            value={noPeople}
            onChangeText={(noPeople) => setNoPeople(noPeople)}
            mode="outlined"
            activeOutlineColor={colors.accentColor}
            placeholder="How many people are you looking for?"
            keyboardType={"numeric"}
            maxLength={2}
          />
          <Button
            style={styles.dateButton}
            uppercase={false}
            onPress={() => setdateOpen(true)}
          >
            <Text style={styles.dateText}>Date: {date}</Text>
          </Button>
          <Modal visible={dateOpen}>
            <View style={styles.centerView}>
              <View style={styles.modalView}>
                <DatePicker
                  backgroundColor="white"
                  minDate={new Date()}
                  maxDate={setMaxDate(3)}
                  monthDisplayMode={"en-short"}
                  cancelText=""
                  rows={5}
                  selectedRowBackgroundColor={colors.accentColor}
                  s //"#C2E1C2"
                  width={350}
                  toolBarPosition="bottom"
                  toolBarStyle={{ width: "100%", justifyContent: "flex-end" }}
                  toolBarConfirmStyle={{ color: colors.accentColor }}
                  confirmText="OK"
                  onValueChange={(date) => setDate(date)}
                  confirm={(dateOpen) => setdateOpen(false)} //{dateOpen=>setdateOpen(false)}//{date => {setDate(date)}} // setDate(date)}
                />
              </View>
            </View>
          </Modal>

          <View>
            <Button
              style={styles.dateButton}
              uppercase={false}
              onPress={showTimepicker}
            >
              <Text style={styles.dateText}>
                Time: {time.getHours() + ':' + time.getMinutes()}
              </Text>
            </Button>
          </View>
          {show && (
            <DateTimePicker
              style={styles.timePicker}
              value={time}
              mode={"time"}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={changeTime}
            />
          )}

          <Button
            style={[styles.button, styles.createEventButton]}
            title="send"
            mode="contained"
            onPress={pressSend}
          >
            <Text style={styles.buttonText}> Create Event </Text>
          </Button>
          <Modal
            animationType={"fade"}
            visible={isVisible}
            transparent={true}
            onRequestClose={true}
          >
            <View style={styles.centerView}>
              <View style={styles.modalView}>
                <Image
                  source={require("../assets/green-checkmark.png")}
                  style={styles.modalLogo}
                />
                <Text style={styles.modalText}>
                  You successfully created an event!
                </Text>
                <Button
                  style={[styles.button, styles.modalButton]}
                  onPress={onBackToTimeline} //toggleModal() comment/uncomment for navigation
                >
                  <Text style={styles.buttonText}>Back To Timeline</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ScrollView: {
    flex: 1,
    width: "100%",
  },
  header: {
    flex: 1,
    alignSelf: "center",
  },
  form: {
    flex: 1,
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  button: {
    width: 300,
    height: 50,
    margin: 10,
    alignSelf: "center",
  },
  dateButton: {
    backgroundColor: "#F6F6F6",
    width: Dimensions.get("window").width - 30,
    height: 40,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#787878",
    alignSelf: "center",
  },
  dateText: {
    color: "#787878",
  },
  modalButton: {
    backgroundColor: colors.accentColor,
    shadowColor: "white",
    alignSelf: "flex-start",
  },
  createEventButton: {
    backgroundColor: colors.accentColor,
    marginTop: 50,
  },
  input: {},
  centerView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalLogo: {
    height: 60,
    width: 60,
  },
  modalText: {
    color: "black",
  },
});
export default CreateEventScreen;
