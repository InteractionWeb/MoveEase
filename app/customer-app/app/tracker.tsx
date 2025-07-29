import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { WebView } from "react-native-webview";
import OrderList from "../components/ui/Orderlist";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { Theme } from "../constants/Theme";

// Responsive utility
const { width } = Dimensions.get("window");
const scale = width / 375;

const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function TrackerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  const orders = [
    {
      icon: "✔️",
      date: "April 20",
      address: "123 Main St → 456 Elm St",
      vendor: "Movers Co.",
      onPress: () => {},
    },
    {
      icon: "📦",
      date: "May 5",
      address: "789 Oak St → 321 Pine St",
      vendor: "Fast Movers",
      onPress: () => {},
    },
    {
      icon: "🚚",
      date: "June 10",
      address: "555 Maple St → 777 Cedar St",
      vendor: "Quick Move",
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
        <WebView
          source={{ uri: 'https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.75%2C-122.40%2C37.80&layer=mapnik' }}
          style={styles.map}
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <OrderList orders={[item]} colors={colors} />
        )}
        ListEmptyComponent={() => (
          <Text style={[styles.placeholderText, { color: colors.text, marginTop: 20 }]}>
            No orders available.
          </Text>
        )}
      />

      <Text style={[styles.placeholderText, { color: colors.text, marginTop: 20 }]}>
        Your tracking information will appear here.
      </Text>

      <PrimaryButton
        style={[styles.contactMoversButton, { backgroundColor: colors.tint, marginTop: 20 }]}
        text="Contact Movers"
        textStyle={[styles.trackButtonText, { color: colors.background }]}
        borderRadius={Theme.borderRadius}
        onPress={() => router.push("/contact")}
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
    marginTop: 'auto',
    marginHorizontal: normalize(14),
    borderRadius: normalize(28),
    height: normalize(46),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(12),
    // alignSelf:"flex-end"
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
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(12),
  },
  mapContainer: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(12),
    overflow: 'hidden',
  },
});
