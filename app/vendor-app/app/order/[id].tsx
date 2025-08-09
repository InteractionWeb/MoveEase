import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import PrimaryButton from '../../components/ui/PrimaryButton';

interface OrderDetails {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  pickup: {
    address: string;
    coordinates: { lat: number; lng: number };
    contactName?: string;
    contactPhone?: string;
    accessNotes?: string;
  };
  dropoff: {
    address: string;
    coordinates: { lat: number; lng: number };
    contactName?: string;
    contactPhone?: string;
    accessNotes?: string;
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  distance: string;
  estimatedDuration: string;
  items: Array<{
    name: string;
    quantity: number;
    weight?: string;
    dimensions?: string;
    special?: boolean;
  }>;
  specialInstructions?: string;
  photos?: string[];
  createdAt: string;
}

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, fetch from API
  const [orderDetails] = useState<OrderDetails>({
    id: id as string,
    customer: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      rating: 4.8,
      reviewCount: 23,
    },
    pickup: {
      address: '123 Main St, Downtown, City 12345',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      contactName: 'John Smith',
      contactPhone: '+1 (555) 123-4567',
      accessNotes: 'Third floor apartment, no elevator. Use buzzer #3A.',
    },
    dropoff: {
      address: '456 Oak Ave, Uptown, City 67890',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      contactName: 'John Smith',
      contactPhone: '+1 (555) 123-4567',
      accessNotes: 'Ground floor, parking available in front.',
    },
    status: 'pending',
    amount: 350,
    scheduledDate: '2025-08-11',
    scheduledTime: '10:00 AM',
    distance: '12.5 miles',
    estimatedDuration: '3-4 hours',
    items: [
      { name: 'Queen Size Bed', quantity: 1, weight: '150 lbs', dimensions: '60" x 80"', special: false },
      { name: 'Dresser', quantity: 1, weight: '80 lbs', dimensions: '48" x 20" x 32"', special: false },
      { name: 'Sofa', quantity: 1, weight: '120 lbs', dimensions: '84" x 36" x 32"', special: false },
      { name: 'Dining Table', quantity: 1, weight: '60 lbs', dimensions: '48" round', special: false },
      { name: 'Dining Chairs', quantity: 4, weight: '15 lbs each', special: false },
      { name: 'TV (65")', quantity: 1, weight: '55 lbs', special: true },
      { name: 'Moving Boxes', quantity: 15, weight: '30 lbs avg', special: false },
    ],
    specialInstructions: 'Please be extra careful with the TV - it\'s brand new. The building has narrow stairs, so items may need to be carried carefully. Customer will be available all day.',
    photos: [],
    createdAt: '2025-08-10T14:30:00Z',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'accepted': return Colors.primary;
      case 'in_progress': return Colors.accent;
      case 'completed': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Awaiting Response';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleAcceptOrder = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement accept order API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Order accepted successfully!');
      // Update status or navigate back
    } catch (error) {
      Alert.alert('Error', 'Failed to accept order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineOrder = () => {
    Alert.alert(
      'Decline Order',
      'Are you sure you want to decline this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: Implement decline order API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert('Order Declined', 'You have declined this order.');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to decline order. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleStartJob = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement start job API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Job Started', 'You have started this moving job.');
      // Update status
    } catch (error) {
      Alert.alert('Error', 'Failed to start job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    Alert.alert(
      'Complete Job',
      'Mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: Implement complete job API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert('Job Completed', 'Congratulations! Job completed successfully.');
              // Navigate to rating/feedback screen or back
            } catch (error) {
              Alert.alert('Error', 'Failed to complete job. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = (phoneNumber: string) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const handleNavigate = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`maps:?q=${encodedAddress}`);
  };

  const renderActionButtons = () => {
    switch (orderDetails.status) {
      case 'pending':
        return (
          <View style={styles.actionButtons}>
            <PrimaryButton
              title="Accept Order"
              onPress={handleAcceptOrder}
              loading={isLoading}
              style={styles.acceptButton}
            />
            <PrimaryButton
              title="Decline"
              onPress={handleDeclineOrder}
              variant="outline"
              disabled={isLoading}
              style={styles.declineButton}
            />
          </View>
        );
      case 'accepted':
        return (
          <View style={styles.actionButtons}>
            <PrimaryButton
              title="Start Job"
              onPress={handleStartJob}
              loading={isLoading}
              style={styles.fullWidthButton}
            />
          </View>
        );
      case 'in_progress':
        return (
          <View style={styles.actionButtons}>
            <PrimaryButton
              title="Complete Job"
              onPress={handleCompleteJob}
              loading={isLoading}
              style={styles.fullWidthButton}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => handleCall(orderDetails.customer.phone)}
        >
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderDetails.status) }]}>
              <Text style={styles.statusText}>{getStatusText(orderDetails.status)}</Text>
            </View>
            <Text style={styles.orderAmount}>${orderDetails.amount}</Text>
          </View>
          <Text style={styles.orderDate}>
            {orderDetails.scheduledDate} • {orderDetails.scheduledTime}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{orderDetails.customer.name.charAt(0)}</Text>
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{orderDetails.customer.name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.warning} />
                  <Text style={styles.ratingText}>
                    {orderDetails.customer.rating} ({orderDetails.customer.reviewCount} reviews)
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleCall(orderDetails.customer.phone)}
              >
                <Ionicons name="call" size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleMessage(orderDetails.customer.phone)}
              >
                <Ionicons name="chatbubble" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Details</Text>
          <View style={styles.routeCard}>
            <View style={styles.locationContainer}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationAddress}>{orderDetails.pickup.address}</Text>
                {orderDetails.pickup.accessNotes && (
                  <Text style={styles.accessNotes}>{orderDetails.pickup.accessNotes}</Text>
                )}
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => handleNavigate(orderDetails.pickup.address)}
                >
                  <Ionicons name="navigate" size={16} color={Colors.primary} />
                  <Text style={styles.navigateText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.routeConnector} />

            <View style={styles.locationContainer}>
              <View style={styles.locationIcon}>
                <Ionicons name="flag" size={20} color={Colors.accent} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Delivery Location</Text>
                <Text style={styles.locationAddress}>{orderDetails.dropoff.address}</Text>
                {orderDetails.dropoff.accessNotes && (
                  <Text style={styles.accessNotes}>{orderDetails.dropoff.accessNotes}</Text>
                )}
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => handleNavigate(orderDetails.dropoff.address)}
                >
                  <Ionicons name="navigate" size={16} color={Colors.primary} />
                  <Text style={styles.navigateText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeInfoItem}>
                <Text style={styles.routeInfoLabel}>Distance</Text>
                <Text style={styles.routeInfoValue}>{orderDetails.distance}</Text>
              </View>
              <View style={styles.routeInfoItem}>
                <Text style={styles.routeInfoLabel}>Duration</Text>
                <Text style={styles.routeInfoValue}>{orderDetails.estimatedDuration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items to Move</Text>
          <View style={styles.itemsCard}>
            {orderDetails.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.special && (
                      <View style={styles.specialBadge}>
                        <Text style={styles.specialText}>Special</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  {item.weight && (
                    <Text style={styles.itemDetails}>Weight: {item.weight}</Text>
                  )}
                  {item.dimensions && (
                    <Text style={styles.itemDetails}>Dimensions: {item.dimensions}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Special Instructions */}
        {orderDetails.specialInstructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <View style={styles.instructionsCard}>
              <Ionicons name="information-circle" size={20} color={Colors.warning} />
              <Text style={styles.instructionsText}>
                {orderDetails.specialInstructions}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {renderActionButtons()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statusCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  orderAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  orderDate: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  customerCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  accessNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  navigateText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  routeConnector: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: 15,
    marginVertical: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 24,
  },
  routeInfoItem: {
    flex: 1,
  },
  routeInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemsCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  itemRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  specialBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  specialText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  instructionsCard: {
    backgroundColor: Colors.warning + '20',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 2,
  },
  declineButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});
