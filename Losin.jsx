import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-toast-message';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginForm = ({ toggleForm, goToForgot,navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) 
  {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'All fields are required',
      visibilityTime:1000,
      position:"top"
    });
    return;
  }

    try {
     const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Store login flag
    await AsyncStorage.setItem('isLoggedIn', 'true');

    // ✅ Get and store display name
    const name = user.displayName || 'User';
    await AsyncStorage.setItem('userName', name);

    // Navigate to Home screen
    navigation.replace("Home");
    } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Credentials',
      visibilityTime:1000,
      position:"top"

    });
    }
  };

  return (
    <View>
      <View style={styles.inputWithIcon}>
        <Icon name="email-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="orange"
          style={styles.inputFlex}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWithIcon}>
        <Icon name="lock-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="orange"
          secureTextEntry={!showPass}
          style={styles.inputFlex}
          value={pass}
          onChangeText={setPass}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Icon name={showPass ? 'eye-off' : 'eye'} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={goToForgot}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.toggleText}>
        Don't have an account?
        <TouchableOpacity onPress={toggleForm}>
          <Text style={styles.linkText}> Sign Up</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const SignupForm = ({ toggleForm,navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const handleSignup = async () => {
   await signOut(auth);

  if (!name || !email || !pass) {
    Toast.show({
      type: 'error',
      text1: 'Missing Fields',
      text2: 'All fields are required',
      position: 'top',
      visibilityTime: 1000,
    });
    return;
  }

  if (!isValidEmail(email)) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Email',
      text2: 'Please enter a valid email address',
      position: 'top',
      visibilityTime: 1000,
    });
    return;
  }

  if (pass.length < 6) {
    Toast.show({
      type: 'error',
      text1: 'Weak Password',
      text2: 'Password must be at least 6 characters',
      position: 'top',
      visibilityTime: 1500,
    });
    return;
  }

  const tt=Toast.show({
    type:"info",
    text1:"Creating Account ...",
    text2:"Please Wait",
    position:"top",
    autoHide:false
  })

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
   
    await updateProfile(userCred.user, { displayName: name });
await AsyncStorage.setItem('userName', name);

    // Save user to Firestore
    await setDoc(doc(db, 'users', userCred.user.uid), {
      uid: userCred.user.uid,
      name,
      email,
      createdAt: new Date(),
    });
    Toast.hide(tt);

    Toast.show({
      type: 'success',
      text1: 'Account Created!',
      text2: 'Welcome to ExpiryMate 🚀',
      position: 'top',
      visibilityTime: 2000,
    });

 
 // Navigate to login screen
   toggleForm();

   
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Toast.show({
        type: 'error',
        text1: 'Email In Use',
        text2: 'This email is already registered',
        position: 'top',
        visibilityTime: 1500,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message,
        position: 'top',
        visibilityTime: 1500,
      });
    }
  }
};
  return (
    <View>
      <View style={styles.inputWithIcon}>
        <Icon name="account-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Name"
          placeholderTextColor="orange"
          style={styles.inputFlex}
          value={name}
          onChangeText={setName}
            maxLength={15}
        />
      </View>

      <View style={styles.inputWithIcon}>
        <Icon name="email-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="orange"
          style={styles.inputFlex}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWithIcon}>
        <Icon name="lock-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="orange"
          secureTextEntry={!showPass}
          style={styles.inputFlex}
          value={pass}
          onChangeText={setPass}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Icon name={showPass ? 'eye-off' : 'eye'} size={20} color="#555" />
        </TouchableOpacity>
      </View>
        <Text>
        <Text style={{ color: 'red' }}> *  </Text>
    Email should be unique

</Text>
    <Text>
        <Text style={{ color: 'red' }}> *  </Text>
    Password should have min length 6

</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      <Text style={styles.toggleText}>
        Already have an account?
        <TouchableOpacity onPress={toggleForm}>
          <Text style={styles.linkText}> Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const ForgotPasswordForm = ({ backToLogin }) => {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (!email) {
    Toast.show({
      type: 'error',
      text1: 'Missing Email',
      text2: 'Please enter your email to reset password',
      visibilityTime:1000,
      position:"top"
    });
    return;
  }
    try {
      await sendPasswordResetEmail(auth, email);
       Toast.show({
      type: 'success',
      text1: 'Reset Link Sent',
      text2: 'Please check your email',
       visibilityTime:1000,
      position:"top"
    });
    } catch (error) {
     
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "No account found with this email address.",
        position: 'top',
        visibilityTime:1000
      });
    }
  
  };

  return (
    <View>
      <View style={styles.inputWithIcon}>
        <Icon name="email-outline" size={20} color="#F9B233" style={styles.icon} />
        <TextInput
          placeholder="Your Email"
          placeholderTextColor="orange"
          style={styles.inputFlex}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
         <Text style={{fontWeight:"600",marginBottom:"10"}}>
        <Text style={{ color: 'red' }}> *  </Text>
 Mail will be send to spam of your account
</Text>

      <Text style={styles.toggleText}>

        Remembered password?
        <TouchableOpacity onPress={backToLogin}>
          <Text style={styles.linkText}> Back to Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export const App = ({navigation}) => {
  const [formState, setFormState] = useState('login');

  return (
    <ImageBackground
      source={require('./assets/login_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar hidden />
    
      <Text style={styles.heading}>
        {formState === 'login'
          ? 'Login'
          : formState === 'signup'
          ? 'Sign up'
          : 'Reset Password'}
      </Text>
      {formState === 'login' && (
        <LoginForm navigation={navigation}
          toggleForm={() => setFormState('signup')}
          goToForgot={() => setFormState('forgot')}
        />
      )}
      {formState === 'signup' && (
      <SignupForm toggleForm={() => setFormState('login')} navigation={navigation} />

      )}
      {formState === 'forgot' && (
        <ForgotPasswordForm backToLogin={() => setFormState('login')} />
      )}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#F9B233',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleText: {
    textAlign: 'center',
    color: '#555',
    fontWeight: '900',
    fontSize: 16,
  },
  linkText: {
    color: '#F9B233',
    fontWeight: '900',
    fontSize: 15,
    position: 'relative',
    top: 4,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgot: {
    color: 'blue',
    fontWeight: '900',
  },
});
