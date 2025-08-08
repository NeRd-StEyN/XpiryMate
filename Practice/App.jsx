import { View, Text, FlatList,Linking, Image, StatusBar, StyleSheet, useColorScheme, TouchableOpacity, Button, Alert } from 'react-native';
import { Data } from '../components/data';
import { useState } from 'react';

export const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [name, setname] = useState("");
  const names = [
    {
      id: "1",
      name: "nipun"
    },
    {
      id: "2",
      name: "shivam"
    },
    {
      id: "3",
      name: 'arjun'
    },
    {
      id: "4",
      name: "manav"
    }
  ]
       const openWebsite = () => {
  Linking.openURL('https://www.google.com');
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={styles.text}>Hello  from react-native 👋</Text>

      <TouchableOpacity activeOpacity={0.5} style={styles.bt} onPress={() => {
        Alert.alert("pressed");
        setname("ni")
      }}>
        <Text style={styles.btText}>Click Here</Text>
      </TouchableOpacity>

      <Userdata  style={{ fontFamily: 'Poppins-Bold'}} name={name} />
      <Data />
      <FlatList keyExtractor={(key) => {
        return key.id;
      }
      } inverted showsHorizontalScrollIndicator={false} horizontal data={names} renderItem={(ele) => {
        return (
          <View style={[styles.tex,styles.btText]}>
            {/* to add multiple styles we use [] in {} */}
            <Text style={{ fontSize: 30 }}>{ele.index + 1}.{ele.item.name}</Text>
            <Image style={{ width: 100, height: 100 }} source={require("./images/englands-james-anderson-looks-on-while-bowling-on-day-four-of-the-fifth-ashes-cricket-test.webp")} />
            <Image style={{ width: 100, height: 100 }} source={{ uri: 'https://example.com/image.jpg' }}/>
          </View>

        )

      }} />
 
<Button title="Open Google" onPress={openWebsite} />
<Userdata name="nnn"/>

    </View>
  );
};

const Userdata = ({ name }) => {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
  },
  bt: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 100,
    marginTop: 20,
    borderColor: "green",
    borderWidth: 5,

  },
  btText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    fontVariant:["small-caps"],
    letterSpacing:4  ,
    lineHeight:22,
    textAlign:"justify",
    textShadowColor:"blue",
    textShadowRadius:10,
    textShadowOffset:{width:5,height:1},
    // textTransform:"capitalize"
    // marginVertical or marginHorizontal same for padding combines top+bottom ,left+right resp

  },
  tex: {
    backgroundColor: "blue",

    color: "red",
    padding: 20,
    height: 250,
    width: 200,
    margin: 20,
    display: "flex",
    flexDirection: "column",
    gap: 40,

  }
});  