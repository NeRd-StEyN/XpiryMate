import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
  Button,
} from "react-native";

export const Fetch = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // initial loading
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh

  const getUserData = async () => {
    try {
      if (!refreshing) setLoading(true); // only show main loader if not refreshing
      const response = await fetch(
        "https://thapatechnical.github.io/userapi/users.json"
      );
      const myData = await response.json();
      setUsers(myData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getUserData();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User List</Text>
      <Button title="Refresh Manually" onPress={handleRefresh} />

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom:30
  },
  name: {
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});
