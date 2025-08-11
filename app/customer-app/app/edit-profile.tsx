import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updatePassword } from 'firebase/auth';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import { LOCATIONIQ_API_KEY, API_ENDPOINTS } from '../constants/Config';
import { auth, db } from '../firebaseConfig.js';

// Responsive utility
const scale = (size: number) => {
  const { width } = require('react-native').Dimensions.get('window');
  const scaleFactor = width / 375;
  return Math.round(size * scaleFactor);
};

const EditProfileScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = (colorScheme === 'dark' ? Colors.dark : Colors.light);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [profileImage, setProfileImage] = useState<{ uri: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
          if (userDoc) {
            const userData = userDoc.data();
            setName(userData.name || '');
            setAddress(userData.address || '');
            setUsername(user.email || '');
            setProfileImage(userData.profileImage ? { uri: userData.profileImage } : null);
            if (userData.longitude) setLongitude(userData.longitude);
            if (userData.latitude) setLatitude(userData.latitude);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
      if (!result.canceled) {
        setProfileImage({ uri: result.assets[0].uri });
      }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const [addressSuggestions, setAddressSuggestions] = React.useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

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
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onAddressChange = (text: string) => {
    setAddress(text);
    fetchAddressSuggestions(text);
  };

  const onSelectSuggestion = (suggestion: { display_name: string; lat: string; lon: string }) => {
    setAddress(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setShowSuggestions(false);
  };

  const geocodeAddress = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter an address to geocode.');
      return;
    }
    try {
      console.log('Geocoding address:', address);
      const response = await fetch(
        `${API_ENDPOINTS.LOCATIONIQ_SEARCH}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json&limit=1`
      );
      if (!response.ok) {
        console.error('Geocoding API response not ok:', response.status);
        Alert.alert('Error', `Geocoding API error: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.log('Geocoding API response data:', data);
      if (data && data.length > 0) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));
        Alert.alert('Success', 'Address geocoded successfully.');
      } else {
        Alert.alert('Error', 'Unable to geocode the address.');
      }
    } catch (error) {
      console.error('Geocoding fetch error:', error);
      Alert.alert('Error', 'Failed to fetch geocoding data.');
    }
  };

  const handleSave = async () => {
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        // Update password if changed
        if (password) {
          if (auth.currentUser) {
            await updatePassword(auth.currentUser, password);
          }
        }
        // Update Firestore user document
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
        if (userDoc) {
          const userRef = doc(db, 'users', userDoc.id);
          await updateDoc(userRef, {
            name,
            address,
            longitude,
            latitude,
            profileImage: profileImage?.uri || null, // Ensure profileImage is updated
          });
        }
        Alert.alert('Success', 'Profile updated successfully.');
        router.back();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile.');
        console.error('Error updating profile:', error);
      }
    };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: scale(30) }} />
      </View>

      <View style={styles.profileImageSection}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={profileImage} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.tint }]}>
              <Ionicons name="person" size={scale(80)} color={colors.background} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={[styles.imageButton, { backgroundColor: colors.tint }]} onPress={pickImage}>
            <Text style={[styles.imageButtonText, { color: colors.background }]}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.imageButton, { backgroundColor: colors.tint }]} onPress={takePhoto}>
            <Text style={[styles.imageButtonText, { color: colors.background }]}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Name</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.tint}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Address</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          value={address}
          onChangeText={onAddressChange}
          placeholder="Enter your address"
          placeholderTextColor={colors.tint}
          autoCorrect={false}
        />
        {showSuggestions && addressSuggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: colors.background, borderColor: colors.tint }]}>
            {addressSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectSuggestion(suggestion)}
                style={styles.suggestionItem}
              >
                <Text style={{ color: colors.text }}>{suggestion.display_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity style={[styles.geocodeButton, { backgroundColor: colors.tint }]} onPress={geocodeAddress}>
          <Text style={[styles.geocodeButtonText, { color: colors.background }]}>Geocode Address</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Username (email)</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          value={username}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          placeholderTextColor={colors.tint}
          secureTextEntry
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.tint }]}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="Confirm new password"
          placeholderTextColor={colors.tint}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.tint }]} onPress={handleSave}>
        <Text style={[styles.saveButtonText, { color: colors.background }]}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginVertical: scale(20),
    justifyContent: 'space-between',
  },
  backButton: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: '700',
  },
  profileImageSection: {
    alignItems: 'center',
    marginVertical: scale(24),
  },
  profileImage: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(80),
    marginBottom: scale(12),
  },
  profileImagePlaceholder: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: scale(200),
    marginBottom: scale(12),
  },
  imageButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
  },
  imageButtonText: {
    fontWeight: '600',
    fontSize: scale(16),
  },
  formGroup: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
  },
  label: {
    fontWeight: '600',
    marginBottom: scale(8),
    fontSize: scale(16),
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    fontSize: scale(16),
  },
  geocodeButton: {
    marginTop: scale(8),
    paddingVertical: scale(10),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  geocodeButtonText: {
    fontWeight: '600',
    fontSize: scale(16),
  },
  saveButton: {
    marginHorizontal: scale(16),
    paddingVertical: scale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: scale(24),
  },
  saveButtonText: {
    fontWeight: '700',
    fontSize: scale(18),
  },
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default EditProfileScreen;
