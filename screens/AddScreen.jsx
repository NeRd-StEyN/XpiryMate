import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform, ScrollView,Button
} from 'react-native';
import Toast from 'react-native-toast-message';
import { notifyItemAdded} from '../notification.service';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
// Update your imports at the top of the file
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';  // Add launchCamera here
import { uploadToCloudinary } from '../cloudinary';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For React Native CLI

const AddScreen = () => {
  const DEFAULT_IMAGE_URL = 'https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_640.jpg';
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Medicine');
  const [quantity, setQuantity] = useState(1); // Changed to number
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [notificationDays, setNotificationDays] = useState('1');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Food', 'Medicine', 'Cosmetics', 'Other'];

  const user = auth.currentUser;

  const handleAddItem = async () => {
    // Validate input
    if (!itemName.trim()) {
      Toast.show({
        type: 'error',

        text1: 'Please enter item name',
        position: 'top',
        topOffset: 50,
        visibilityTime: 1500
      });
      return;
    }
    const addingToastId = Toast.show({
      type: 'info',
      text1: 'Adding Item Please Wait...',

      position: 'top',
      autoHide: false, // We'll hide it manually
    });

    try {

      let imageUrl = null;
      if (image) {
        try {
          imageUrl = await uploadToCloudinary(image.uri);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          Toast.show({
            type: 'warning',

            text1: 'Item was saved but image upload failed',
            position: 'top',
            visibilityTime: 1500
          });
        }
      }

     // Save to Firestore and get the new doc id
const docRef = await addDoc(collection(db, 'users', user.uid, 'items'), {
  name: itemName,
  category,
  quantity,
  expiryDate,
  notificationDays: parseInt(notificationDays),
  imageUrl: imageUrl || DEFAULT_IMAGE_URL,
  createdAt: serverTimestamp(),
});

// pass itemId to notifyItemAdded
notifyItemAdded(docRef.id, itemName, expiryDate, parseInt(notificationDays));



      Toast.hide(addingToastId);

     
      Toast.show({
        type: 'success',

        text1: 'Item added successfully',
        position: 'top',
        visibilityTime: 1000,

      });

      setItemName('');
      setCategory('Medicine');
      setQuantity(1);
      setExpiryDate(new Date());
      setNotificationDays('1');
      setImage(null);

    } catch (error) {
      console.error('Error adding item:', error);
      Toast.hide(addingToastId);

      let errorMessage = 'Failed to add item. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'You no longer have permission to add items';
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 1500
      });

    }
  }
  const pickFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      }
      if (response.assets?.[0]?.uri) {
        setImage(response.assets[0]);
      }
    });
  };

  const takePhoto = () => {

    const options = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
    };

    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        console.log('Camera Error: ', response.error);
        return;
      }
      if (response.assets?.[0]?.uri) {
        setImage(response.assets[0]);
      }
    });
  };


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <View style={{ flex: 1 }}> {/* Ensures full screen height */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Add this
        style={styles.container}
      >
       <TouchableOpacity
  onPress={() => {
    setItemName('');
    setCategory('Medicine');
    setQuantity(1);
    setExpiryDate(new Date());
    setNotificationDays('1');
    setImage(null);
  }}
  style={{
    backgroundColor: '#ff0000ff',
    padding: 10,
    borderRadius: 8,
    display:"flex",
  flexDirection:"row",
  justifyContent:"flex-end",
    marginTop: 10,
    width:"14%"
  }}
>
  <Icon name="clear" size={25} color="#000" />
</TouchableOpacity>

        <Text style={styles.title}>Add New Item</Text>

        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <View style={styles.imageOptionsContainer}>
              <TouchableOpacity onPress={takePhoto} style={styles.imageOptionButton}>
                <Icon name="camera-alt" size={24} color="white" />
                <Text style={styles.imageOptionText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickFromGallery} style={styles.imageOptionButton}>
                <Icon name="photo-library" size={24} color="white" />
                <Text style={styles.imageOptionText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageOptionsContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.imageOptionButton}>
              <Icon name="camera-alt" size={30} color="white" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFromGallery} style={styles.imageOptionButton}>
              <Icon name="photo-library" size={30} color="white" />
              <Text style={styles.imageOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}


        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={itemName}
          placeholderTextColor="white" // Add this line
          onChangeText={setItemName}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Category:</Text>
          <Picker
            selectedValue={category}
            dropdownIconColor="white" // Makes dropdown arrow visible (Android)
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={cat} />
            ))}
          </Picker>
        </View>

        {/* Quantity Input with +/- Buttons */}
        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Icon name="remove" size={24} color="white" />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                setQuantity(num > 0 ? num : 1);
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
<TouchableOpacity
  style={styles.dateButton}
  onPress={() => setShowDatePicker(true)}
>
  <Text style={{ color: 'white' }}>
    {`Expiry Date: ${expiryDate.toDateString()}`}
  </Text>
</TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Notify before expiry:</Text>
          <Picker
            selectedValue={notificationDays}
            onValueChange={(itemValue) => setNotificationDays(itemValue)}
            style={styles.picker}

          >
            <Picker.Item label="1 day" value="1" />
              <Picker.Item label="2 days" value="2" />
            <Picker.Item label="3 days" value="3" />
            <Picker.Item label="1 week" value="7" />
            <Picker.Item label="2 weeks" value="14" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
backgroundColor: '#1c1c1c',
color:"white",

  },
  scrollContainer: {
    paddingBottom: 90, // Extra space for the button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:"white"
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color:"white",
    backgroundColor: '#393838ff',
    paddingLeft:20
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
      backgroundColor: '#393838ff',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: "white",
    padding:27
  },
  label: {
    marginTop: 5,
    color: 'white',
    marginBottom: 8,
  },
  dateButton: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
      backgroundColor: '#393838ff',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // New styles for quantity controls
  quantityContainer: {
    marginBottom: 15,
    
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
      backgroundColor: '#393838ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  quantityButton: {
    padding: 10,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    height: 40,
    fontSize: 16,
    color:"white"
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  imageOptionButton: {
    alignItems: 'center',
    padding: 10,
      backgroundColor: '#393838ff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '45%',
  },
  imageOptionText: {
    marginTop: 5,
    fontSize: 12,
    color:"white"
  },

});

export default AddScreen;