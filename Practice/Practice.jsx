//Section List

//import React from 'react';
// import {
//   View,
//   Text,
//   SectionList,
//   StyleSheet,
//   SafeAreaView,
// } from 'react-native';

// const DATA = [
//   {
//     title: 'Fruits',
//     data: ['Apple', 'Banana', 'Orange'],
//   },
//   {
//     title: 'Vegetables',
//     data: ['Carrot', 'Broccoli', 'Spinach'],
//   },
//   {
//     title: 'Dairy',
//     data: ['Milk', 'Cheese', 'Yogurt'],
//   },
// ];

// export const Practice = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Grocery List</Text>

//       <SectionList
//         sections={DATA}
//         keyExtractor={(item, index) => item + index}
//         renderItem={({ item }) => (
//           <Text style={styles.item}>• {item}</Text>
//         )}
//         renderSectionHeader={({ section: { title } }) => (
//           <Text style={styles.sectionHeader}>{title}</Text>
//         )}
//       />
//     </SafeAreaView>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   sectionHeader: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     backgroundColor: '#e0e0e0',
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     marginTop: 10,
//     borderRadius: 5,
//   },
//   item: {
//     fontSize: 18,
//     paddingLeft: 20,
//     paddingVertical: 4,
//   },
// });





//Radio Button manual

// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// const options = ['Male', 'Female', 'Other'];

// export const Practice = () => {
//   const [selected, setSelected] = useState(null);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Gender:</Text>

//       {options.map((option, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.optionContainer}
//           onPress={() => setSelected(option)}
//         >
//           <View style={styles.outerCircle}>
//             {selected === option && <View style={styles.innerCircle} />}
//           </View>
//           <Text style={styles.optionText}>{option}</Text>
//         </TouchableOpacity>
//       ))}
//       <ActivityIndicator size="100" color="red" animating={false}/>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   optionContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   outerCircle: {
//     height: 24,
//     width: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#4a90e2',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },
//   innerCircle: {
//     height: 12,
//     width: 12,
//     borderRadius: 6,
//     backgroundColor: '#4a90e2',
//   },
//   optionText: {
//     fontSize: 16,
//   },
// });



// Modal 
// import React, { useState } from 'react';
// import { Modal, View, Text, Button, StyleSheet } from 'react-native';

// export const Practice = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   return (
//     <View style={styles.container}>
//       <Button title="Open Modal" onPress={() => setModalVisible(true)} />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Hello, I am a Modal!</Text>
//             <Button title="Close Modal" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(135, 135, 135, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalView: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',

// shadowColor:"green",
//     elevation: 8,                    // Android
//   },
//   modalText: {
//     fontSize: 18,
//     marginBottom: 15,

//     // Text shadow
//     color: 'black',
//     textShadowColor: 'rgba(0,0,0,0.4)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 2,
//   },
// });


// Pressable 

// import React from 'react';
// import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';

// export const Practice = () => {
//   const handlePress = () => Alert.alert('Pressed!', 'You tapped the button.');
//   const handleLongPress = () => Alert.alert('Long Pressed!', 'You held the button.');
//   const handlePressIn = () => console.log('Press In');
//   const handlePressOut = () => console.log('Press Out');

//   return (
//     <View style={styles.container}>
//       <Pressable
//         onPress={handlePress}
//         onLongPress={handleLongPress}
//         onPressIn={handlePressIn}
//          delayLongPress={1000} // 🔸 1 second delay
//         onPressOut={handlePressOut}
//         style={({ pressed }) => [
//           styles.button,
//           { backgroundColor: pressed ? 'pink' : '#2196F3' }
//         ]}
//       >
//         <Text style={styles.text}>Press Me</Text>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   text: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });





//Status Bar
// import React from 'react';
// import { View, Text, StatusBar, StyleSheet } from 'react-native';

// export const Practice = () => {
//   return (
//     <View style={styles.container}>
//       {/* Status bar customization */}
//       <StatusBar
      
//         barStyle="default" // 'default' | 'light-content' | 'dark-content'
//         translucent={false}  
//         hidden={false}    // Optional
//       />
//       <Text style={styles.text}>StatusBar Example</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
   
//     backgroundColor: 'red',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//   },
// });



//Platform
// import React from 'react';
// import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

// export const Practice = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Platform Demo</Text>

//       <Text style={styles.platformText}>
//         {Platform.OS === 'ios' ? 'Running on iOS' : 'Running on Android'}
//       </Text>

//       <Text style={styles.versionText}>
//         OS Version: {Platform.Version}   </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color:Platform.OS=="ios"?"red":"green"
//   },
//   platformText: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: '#333',
//   },
//   versionText: {
//     fontSize: 16,
//     color: 'gray',
//   },
// });



//WebView

// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// export const Practice = () => {
//   return (
//     <View style={styles.container}>
//       <WebView
//        source={{ uri: 'https://www.google.com' }}

//         style={styles.webview}
//       />
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
// });


//Bottom Tab Navigation
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View, Text } from 'react-native';

// // Dummy Screens
// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>🏠 Home Screen</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>⚙️ Settings Screen</Text>
//     </View>
//   );
// }

// // Create bottom tab navigator
// const Tab = createBottomTabNavigator();

// export const Practice=()=>
//      {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }



//Top Tab Navigation
// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// // Dummy screens
// function HomeScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>🏠 Home Screen</Text>
//     </View>
//   );
// }


// function ProfileScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>👤 Profile Screen</Text>
//     </View>
//   );
// }

// // Create top tab navigator
// const Tab = createMaterialTopTabNavigator();

// export const Practice=()=> {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }


// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { View, Text, StyleSheet } from 'react-native';

// const Drawer = createDrawerNavigator();

// const HomeScreen = () => (
//   <View style={styles.container}>
//     <Text style={styles.text}>Home Screen</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View style={styles.container}>
//     <Text style={styles.text}>Profile Screen</Text>
//   </View>
// );

// const SettingsScreen = () => (
//   <View style={styles.container}>
//     <Text style={styles.text}>Settings Screen</Text>
//   </View>
// );

// export const Practice=()=> {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator initialRouteName="Home">
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Profile" component={ProfileScreen} />
//         <Drawer.Screen name="Settings" component={SettingsScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, justifyContent: 'center', alignItems: 'center',
//   },
//   text: {
//     fontSize: 24,
//   },
// });



//Async storage
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Practice = () => {
  const [name, setName] = useState('');

  // Set value
  const saveName = async () => {
    try {
      await AsyncStorage.setItem('name', 'Nipun');
      alert('Name saved');
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  // Get value
  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem('name');
      if (value !== null) {
        setName(value);
      } else {
        alert('No name found');
      }
    } catch (error) {
      console.error('Error reading name:', error);
    }
  };

  // Delete value
  const deleteName = async () => {
    try {
      await AsyncStorage.removeItem('name');
      setName('');
      alert('Name deleted');
    } catch (error) {
      console.error('Error deleting name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Example</Text>
      <Button title="Save Name" onPress={saveName} />
      <View style={styles.spacing} />
      <Button title="Get Name" onPress={getName} />
      <View style={styles.spacing} />
      <Button title="Delete Name" onPress={deleteName} />
      <View style={styles.spacing} />
      <Text style={styles.result}>Stored Name: {name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  spacing: {
    height: 15,
  },
});


