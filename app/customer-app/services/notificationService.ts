import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
  newServices: boolean;
  vendorMessages: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  orderUpdates: true,
  promotions: false,
  reminders: true,
  newServices: false,
  vendorMessages: true,
  pushEnabled: true,
  emailEnabled: false,
  smsEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  /**
   * Request notification permissions from the user
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Open device notification settings
   */
  static async openSettings(): Promise<void> {
    try {
      // On mobile, this will typically open the app's notification settings
      await Notifications.requestPermissionsAsync();
    } catch (error) {
      console.error('Error opening notification settings:', error);
    }
  }

  /**
   * Get the device's push token
   */
  static async getPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Schedule a local notification
   */
  static async scheduleNotification(
    title: string,
    body: string,
    data?: any,
    delay?: number
  ): Promise<string | null> {
    try {
      const settings = await NotificationService.getSettings();
      
      if (!settings.pushEnabled) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: settings.soundEnabled ? 'default' : undefined,
        },
        trigger: delay ? {
          seconds: delay,
        } as Notifications.TimeIntervalTriggerInput : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Send order update notification
   */
  static async notifyOrderUpdate(orderId: string, status: string, details?: string): Promise<void> {
    const settings = await NotificationService.getSettings();
    
    if (!settings.orderUpdates || !settings.pushEnabled) {
      return;
    }

    let title = 'Order Update';
    let body = `Order #${orderId} status: ${status}`;
    
    if (details) {
      body += ` - ${details}`;
    }

    await NotificationService.scheduleNotification(title, body, { 
      type: 'order_update', 
      orderId, 
      status 
    });
  }

  /**
   * Send reminder notification
   */
  static async notifyReminder(title: string, message: string, orderId?: string): Promise<void> {
    const settings = await NotificationService.getSettings();
    
    if (!settings.reminders || !settings.pushEnabled) {
      return;
    }

    await NotificationService.scheduleNotification(title, message, { 
      type: 'reminder', 
      orderId 
    });
  }

  /**
   * Send promotional notification
   */
  static async notifyPromotion(title: string, message: string, promoCode?: string): Promise<void> {
    const settings = await NotificationService.getSettings();
    
    if (!settings.promotions || !settings.pushEnabled) {
      return;
    }

    await NotificationService.scheduleNotification(title, message, { 
      type: 'promotion', 
      promoCode 
    });
  }

  /**
   * Send vendor message notification
   */
  static async notifyVendorMessage(vendorName: string, message: string, orderId?: string): Promise<void> {
    const settings = await NotificationService.getSettings();
    
    if (!settings.vendorMessages || !settings.pushEnabled) {
      return;
    }

    const title = `Message from ${vendorName}`;
    await NotificationService.scheduleNotification(title, message, { 
      type: 'vendor_message', 
      vendorName, 
      orderId 
    });
  }

  /**
   * Cancel all notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  /**
   * Cancel notification by ID
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  /**
   * Get current notification settings
   */
  static async getSettings(): Promise<NotificationSettings> {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        return { ...defaultNotificationSettings, ...JSON.parse(saved) };
      }
      return defaultNotificationSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return defaultNotificationSettings;
    }
  }

  /**
   * Save notification settings
   */
  static async saveSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  /**
   * Test notification - useful for debugging
   */
  static async testNotification(): Promise<void> {
    await NotificationService.scheduleNotification(
      'Test Notification',
      'This is a test notification from MoveEase!',
      { type: 'test' },
      2 // 2 seconds delay
    );
  }
}

export default NotificationService;
