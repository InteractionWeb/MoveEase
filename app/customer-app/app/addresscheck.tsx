// import { useRouter } from "expo-router";
// import { collection, getDocs } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Dimensions,
//   PixelRatio,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import { Colors } from "../constants/Colors";
// import { auth, db } from "../firebaseConfig";

// // Responsive utility
// const { width } = Dimensions.get("window");
// const scale = width / 375;
// const normalize = (size: number) =>
//   Math.round(PixelRatio.roundToNearestPixel(size * scale));

// export default function AddressCheck() {
//   const router = useRouter();
//   const colorScheme = useColorScheme() || "light";
//   const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [address, setAddress] = useState<string>("");

//   useEffect(() => {
//     const fetchLocation = async () => {
//       const user = auth.currentUser;
//       if (!user) return;
//       try {
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const userDoc = usersSnapshot.docs.find(
//           (doc) => doc.data().email === user.email
//         );
//         if (userDoc) {
//           const data = userDoc.data();
//           if (data.latitude) setLatitude(data.latitude);
//           if (data.longitude) setLongitude(data.longitude);
//         }
//       } catch (error) {
//         console.error("Failed to fetch location:", error);
//       }
//     };
//     fetchLocation();
//   }, []);

//   const [addressSuggestions, setAddressSuggestions] = useState<
//     Array<{ display_name: string; lat: string; lon: string }>
//   >([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const fetchAddressSuggestions = async (query: string) => {
//     if (!query) {
//       setAddressSuggestions([]);
//       return;
//     }
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           query
//         )}`,
//         {
//           headers: {
//             "User-Agent": "MoveEaseApp/1.0 (your-email@example.com)",
//           },
//         }
//       );
//       const data = await response.json();
//       setAddressSuggestions(data);
//       setShowSuggestions(true);
//     } catch (error) {
//       console.error("Error fetching address suggestions:", error);
//       setAddressSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   const onAddressChange = (text: string) => {
//     setAddress(text);
//     fetchAddressSuggestions(text);
//   };

//   const onSelectSuggestion = (suggestion: {
//     display_name: string;
//     lat: string;
//     lon: string;
//   }) => {
//     setAddress(suggestion.display_name);
//     setLatitude(parseFloat(suggestion.lat));
//     setLongitude(parseFloat(suggestion.lon));
//     setShowSuggestions(false);
//   };

//   const geocodeAddress = async () => {
//     if (!address) {
//       Alert.alert("Error", "Please enter an address to geocode.");
//       return;
//     }
//     try {
//       console.log("Geocoding address:", address);
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           address
//         )}`,
//         {
//           headers: {
//             "User-Agent": "MoveEaseApp/1.0 (contact@moveeaseapp.com)",
//           },
//         }
//       );
//       if (!response.ok) {
//         console.error("Geocoding API response not ok:", response.status);
//         Alert.alert("Error", `Geocoding API error: ${response.status}`);
//         return;
//       }
//       const data = await response.json();
//       console.log("Geocoding API response data:", data);
//       if (data && data.length > 0) {
//         setLatitude(parseFloat(data[0].lat));
//         setLongitude(parseFloat(data[0].lon));
//         Alert.alert("Success", "Address geocoded successfully.");
//       } else {
//         Alert.alert("Error", "Unable to geocode the address.");
//       }
//     } catch (error) {
//       console.error("Geocoding fetch error:", error);
//       Alert.alert("Error", "Failed to fetch geocoding data.");
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <View style={styles.mapContainer}>
//         {latitude !== null && longitude !== null ? (
//           <MapView
//             style={styles.map}
//             initialRegion={{
//               latitude,
//               longitude,
//               latitudeDelta: 5,
//               longitudeDelta: 5,
//             }}
//           >
//             <Marker coordinate={{ latitude, longitude }} />
//           </MapView>
//         ) : (
//           <View
//             style={[styles.map, { justifyContent: "center", alignItems: "center" }]}
//           >
//             <Text style={{ color: colors.text }}>No location data available</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.coordinatesContainer}>
//         <Text style={[styles.coordinateText, { color: colors.text }]}>
//           Latitude: {latitude !== null ? latitude.toFixed(6) : "N/A"}
//         </Text>
//         <Text style={[styles.coordinateText, { color: colors.text }]}>
//           Longitude: {longitude !== null ? longitude.toFixed(6) : "N/A"}
//         </Text>
//       </View>

//       <View style={{ flex: 1, marginHorizontal: normalize(16) }}>
//         <TextInput
//           style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
//           placeholder="Enter address"
//           placeholderTextColor={colors.text}
//           value={address}
//           onChangeText={onAddressChange}
//         />
//         {showSuggestions && addressSuggestions.length > 0 && (
//           <View
//             style={[
//               styles.suggestionsContainer,
//               { backgroundColor: colors.background, borderColor: colors.tint },
//             ]}
//           >
//             {addressSuggestions.map((suggestion, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => onSelectSuggestion(suggestion)}
//                 style={styles.suggestionItem}
//               >
//                 <Text style={{ color: colors.text }}>{suggestion.display_name}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//         <TouchableOpacity
//           style={[styles.geocodeButton, { backgroundColor: colors.tint }]}
//           onPress={geocodeAddress}
//         >
//           <Text style={[styles.geocodeButtonText, { color: colors.background }]}>
//             Geocode Address
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: normalize(16),
//     marginVertical: normalize(20),
//     top: normalize(25),
//     justifyContent: "space-between",
//   },
//   backButton: {
//     padding: normalize(4),
//   },
//   headerTitle: {
//     fontSize: normalize(16),
//     fontWeight: "700",
//   },
//   contactMoversButton: {
//     marginTop: "auto",
//     marginHorizontal: normalize(14),
//     borderRadius: normalize(28),
//     height: normalize(46),
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: normalize(12),
//   },
//   trackButtonText: {
//     fontWeight: "500",
//   },
//   placeholderText: {
//     fontSize: normalize(18),
//     fontStyle: "italic",
//     textAlign: "center",
//   },
//   map: {
//     width: "100%",
//     height: normalize(200),
//     borderRadius: normalize(12),
//     alignSelf: "center",
//   },
//   mapContainer: {
//     width: "100%",
//     top: normalize(20),
//     height: normalize(200),
//     borderRadius: normalize(12),
//     overflow: "hidden",
//     backgroundColor: "transparent",
//     padding: normalize(2),
//   },
//   ordercontainer: {
//     height: normalize(400),
//     backgroundColor: "blue",
//   },
//   coordinatesContainer: {
//     marginHorizontal: normalize(16),
//     marginBottom: normalize(12),
//     alignItems: "center",
//   },
//   coordinateText: {
//     top: normalize(20),
//     fontSize: normalize(16),
//     fontWeight: "600",
//     padding: normalize(5),
//   },
//   formGroup: {
//     marginHorizontal: scale * 16,
//     marginBottom: scale * 16,
//   },
//   label: {
//     fontWeight: "600",
//     marginBottom: scale * 8,
//     fontSize: scale * 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: scale * 12,
//     paddingHorizontal: scale * 12,
//     paddingVertical: scale * 10,
//     fontSize: scale * 16,
//   },
//   geocodeButton: {
//     marginTop: scale * 8,
//     paddingVertical: scale * 10,
//     borderRadius: scale * 12,
//     alignItems: "center",
//   },
//   geocodeButtonText: {
//     fontWeight: "600",
//     fontSize: scale * 16,
//   },
//   saveButton: {
//     marginHorizontal: scale * 16,
//     paddingVertical: scale * 14,
//     borderRadius: scale * 12,
//     alignItems: "center",
//     marginBottom: scale * 24,
//   },
//   saveButtonText: {
//     fontWeight: "700",
//     fontSize: scale * 18,
//   },
//   suggestionsContainer: {
//     maxHeight: 150,
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 4,
//   },
//   suggestionItem: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
