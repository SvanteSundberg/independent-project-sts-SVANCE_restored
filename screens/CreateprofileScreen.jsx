import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from "react-native";
import {useState } from 'react';
import { TextInput, Checkbox, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import firebase from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
 
function CreateprofileScreen({navigation, route}) {
   const [name, setName] = useState(route.params.name);
   const [age, setAge] = useState(route.params.age);
   const [descrip, setDescrip] = useState(route.params.bio);
   const sports = ["football", "padel", "basketball", "tennis", "handball", "floorball", "volleyball", "run", "golf", "squash"];
   const [photo, setPhoto] = useState(route.params.photo);
   const [remove, setRemove] = useState(false);
   const [selectedSports, chooseSports] = useState(route.params.selectedSports);
   const [uploading, setUploading] = useState(false);

   const auth = getAuth();
   const user = auth.currentUser;

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
        navigation.navigate("ProfileScreen",
        {userID:user.uid});
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
       <SafeAreaView style={styles.container}>
           <ScrollView style={styles.scroll}>
           <Image
               source={require("../assets/sportaLogo.png")}
               style={styles.logga}/>
 
           <Text style={styles.header}>
            FILL IN YOUR DETAILS
           </Text>
 
           <TouchableOpacity onPress={pickImage} style={styles.container}>
         {!uploading && <View>
           {photo && <Image source={{ uri: photo }} style = {styles.userIcon} />}
           {!photo && <Image source={require("../assets/icon-user.png")} style = {styles.userIcon}/>}
           </View>
        }

           {uploading && <Image source={require("../assets/waiting.png")} style = {styles.userIcon}/>}
           <Text> Upload image</Text>

           </TouchableOpacity>
 
 
           <View>
           <TextInput
               label= "Name"
               mode="outlined"
               activeOutlineColor="hotpink"
               placeholder="What is your name?"
               value={name}
               onChangeText={name => setName(name)}
               style={styles.text}
               >
           </TextInput>
 
           <TextInput
               label= "Age"
               mode="outlined"
               activeOutlineColor="hotpink"
               placeholder="How old are you?"
               value={age}
               onChangeText={age => setAge(age)}
               style={styles.text}
               >
            </TextInput>      
 
           <TextInput
               multiline
               label= "Short description"
               mode="outlined"
               activeOutlineColor="hotpink"
               placeholder="Tell us about yourself"
               value={descrip}
               onChangeText={text => setDescrip(text)}
               style={[styles.text, styles.textBigger]}
               >       
           </TextInput>
 
            <Text
               style={styles.header}> My favorite sports </Text> 
           
 
           {sports.map((sport) => (    
           <Checkbox.Item
               uncheckedColor="black"
               color="blue"
               key={sport}
               label={sport}
               status={selectedSports.includes(sport) ? 'checked' : 'unchecked'}
 
 
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
               >
                  
               </Checkbox.Item>
           ))}
           </View>

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
        width: 200,
        alignSelf: 'center',
        margin:7
    },
   container: {
       alignItems: 'center',
   },
   header: {
       margin:10,
       fontSize:16,
       fontWeight: 'bold'
   },
   logga:{
       width: 300,
       height: 70,
       marginTop:20,
       marginBottom:10,
   },
   flexContainer: {
        flex: 1,
   },
   userIcon: {
       borderRadius: 200 / 2, 
       borderWidth: 1,
       borderColor: "black",
       margin:10,
       width: 130,
       height: 130
   },
   scroll:{
   },
   text: {
       height: 45,
       width: 220,
       margin:10,
   },
   textBigger: {
       height:60,
   },
 
})
 
export default CreateprofileScreen;