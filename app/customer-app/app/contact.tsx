import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { Theme } from "../constants/Theme";

// Responsive utility
const { width } = Dimensions.get("window");
const scale = width / 375;

const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function ContactScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  const [userName, setUserName] = useState("Ethan Carter");
  const [moverType, setmoverType] = useState("Lead Mover");
  const [profileImage, setProfileImage] = useState(
    require("../assets/images/siuu.jpg")
  );

  const moverContacts = [
    {
      section: "Contact Information",
      items: [
        {
          label: "Phone",
          icon: "📞",
          content: "0314-77141714",
          onPress: () => alert("needs linking to database"),
        },
        {
          label: "Email",
          icon: "📧",
          content: "zulifqarveila@yahoo.com",
          onPress: () => alert("needs linking to database"),
        },
      ],
    },
  ];

  return (
    <ScrollView
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
          Contact Movers
        </Text>
        <View style={{ width: normalize(30) }} />
      </View>

      <View style={styles.profileSection}>
        <Image source={profileImage} style={styles.profileImage} />
        <View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userName}
          </Text>
          <Text style={[styles.moverType, { color: colors.tint }]}>
            {moverType}
          </Text>
        </View>
      </View>

      {moverContacts.map((section, idx) => (
        <View key={idx} style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.section}
          </Text>
          {section.items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.moverContact, { borderColor: colors.tint }]}
              onPress={item.onPress}
            >
              <Text style={styles.moverContactIcon}>{item.icon}</Text>
              <View>
                <Text style={[styles.moverContactText, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.moverContactText, { color: colors.text }]}>
                  {item.content}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <PrimaryButton
        style={[styles.contactMoversButton, { backgroundColor: colors.tint }]}
        text="Chat with Movers"
        textStyle={[styles.trackButtonText, { color: colors.background }]}
        borderRadius={Theme.borderRadius}
        onPress={() => alert('Come over here lil mama lemme whisper in yo earrr') }
      />
    </ScrollView>
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
  profileSection: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: normalize(20),
  },
  profileImage: {
    width: normalize(150),
    height: normalize(150),
    borderRadius: normalize(80),
    margin: normalize(14),
  },
  userName: {
    fontSize: normalize(24),
    fontWeight: "700",
  },
  moverType: {
    fontSize: normalize(16),
    color: "#6b7c93",
    marginTop: normalize(4),
  },
  contactSection: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(24),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: "700",
    marginBottom: normalize(12),
  },
  moverContact: {
    flexDirection: 'row',
    paddingVertical: normalize(14),
  },
  moverContactIcon: {
    fontSize: normalize(24),
    padding: normalize(4),
  },
  moverContactText: {
    fontSize: normalize(16),
    marginLeft: normalize(13),
  },
  contactMoversButton: {
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
});
