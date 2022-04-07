import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import  StartScreen from './screens/StartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import CreateEventScreen from "./screens/CreateEventScreen.jsx";
import TimelineScreen from "./screens/TimelineScreen.jsx";

const {Navigator, Screen}= createNativeStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator  initialRouteName="StartScreen" >
        
            <Screen name="StartScreen" 
                    component={StartScreen} 
                    options={{headerShown: false}}>
            </Screen>

            <Screen name="LoginScreen" 
                    component={LoginScreen} 
                    options={{
                    title:"Sign in", }}>
            </Screen>

            <Screen name="TimelineScreen"
                component={TimelineScreen}>
            </Screen>

            <Screen name="CreateEventScreen"
                component={CreateEventScreen}>
            </Screen>
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator;

