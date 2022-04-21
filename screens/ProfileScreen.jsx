import { SafeAreaView, View, Image, ScrollView, StyleSheet } from "react-native";
import {useState, useEffect} from 'react';
import { Button, Text } from 'react-native-paper';
import { getAuth} from "firebase/auth";
import firebase from '../config/firebase';
import { useIsFocused } from '@react-navigation/native';
import MyEvents from "../components/MyEvents";
import DownMenu from "../components/DownMenu";

function ProfileScreen({navigation, route}) {
   const [name, setName] = useState('');
   const [age, setAge] = useState('');
   const [descrip, setDescrip] = useState('');
   const [photo, setPhoto] = useState(null);
   const [selectedSports, chooseSports] = useState([]);

   const auth = getAuth();
   const user = auth.currentUser;
   const isFocused = useIsFocused();
   const [userID, setUserID] = useState(route.params.userID);
   const ownUser = (route.params.userID==user.uid);

   const changeUser = (userID) => {
        setUserID(userID);
   }

    /*useEffect(() => {
        getUserInfo();
    }, [isFocused, userID]);*/

    const getUserInfo = async()=> {
        console.log("nu hämtar jag info!");
        const response =firebase.firestore().collection('users');
        const info =await response.doc(userID).get();
        if (info.exists){
            setName(info.get("name"));
            setAge(info.get("age"));
            setDescrip(info.get("bio"));
            chooseSports(info.get("sports"));
            setPhoto(info.get("photo"));
        }
        else {
            navigation.navigate("CreateprofileScreen", {
                name: name,
                age: age,
                bio: descrip,
                photo: photo,
                selectedSports: selectedSports
              })
        }
      };

     const goToEdit = () => {
        navigation.navigate("CreateprofileScreen", {
                name: name,
                age: age,
                bio: descrip,
                photo: photo,
                selectedSports: selectedSports,
              })
     }

     /*{ownUser && <View style={styles.buttons}>
                <Button 
                mode={'outlined'}
                style={styles.button}
                onPress={goToEdit}
                color={'dodgerblue'}> Edit profile </Button>
                <Button 
                mode={'outlined'}
                style={styles.button}
                onPress={handleSignOut}
                color={'dodgerblue'}> Sign out</Button>
            </View>}*/

    return (
        <SafeAreaView>
        <ScrollView>

        <View style={[styles.container, styles.userContainer]}>

            {ownUser &&  <DownMenu  style={styles.menu} goToEdit={goToEdit}/>} 

            {photo && <Image source={{ uri: photo }} style = {styles.userIcon} />}
            {!photo && <Image source={require("../assets/icon-user.png")} style = {styles.userIcon}/>}

            <Text style={styles.header}> {name} </Text>
            <Text style={styles.age}> {age} years old</Text>

            </View>

            <View style={[styles.container, styles.userInfoContainer]}> 
                <Text style={styles.bio}> {descrip} </Text>
                <Text style={styles.header}> Favorite Sports</Text>
                <View style={[styles.sports]}>
                {selectedSports.map((sport) => (
                    sport=='padel' ? (<Image 
                        style = {styles.sportImage}
                        key={sport}
                        source={require("../assets/padel.png")}/>) 
                    
                    : 
                    
                    <Button 
                    labelStyle={{fontSize: 30,
                    color:'black'}}
                    style={styles.icons}
                    key={sport}
                    icon={sport}/>

                ))
                    
                }
                </View>

            </View>

            <MyEvents navigation={navigation} name={name} theUser ={userID} changeUser={changeUser} />

                </ScrollView> 
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    age: {
        fontStyle: 'italic',
    },
    
    bio: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "black",
        padding: 15,
        width: '70%',
        marginBottom: 10,
    },
    button: {
        width: 200,
        alignSelf: 'center',
        margin:7
    },
    buttons:{
        flex: 1,
    },
    container: {
        alignItems: 'center',
        justifyContent:'center'
    },
    header: {
        margin:10,
        fontSize:16,
        fontWeight: 'bold',
    },

    logga:{
        width: 300,
        height: 70,
        marginTop:20,
        marginBottom:10,
    },
    menu: {
        position: "absolute",
        right:-20,
        top:0,
    },
    userIcon: {
        borderRadius: 200 / 2, 
        borderWidth: 1,
        borderColor: "black",
        margin:10,
        marginTop:30,
        width: 130,
        height: 130,
        zIndex: 0,
    },
    userContainer: {
        backgroundColor: 'indianred',
        paddingBottom:15,
    },
    userInfoContainer: {
        marginTop: 10,
    },
    sports: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop:5,
    },
    sportImage: {
        width: 40,
        height: 40,
    },
    size: {
        backgroundColor: 'green',
        zIndex: 100,
    }
  
 })

export default ProfileScreen;