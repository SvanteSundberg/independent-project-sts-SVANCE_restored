import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import  StartScreen from './screens/StartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';

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
        </Navigator>
    </NavigationContainer>
)

export default AppNavigator;

