import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGeminiTips } from '../gemini';
export default function HomeScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState("User");
const [tips, setTips] = useState([]);
const [loading, setLoading] = useState(false);

const getTips = async () => {
  setLoading(true);
  const fetchedTips = await fetchGeminiTips();
  setTips(fetchedTips);
  setLoading(false);
};

  useEffect(() => {
    // Load user name
    const loadUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setCurrentUser(name || 'User');
    };

    // Fetch first tip
    getTips();

    loadUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(['isLoggedIn', 'userName']);
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
        text2: 'Hope to see you again! 👋',
        position: 'top',
        visibilityTime: 3000,
      });
      navigation.replace('Losin');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.one}>
        <Text style={styles.helloText}>Hello</Text>
        <Text style={styles.nameText}>{currentUser}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ffffffff" />
        </TouchableOpacity>
        <Image
          source={require("../assets/logo_bg.png")}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.txt}>XpiryMate</Text>
        <View style={styles.separator} />

        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Effortlessly add your items</Text>
          <Text style={styles.addSub}>
            worry-free, with no concerns about expiry!
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('Add')}
          >
            <Text style={styles.addButtonText}>+ Add item</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.two}>
  <Text style={styles.reminderTitle}>Tips</Text>
   <TouchableOpacity style={styles.tipButton} onPress={getTips}>
    <Text style={styles.tipButtonText}>🔁</Text>
  </TouchableOpacity>
  {loading ? (
    <>     <View style={[styles.tipCard,{marginLeft:"35"}]}>
          <Text style={styles.tipText}>💡Eating nutritious foods like apples daily strengthens your immune system and overall health, helping you avoid frequent visits to the doctor. 🍎👨‍⚕️ </Text>

        </View>
        <View>
          <ActivityIndicator size="large" color="#ff0000ff" />
        </View>
</>

  ) : (
    <FlatList
      data={tips}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>💡 {item}</Text>
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
  )}
 
</View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',

  },
  helloText: {
    fontSize: 25,
    fontWeight: '800',
    color: 'white',
  },
  txt:{
alignSelf:"flex-end",
fontWeight:"900",
fontSize:20,
color:"white"
  },
  tipButton:{
    alignSelf:"flex-end",
    position:"relative",
    bottom:27,
  right:40
  },
  tipButtonText:{
fontSize:20
  },
   separator: {
    height: 3,
marginTop:20,
    backgroundColor: '#fff',
  
  },
  nameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    maxWidth:"70%",
    
  },
  addCard: {
    backgroundColor:  '#e0f7fa',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    marginTop:40,
  

  },
  tipCard: {
  backgroundColor: '#e0f7fa',
  borderRadius: 10,
  padding: 15,
  marginRight: 10,
  width: 250,
  height:200
},
tipText: {
  fontSize: 14,
  color: 'black',
  fontWeight:"900"
},

  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  addSub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  img:{
borderRadius:50,
height:90,
width:100,
alignSelf:"flex-end",
marginTop:-120

  },
  logoutBtn: {
  flexDirection: 'row',
  backgroundColor: '#000',
  padding: 8,
  borderRadius: 8,
  
  alignSelf: 'flex-start',
  marginTop: 10,
},


  addButton: {
    borderWidth: 2,
    borderColor: '#000000ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#00897b',
    fontWeight: '600',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
   
  },
  one:{
flex:1.5,
paddingTop:60,
paddingLeft:30,
paddingRight:30,

  },
  two:{
    flex:1.3,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
backgroundColor:"white",
backgroundColor:"#b7e4eeff",
padding:20
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign:"center",
    color:"black"
  },
  viewAll: {
    color: '#00897b',
    fontWeight: '500',
  },
  list: {
    flexGrow: 0,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  daysLeft: {
    fontSize: 12,
    color: '#666',
  },
  daysNumber: {
    color: 'red',
    fontWeight: 'bold',
  },
});
