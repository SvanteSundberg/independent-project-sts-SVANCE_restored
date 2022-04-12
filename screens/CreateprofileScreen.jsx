import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import {useState, useEffect} from 'react';
import { TextInput, Checkbox, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut } from "firebase/auth";
import firebase from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
 
function CreateprofileScreen(props) {
   const [name, setName] = useState('');
   const [age, setAge] = useState('');
   const [descrip, setDescrip] = useState('');
   const sports = ["soccer", "padel", "basketball"];
   const [photo, setPhoto] = useState(null);
   const [selectedSports, chooseSports] = useState([]);
   const navigation= useNavigation();

   const auth = getAuth();
   const user = auth.currentUser;

   useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async()=> {
        const response =firebase.firestore().collection('users');
        const info =await response.doc(user.uid).get();
        if (info.exists){
            setName(info.get("name"));
            setAge(info.get("age"));
            setDescrip(info.get("bio"));
            chooseSports(info.get("sports"));
            setPhoto(info.get("photo"));
        }
        else {
        }
      };

   const updateUserInfo = () => {
        firebase.firestore().collection('users').doc(user.uid).set({
            name: name,
            age: age,
            bio: descrip,
            sports: selectedSports,
            photo: photo
            });
        getUserInfo();
    }


   const pickImage = async () => {
       let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
       });
  
       if (!result.cancelled) {
         setPhoto(result.uri);
       }
     };

     const handleSignOut = async() => {
        signOut(auth).then(() => {
            navigation.navigate("StartScreen")

          }).catch((error) => {
            console.log("Sign-out not successful");
          });

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
           {photo && <Image source={{ uri: photo }} style = {styles.userIcon} />}
           {!photo && <Image source={require("../assets/icon-user.png")} style = {styles.userIcon}/>}
 
           <Text> Upload image</Text>
           <Button onPress={handleSignOut}> Sign out</Button>
           <Button> Edit Profile
           
           </Button>
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

           <Button
              onPress={updateUserInfo} > Save Information </Button> 
           </ScrollView>
 
 
       </SafeAreaView>
   );
}
const styles = StyleSheet.create({
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
