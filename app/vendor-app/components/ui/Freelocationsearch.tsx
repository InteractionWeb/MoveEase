import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface LocationResult {
  id: string;
  address: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface FreeLocationSearchProps {
  placeholder?: string;
  onLocationSelect: (location: LocationResult) => void;
  initialValue?: string;
  style?: any;
}

export default function FreeLocationSearch({
  placeholder = "Search location...",
  onLocationSelect,
  initialValue = "",
  style,
}: FreeLocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock location search - in real app, integrate with Google Places API or similar
  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock results - in real app, call actual geocoding service
      const mockResults: LocationResult[] = [
        {
          id: '1',
          address: `${searchQuery} Street, Downtown`,
          description: 'Downtown Area',
          coordinates: { lat: 40.7128, lng: -74.0060 },
        },
        {
          id: '2',
          address: `${searchQuery} Avenue, Midtown`,
          description: 'Midtown District',
          coordinates: { lat: 40.7589, lng: -73.9851 },
        },
        {
          id: '3',
          address: `${searchQuery} Road, Uptown`,
          description: 'Uptown Area',
          coordinates: { lat: 40.7831, lng: -73.9712 },
        },
        {
          id: '4',
          address: `${searchQuery} Boulevard, Westside`,
          description: 'Westside Neighborhood',
          coordinates: { lat: 40.7505, lng: -73.9934 },
        },
        {
          id: '5',
          address: `${searchQuery} Lane, Eastside`,
          description: 'Eastside District',
          coordinates: { lat: 40.7282, lng: -73.9942 },
        },
      ];

      setResults(mockResults);
    } catch (error) {
      console.error('Location search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    searchLocations(text);
  };

  const handleLocationSelect = (location: LocationResult) => {
    setQuery(location.address);
    setShowResults(false);
    setResults([]);
    onLocationSelect(location);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const renderLocationItem = ({ item }: { item: LocationResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.resultIcon}>
        <Ionicons name="location-outline" size={20} color={Colors.primary} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultAddress} numberOfLines={1}>
          {item.address}
        </Text>
        <Text style={styles.resultDescription} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleQueryChange}
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
            autoCapitalize="words"
            autoComplete="street-address"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderLocationItem}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    position: 'relative',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 240,
    zIndex: 1001,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  resultsList: {
    maxHeight: 240,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  resultDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
