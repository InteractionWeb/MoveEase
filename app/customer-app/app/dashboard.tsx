import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import * as Location from 'expo-location';
import DateSelector from "../components/ui/DateSelector";
import Freelocationsearch from "../components/ui/Freelocationsearch";
import MapModal from "../components/ui/MapModal";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { auth, db } from "../firebaseConfig.js";
import { Order, OrderService } from "../services/orderService";
// import { Vendor, VendorService } from "../services/vendorService"; // Commented out until vendor app is ready

const { width } = Dimensions.get("window");
const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

const DashboardScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  // Form state
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [fromLocation, setFromLocation] = useState<{lat: number, lon: number} | null>(null);
  const [toLocation, setToLocation] = useState<{lat: number, lon: number} | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Loading and data state
  const [orders, setOrders] = useState<Order[]>([]);
  // const [vendors, setVendors] = useState<Vendor[]>([]); // Commented out until vendor app is ready
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  // Map modal state
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapModalType, setMapModalType] = useState<'from' | 'to'>('from');

  const vehicleOptions = [
    { label: "Small Van", value: "van" },
    { label: "Medium Truck", value: "truck" },
    { label: "Large Truck", value: "large_truck" },
  ];

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const userOrders = await OrderService.getUserOrders();
      // const availableVendors = await VendorService.getAvailableVendors(); // Commented out until vendor app is ready
      
      setOrders(userOrders);
      // setVendors(availableVendors); // Commented out until vendor app is ready
      
      // Load user location
      await loadUserLocation();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserLocation = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
      if (userDoc) {
        const data = userDoc.data();
        if (data.latitude && data.longitude) {
          setUserLocation({ latitude: data.latitude, longitude: data.longitude });
        }
      }
    } catch (error) {
      console.error('Failed to load user location:', error);
    }
  };

  const handleFindMovers = async () => {
    // Validation
    if (!fromAddress || !toAddress) {
      Alert.alert('Error', 'Please enter both pickup and drop-off locations');
      return;
    }
    if (!fromLocation || !toLocation) {
      Alert.alert('Error', 'Please select valid locations from the suggestions');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a moving date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle type');
      return;
    }

    setBookingLoading(true);
    try {
      // Calculate distance and cost
      const distance = OrderService.calculateDistance(
        fromLocation.lat, fromLocation.lon,
        toLocation.lat, toLocation.lon
      );
      const estimatedCost = OrderService.calculateCost(distance, selectedVehicle);
      const estimatedDuration = OrderService.estimateDuration(distance);

      // Create order
      const orderData = {
        fromAddress,
        toAddress,
        fromLatitude: fromLocation.lat,
        fromLongitude: fromLocation.lon,
        toLatitude: toLocation.lat,
        toLongitude: toLocation.lon,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        vehicleType: selectedVehicle,
        totalCost: estimatedCost,
        estimatedDuration,
        ...(specialInstructions && { specialInstructions }), // Only include if not empty
      };

      const orderId = await OrderService.createOrder(orderData);

      // Navigate to booking confirmation
      const userOrders = await OrderService.getUserOrders();
      const newOrder = userOrders.find(order => order.id === orderId);
      
      router.push({
        pathname: "/booking",
        params: { orderData: JSON.stringify(newOrder) }
      });
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const resetForm = () => {
    setFromAddress("");
    setToAddress("");
    setFromLocation(null);
    setToLocation(null);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedVehicle("");
    setSpecialInstructions("");
  };

  const handleMapPinPress = (type: 'from' | 'to') => {
    setMapModalType(type);
    setMapModalVisible(true);
  };

  const handleLocationFromMap = (location: { address: string; lat: number; lng: number }) => {
    if (mapModalType === 'from') {
      setFromAddress(location.address);
      setFromLocation({ lat: location.lat, lon: location.lng });
    } else {
      setToAddress(location.address);
      setToLocation({ lat: location.lat, lon: location.lng });
    }
  };

  const handleCurrentLocationPress = async (type: 'from' | 'to') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use current location feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Check if location is in Lahore (rough bounds)
      const isInLahore = latitude >= 31.3 && latitude <= 31.7 && longitude >= 74.1 && longitude <= 74.5;
      
      if (!isInLahore) {
        Alert.alert(
          'Location Not Available',
          'Your current location is outside Lahore. Please select a location within the city.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Reverse geocode to get address
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodeResult && geocodeResult.length > 0) {
        const result = geocodeResult[0];
        const address = [result.name, result.street, result.city, result.region]
          .filter(Boolean)
          .join(', ');

        if (type === 'from') {
          setFromAddress(address);
          setFromLocation({ lat: latitude, lon: longitude });
        } else {
          setToAddress(address);
          setToLocation({ lat: latitude, lon: longitude });
        }
      } else {
        if (type === 'from') {
          setFromAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setFromLocation({ lat: latitude, lon: longitude });
        } else {
          setToAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setToLocation({ lat: latitude, lon: longitude });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get current location. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/booking",
      params: { orderData: JSON.stringify(order) }
    });
  };

  const getOrderIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🚚';
      case 'confirmed': return '📋';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

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

  const formatOrderAddress = (fromAddress: string, toAddress: string) => {
    const fromShort = fromAddress.split(',')[0] || fromAddress.substring(0, 20);
    const toShort = toAddress.split(',')[0] || toAddress.substring(0, 20);
    return `${fromShort} → ${toShort}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuIcon}>
            <Text style={[styles.menuText, { color: colors.tint }]}>≡</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Move<Text style={{ color: colors.tint }}>Ease</Text>
          </Text>
          <TouchableOpacity
            style={[styles.profileIconBox, { backgroundColor: colors.background }]}
            onPress={() => router.push("./profile")}
          >
            <View style={[styles.profileIcon, { backgroundColor: colors.background }]}>
              <Text style={[styles.profileIconText, { color: colors.text }]}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Book a Moving Service
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.tint }]}>
            Find and book trusted movers easily.
          </Text>

          {/* Booking Form */}
          <View style={styles.inputGroup}>
            {/* From Location */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>From</Text>
              <View style={styles.locationInputContainer}>
                <View style={[styles.inputBox, styles.locationInputBox, { backgroundColor: colors.background, borderColor: colors.tint }]}>
                  <Freelocationsearch
                    onSelect={(location) => {
                      setFromAddress(location.name);
                      setFromLocation({ lat: location.lat, lon: location.lon });
                    }}
                    value={fromAddress}
                  />
                </View>
                <View style={styles.locationButtons}>
                  <TouchableOpacity
                    style={[styles.locationButton, { backgroundColor: colors.tint }]}
                    onPress={() => handleMapPinPress('from')}
                  >
                    <Ionicons name="location" size={20} color={colors.background} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.locationButton, { backgroundColor: colors.tint }]}
                    onPress={() => handleCurrentLocationPress('from')}
                  >
                    <Ionicons name="navigate" size={20} color={colors.background} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* To Location */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>To</Text>
              <View style={styles.locationInputContainer}>
                <View style={[styles.inputBox, styles.locationInputBox, { backgroundColor: colors.background, borderColor: colors.tint }]}>
                  <Freelocationsearch
                    onSelect={(location) => {
                      setToAddress(location.name);
                      setToLocation({ lat: location.lat, lon: location.lon });
                    }}
                    value={toAddress}
                  />
                </View>
                <View style={styles.locationButtons}>
                  <TouchableOpacity
                    style={[styles.locationButton, { backgroundColor: colors.tint }]}
                    onPress={() => handleMapPinPress('to')}
                  >
                    <Ionicons name="location" size={20} color={colors.background} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.locationButton, { backgroundColor: colors.tint }]}
                    onPress={() => handleCurrentLocationPress('to')}
                  >
                    <Ionicons name="navigate" size={20} color={colors.background} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Date and Time Row */}
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Date</Text>
                <DateSelector
                  placeholder="Select date"
                  value={selectedDate || new Date()}
                  onChange={setSelectedDate}
                  style={{
                    ...styles.inputBox,
                    backgroundColor: colors.background,
                    borderColor: colors.tint,
                  }}
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Time</Text>
                <TouchableOpacity
                  style={[styles.inputBox, styles.dropdownBox, { backgroundColor: colors.background, borderColor: colors.tint }]}
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                  <Text style={{ color: selectedTime ? colors.text : colors.tint, fontSize: scale(16) }}>
                    {selectedTime || "Select time"}
                  </Text>
                  <Text style={[styles.dropdownArrow, { color: colors.tint }]}>▼</Text>
                </TouchableOpacity>
                
                {dropdownVisible && (
                  <View style={[styles.dropdownMenuInline, { backgroundColor: colors.background, borderColor: colors.tint }]}>
                    {timeSlots.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedTime(time);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, { color: colors.text }]}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Vehicle Selection */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Vehicle Type</Text>
              <View style={styles.vehicleOptions}>
                {vehicleOptions.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.value}
                    style={[
                      styles.vehicleOption,
                      selectedVehicle === vehicle.value && styles.vehicleOptionSelected,
                      { borderColor: colors.tint, backgroundColor: selectedVehicle === vehicle.value ? colors.tint : colors.background }
                    ]}
                    onPress={() => setSelectedVehicle(vehicle.value)}
                  >
                    <Text
                      style={[
                        styles.vehicleOptionText,
                        { color: selectedVehicle === vehicle.value ? colors.background : colors.text }
                      ]}
                    >
                      {vehicle.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Instructions */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Special Instructions (Optional)</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.tint, color: colors.text }]}
                placeholder="Any special requirements or notes..."
                placeholderTextColor={colors.tint}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Find Movers Button */}
          <PrimaryButton
            title={bookingLoading ? "Creating Booking..." : "Find Movers"}
            onPress={handleFindMovers}
            disabled={bookingLoading}
            style={{
              ...styles.findMoversButton,
              backgroundColor: colors.tint,
            }}
            textStyle={{
              ...styles.findMoversText,
              color: colors.background,
            }}
          />

          {/* How It Works Section */}
          <View style={styles.howItWorksBox}>
            <View style={[styles.illustrationImg, { backgroundColor: colors.tint + '20', justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="cube-outline" size={60} color={colors.tint} />
            </View>
            <View style={styles.howItWorksSteps}>
              <Text style={[styles.howItWorksTitle, { color: colors.text }]}>
                How it works
              </Text>
              <View style={styles.howItWorksRow}>
                <Text style={styles.howItWorksIcon}>📝</Text>
                <Text style={[styles.howItWorksText, { color: colors.text }]}>
                  Describe Your Move
                </Text>
              </View>
              <View style={styles.howItWorksRow}>
                <Text style={styles.howItWorksIcon}>✅</Text>
                <Text style={[styles.howItWorksText, { color: colors.text }]}>
                  Compare Vendors
                </Text>
              </View>
              <View style={styles.howItWorksRow}>
                <Text style={styles.howItWorksIcon}>🚚</Text>
                <Text style={[styles.howItWorksText, { color: colors.text }]}>
                  Select a Mover
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Orders */}
          {orders.length > 0 && (
            <View style={styles.ordersSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
              {orders.slice(0, 3).map((order, index) => (
                <TouchableOpacity
                  key={order.id || index}
                  style={[styles.orderItem, { backgroundColor: colors.background, borderColor: colors.tint }]}
                  onPress={() => handleOrderPress(order)}
                >
                  <Text style={styles.orderIcon}>{getOrderIcon(order.status)}</Text>
                  <View style={styles.orderDetails}>
                    <Text style={[styles.orderDate, { color: colors.text }]}>
                      {formatOrderDate(order.scheduledDate)}
                    </Text>
                    <Text style={[styles.orderAddress, { color: colors.text }]} numberOfLines={1}>
                      {formatOrderAddress(order.fromAddress, order.toAddress)}
                    </Text>
                    <Text style={[styles.orderVendor, { color: colors.tint }]}>
                      {order.vendorName || 'Assigning vendor...'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.tint} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Map Modal */}
      <MapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onLocationSelect={handleLocationFromMap}
        initialLocation={
          mapModalType === 'from' && fromLocation
            ? { lat: fromLocation.lat, lng: fromLocation.lon }
            : mapModalType === 'to' && toLocation
            ? { lat: toLocation.lat, lng: toLocation.lon }
            : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: scale(16),
    fontSize: scale(16),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
  },
  menuIcon: { 
    padding: scale(8) 
  },
  menuText: { 
    fontSize: scale(28), 
    fontWeight: "700" 
  },
  headerTitle: {
    fontSize: scale(28),
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  profileIconBox: { 
    padding: scale(8) 
  },
  profileIcon: {
    borderRadius: 20,
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  profileIconText: { 
    fontSize: scale(24) 
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: scale(26),
    fontWeight: "700",
    marginLeft: scale(16),
    marginTop: scale(8),
    marginBottom: scale(4),
  },
  pageSubtitle: {
    fontSize: scale(16),
    marginLeft: scale(16),
    marginBottom: scale(16),
  },
  inputGroup: { 
    marginHorizontal: scale(16), 
    marginBottom: scale(12) 
  },
  inputWrapper: {
    marginBottom: scale(16),
  },
  inputLabel: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: scale(8),
  },
  inputBox: {
    borderRadius: 12,
    minHeight: scale(48),
    fontSize: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderWidth: 1,
    justifyContent: 'center',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInputBox: {
    flex: 1,
    marginRight: scale(8),
  },
  locationButtons: {
    flexDirection: 'row',
    gap: scale(4),
  },
  locationButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { 
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownArrow: { 
    fontSize: scale(16), 
    fontWeight: "700" 
  },
  dropdownMenuInline: {
    position: "absolute",
    top: scale(50),
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 12,
    paddingVertical: scale(8),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: { 
    paddingVertical: scale(12), 
    paddingHorizontal: scale(18) 
  },
  dropdownItemText: { 
    fontSize: scale(16) 
  },
  vehicleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleOption: {
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    marginBottom: scale(8),
    minWidth: '30%',
    alignItems: 'center',
  },
  vehicleOptionSelected: {
    // Selected state handled by backgroundColor in JSX
  },
  vehicleOptionText: {
    fontSize: scale(14),
    fontWeight: '500',
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    fontSize: scale(16),
    textAlignVertical: 'top',
    minHeight: scale(80),
  },
  findMoversButton: {
    borderRadius: 24,
    height: scale(52),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginVertical: scale(16),
  },
  findMoversText: { 
    fontSize: scale(20), 
    fontWeight: "600" 
  },
  howItWorksBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginVertical: scale(16),
  },
  illustrationImg: {
    width: scale(90),
    height: scale(90),
    resizeMode: "contain",
    borderRadius: scale(12),
  },
  howItWorksSteps: { 
    flex: 1,
    marginLeft: scale(16),
  },
  howItWorksTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    marginBottom: scale(8),
  },
  howItWorksRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale(6),
  },
  howItWorksIcon: { 
    fontSize: scale(18), 
    marginRight: scale(8) 
  },
  howItWorksText: { 
    fontSize: scale(16) 
  },
  ordersSection: {
    marginHorizontal: scale(16),
    marginTop: scale(20),
    marginBottom: scale(20),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    marginBottom: scale(12),
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(12),
    borderWidth: 1,
    marginBottom: scale(8),
  },
  orderIcon: {
    fontSize: scale(24),
    marginRight: scale(12),
  },
  orderDetails: {
    flex: 1,
  },
  orderDate: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: scale(2),
  },
  orderAddress: {
    fontSize: scale(16),
    marginBottom: scale(2),
  },
  orderVendor: {
    fontSize: scale(12),
  },
});

export default DashboardScreen;