import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginForm } from './Practice/LoginForm';
import { Home } from './Practice/Home';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

export const Route = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: "red",
          headerTitleStyle: { fontWeight: 'bold', fontSize: 30 }
        }}
      >
        <Stack.Screen name="Login" options={{headerBackVisible:false}}component={LoginForm} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button title="Left" onPress={() => navigation.navigate("Login")} />
            ),
            headerRight: () => <Button title="Right" onPress={() => {}} />,
            title: 'Welcome Home',
            headerStyle: { backgroundColor: '#f39f21ff' },
            headerTintColor: 'white',
            headerTitleStyle: { fontSize: 20, fontWeight: '600' }
          })}
        />
                 {/* options={{ headerBackVisible: false ,headerShown:false}} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
