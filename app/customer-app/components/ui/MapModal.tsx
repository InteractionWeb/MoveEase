import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { LOCATIONIQ_API_KEY } from '../../constants/Config';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const { width, height } = Dimensions.get('window');

// Lahore bounds
const LAHORE_BOUNDS = {
  north: 31.7,
  south: 31.3,
  east: 74.5,
  west: 74.1,
};

const LAHORE_REGION: Region = {
  latitude: 31.5497,
  longitude: 74.3436,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

const MapModal: React.FC<MapModalProps> = ({
  visible,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null);
  const [region, setRegion] = useState<Region>(LAHORE_REGION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation({ lat: initialLocation.lat, lng: initialLocation.lng });
      setRegion({
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [initialLocation]);

  const isInLahore = (lat: number, lng: number): boolean => {
    return (
      lat >= LAHORE_BOUNDS.south &&
      lat <= LAHORE_BOUNDS.north &&
      lng >= LAHORE_BOUNDS.west &&
      lng <= LAHORE_BOUNDS.east
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json&accept-language=en`
      );
      return response.data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    if (!isInLahore(latitude, longitude)) {
      Alert.alert(
        'Location Not Available',
        'Please select a location within Lahore city limits.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    const address = await reverseGeocode(latitude, longitude);
    setSelectedLocation({ lat: latitude, lng: longitude, address });
    setLoading(false);
  };

  const handleCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use current location feature.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      if (!isInLahore(latitude, longitude)) {
        Alert.alert(
          'Current Location Not Available',
          'Your current location is outside Lahore. Please select a location within the city.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const address = await reverseGeocode(latitude, longitude);
      setSelectedLocation({ lat: latitude, lng: longitude, address });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get current location. Please try again or select manually.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        address: selectedLocation.address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Location in Lahore</Text>
          <TouchableOpacity
            onPress={handleCurrentLocation}
            style={styles.currentLocationButton}
            disabled={loading}
          >
            <Ionicons 
              name="locate" 
              size={24} 
              color={loading ? "#ccc" : "#007AFF"} 
            />
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              }}
              title="Selected Location"
              description={selectedLocation.address || "Tap confirm to select this location"}
            />
          )}
        </MapView>

        {selectedLocation && (
          <View style={styles.selectedLocationInfo}>
            <Text style={styles.selectedLocationText} numberOfLines={2}>
              {selectedLocation.address || `${selectedLocation.lat}, ${selectedLocation.lng}`}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.instruction}>
            Tap anywhere on the map to select a location in Lahore
          </Text>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: selectedLocation ? '#007AFF' : '#ccc' }
            ]}
            onPress={handleConfirm}
            disabled={!selectedLocation || loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Loading...' : 'Confirm Location'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  currentLocationButton: {
    padding: 4,
  },
  map: {
    flex: 1,
  },
  selectedLocationInfo: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedLocationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapModal;
