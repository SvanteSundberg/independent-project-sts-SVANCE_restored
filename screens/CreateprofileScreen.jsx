import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {useState} from 'react';
import { TextInput, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
 
function CreateprofileScreen(props) {
   const [name, setName] = useState('');
   const [age, setAge] = useState('');
   const [descrip, setDescrip] = useState('');
   const sports = ["soccer", "padel", "basketball"];
   const [checked, setChecked] = useState(sports.map(() => false));
   const [photo, setPhoto] = useState(null);
 
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
 
   return (
       <SafeAreaView style={styles.container}>
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
               style={styles.header}> Which sports are you interested in? </Text>
 
           {sports.map((sport, index) => (    
           <Checkbox.Item
               uncheckedColor="black"
               color="blue"
               key={sport}
               label={sport}
               status={checked[index] ? 'checked' : 'unchecked'}
 
 
               onPress={() => {
                   let updateChecked = [...checked];
                   updateChecked[index]=!updateChecked[index];
                   setChecked(updateChecked);
               }}
               >
                  
               </Checkbox.Item>
           ))}
           </View>
 
 
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
       height: 60,
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
