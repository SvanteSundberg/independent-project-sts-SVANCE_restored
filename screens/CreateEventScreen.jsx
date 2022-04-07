import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { TextInput, Button, Modal, Portal, Provider } from "react-native-paper";
import React from 'react';
import colors from '../config/colors.js';
import firebase from '../config/firebase';
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";


function CreateEventScreen(props) {

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [place, setPlace] = React.useState("");
    const [date, setDate] = React.useState("");
    const [noPeople, setNoPeople] = React.useState("");

    const pressSend = () => {
       /*  sendEvent(); */
        /* showModal(); */
    }

    /* const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, height: 300 }
 */
    const sendEvent = () => firebase.firestore().collection('events').add({
        title: title,
        description: description,
        place: place,
        date: date,
        noPeople: noPeople,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    })




    return (
        <SafeAreaView style={styles.main}>
            <ScrollView style={styles.ScrollView}>
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

                    <Button style={[styles.button, styles.createEventButton]} title="send" mode="contained" onPress={pressSend}>
                        Create Event
                    </Button>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        backgroundColor: colors.backgroundColor,
    },
    form: {
        padding: 10,

    },
    button: {
        width: 300,
        margin: 10,
    },
    createEventButton: {
        backgroundColor: colors.accentColor,

    },
    input: {

    }
});

export default CreateEventScreen;