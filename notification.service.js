import notifee, {
  AndroidImportance,
  AndroidPriority,
  TriggerType,
} from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

// Create notification channel at app start (call this once globally)
export async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'item-notifications',
      name: 'Item Notifications',
      
      vibration: true,
      sound: 'default',
    });
  }
}

// Request notifications permissions (Android 13+ and iOS)
export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // For iOS you can use notifee.requestPermission() if desired
  return true;
}

function toJsDate(maybeDate) {
  if (!maybeDate) return null;
  if (maybeDate instanceof Date) return maybeDate;
  if (typeof maybeDate === 'object' && typeof maybeDate.toDate === 'function') {
    return maybeDate.toDate(); // Firestore Timestamp
  }
  const d = new Date(maybeDate);
  return isNaN(d.getTime()) ? null : d;
}

export const notifyItemAdded = async (itemId,itemName, expiryDate, notificationDays = 3) => {
  try {
    // ensure permission & channel exist
    const permitted = await requestNotificationPermission();
    if (!permitted) {
      console.warn('[notify] permission not granted');
      return;
    }
    if (Platform.OS === 'android') {
      await createNotificationChannel();
    }

    // 1) Immediate notification
    await notifee.displayNotification({
      title: `${itemName} added sucessfully`,
      body: expiryDate ? `Expires on ${new Date(expiryDate).toLocaleDateString()}` : 'Item added',
      android: {
        channelId: 'item-notifications',
        sound: 'default',
        vibration: true,
      
      },
    });

    // 3) Expiry notification logic
    const parsedExpiry = toJsDate(expiryDate);
    if (!parsedExpiry) {
      console.warn('[notify] invalid expiryDate, skipping expiry schedule');
    } else {
      const notificationDate = new Date(parsedExpiry.getTime());
      notificationDate.setDate(notificationDate.getDate() - Number(notificationDays || 0));
notificationDate.setSeconds(notificationDate.getSeconds() + 70);
      if (notificationDate > new Date()) {
        const expiryTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationDate.getTime(),
          alarmManager: true,
          allowWhileIdle: true,
        };

      const expiryId = `expiry-${itemId}`; // instead of name+timestamp


        await notifee.createTriggerNotification(
          {
            id: expiryId,
            title: 'Item Expiring Soon!',
            body: `${itemName} expires in ${notificationDays} day${notificationDays > 1 ? 's' : ''}.`,
            android: {
              channelId: 'item-notifications',
              sound: "defualt",
              vibration: true,
             
            },
          },
          expiryTrigger,
        );

        console.log(`[notify] Scheduled expiry notification (${expiryId}) for ${notificationDate}`);
      } else {
        console.log('[notify] expiry notification date in the past, not scheduling');
      }
    }

    // 4) Debug: list scheduled trigger ids
    const scheduled = await notifee.getTriggerNotificationIds();
    console.log('[notify] Scheduled notification IDs:', scheduled);
  } catch (err) {
    console.error('[notify] Error:', err);
  }
};

export const cancelScheduledNotification = async (id) => {
  if (!id) return;
  try {
    await notifee.cancelNotification(id);
    console.log('[notify] cancelNotification called for id=', id);
  } catch (e) {
    console.warn('[notify] cancel failed', e);
  }
};
