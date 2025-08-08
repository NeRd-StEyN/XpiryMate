// Home.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';
// Screens
import HomeMain from './screens/HomeMain';
import AddScreen from './screens/AddScreen';
import MyselfScreen from './screens/AnalyticsScreen';
import ChatScreen from './screens/ChatScreen';
import ItemScreen from './screens/ItemScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
const Tab = createBottomTabNavigator();

export const Home = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
          tabBarStyle: {
      backgroundColor: '#000000ff', // change to your desired background color
      borderTopWidth: 0,
    },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'white',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Add':
              iconName = 'plus-circle'; // 👈 Circle with +
              break;
            case 'Analytics':
              iconName = 'chart-bar';
              break;
               case 'Items':
              iconName = 'view-list';
              break;
            case 'AI Chat':
              iconName = 'robot';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeMain} />
        <Tab.Screen name="Items" component={ItemScreen} />
<Tab.Screen
  name="Add"
  component={AddScreen}
  options={{
    title: '',
    tabBarIcon: () => (
      <View style={{ marginBottom: -10 }}>
        <Icon name="plus-circle" size={33} color="green" />
      </View>
    ),
  }}
/>


    
     
      <Tab.Screen name="AI Chat" component={ChatScreen} />
       <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
};
