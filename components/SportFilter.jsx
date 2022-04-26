import React from "react";
import { View, Text, StyleSheet} from "react-native";
import {Chip, Button } from "react-native-paper";
import firebase from '../config/firebase';
 
const SportFilter = (props) => {            

    const [selectedSports, setSelectedsports] = React.useState([]);
    const getUserInfo = async()=> {
        const response =firebase.firestore().collection('users');
        const info =await response.doc(props.userid).get();
        setSelectedsports(info.get("sports"));
        filteredBysport(info.get("sports"));
      };
      
      React.useEffect(() => {
        getUserInfo();
    }, []);

    const clearFilters=()=>{
        setSelectedsports([]);
        props.setevents([]);
        props.setevents([...props.originalEvents])
    }

    const filteredBysport=(sports)=>{
        if(sports.length==0){
            clearFilters();
        }
        else{
        const filteredEvents=[];
        props.originalEvents.map((event)=>{
         if(sports.includes(event.sport)){
             filteredEvents.push(event);
         }
        })
        props.setevents([]);
        props.setevents([...filteredEvents]);
    }}

  return (
    
      <View>
        <View >
            <View style={styles.sportoptions}>
          {props.sports.map((sport) => {
            return (
              <Chip
               mode='outlined'
                key={sport}
                selected= {selectedSports.includes(sport)}
                selectedColor='#0081CF'
                onPress={() => {
                    let updateSports = [...selectedSports]
                   const sportIndex = updateSports.indexOf(sport);
                   if (sportIndex > -1){
                       updateSports.splice(sportIndex, 1);
                   }
                   else {
                       updateSports.push(sport)
                   }
                   setSelectedsports(updateSports);
                    filteredBysport(updateSports)}}
              >
                <Text> {sport} </Text>
              </Chip>
            );
          })}
          
          </View>

        <Button onPress={clearFilters} color='#DEA01E'>
          Clear all filters
        </Button>
        </View>
      </View>
    
  );
};

const styles = StyleSheet.create({
    sportoptions:{
      flexDirection:'row',
      flexWrap:'wrap'
    },
    
})
 
export default SportFilter;