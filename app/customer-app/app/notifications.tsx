import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors } from '../constants/Colors.js';

// Responsive utility
const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

interface NotificationSettings {
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

interface NotificationItem {
  key: keyof NotificationSettings;
  title: string;
  description: string;
  disabled?: boolean;
}

interface NotificationSection {
  title: string;
  description: string;
  items: NotificationItem[];
}

const defaultSettings: NotificationSettings = {
  orderUpdates: true,
  promotions: true,
  reminders: true,
  newServices: false,
  vendorMessages: true,
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

const NotificationsScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    
    // If push notifications are disabled, disable sound and vibration too
    if (key === 'pushEnabled' && !value) {
      newSettings.soundEnabled = false;
      newSettings.vibrationEnabled = false;
    }
    
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => saveSettings(defaultSettings),
        },
      ]
    );
  };

  const notificationSections: NotificationSection[] = [
    {
      title: 'Order Notifications',
      description: 'Get notified about your order status and updates',
      items: [
        {
          key: 'orderUpdates' as keyof NotificationSettings,
          title: 'Order Updates',
          description: 'Status changes, pickup, delivery notifications',
        },
        {
          key: 'reminders' as keyof NotificationSettings,
          title: 'Order Reminders',
          description: 'Upcoming pickups and deliveries',
        },
        {
          key: 'vendorMessages' as keyof NotificationSettings,
          title: 'Vendor Messages',
          description: 'Messages from your service providers',
        },
      ],
    },
    {
      title: 'Marketing & Promotions',
      description: 'Special offers and new features',
      items: [
        {
          key: 'promotions' as keyof NotificationSettings,
          title: 'Promotions & Offers',
          description: 'Discounts, special deals, and coupons',
        },
        {
          key: 'newServices' as keyof NotificationSettings,
          title: 'New Services',
          description: 'Updates about new services and features',
        },
      ],
    },
    {
      title: 'Delivery Methods',
      description: 'Choose how you want to receive notifications',
      items: [
        {
          key: 'pushEnabled' as keyof NotificationSettings,
          title: 'Push Notifications',
          description: 'Real-time notifications on your device',
        },
        {
          key: 'emailEnabled' as keyof NotificationSettings,
          title: 'Email Notifications',
          description: 'Send notifications to your email',
        },
        {
          key: 'smsEnabled' as keyof NotificationSettings,
          title: 'SMS Notifications',
          description: 'Text messages for important updates',
        },
      ],
    },
    {
      title: 'Alert Settings',
      description: 'Customize how notifications appear',
      items: [
        {
          key: 'soundEnabled' as keyof NotificationSettings,
          title: 'Sound',
          description: 'Play notification sounds',
          disabled: !settings.pushEnabled,
        },
        {
          key: 'vibrationEnabled' as keyof NotificationSettings,
          title: 'Vibration',
          description: 'Vibrate for notifications',
          disabled: !settings.pushEnabled,
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={resetToDefaults} style={styles.resetButton}>
          <Text style={[styles.resetButtonText, { color: colors.tint }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {notificationSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionDescription, { color: colors.tint }]}>
                {section.description}
              </Text>
            </View>

            <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <View key={item.key} style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text
                      style={[
                        styles.settingTitle,
                        { 
                          color: item.disabled ? colors.tint + '60' : colors.text 
                        }
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { 
                          color: item.disabled ? colors.tint + '40' : colors.tint 
                        }
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    value={settings[item.key]}
                    onValueChange={(value) => updateSetting(item.key, value)}
                    trackColor={{ 
                      false: colors.tint + '30', 
                      true: colors.tint + '80' 
                    }}
                    thumbColor={settings[item.key] ? colors.tint : '#f4f3f4'}
                    disabled={item.disabled}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Ionicons 
              name="information-circle" 
              size={normalize(24)} 
              color={colors.tint} 
              style={styles.infoIcon}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Permission Required
              </Text>
              <Text style={[styles.infoDescription, { color: colors.tint }]}>
                Some notifications may require additional permissions. Go to your device settings to enable them if needed.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: normalize(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(50),
    paddingBottom: normalize(20),
    justifyContent: 'space-between',
  },
  backButton: {
    padding: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  resetButton: {
    padding: normalize(8),
  },
  resetButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(32),
  },
  section: {
    marginBottom: normalize(32),
  },
  sectionHeader: {
    marginBottom: normalize(16),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    marginBottom: normalize(4),
  },
  sectionDescription: {
    fontSize: normalize(14),
    lineHeight: normalize(20),
  },
  sectionContent: {
    borderRadius: normalize(12),
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e1e8ed',
  },
  settingInfo: {
    flex: 1,
    marginRight: normalize(12),
  },
  settingTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  settingDescription: {
    fontSize: normalize(14),
    lineHeight: normalize(20),
  },
  infoSection: {
    marginTop: normalize(16),
  },
  infoCard: {
    flexDirection: 'row',
    padding: normalize(16),
    borderRadius: normalize(12),
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: normalize(12),
    marginTop: normalize(2),
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: normalize(4),
  },
  infoDescription: {
    fontSize: normalize(14),
    lineHeight: normalize(20),
  },
});

export default NotificationsScreen;
