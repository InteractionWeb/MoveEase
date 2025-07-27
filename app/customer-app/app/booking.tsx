import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
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
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { Theme } from "../constants/Theme";

const { width, height } = Dimensions.get("window");
const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

export default function BookingScreen(): JSX.Element {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  const bookingDetails = [
    { label: "Provider", value: "Uneliable Movers Inc." },
    { label: "Estimated Time", value: "6 months" },
    { label: "Total Cost", value: "ur mom" },
  ];
  const bookingSummary = [
    { label: "Moving from", value: "123 Oak St to 456 Pine Ave" },
    { label: "Scheduled for", value: "July 20, 2026, 9:00 AM" },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Your move is booked!
        </Text>

        <Text style={[styles.subheading, { color: colors.tint }]}>
          You're all set for your move with MoveEase. Here's a summary of your
          booking:
        </Text>

        <View style={styles.imageContainer}>
          <ImageBackground
            source={require("../assets/images/siuu.jpg")}
            style={styles.image}
            imageStyle={{ borderRadius: Theme.borderRadius }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
              style={styles.gradientOverlay}
            >
              <View style={styles.summaryTextBox}>
                {bookingSummary.map((detail, index) => (
                  <Text
                    key={index}
                    style={[
                      index === 0 ? styles.summary : styles.detail,
                      { color: "white" },
                    ]}
                  >
                    {detail.label}: {detail.value}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {bookingDetails.map((detail, index) => (
            <View key={index}>
              <View
                style={{
                  marginBottom: 9,
                  borderWidth: 0.5,
                  width: "100%",
                  borderColor: colors.tabIconDefault,
                }}
              />

              <Text style={[styles.detail, { color: colors.text }]}>
                <Text style={{ color: colors.tint }}>{detail.label}</Text>
                {`: ${detail.value}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            style={[styles.thoseTwoButtons, {  backgroundColor: colors.tint, height:scale(55) }]}
            text="Track Move"
            textStyle={[
              styles.trackButtonText,
              { fontSize: scale(18), color: colors.background },
            ]}
            borderRadius={Theme.borderRadius}
            onPress={() => router.push("/tracker")}
          />
          <PrimaryButton
            style={[styles.thoseTwoButtons, { backgroundColor: colors.icon }]}
            text="Go to Home"
            textStyle={[styles.trackButtonText, { color: colors.background }]}
            borderRadius={Theme.borderRadius}
            onPress={() => router.back("/dashboard")}
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
  heading: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginTop: scale(23),
    textAlign: "center",
    marginBottom: scale(10),
  },
  subheading: {
    fontSize: scale(16),
    textAlign: "center",
    marginBottom: scale(16),
    paddingHorizontal: scale(16),
  },
  imageContainer: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    borderRadius: Theme.borderRadius,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: scale(300),
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: scale(12),
  },
  summaryTextBox: {
    paddingVertical: scale(4),
  },
  summary: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(6),
  },
  detail: {
    fontSize: scale(16),
    marginBottom: scale(8),
  },
  buttonWrapper: {
    paddingHorizontal: scale(16),
    marginTop: scale(16),
  },
  thoseTwoButtons: {
    borderRadius: scale(28),
    height: scale(46),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(12),
  },
  trackButtonText: {
    fontWeight: "500",
  },
});

