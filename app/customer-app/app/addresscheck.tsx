import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Colors } from "../constants/Colors";
import { LOCATIONIQ_API_KEY, API_ENDPOINTS } from "../constants/Config";
import { auth, db } from "../firebaseConfig.js";

// Responsive utility
const { width } = Dimensions.get("window");
const scale = width / 375;
const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function AddressCheck() {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userDoc = usersSnapshot.docs.find(
          (doc) => doc.data().email === user.email
        );
        if (userDoc) {
          const data = userDoc.data();
          if (data.latitude) setLatitude(data.latitude);
          if (data.longitude) setLongitude(data.longitude);
          if (data.address) setAddress(data.address);
        }
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    };
    fetchLocation();
  }, []);

  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchAddressSuggestions = async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `${API_ENDPOINTS.LOCATIONIQ_SEARCH}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onAddressChange = (text: string) => {
    setAddress(text);
    fetchAddressSuggestions(text);
  };

  const onSelectSuggestion = (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    setAddress(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setShowSuggestions(false);
  };

  const geocodeAddress = async () => {
    if (!address) {
      Alert.alert("Error", "Please enter an address to geocode.");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Geocoding address:", address);
      const response = await fetch(
        `${API_ENDPOINTS.LOCATIONIQ_SEARCH}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      if (!response.ok) {
        console.error("Geocoding API response not ok:", response.status);
        Alert.alert("Error", `Geocoding API error: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log("Geocoding API response data:", data);
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLatitude(lat);
        setLongitude(lon);
        
        // Update user's address in database
        await updateUserAddress(address, lat, lon);
        
        Alert.alert("Success", "Address geocoded and saved successfully.");
      } else {
        Alert.alert("Error", "Unable to geocode the address.");
      }
    } catch (error) {
      console.error("Geocoding fetch error:", error);
      Alert.alert("Error", "Failed to fetch geocoding data.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAddress = async (newAddress: string, lat: number, lon: number) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
      if (userDoc) {
        const userRef = doc(db, 'users', userDoc.id);
        await updateDoc(userRef, {
          address: newAddress,
          latitude: lat,
          longitude: lon,
        });
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Address Check</Text>
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
            <Marker coordinate={{ latitude, longitude }} title="Your Location" />
          </MapView>
        ) : (
          <View
            style={[styles.map, { justifyContent: "center", alignItems: "center" }]}
          >
            <Text style={[styles.placeholderText, { color: colors.text }]}>
              No location data available
            </Text>
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

      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Search Address</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          placeholder="Enter address"
          placeholderTextColor={colors.text}
          value={address}
          onChangeText={onAddressChange}
        />
        
        {showSuggestions && addressSuggestions.length > 0 && (
          <View
            style={[
              styles.suggestionsContainer,
              { backgroundColor: colors.background, borderColor: colors.tint },
            ]}
          >
            {addressSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectSuggestion(suggestion)}
                style={styles.suggestionItem}
              >
                <Text style={[styles.suggestionText, { color: colors.text }]}>
                  {suggestion.display_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <PrimaryButton
          title={isLoading ? "Geocoding..." : "Geocode & Save Address"}
          onPress={geocodeAddress}
          disabled={isLoading || !address}
          style={styles.geocodeButton}
        />
      </View>
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
    paddingTop: normalize(50),
    paddingBottom: normalize(20),
    justifyContent: "space-between",
  },
  backButton: {
    padding: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "700",
  },
  mapContainer: {
    marginHorizontal: normalize(16),
    height: normalize(250),
    borderRadius: normalize(12),
    overflow: "hidden",
    marginBottom: normalize(16),
  },
  map: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    fontSize: normalize(16),
    fontStyle: "italic",
    textAlign: "center",
  },
  coordinatesContainer: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: normalize(12),
    borderRadius: normalize(8),
  },
  coordinateText: {
    fontSize: normalize(14),
    fontWeight: "600",
    marginVertical: normalize(2),
  },
  formContainer: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  label: {
    fontWeight: "600",
    marginBottom: normalize(8),
    fontSize: normalize(16),
  },
  input: {
    borderWidth: 1,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
    fontSize: normalize(16),
    marginBottom: normalize(8),
  },
  suggestionsContainer: {
    maxHeight: normalize(150),
    borderWidth: 1,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  suggestionItem: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  suggestionText: {
    fontSize: normalize(14),
  },
  geocodeButton: {
    marginTop: normalize(8),
  },
});
