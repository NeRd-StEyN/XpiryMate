import { Platform, PermissionsAndroid } from 'react-native';

export const requestPermissions = async () => {
  // 🔔 Notification Permission
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const notificationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (notificationGranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('✅ Notification permission granted');
    } else {
      console.warn('❌ Notification permission denied');
    }
  }

  // 📷 Camera Permission
  const cameraGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );

  if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('✅ Camera permission granted');
  } else {
    console.warn('❌ Camera permission denied');
  }
};
