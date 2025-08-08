import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.view}>
      <Text style={styles.text}>{count}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => setCount(prev => prev + 10)}>
        <Text style={styles.btnText}>+10</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => setCount(0)}>
        <Text style={styles.btnText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity  disabled={count === 0} style={styles.btn} onPress={() => setCount(prev => prev - 10)}>
        <Text style={styles.btnText}>-10</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#000000ff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: 100,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
  },
});
