import { StyleSheet,View, Text, Image, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native";
import * as React from 'react';
import { Checkbox,Menu, Divider, } from 'react-native-paper';
import { IconButton, Colors, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
import Events from "../components/Events";



 
const Timeline = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation= useNavigation(); 
   
    const [events, setevents] =React.useState([]);
    const sports = ["soccer", "padel", "basketball"];
    const [Mysports, chooseSports] = React.useState([]);
    const [Mydates, choosedates] = React.useState([]);
    const [showSort, setShowSort]= React.useState(false);
    const [showSportSort, setShowSportSort]= React.useState(false);
    const [myEvents, setMyevents]= React.useState([]);
    const [owners, setOwners]= React.useState([]);
    const [photo, setPhoto] = React.useState(null);
   
    const fetchEvents = async()=>{
      const db =firebase.firestore();
      const snapshot= query(collection(db,'events'), orderBy("date"));
      const data =await getDocs(snapshot);
      setevents([]);
      let myEvents= [];
      data.docs.forEach(item =>{

        if (item.data().owner !== user.uid){
        if(new Date(item.data().date)> new Date()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setevents(events=>([...events, data]));
          myEvents.push(data);
          }
        else if (new Date(item.data().date).getUTCDate()== new Date().getUTCDate()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setevents(events=>([...events, data]));
          myEvents.push(data);
        }
          //if(new Date(item.data().date)< new Date()){
          // deleteExpDate(item.data());
          //  }

        }
      });
    
      fetchOwners(myEvents);
      
      /*events.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      });*/
    };

    const fetchOwners=async(myEvents)=> {
      setOwners([]);
      const users =firebase.firestore().collection('users');
      myEvents.map(async (event) => {
        const name=await users.doc(event.owner).get();
        const obj={ownerid:event.owner, name:name.get('name')}
        setOwners(owners=>([...owners, obj]))
      });
    }

     React.useEffect(() => {
      fetchEvents();
      getUserPhoto();
     
    },[]);

    const getUserPhoto = async()=> {
      const response =firebase.firestore().collection('users');
      const info =await response.doc(user.uid).get();
      if (info.exists){
          setPhoto(info.get("photo"));
          console.log(info.get("photo"), "thaba");
      }
    };
     

const deleteExpDate=async (element)=>{
  await firebase.firestore().collection('events').doc(element.eventID).delete();
}
 
    return (<SafeAreaView style={styles.main}>
      

        <View style={styles.head} >
        <TouchableOpacity style={styles.profile}
        onPress={() => navigation.navigate("ProfileScreen", {userID: user.uid}
        )}>
          <Image source={{ uri: photo }} style = {styles.userIcon}/>
        </TouchableOpacity>
          <Text style={styles.header}>Aktiviteter</Text>
          <IconButton
        style ={styles.sort}
        icon="filter-variant"
        color={Colors.black}
        size={40}
        onPress={()=>setShowSort(!showSort)}
        label="Filter"/>

</View>
{showSort&& <View><Button  onPress={()=>setShowSportSort(!showSportSort)}>sortera med sport</Button>
{showSportSort&& <View>{sports.map((element)=>(
         
         <Checkbox.Item
              uncheckedColor="black"
              color="blue"
              label={element}
              status={Mysports.includes(element) ? 'checked' : 'unchecked'}
              onPress={() => {
                let updateSports = [...Mysports]
               const sportIndex = updateSports.indexOf(element);
               if (sportIndex > -1){
                   updateSports.splice(sportIndex, 1);
               }
               else {
                   updateSports.push(element)
               }
               chooseSports(updateSports);}}
              >
                
              </Checkbox.Item>
        
       ))
         }
         </View> }

<Button>sortera med dag</Button>

</View> }

        
        <ScrollView style={styles.scroller} >
         <Events events={events} setevents={setevents} owners={owners}/>
       
    </ScrollView>
    <SafeAreaView style ={styles.createEvent}>
     
    <IconButton
  icon="pencil-circle"
  color={Colors.black}
  size={80}
  onPress={() => navigation.navigate("CreateEventScreen")}
/>
 
  </SafeAreaView>
  </SafeAreaView>


    );
  }
 
 
 
 
 
const styles = StyleSheet.create({
  main:{
    flex:1,
  },

  postContainer:{
      marginTop:10,
  },

  head: {
    flexDirection:"row", 
    justifyContent: "center", 
    backgroundColor: 'white',
    height:'13%',
    borderBottomWidth :0.5,
    borderBottomColor: 'lightgrey',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 9,
  },
 
    header:{
      alignSelf: 'center',
      fontWeight: "bold",
      fontSize: 25,
    },
    
    scroller:{
      alignSelf:'center',
      flex:1,
    },

    postHeader:{
      backgroundColor:'#007EA7',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderWidth:1,
      justifyContent:'space-between',
      alignItems:'center',
      flexDirection:'row',
      
    },
    
    profile:{
      alignSelf:'center',
      position: "absolute",
      left: 15,
      top:14,
      width: 30,
      height: 30
    },
    sort:{
      alignSelf:'center',
      position: "absolute",
      right: 10,
    },

    createEvent:{
      bottom: 40, 
      right:-5, 
      position: 'absolute'
    },
   
    posts:{
      flex:1,
      width: Dimensions.get('window').width -10,
      height:200,
      borderWidth: 0.5,
      borderRadius: 10,
        //borderColor:"black",
        //backgroundColor:"#D6EAF8",
    },
    userIcon: {
      borderRadius: 200 / 2, 
      borderWidth: 1,
      width: 48,
      height: 48,
      borderColor: 'black'
  },

});
 
export default Timeline;
 
 
 
 




