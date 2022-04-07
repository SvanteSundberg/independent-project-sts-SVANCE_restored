import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import  StartScreen from './screens/StartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import nyStart from './screens/nyStart.jsx'
import ResetPassword from './screens/ResetPassword.jsx'
const {Navigator, Screen}= createNativeStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Navigator  initialRouteName="nyStart" >
            <Screen name="nyStart" 
                    component={nyStart} 
                    options={{headerShown: false}}>
            </Screen>
            
            <Screen name="RegisterScreen" 
                    component={RegisterScreen} 
                    options={{
                    title:"Register", }}>
            </Screen>

            <Screen name="LoginScreen" 
                    component={LoginScreen} 
                    options={{
                    title:"Sign in", }}>
            </Screen>





            <Screen name="ResetPassword" 
                    component={ResetPassword} 
                    options={{
                    title:"Reset", }}>
            </Screen>

        </Navigator>
    </NavigationContainer>
)

export default AppNavigator;

