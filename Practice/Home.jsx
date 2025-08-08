// Home.jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const Home = ({ route, navigation }) => {
 const username = route?.params?.username || 'Guest';

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {username}!</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
