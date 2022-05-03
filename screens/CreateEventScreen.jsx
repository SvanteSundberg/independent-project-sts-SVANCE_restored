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
import sports from "./CreateprofileScreen.jsx";
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from "react-i18next";
import { getAuth } from "firebase/auth";
import { color } from "react-native-elements/dist/helpers";


function CreateEventScreen(props) {
  const { t, i18n } = useTranslation();

  const auth = getAuth();
  const user = auth.currentUser;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [sport, setSport] = React.useState("");
  const [date, setDate] = React.useState(
    new Date().getFullYear() +
    "-" + "0" +
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

  const correctTime = (time) => {
    let correctHours = time.getHours();
    let correctMinutes = time.getMinutes();;
    let correctTime;
    if (time.getHours() < 10) {
      correctHours = "0" + time.getHours();
    }
    if (time.getMinutes() < 10) {
      correctMinutes = "0" + time.getMinutes();
    }
    correctTime = correctHours + ":" + correctMinutes;
    return correctTime;
  }


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
  const changeTime = (event, selectedTime) => {
    console.log(sport);
    const currentTime = selectedTime || time;
    setTime(currentTime);
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
      !noPeople.trim() ||
      sport == "select"
    ) {
      alert("Please fill out all fields");
      return;
    }
    toggleModal();
    sendEvent();
  };
  const toggleModal = () => {
    setVisible(!isVisible);
  };
  const googleInput = React.useRef();
  const sendEvent = () => {
    firebase
      .firestore()
      .collection("events")
      .add({
        title: title,
        lang: i18n.language,
        owner: user.uid,
        sport: sport,
        description: description,
        region: region,
        date: date,
        noPeople: noPeople,
        placesLeft: noPeople,
        time: correctTime(time),
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
    navigation.navigate("HomeScreen");
  };

  const handleBackwards = () =>  navigation.navigate("HomeScreen")

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        style={styles.ScrollView}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always"
        listViewDisplayed={false}
        horizontal={false}
      >
         

        <View style={styles.form}>
        
        <View style={{flexDirection:"row", alignSelf: "center"}}>
          <Button
          style={styles.backButton}
          onPress={handleBackwards}
          icon='keyboard-backspace'
          labelStyle={{fontSize: 30,
          color: colors.lightBlue}}>
            </Button>
        <Text style={styles.header}> {t('createEventTitle')} </Text>
        </View>
        

          <TextInput
            style={styles.input}
            label={t('title1')}
            value={title}
            onChangeText={(title) => setTitle(title)}
            mode="outlined"
            outlineColor="white"
            activeOutlineColor={colors.mediumBlue}
            placeholder={t('title2')}
            maxLength={30}
          />
          <TextInput
            style={styles.input}
            label={t('desc1')}
            value={description}
            onChangeText={(description) => setDescription(description)}
            mode="outlined"
            outlineColor="white"
            activeOutlineColor={colors.mediumBlue}
            placeholder={t('desc2')}
            maxLength={100}
            
          />

          <TextInput
            label={t('nopeople1')}
            value={noPeople}
            style={styles.input}
            onChangeText={(noPeople) => setNoPeople(noPeople)}
            mode="outlined"
            outlineColor="white"
            activeOutlineColor={colors.mediumBlue}
            placeholder={t('nopeople2')}
            keyboardType={"numeric"}
            maxLength={2}
          />

          <GooglePlacesAutocomplete
          placeholder={t('place')}
            fetchDetails={true}
            GooglePlacesSearchQuery={{
              rankby: "distance",
            }}
            onPress={(details, data = null) => {
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
                height: 50,
                backgroundColor: '#F6F6F6',
                marginTop: 5,
                marginBottom:10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:'white',
                color: "#787878",
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
          <Button
              style={styles.dateButton}
              uppercase={false}
              onPress={() => setdateOpen(true)}
            >
              <Text style={styles.dateText}>{t('date')}: {date}</Text>
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
                    selectedRowBackgroundColor={colors.mediumBlue}
                    width={350}
                    toolBarPosition="bottom"
                    toolBarStyle={{ width: "100%", justifyContent: "flex-end" }}
                    toolBarConfirmStyle={{ color: colors.deepBlue }}
                    confirmText="OK"
                    onValueChange={(date) => setDate(date)}
                    confirm={(dateOpen) => setdateOpen(false)}
                  />
                </View>
              </View>
            </Modal>
            <View style={styles.block}></View>
            <View>
              <Button
                style={styles.dateButton}
                uppercase={false}
                onPress={showTimepicker}
              >
                <Text style={styles.dateText}>
                  {t('time')}: {time.getHours() + ':' + time.getMinutes()}
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
          <View style={styles.sportPickerView}>
            <Picker
              style={styles.sportPicker}
              selectedValue={sport}
              onValueChange={(itemValue, itemIndex) =>
                setSport(itemValue)
              }>
              <Picker.Item label={t('selectSport')} value="select" />
              <Picker.Item label={t('football')} value="fotboll" />
              <Picker.Item label={t('basket')} value="basket" />
              <Picker.Item label={t('padel')} value="padel" />
              <Picker.Item label={t('tennis')} value="tennis" />
              <Picker.Item label={t('handball')} value="handball" />
              <Picker.Item label={t('bandy')} value="floorball" />
              <Picker.Item label={t('volleyball')} value="volleyball" />
              <Picker.Item label={t('run')} value="run" />
              <Picker.Item label={t('golf')} value="golf" />
              <Picker.Item label={t('squash')} value="squash" />
              <Picker.Item label={t('other')} value="other" />
            </Picker>
          </View>
            
          <Button
            style={[styles.button, styles.createEventButton]}
            title="send"
            mode="contained"
            onPress={pressSend}
          >
            <Text style={styles.buttonText}> {t('createEvent')} </Text>
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
                  {t('createdEvent')}
                </Text>
                <Button
                  style={[styles.button, styles.modalButton]}
                  onPress={onBackToTimeline}
                >
                  <Text style={styles.buttonText}>{t('backToTimeline')}</Text>
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
  backButton: {
    right: 10,
    width:15,
    height: 25,
    
    
},
  main: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ScrollView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    flex: 1,
    alignSelf: "center",
    padding: 1,
    fontSize:17,
    fontWeight:'bold',
    color:colors.mediumBlue,
    marginBottom: 20,
    marginTop: 30,
    right: 20,
  },
  form: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.deepBlue,
    margin: 5,
    paddingTop:20,
    borderRadius: 15,
  },
  sportPickerView: {
    color: 'gray',
  },
  sportPicker: {
    backgroundColor: '#F6F6F6',
    color: '#787878',
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
  dateTimeView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  block: {
    width: 20,
  },
  input:{
    marginBottom:5,
  },
  dateButton: {
    backgroundColor: 'white',
    width: Dimensions.get("window").width -40,
    padding: 5,
    height: 50,
    marginBottom:10,
    borderRadius: 0,

  },
  dateText: {
    color: "#787878",
  },
  modalButton: {
    backgroundColor: colors.orange,
    shadowColor: "white",
    alignSelf: "flex-start",
  },
  createEventButton: {
    backgroundColor: colors.orange,
    marginTop: 20,
  },
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
