// notification.test.js
import PushNotification from 'react-native-push-notification';
import { scheduleExpiryNotification, cancelAllNotifications, getScheduledNotifications } from '.notification.service';

// Configure PushNotification (same as your main file)
PushNotification.configure({
  onNotification: (notification) => {
    console.log('TEST NOTIFICATION RECEIVED:', notification);
  },
  playSound: false,
  vibrate: false,
});

// --- TEST CASES ---

// Case 1: Immediate notification (appears in 2 seconds)
const testNow = () => {
  PushNotification.localNotification({
    id: 'test-now',
    title: "TEST (Immediate)",
    message: "This should appear instantly!",
    playSound: false,
    vibrate: false,
  });
  console.log("Check your device for an immediate notification!");
};

// Case 2: Scheduled notification (10 seconds later)
const testScheduled = () => {
  const futureDate = new Date();
  futureDate.setSeconds(futureDate.getSeconds() + 10); // 10 seconds from now

  scheduleExpiryNotification("Test Item", futureDate, 1);
  console.log("Scheduled a notification for 10 seconds later. Check logs!");
};

// Case 3: List all scheduled notifications
const testListScheduled = async () => {
  const notifs = await getScheduledNotifications();
  console.log("Scheduled Notifications:", notifs);
};

// Case 4: Cancel all notifications
const testCancelAll = () => {
  cancelAllNotifications();
  console.log("Cancelled all notifications!");
};

// --- RUN TESTS ---
// Uncomment the test you want to run:

testNow();           // Test immediate notification
// testScheduled();  // Test scheduling
// testListScheduled(); // List pending notifications
// testCancelAll();  // Cancel all notifications