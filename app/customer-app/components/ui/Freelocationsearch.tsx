import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LOCATIONIQ_API_KEY, API_ENDPOINTS } from "../../constants/Config";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface FreeLocationSearchProps {
  onSelect: (location: Location) => void;
  value?: string;
}

export default function FreeLocationSearch({ onSelect, value }: FreeLocationSearchProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update query when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
      // Don't show suggestions when value is set from parent
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // Add Lahore, Pakistan to the query to restrict results to this city
        const searchQuery = `${query}, Lahore, Pakistan`;
        const response = await fetch(
          `${API_ENDPOINTS.LOCATIONIQ_SEARCH}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
            searchQuery
          )}&format=json&limit=5&addressdetails=1&countrycodes=pk&bounded=1&viewbox=74.1,31.7,74.6,31.4`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`LocationIQ API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter results to only include locations in Lahore
        const lahoreResults = data.filter((item: any) => {
          const displayName = item.display_name.toLowerCase();
          return displayName.includes('lahore') && displayName.includes('pakistan');
        });
        
        setSuggestions(lahoreResults);
        setShowSuggestions(true);
      } catch (err) {
        console.error("LocationIQ error", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500); // debounce API calls
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search location in Lahore"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowSuggestions(true);
        }}
        onBlur={() => {
          // Hide suggestions when input loses focus
          setTimeout(() => setShowSuggestions(false), 150);
        }}
        style={styles.input}
      />
      {suggestions.length > 0 && showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => item.osm_id?.toString() || index.toString()}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => {
                  setQuery(item.display_name);
                  setSuggestions([]);
                  setShowSuggestions(false);
                  onSelect({
                    name: item.display_name,
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                  });
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            style={{ flex: 1 }}
          />
          {suggestions.length > 0 && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    minHeight: 24,
    padding: 0,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 4,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
