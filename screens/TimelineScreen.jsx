import { StyleSheet,View, Text, TextInput, SafeAreaView, Button } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


function Timeline(props) {
    
    return (
        <SafeAreaView>
            <Text style = {styles.header}>Aktiviteter</Text>
            <View style = {styles.posts}>
                <Text>Title</Text>
                <Text>description</Text>
                <Button title = {'join'} style = {styles.joinbutton}/>
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header:{
        fontSize:30,
        flex: 1,
        maxHeight:50,    
    },
    joinbutton:{
       

    },
    posts:{
        width:300,
        height:100,
        marginTop:5,
        borderWidth: 2,
        borderColor:"black",
    }
});

export default Timeline;