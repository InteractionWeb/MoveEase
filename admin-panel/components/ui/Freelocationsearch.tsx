import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

interface FreeLocationSearchProps {
  onSelect: (location: Location) => void;
}

export default function FreeLocationSearch({ onSelect }: FreeLocationSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=3`,
          {
            headers: {
              "User-Agent": "MoveEase/1.0 (you@example.com)",
            },
          }
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Nominatim error", err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500); // debounce API calls
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search location"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestion}
            onPress={() => {
              setQuery(item.display_name);
              setSuggestions([]);
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  suggestion: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
});
