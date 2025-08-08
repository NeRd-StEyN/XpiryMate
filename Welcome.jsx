import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WelcomeScreen = ({ navigation }) => {
 useEffect(() => {
  const checkLoginStatus = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    setTimeout(() => {
      navigation.replace(isLoggedIn === 'true' ? 'Home' : 'Losin');
    }, 500); // Optional delay for splash effect
  };
  checkLoginStatus();
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>XpiryMate</Text>
      <Text style={styles.text2}>Beat expiry dates before they beat you!</Text>
      <Image
        source={require('./assets/logo_bg.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
   backgroundColor: '#222222ff',
  },
  text: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 20,
    color:"white"
  },
  image: {
    width: 200,
    height: 200,
  },
   text2: {
    fontSize: 15, fontWeight: 'bold', marginBottom: 20,
    color:"white"
  },
});
