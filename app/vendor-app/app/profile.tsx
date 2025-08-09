import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';

interface VendorProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rating: number;
  totalJobs: number;
  memberSince: string;
  isVerified: boolean;
  isAvailable: boolean;
  vehicleTypes: string[];
  servicesOffered: string[];
}

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<VendorProfile>({
    id: '1',
    companyName: 'Swift Movers LLC',
    contactPerson: 'Mike Johnson',
    email: 'mike@swiftmovers.com',
    phone: '+1 (555) 987-6543',
    address: '123 Business Ave',
    city: 'City Name',
    state: 'ST',
    zipCode: '12345',
    rating: 4.8,
    totalJobs: 128,
    memberSince: '2023-03-15',
    isVerified: true,
    isAvailable: true,
    vehicleTypes: ['Large Van', 'Medium Truck', 'Moving Trailer'],
    servicesOffered: ['Local Moving', 'Long Distance Moving', 'Packing Services', 'Storage Services'],
  });

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your business information',
      icon: 'person-outline',
      action: () => router.push('/edit-profile'),
    },
    {
      id: 'vehicle-info',
      title: 'Vehicle Information',
      subtitle: 'Manage your fleet details',
      icon: 'car-outline',
      action: () => router.push('/vehicles'),
    },
    {
      id: 'services',
      title: 'Services & Pricing',
      subtitle: 'Update your service offerings',
      icon: 'pricetag-outline',
      action: () => router.push('/services'),
    },
    {
      id: 'documents',
      title: 'Documents & Verification',
      subtitle: 'Manage licenses and certifications',
      icon: 'document-text-outline',
      action: () => router.push('/documents'),
    },
    {
      id: 'earnings',
      title: 'Earnings & Payments',
      subtitle: 'View earnings and payment settings',
      icon: 'card-outline',
      action: () => router.push('/earnings'),
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      subtitle: 'View customer feedback',
      icon: 'star-outline',
      action: () => router.push('/reviews'),
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      subtitle: 'Manage your preferences',
      icon: 'notifications-outline',
      action: () => router.push('/notification-settings'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle-outline',
      action: () => router.push('/support'),
    },
  ];

  const handleAvailabilityToggle = async (value: boolean) => {
    setIsLoading(true);
    try {
      // TODO: Update availability in backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(prev => ({ ...prev, isAvailable: value }));
      
      Alert.alert(
        'Availability Updated',
        value ? 'You are now available to receive orders.' : 'You are now offline and will not receive new orders.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear auth state and navigate to login
            router.replace('/login');
          },
        },
      ]
    );
  };

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
          <Text style={styles.title}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.companyName.charAt(0)}</Text>
            </View>
            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.companyName}>{profile.companyName}</Text>
            <Text style={styles.contactPerson}>{profile.contactPerson}</Text>
            <Text style={styles.memberSince}>Member since {new Date(profile.memberSince).getFullYear()}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.warning} />
                  <Text style={styles.ratingText}>{profile.rating}</Text>
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.totalJobs}</Text>
                <Text style={styles.statLabel}>Completed Jobs</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityTitle}>Availability Status</Text>
            <Text style={styles.availabilitySubtitle}>
              {profile.isAvailable ? 'You are online and can receive orders' : 'You are offline'}
            </Text>
          </View>
          <Switch
            value={profile.isAvailable}
            onValueChange={handleAvailabilityToggle}
            trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
            thumbColor={profile.isAvailable ? Colors.primary : Colors.textLight}
            disabled={isLoading}
          />
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoContainer}>
          <View style={styles.quickInfoCard}>
            <Text style={styles.quickInfoTitle}>Vehicle Types</Text>
            <Text style={styles.quickInfoText}>{profile.vehicleTypes.join(', ')}</Text>
          </View>
          
          <View style={styles.quickInfoCard}>
            <Text style={styles.quickInfoTitle}>Services</Text>
            <Text style={styles.quickInfoText}>{profile.servicesOffered.join(', ')}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <PrimaryButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MoveEase Vendor v1.0.0</Text>
        </View>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  profileCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  companyName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactPerson: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  availabilityCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  availabilitySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  quickInfoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickInfoCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
  },
  quickInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quickInfoText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  menuContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});
