import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Dimensions,
    PixelRatio,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";
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

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={normalize(24)}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Live Move Tracker
        </Text>
        <View style={{ width: normalize(30) }} />
      </View>

      <PrimaryButton
        style={[styles.contactMoversButton, { backgroundColor: colors.tint }]}
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
});
