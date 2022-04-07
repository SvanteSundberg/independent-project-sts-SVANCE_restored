import { StyleSheet, Text, View, ScrollView, Modal, Image, TouchableHighlight, Pressable, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { TextInput, Button, Portal, Provider } from "react-native-paper";
import React from 'react';
import colors from '../config/colors.js';
import firebase from '../config/firebase';
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import { DatePicker } from "react-native-common-date-picker";
// import { useNavigation } from '@react-navigation/native'; //uncomment to use navigation

function CreateEventScreen(props) {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [place, setPlace] = React.useState("");
    const [date, setDate] = React.useState("");
    const [noPeople, setNoPeople] = React.useState("");

    // const navigation= useNavigation(); //uncomment to use navigation

    const pressSend = () => {
        checkInput();
    }
    const [isVisible, setVisible] = React.useState(false);
    const checkInput = () => {
        if (!title.trim() || !description.trim() || !place.trim() || !date.trim() || !noPeople.trim()) {
            alert('Please fill out all fields');
            return;
        }
        //  sendEvent(); //uncomment to send to database
        toggleModal();
    };
    const toggleModal = () => {
        setVisible(!isVisible);
    };
    const sendEvent = () => firebase.firestore().collection('events').add({
        title: title,
        description: description,
        place: place,
        date: date,
        noPeople: noPeople,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    });




    return (
        <SafeAreaView style={styles.main}>
            <ScrollView style={styles.ScrollView} nestedScrollEnabled={true}>
                <Text style={styles.header}> CREATE EVENT </Text>



                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        label='Event title'
                        value={title}
                        onChangeText={title => setTitle(title)}
                        mode='outlined'
                        activeOutlineColor='hotpink'
                        placeholder="Title of your event"
                    />
                    <TextInput
                        label='Event Description'
                        value={description}
                        onChangeText={description => setDescription(description)}
                        mode='outlined'
                        activeOutlineColor='hotpink'
                        placeholder="Describe your event in a few words"
                        maxLength={100}
                    />
                    <TextInput
                        label='Place'
                        value={place}
                        onChangeText={place => setPlace(place)}
                        mode='outlined'
                        activeOutlineColor='hotpink'
                        placeholder="Where does the event take place?"
                    />
                    <TextInput
                        label='Date'
                        value={date}
                        onChangeText={date => setDate(date)}
                        mode='outlined'
                        activeOutlineColor='hotpink'
                        placeholder="When does the event take place?"
                    />
                    <TextInput
                        label='Number of people'
                        value={noPeople}
                        onChangeText={noPeople => setNoPeople(noPeople)}
                        mode='outlined'
                        activeOutlineColor='hotpink'
                        placeholder="How many people are you looking for?"
                        keyboardType={'numeric'}
                        maxLength={2}

                    />

                    <DatePicker
                        backgroundColor="white"

                        minDate='2022-04-01'
                        maxDate='2022-07-01'
                        monthDisplayMode={'en-short'}
                        titleText="Choose a date for the event"
                        cancelText=""
                        rows={5}
                        selectedRowBackgroundColor="#C2E1C2"
                        width={350}

                        confirm={(date) => {
                            console.log(date);
                        }}
                    />

                    <Button style={[styles.button, styles.createEventButton]} title="send" mode="contained" onPress={pressSend}>
                        Create Event
                    </Button>

                    <Modal
                        animationType={"fade"}
                        visible={isVisible}
                        transparent={true}
                    >
                        <View style={styles.centerView}>
                            <View style={styles.modalView}>
                                <Image source={require('../assets/green-checkmark.png')} style={styles.modalLogo} />
                                <Text style={styles.modalText}>You successfully created an event!</Text>

                                <Button
                                    style={[styles.button, styles.modalButton]}
                                    onPress={() => toggleModal()}// navigation.navigate("TimelineScreen")} //comment/uncomment for navigation
                                >
                                    <Text style={styles.buttonText}>
                                        Back To Timeline</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        backgroundColor: colors.backgroundColor,
    },
    ScrollView: {
        flex: 1,
        width: '100%',
    },
    form: {
        flex: 1,
        padding: 10,

    },
    buttonText: {
        color: 'white',
    },
    button: {
        width: 300,
        margin: 10,
    },
    modalButton: {
        backgroundColor: colors.accentColor,
        shadowColor: 'white',
    },
    createEventButton: {
        backgroundColor: colors.accentColor,

    },
    input: {

    },
    centerView: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalLogo: {
        height: 60,
        width: 60,
    },
    modalText: {
        color: 'black',
    }
});

export default CreateEventScreen;