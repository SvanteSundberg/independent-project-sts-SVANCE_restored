import { doc } from '@firebase/firestore';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StyleSheet, ScrollView, ActivityIndicator, View,} from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from '../config/firebase';





getdata();

async function getdata() {
  console.log('hieuhfeuh');
 
  const ref = firebase
        .firestore()
        .collection("users");
      const snapshot = await ref.get();
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        
      });
  
    } 

   


class FetchListScreen extends Component {


    constructor() {
        super();
        this.docs = firebase.firestore().collection('users');
        this.state = {
          isLoading: true,
          users: []
        };
      }
      
     
     
    
      componentDidMount() {
        this.unsubscribe = this.docs.onSnapshot(this.getStudentsData);
      }
    
      componentWillUnmount(){
        this.unsubscribe();
      }
      
    
      getStudentsData = (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((res) => {
          const { FirstName, LastName} = res.data();
          
          users.push({
            key: res.id,
            FirstName,
            LastName
          });
        });
        
        this.setState({
          users,
          isLoading: false
       });
      }
    
    
    
      render() {
        if(this.state.isLoading){
          return(
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="red"/>
            </View>
          )
        }    
        return (
          <ScrollView style={styles.wrapper}>
              {
                this.state.users.map((res, i) => {
                  return (
                    <ListItem 
                       key={i}           
                       bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title>{res.FirstName} </ListItem.Title>
                        <ListItem.Subtitle>{res.LastName}</ListItem.Subtitle>
                      </ListItem.Content>
                      <ListItem.Chevron 
                         color="black" 
                      />
                    </ListItem>
                  );
                })
              }
          </ScrollView>
        );
      }
    }

    const styles = StyleSheet.create({
      wrapper: {
       flex: 1,
       paddingBottom: 22,
       marginTop: 80
      },
      loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',    
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }
    })
  
export default FetchListScreen;