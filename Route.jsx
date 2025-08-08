import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { App } from './Losin';
import { WelcomeScreen } from './Welcome';
import { requestPermissions } from './notification.service2';
import { createNotificationChannel, requestNotificationPermission } from './notification.service'; // adjust path
import Toast from 'react-native-toast-message';
import { Home } from './Home';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Import this

const Stack = createNativeStackNavigator();

export const Route = () => {
useEffect(() => {
  requestPermissions(); // 👈 Now requests both Notification and Camera
}, []);

useEffect(() => {
    // Create channel once on app start
    createNotificationChannel();

    // Request permissions on start
    requestNotificationPermission();
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* ✅ Wrap everything here */}
      <StatusBar hidden={true} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Wlcm">
          <Stack.Screen name="Losin" options={{ headerBackVisible: false }} component={App} />
          <Stack.Screen name="Wlcm" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
};
