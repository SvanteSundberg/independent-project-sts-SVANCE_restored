import { StyleSheet,View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native";
import * as React from 'react';
import { Checkbox,Menu, Divider, } from 'react-native-paper';
import { IconButton, Colors, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../config/firebase';
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, where, orderBy} from "firebase/firestore";
import Events from "../components/Events";

import { DatePicker } from "react-native-common-date-picker";
import colors from "../config/colors.js";
import SportFilter from "../components/SportFilter";



 
const Timeline = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigation= useNavigation(); 
   
    const [events, setevents] =React.useState([]);
    const [unfilteredEvents, setUnfilteredevents]= React.useState([]);
    const sports = ['football','basket','padel','tennis','handball','bandy','volleyball','run','golf','squash','other'];
    const [Mysports, chooseSports] = React.useState([]);
    const [Mydates, choosedates] = React.useState([]);
    const [showSort, setShowSort]= React.useState(false);
    const [showSportSort, setShowSportSort]= React.useState(false);
    const [myEvents, setMyevents]= React.useState([]);
    const [owners, setOwners]= React.useState([]);
    const [date, setDate] = React.useState(
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
    );
    const [dateOpen, setdateOpen] = React.useState(false);
    const [isFilteredBydate, setIsfilteredBydate]= React.useState(false);
    const [filteredDatearray, setFiltereddatearray]= React.useState([]);
   
    const fetchEvents = async()=>{
      const db =firebase.firestore();
      const snapshot= query(collection(db,'events'), orderBy("date"));
      const data =await getDocs(snapshot);
      setUnfilteredevents([]);
      let myEvents= [];
      data.docs.forEach(item =>{
        if(new Date(item.data().date)> new Date()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setUnfilteredevents(events=>([...events, data]));
          myEvents.push(data);
          }
        else if (new Date(item.data().date).getUTCDate()== new Date().getUTCDate()){
          let data = item.data();
          let id = {eventID: item.id}
          Object.assign(data, id);
          setUnfilteredevents(events=>([...events, data]));
          myEvents.push(data);
        }
          //if(new Date(item.data().date)< new Date()){
          // deleteExpDate(item.data());
          //  }

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
        const name=await users.doc(event.owner).get();
        const obj={ownerid:event.owner, name:name.get('name')}
        setOwners(owners=>([...owners, obj]))
      });
    }

     React.useEffect(() => {
      fetchEvents();
     
    },[]);

const filterBydate=(date)=>{
  setDate(date);
  setdateOpen(false);
  setFiltereddatearray([]);
  for (let event of events) {
    
    if (event.date === date) {
      setFiltereddatearray(filteredDatearray=>[...filteredDatearray, event])
    }
  }
  setIsfilteredBydate(true);
}  



const deleteExpDate=async (element)=>{
  await firebase.firestore().collection('events').doc(element.eventID).delete();
}
 
    return (<SafeAreaView style={styles.main}>
      

        <View style={{flexDirection:"row", justifyContent: "center", height:40}} >
        <IconButton
        style ={styles.profile}
        icon="account-circle"
        color={Colors.black}
        size={40}
        onPress={() => navigation.navigate("ProfileScreen", {userID: user.uid}
        )}
/>
          <Text style={styles.header}>Aktiviteter</Text>
          <IconButton
        style ={styles.sort}
        icon="filter-variant"
        color={Colors.black}
        size={40}
        onPress={()=>setShowSort(!showSort)}
/></View>
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


 <Button onPress={()=>setdateOpen(!dateOpen)}>sortera med dag</Button>
 {isFilteredBydate && <Button onPress={()=>setIsfilteredBydate(false)}> Clear filters </Button>}
 <SportFilter sports={sports} events={events} setevents={setevents} originalEvents={unfilteredEvents} userid={user.uid}/>
 
 {dateOpen && <DatePicker
                    backgroundColor="white"
                    minDate={new Date()}
                    maxDate={setMaxDate(3)}
                    monthDisplayMode={"en-short"}
                    cancelText=""
                    rows={5}
                    width={350}
                    toolBarPosition="bottom"
                    toolBarStyle={{ width: "100%", justifyContent: "flex-end" }}
                    toolBarConfirmStyle={{ color: colors.blue }}
                    confirmText="OK"
                    confirm={(date) => filterBydate(date)}
                  />
 }
 
</View> }

        
        <ScrollView style={styles.scroller} >
      {!isFilteredBydate &&   <Events events={events} setevents={setevents} owners={owners}/>}
      {isFilteredBydate &&   <Events events={filteredDatearray} setevents={setevents} owners={owners}/>}
       
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
      left: 10,
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
    }
});
 
export default Timeline;
 
 
 
 




