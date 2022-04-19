import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TimelineScreen from './TimelineScreen';
import CreateprofileScreen from './CreateprofileScreen';
import { Ionicons } from "@expo/vector-icons";
import MyEventsScreen from './MyEventsScreen';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator   
    activeColor="#f0edf6"
    inactiveColor="#3e2465"
    barStyle={{ backgroundColor: '#694fad' }}>
      <Tab.Screen 
        name="Timeline" 
        component={TimelineScreen}
        options={{tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="md-home"
                size={24}
                color={tabInfo.focused ? "dodgerblue" : "#8e8e93"}
              />
            );
          },headerShown: false
          }
          }
         />

      <Tab.Screen 
        name="Profile" 
        component={CreateprofileScreen} 
        options={{tabBarIcon: (tabInfo) => {
        return (
          <Ionicons
            name="md-person-circle-outline"
            size={24}
            color={tabInfo.focused ? "dodgerblue" : "#8e8e93" }/>
            );}, headerShown: false
      }
      } />

<Tab.Screen 
        name="Events" 
        component={MyEventsScreen} 
        options={{tabBarIcon: (tabInfo) => {
        return (
          <Ionicons
            name="notifications"
            size={24}
            color={tabInfo.focused ? "dodgerblue" : "#8e8e93" }/>
            );}, headerShown: false
      }
      } />

    </Tab.Navigator>
  );
}