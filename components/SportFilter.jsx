import React from "react";
import { View, Text, StyleSheet} from "react-native";
import {Chip, Button, IconButton } from "react-native-paper";
import firebase from '../config/firebase';
import { DatePicker } from "react-native-common-date-picker";
import colors from "../config/colors.js";
 
const SportFilter = (props) => {            

    const clearFilters=()=>{
        props.setSelectedsports([]);
        props.setevents([]);
        props.setevents([...props.originalEvents]);
        props.setDateSorted(false);
        props.setShowSort(false)
    }

    const filterBydate=(date,events)=>{
        props.setDate(date);
        props.setDateSorted(true);
        let list= []
        for (let event of events) {
          if (event.date === date) {
            list.push(event);
          }
        }
        props.setevents([]);
        props.setevents([...list]);
      } 

    const filteredBysport=(sports)=>{
        let filteredEvents=[];
            if(sports.length>0){
            props.originalEvents.map((event)=>{
                if(sports.includes(event.sport)){
                filteredEvents.push(event);
            }
             })
            }
            else{
                filteredEvents=props.originalEvents
            }            

        if(props.dateSorted){     
            filterBydate(props.date, filteredEvents)
        }
        else{
        props.setevents([]);
        props.setevents([...filteredEvents]);
        } 
    }

    const applyFilter=(sports)=>{
        filteredBysport(sports);
        props.setShowSort(false)
    }


  return (
    
      <View style={styles.container}>
          <Text style={styles.header}> Date </Text>
          <View style={{flexDirection:'row', marginBottom:10, alignItems:'center'}}>
          <IconButton  icon="calendar" color='#0081CF' onPress={()=>props.setdateOpen(!props.dateOpen)}  ></IconButton>
          
          {props.dateSorted && <Text >{props.date}</Text>}
        {!props.dateSorted && <Text >No selected date </Text>}
        </View>
        
        {props.dateOpen && <DatePicker
                    backgroundColor="white"
                    minDate={new Date()}
                    maxDate={props.setMaxDate(3)}
                    monthDisplayMode={"en-short"}
                    cancelText=""
                    rows={5}
                    selectedRowBackgroundColor={colors.mediumBlue}
                    width={350}
                    toolBarPosition="bottom"
                    toolBarStyle={{ width: "100%", justifyContent: "flex-end" }}
                    toolBarConfirmStyle={{ color: colors.deepBlue }}
                    confirmText="OK"
                    confirm={(date)=>{props.setDate(date);
                                      props.setDateSorted(true);
                                      props.setdateOpen(!props.dateOpen)}}
                  />}
                  

        <View >
        <Text style={styles.header}> Sports </Text>
        <View style={styles.sportoptions}>
                
          {props.sports.map((sport) => {
            return (
              <Chip
              style={{marginRight:2}}
               mode='outlined'
                key={sport}
                selected= {props.selectedSports.includes(sport)}
                selectedColor='#0081CF'
                onPress={() => {
                    let updateSports = [...props.selectedSports]
                   const sportIndex = updateSports.indexOf(sport);
                   if (sportIndex > -1){
                       updateSports.splice(sportIndex, 1);
                   }
                   else {
                       updateSports.push(sport)
                   }
                   props.setSelectedsports(updateSports);
                   }}
              >
                <Text> {sport} </Text>
              </Chip>
            );
          })}
          
          </View>
        <View style={styles.Btns}>
        <Button onPress={clearFilters} 
                color='#DEA01E'
                style={styles.clearBtn}
                mode='outlined'>
          Clear filters
        </Button>
        <Button onPress={()=>applyFilter(props.selectedSports)} 
                color='#DEA01E'
                style={styles.clearBtn}
                mode='contained'
                labelStyle={{color:'white'}}>
          Apply filters
        </Button>
        </View>
        </View>
      </View>
      
  );
};


const styles = StyleSheet.create({
    sportoptions:{
      flexDirection:'row',
      flexWrap:'wrap',
      paddingBottom:10,
      borderBottomColor:'#DEA01E',
        borderBottomWidth:1
    },

    container:{
        margin:10,
        marginTop:20
        
    },

    clearBtn:{
        margin:10,
       
    },

    header:{
        flexDirection:'row',
        alignItems:'flex-start',
        borderBottomColor:'#DEA01E',
        borderBottomWidth:1,
        marginBottom:10
    },

    Btns:{
        flexDirection:'row',
    }
    
})
 
export default SportFilter;