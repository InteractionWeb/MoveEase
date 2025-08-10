import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  category: string;
  isEnabled: boolean;
  isImportant?: boolean;
}

export default function NotificationSettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'New Order Notifications',
      description: 'Get notified when you receive a new booking request',
      category: 'Orders',
      isEnabled: true,
      isImportant: true,
    },
    {
      id: '2',
      title: 'Order Updates',
      description: 'Notifications about order status changes and customer messages',
      category: 'Orders',
      isEnabled: true,
    },
    {
      id: '3',
      title: 'Payment Notifications',
      description: 'Get notified when payments are processed',
      category: 'Payments',
      isEnabled: true,
    },
    {
      id: '4',
      title: 'Weekly Earnings Summary',
      description: 'Weekly summary of your earnings and completed jobs',
      category: 'Reports',
      isEnabled: true,
    },
    {
      id: '5',
      title: 'Monthly Performance Report',
      description: 'Monthly report on your performance and ratings',
      category: 'Reports',
      isEnabled: false,
    },
    {
      id: '6',
      title: 'Document Expiry Reminders',
      description: 'Reminders when your documents are about to expire',
      category: 'Account',
      isEnabled: true,
    },
    {
      id: '7',
      title: 'System Maintenance',
      description: 'Important system updates and maintenance notifications',
      category: 'System',
      isEnabled: true,
      isImportant: true,
    },
    {
      id: '8',
      title: 'Marketing Messages',
      description: 'Promotional offers and platform updates',
      category: 'Marketing',
      isEnabled: false,
    },
  ]);

  const toggleSetting = (settingId: string) => {
    const setting = settings.find(s => s.id === settingId);
    
    if (setting?.isImportant) {
      Alert.alert(
        'Important Notification',
        'This notification is important for your business operations and cannot be disabled.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, isEnabled: !setting.isEnabled }
          : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Save notification settings to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Notification settings updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupedSettings = settings.reduce((groups, setting) => {
    if (!groups[setting.category]) {
      groups[setting.category] = [];
    }
    groups[setting.category].push(setting);
    return groups;
  }, {} as Record<string, NotificationSetting[]>);

  const renderSettingItem = (setting: NotificationSetting) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.titleContainer}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          {setting.isImportant && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantText}>Required</Text>
            </View>
          )}
        </View>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      <Switch
        value={setting.isEnabled}
        onValueChange={() => toggleSetting(setting.id)}
        trackColor={{ false: Colors.border, true: Colors.primary + '30' }}
        thumbColor={setting.isEnabled ? Colors.primary : Colors.textLight}
        disabled={setting.isImportant}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <Text style={styles.infoText}>
              Manage your notification preferences to stay informed about your business activities.
            </Text>
          </View>

          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryCard}>
                {categorySettings.map((setting, index) => (
                  <View key={setting.id}>
                    {renderSettingItem(setting)}
                    {index < categorySettings.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.additionalInfo}>
            <Text style={styles.noteTitle}>Important Notes:</Text>
            <Text style={styles.noteText}>
              • Some notifications are required for business operations and cannot be disabled
            </Text>
            <Text style={styles.noteText}>
              • Email notifications will be sent to your registered email address
            </Text>
            <Text style={styles.noteText}>
              • You can change these settings at any time
            </Text>
          </View>
        </View>

        <PrimaryButton
          title={isLoading ? "Saving..." : "Save Settings"}
          onPress={handleSaveSettings}
          disabled={isLoading}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  importantBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.warning + '20',
    borderRadius: 4,
  },
  importantText: {
    fontSize: 10,
    color: Colors.warning,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  additionalInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
