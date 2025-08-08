import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const RandomColor = () => {
  const [colorData, setColorData] = useState(getRandomColor());

  const handleGenerate = () => {
    setColorData(getRandomColor());
  };

  return (
    <View style={styles.container}>
      <View style={[styles.colorBox, { backgroundColor: colorData.color }]} />
      <Text style={styles.rgbText}>{colorData.rgb}</Text>
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate Random Color</Text>
      </TouchableOpacity>
    </View>
  );
};

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { color: `rgb(${r}, ${g}, ${b})`, rgb: `RGB(${r}, ${g}, ${b})` };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorBox: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  rgbText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

