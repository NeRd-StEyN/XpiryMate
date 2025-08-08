// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOkbDyIk4CfUX1qw1XYQ5CaUy-BTimf5I",
  authDomain: "expirymate-1db79.firebaseapp.com",
  projectId: "expirymate-1db79",
  storageBucket: "expirymate-1db79.firebasestorage.app",
  messagingSenderId: "122910844962",
  appId: "1:122910844962:web:670870e993b52e2f15427b",
  measurementId: "G-PVB8Y6ZJBR"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);