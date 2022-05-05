import { StyleSheet,View, Text, Image, TextInput, RefreshControl, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native";
import * as React from 'react';
import { Checkbox,Menu, Divider, } from 'react-native-paper';
import { IconButton, Colors, Button, Chip, Modal, Portal  } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
import Events from "../components/Events";
import SportFilter from "../components/SportFilter";
import { useFocusEffect } from '@react-navigation/native';
import colors from "../config/colors";


 
const Timeline = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation= useNavigation(); 
    const [events, setevents] =React.useState([]);
    const [unfilteredEvents, setUnfilteredevents]= React.useState([]);
    const [selectedSports, setSelectedsports] = React.useState([]);
    const sports = ['football','basket','padel','tennis','handball','bandy','volleyball','run','golf','squash','other'];
    const [showSort, setShowSort]= React.useState(false);
    const [dateSorted, setDateSorted]= React.useState(false);
    const [owners, setOwners]= React.useState([]);
    const [date, setDate] = React.useState(
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    );
    const [dateOpen, setdateOpen] = React.useState(false);
    const [photo, setPhoto] = React.useState(null);
    const [joinedEvents, setJoinedEvents] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh =()=>{ 
      setRefreshing(true);
      fetchEvents();
      fetchJoinedEvents();
      setRefreshing(false);
    } 

    const fetchJoinedEvents = async () => {
      setJoinedEvents([]);
      const db = firebase.firestore();
      const joinedEvents = query(
        collection(db, "user_event"),
        where("userID", "==", user.uid)
      );
      const myEventsnapshot = await getDocs(joinedEvents);
      myEventsnapshot.forEach((event) => {
        setJoinedEvents((events) => [...events, event.data().eventID]);
      });
    };
   
    const fetchEvents = async()=>{
      const db =firebase.firestore();
      const snapshot= query(collection(db,'events'), orderBy("date"));
      const data =await getDocs(snapshot);
      setUnfilteredevents([]);
      setevents([]);
      let myEvents= [];
      data.docs.forEach(item =>{
        if (item.data().owner !== user.uid){
        if(new Date(item.data().date)> new Date()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setUnfilteredevents(events=>([...events, data]));
          setevents(events=>([...events, data]))
          myEvents.push(data);
          }
        else if (new Date(item.data().date).getUTCDate()== new Date().getUTCDate()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setUnfilteredevents(events=>([...events, data]));
          setevents(events=>([...events, data]))
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

    const fetchOwners=async(myEvents)=> {
      setOwners([]);
      const users =firebase.firestore().collection('users');
      myEvents.map(async (event) => {
        const photo=await users.doc(event.owner).get();
        const obj={ownerid:event.owner, photo:photo.get('photo')}
        setOwners(owners=>([...owners, obj]))
      });
    }

    useFocusEffect(
      React.useCallback(() => {
        fetchEvents();
        getUserPhoto();
        fetchJoinedEvents();
      }, [])
    );

     /*React.useEffect(() => {
      fetchEvents();
      getUserPhoto();
      fetchJoinedEvents();
     
    },[]);*/


    const getUserPhoto = async()=> {
      const response =firebase.firestore().collection('users');
      const info =await response.doc(user.uid).get();
      if (info.exists){
          setPhoto(info.get("photo"));
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
          {/*<Image source={{ uri: photo }} style = {styles.userIcon}/>*/}
        </TouchableOpacity>
          <Text style={styles.header}>Aktiviteter</Text>
          <IconButton
        style ={styles.sort}
        icon="filter-variant"
        color={Colors.black}
        size={40}
        onPress={()=>setShowSort(!showSort)}

/></View>
<Portal>
        <Modal visible={showSort} 
              onDismiss={()=>setShowSort(!showSort)}
              contentContainerStyle={styles.modalStyle}>

<SportFilter
 selectedSports={selectedSports} 
 setSelectedsports={setSelectedsports}
 sports={sports}
 events={events} 
 setevents={setevents} 
 originalEvents={unfilteredEvents} 
 userid={user.uid} 
 setDateSorted={setDateSorted}
 dateSorted={dateSorted}
 date={date}
 setMaxDate={setMaxDate}
 setDate={setDate}
 setdateOpen={setdateOpen}
 setShowSort={setShowSort}
 dateOpen={dateOpen}
 showSort={showSort}/>
 
 </Modal></Portal>

        <ScrollView style={styles.scroller} refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                } >
      <Events events={events} setevents={setevents} owners={owners} joinedEvents={joinedEvents} setJoinedEvents={setJoinedEvents}/>
     
       
    </ScrollView>
    <SafeAreaView style ={styles.createEvent}>
     
    <IconButton
  icon="pencil-circle"
  color={colors.orange}
  size={85}
  onPress={() => navigation.navigate("CreateEventScreen")}
  style = {{shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  top:10,
  elevation: 5,}}
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

  modalStyle:{
    backgroundColor:'white',
    padding:30,
    borderRadius:20
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
      bottom: 22, 
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
      borderColor: colors.orange
  },

});
 
export default Timeline;
 
 
 
 




