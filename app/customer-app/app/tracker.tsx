import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { Theme } from "../constants/Theme";
import { auth, db } from "../firebaseConfig.js";
import { Order, OrderService } from "../services/orderService";

// Responsive utility
const { width } = Dimensions.get("window");
const scale = width / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function TrackerScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const colorScheme = useColorScheme() || "light";
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
        if (userDoc) {
          const data = userDoc.data();
          if (data.latitude) setLatitude(data.latitude);
          if (data.longitude) setLongitude(data.longitude);
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;
      
      try {
        // First try to get from OrderService
        const userOrders = await OrderService.getUserOrders();
        const order = userOrders.find(order => order.id === orderId);
        
        if (order) {
          setOrderData(order);
        } else {
          // Fallback to direct Firestore query
          const ordersSnapshot = await getDocs(collection(db, "orders"));
          const orderDoc = ordersSnapshot.docs.find(doc => doc.id === orderId);
          if (orderDoc) {
            setOrderData({ id: orderDoc.id, ...orderDoc.data() });
          }
        }
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const orders = [
    {
      icon: "✔️",
      date: "April 20",
      address: "123 Main St → 456 Elm St",
      vendor: "Movers Co.",
      onPress: () => {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Live EasyMove Tracker</Text>
        <View style={{ width: normalize(30) }} />
      </View>

      <View style={styles.mapContainer}>
        {latitude !== null && longitude !== null ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        ) : (
          <View style={[styles.map, { justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ color: colors.text }}>No location data available</Text>
          </View>
        )}
      </View>

      <View style={styles.coordinatesContainer}>
        <Text style={[styles.coordinateText, { color: colors.text }]}>
          Latitude: {latitude !== null ? latitude.toFixed(6) : "N/A"}
        </Text>
        <Text style={[styles.coordinateText, { color: colors.text }]}>
          Longitude: {longitude !== null ? longitude.toFixed(6) : "N/A"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={orders}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 16,
                  padding: 12,
                  marginBottom: 10,
                  borderWidth: 1,
                  backgroundColor: colors.card,
                  borderColor: colors.card,
                  marginHorizontal: 40,
                },
              ]}
            >
              <View style={[{
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                backgroundColor: colors.tint,
              }]}>
                <Text style={[{
                  fontSize: 18,
                  color: colors.background,
                }]}>
                  📦
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }]}>
                  {item.date}
                </Text>
                <Text style={[{
                  fontSize: 15,
                  color: colors.tint,
                }]}>
                  {item.address}
                </Text>
                <Text style={[{
                  fontSize: 14,
                  color: colors.tint,
                }]}>
                  Vendor: {item.vendor}
                </Text>
              </View>
              <TouchableOpacity
                style={[{
                  borderRadius: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  marginLeft: 8,
                  backgroundColor: colors.tint,
                }]}
                onPress={item.onPress}
              >
                <Text style={[{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.background,
                }]}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={[styles.ordercontainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.placeholderText, { color: colors.text, marginTop: 20 }]}>
                No orders available.
              </Text>
              <Text style={[styles.placeholderText, { color: colors.text, marginTop: 20 }]}>
                Your tracking information will appear here.
              </Text>
            </View>
          )}
        />
      </View>

      <PrimaryButton
        style={{
          ...styles.contactMoversButton,
          backgroundColor: colors.tint,
          marginBottom: normalize(20),
          height: normalize(66),
        }}
        title="Contact Movers"
        textStyle={{
          ...styles.trackButtonText,
          color: colors.background,
        }}
        onPress={() => {
          if (orderData && orderData.vendorId && orderData.vendorName) {
            router.push({
              pathname: "/chat",
              params: { 
                orderId: orderData.id,
                vendorId: orderData.vendorId,
                vendorName: orderData.vendorName
              }
            });
          } else {
            // Fallback for orders without vendor assigned yet
            alert("Vendor not assigned yet. Please check back later.");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(16),
    marginVertical: normalize(20),
    top: normalize(25),
    justifyContent: "space-between",
  },
  backButton: {
    padding: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: "700",
  },
  contactMoversButton: {
    marginTop: "auto",
    marginHorizontal: normalize(14),
    borderRadius: normalize(28),
    height: normalize(46),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(12),
  },
  trackButtonText: {
    fontWeight: "500",
  },
  placeholderText: {
    fontSize: normalize(18),
    fontStyle: "italic",
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: normalize(200),
    borderRadius: normalize(12),
    alignSelf: "center",
  },
  mapContainer: {
    width: "100%",
    top: normalize(20),
    height: normalize(200),
    borderRadius: normalize(12),
    overflow: "hidden",
    backgroundColor: "transparent",
    padding: normalize(2),
  },
  ordercontainer: {
    height: normalize(400),
    backgroundColor: "blue",
  },
  coordinatesContainer: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(12),
    alignItems: "center",
  },
  coordinateText: {
    fontSize: normalize(16),
    fontWeight: "600",
  },
  
});
