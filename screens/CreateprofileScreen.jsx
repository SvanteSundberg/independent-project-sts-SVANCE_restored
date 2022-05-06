import { KeyboardAvoidingView, SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from "react-native";
import {useState } from 'react';
import { TextInput, Checkbox, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import colors from "../config/colors";
import Warning from "../components/Warning";

 
function CreateprofileScreen({navigation, route}) {
   const [name, setName] = useState(route.params.name);
   const [age, setAge] = useState(route.params.age);
   const [descrip, setDescrip] = useState(route.params.bio);
   const sports = ["football", "padel", "basketball", "tennis", "handball", "floorball", "volleyball", "run", "golf", "squash"];
   const [photo, setPhoto] = useState(route.params.photo);
   const [remove, setRemove] = useState(false);
   const [selectedSports, chooseSports] = useState(route.params.selectedSports);
   const [uploading, setUploading] = useState(false);
   const [visable, setVisable] = useState(false);
   

   const handleBackwards = () =>  navigation.navigate("HomeScreen")

   const auth = getAuth();
   const user = auth.currentUser;

   const changeVisable = (value) => {
    setVisable(value);
  }

   const updateUserInfo = () => {
       if (name.length>0 && age>0 && descrip.length>0 &&
        typeof photo !== "undefined"){
        console.log(photo);
        firebase.firestore().collection('users').doc(user.uid).set({
           name: name,
            age: age,
            bio: descrip,
           sports: selectedSports,
            photo: photo
            });
            if (typeof route.params.first !== "undefined"){
                navigation.navigate("ProfileScreen",
                {userID:user.uid});
            }
            else{
                changeVisable(true);
                navigation.navigate("Homescreen");
            }
       }
       else {
        Alert.alert(
            "Failed to save",
            "You need to fill in all the fields before saving!",
              { text: "OK" }
            
          );
    }
}


   const pickImage = async () => {
       if (!uploading){
       let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
       });
  
       try {
        if (!result.cancelled) {
            if (typeof photo !==undefined){
                setRemove(true);
            }
            setUploading(true);
            const uploadUrl = await uploadImageAsync(result.uri);
        }
        
        } catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } 
        }
        };
        

     async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        
        const fileRef = ref(getStorage(), user.uid);

        if (remove){
            deleteObject(fileRef).then(() => {
                // File deleted successfully
              }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
              });
        }

        const result = await uploadBytes(fileRef, blob);
        blob.close();


        const url = await getDownloadURL(fileRef);
        setPhoto(url);
        setUploading(false);

        /*const unique = uuid.v4();
        const fileRef = ref(getStorage(), user.uid);
        const result = await uploadBytes(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
      
        const url = await getDownloadURL(fileRef);
        setPhoto(url);
        setUploading(false);
        if (remove) {
            deleteObject(fileRef).then(() => {
                // File deleted successfully
              }).catch((error) => {
                // Uh-oh, an error occurred!
              });
        }*/

        /*if (remove){
            deleteObject(fileRef).then(() => {
                // File deleted successfully
              }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
              });
        }*/
      }


 
   return (
       <SafeAreaView style={[styles.container, styles.background]}>
           <ScrollView style={styles.scroll}>

           <Button
       style={styles.backButton}
       onPress={handleBackwards}
      icon='keyboard-backspace'
       labelStyle={{fontSize: 35,
        color: colors.lightBlue}}>
        </Button>
 
           <Text style={[styles.header, {marginTop:30}]}>
            FILL IN YOUR DETAILS
           </Text>
 
           <KeyboardAvoidingView>
           <TouchableOpacity onPress={pickImage}>
         {!uploading && <View>
           {photo && <Image source={{ uri: photo }} style = {styles.userIcon} />}
           {!photo && <Image source={require("../assets/icon-user.png")} style = {styles.userIcon}/>}
           </View>
        }
            {uploading && <Image source={require("../assets/waiting.png")} style = {[styles.waiting]}/> } 
           {!uploading && <Text style={styles.uploading}> Upload image</Text>}
           {uploading && <Text style={styles.uploading}> Uploading image...</Text>}

           </TouchableOpacity>
 
 
           <TextInput
               label= "Name"
               mode="outlined"
               activeOutlineColor={colors.orange}
               placeholder="What is your name?"
               value={name}
               onChangeText={name => setName(name)}
               style={styles.text}
               >
           </TextInput>
 
           <TextInput
               label= "Age"
               mode="outlined"
               activeOutlineColor={colors.orange}
               placeholder="How old are you?"
               value={age}
               keyboardType={"numeric"}
               onChangeText={age => setAge(age)}
               style={styles.text}
               >
            </TextInput>      
 
           <TextInput
               multiline
               label= "Short description"
               mode="outlined"
               maxLength={150}
               activeOutlineColor={colors.orange}
               placeholder="Tell us about yourself"
               value={descrip}
               onChangeText={text => setDescrip(text)}
               style={[styles.text, styles.textBigger]}
               >       
           </TextInput>
 
            <Text
               style={styles.header}> My favorite sports </Text> 
           
        <View style={styles.sportsContainer}> 
           {sports.map((sport) => (    
           <Checkbox.Item
               uncheckedColor="black"
               color={colors.orange}
               key={sport}
               label={sport}
               status={selectedSports.includes(sport) ? 'checked' : 'unchecked'}
               labelStyle={{width: '25%', color: colors.lightBlue}}
               style={styles.checkbox}
 
 
               onPress={() => {
                   let updateSports = [...selectedSports]
                   const sportIndex = updateSports.indexOf(sport);
                   if (sportIndex > -1){
                       updateSports.splice(sportIndex, 1);
                   }
                   else {
                       updateSports.push(sport)
                   }
                   chooseSports(updateSports);
               }}
               />
                  
           ))}
           </View>
           </KeyboardAvoidingView>

           <Warning visable={visable} changeVisable={changeVisable}/>

        <View style={styles.flexContainer}>
            <Button
              onPress={updateUserInfo} 
              mode={'outlined'}
              style={styles.button}
              color={'dodgerblue'}> Save Information </Button>
        </View>
           </ScrollView>
 
 
       </SafeAreaView>
   );
}
const styles = StyleSheet.create({
    button: {
        width: 300,
        height: 50,
        alignSelf: 'center',
        padding:5,
        backgroundColor: colors.orange,
        margin:5,
        marginBottom:20,
        justifyContent: "center"
    },
    background: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.deepBlue,
        margin: 5,
        paddingTop:20,
        borderRadius: 15,
    },
   container: {
       paddingBottom: 25
   },
   checkbox: {
    borderWidth:1, 
    borderColor: colors.mediumBlue, 
    borderRadius: 15, 
    margin:10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.6,
    shadowRadius: 4,
   },
   uploading:{
       alignSelf: "center",
       color: colors.lightBlue
   },

   backButton: {
    width:20,
    height: 35,
    top:20,
    left: 10
},
   header: {
       margin:10,
       fontSize:16,
       fontWeight: 'bold',
       alignSelf: 'center',
       color: colors.mediumBlue
   },
   logga:{
       width: 300,
       height: 70,
       marginTop:20,
       marginBottom:10,
       alignSelf: 'center',
   },
   flexContainer: {
        flex: 1,
        alignSelf: 'center',
   },
   userIcon: {
       borderRadius: 200 / 2, 
       borderWidth: 2,
       borderColor: colors.lightBlue,
       margin:10,
       width: 130,
       height: 130,
       alignSelf: 'center',
   },
   text: {
       height: 50,
       margin: 7,
       marginLeft: 13,
       marginRight: 13,
       shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
   },
   textBigger: {
       height:100,
   },
   sportsContainer: {
    flexDirection:"row", 
    flexWrap:"wrap", 
    justifyContent:"center",
    marginBottom: 10,
   },
   scroll: {
       width:'100%',
       height:'100%'
   },
   waiting: {
       margin:10,
       width: 30,
       height: 30,
       alignSelf: 'center',
   }, 
   upload: {
       width: 50,
       height: 50,
       alignSelf: 'center',
       backgroundColor: 'white',
       borderRadius: 200 / 2, 
       borderColor: 'white',
       marginBottom: 5
   }


 
})
 
export default CreateprofileScreen;