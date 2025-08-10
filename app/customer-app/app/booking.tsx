import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton.js";
import { Colors } from "../constants/Colors.js";
import { Theme } from "../constants/Theme.js";
import { Order, OrderService } from "../services/orderService.js";

const { width, height } = Dimensions.get("window");
const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

// Helper function to safely format dates
const formatOrderDate = (scheduledDate: any) => {
  if (!scheduledDate) return 'Date not set';
  
  // If it's already a Date object
  if (scheduledDate instanceof Date) {
    return scheduledDate.toLocaleDateString();
  }
  
  // If it's a Firestore timestamp
  if (scheduledDate.toDate && typeof scheduledDate.toDate === 'function') {
    return scheduledDate.toDate().toLocaleDateString();
  }
  
  // If it's a string or number, try to convert
  try {
    const date = new Date(scheduledDate);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error parsing date:', error);
  }
  
  return 'Date not set';
};

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme() || "light";
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = async () => {
    try {
      // If we have order data passed from dashboard, use it
      if (params.orderData) {
        const orderData = JSON.parse(params.orderData as string);
        
        // Convert date strings back to Date objects after JSON parsing
        const processedOrder = {
          ...orderData,
          scheduledDate: orderData.scheduledDate ? new Date(orderData.scheduledDate) : new Date(),
          createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
          updatedAt: orderData.updatedAt ? new Date(orderData.updatedAt) : new Date(),
        };
        
        setOrder(processedOrder);
      } else {
        // Otherwise fetch latest order
        const orders = await OrderService.getUserOrders();
        if (orders.length > 0) {
          setOrder(orders[0]); // Get the most recent order
        }
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackMove = () => {
    if (order) {
      router.push({
        pathname: "/tracker",
        params: { orderId: order.id }
      });
    } else {
      router.push("/tracker");
    }
  };

  const handleContactVendor = () => {
    if (order?.vendorId) {
      router.push({
        pathname: "/contact",
        params: { vendorId: order.vendorId }
      });
    } else {
      Alert.alert('Info', 'Vendor will be assigned soon');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading booking details...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.tint} style={{ alignSelf: 'center', marginBottom: 16 }} />
        <Text style={[styles.heading, { color: colors.text }]}>No Booking Found</Text>
        <Text style={[styles.subheading, { color: colors.text }]}>
          You haven't made any bookings yet.
        </Text>
        <PrimaryButton
          title="Create New Booking"
          onPress={() => router.push("/dashboard")}
          style={styles.createBookingButton}
        />
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#4CAF50';
      case 'in_progress': return '#2196F3';
      case 'completed': return '#8BC34A';
      case 'cancelled': return '#F44336';
      default: return colors.tint;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons 
            name="checkmark-circle" 
            size={64} 
            color="#4CAF50" 
            style={{ alignSelf: 'center', marginBottom: 16 }} 
          />
          <Text style={[styles.heading, { color: colors.text }]}>
            Your move is booked!
          </Text>
          <Text style={[styles.subheading, { color: colors.text }]}>
            You're all set for your move with MoveEase. Here's a summary of your booking:
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={[styles.statusText, { color: 'white' }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={[styles.detailsContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>From:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
              {order.fromAddress}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>To:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={2}>
              {order.toAddress}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Date:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatOrderDate(order.scheduledDate)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Time:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {order.scheduledTime}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Vehicle:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {order.vehicleType.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>Estimated Duration:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {order.estimatedDuration}
            </Text>
          </View>
          
          <View style={[styles.detailRow, styles.totalCostRow]}>
            <Text style={[styles.detailLabel, styles.totalCostLabel, { color: colors.text }]}>Total Cost:</Text>
            <Text style={[styles.detailValue, styles.totalCostValue, { color: colors.tint }]}>
              ${order.totalCost}
            </Text>
          </View>
          
          {order.vendorName && (
            <View style={styles.vendorSection}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scale(16), marginBottom: scale(8) }]}>
                Assigned Vendor
              </Text>
              <Text style={[styles.vendorName, { color: colors.text }]}>
                {order.vendorName}
              </Text>
              {order.vendorPhone && (
                <Text style={[styles.vendorPhone, { color: colors.tint }]}>
                  {order.vendorPhone}
                </Text>
              )}
            </View>
          )}
          
          {order.specialInstructions && (
            <View style={styles.instructionsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scale(16), marginBottom: scale(8) }]}>
                Special Instructions
              </Text>
              <Text style={[styles.instructionsText, { color: colors.text }]}>
                {order.specialInstructions}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            style={{
              ...styles.actionButton,
              backgroundColor: colors.tint,
            }}
            title="Track Move"
            textStyle={{
              ...styles.buttonText,
              color: colors.background,
            }}
            onPress={handleTrackMove}
          />

          {order.vendorId && (
            <PrimaryButton
              style={{
                ...styles.actionButton,
                backgroundColor: colors.icon,
              }}
              title="Contact Vendor"
              textStyle={{
                ...styles.buttonText,
                color: colors.background,
              }}
              onPress={handleContactVendor}
            />
          )}

          <PrimaryButton
            style={{
              ...styles.actionButton,
              backgroundColor: '#6c757d',
            }}
            title="Go to Dashboard"
            textStyle={{
              ...styles.buttonText,
              color: 'white',
            }}
            onPress={() => router.push("/dashboard")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: scale(20),
    paddingHorizontal: scale(16),
    alignItems: 'center',
    marginBottom: scale(20),
  },
  heading: {
    fontSize: scale(24),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scale(10),
  },
  subheading: {
    fontSize: scale(16),
    textAlign: "center",
    paddingHorizontal: scale(16),
    lineHeight: scale(22),
  },
  loadingText: {
    textAlign: 'center',
    marginTop: scale(16),
    fontSize: scale(16),
  },
  createBookingButton: {
    marginHorizontal: scale(20),
    marginTop: scale(20),
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  statusBadge: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(20),
  },
  statusText: {
    fontSize: scale(14),
    fontWeight: '600',
  },
  detailsContainer: {
    marginHorizontal: scale(16),
    padding: scale(20),
    borderRadius: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(16),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(12),
  },
  detailLabel: {
    fontSize: scale(14),
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: scale(14),
    flex: 2,
    textAlign: 'right',
  },
  totalCostRow: {
    marginTop: scale(8),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalCostLabel: {
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  totalCostValue: {
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  vendorSection: {
    marginTop: scale(16),
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  vendorName: {
    fontSize: scale(16),
    fontWeight: '600',
    marginBottom: scale(4),
  },
  vendorPhone: {
    fontSize: scale(14),
  },
  instructionsSection: {
    marginTop: scale(16),
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionsText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  actionButton: {
    marginVertical: scale(8),
  },
  buttonText: {
    fontWeight: '600',
    fontSize: scale(16),
  },
});

