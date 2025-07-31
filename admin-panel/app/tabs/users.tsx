import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type UserType = "customer" | "vendor";

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
}

const sampleUsers: User[] = [
  { id: "1", name: "Alice Smith", email: "alice@example.com", userType: "customer" },
  { id: "2", name: "Bob Vendor", email: "vendorbob@example.com", userType: "vendor" },
  { id: "3", name: "Clara Doe", email: "clara@example.com", userType: "customer" },
  { id: "4", name: "Vendor Max", email: "max@example.com", userType: "vendor" },
];

const Users = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UserType | "all">("all");

  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "all" || user.userType === filter;
    return matchesSearch && matchesType;
  });

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>User Management</Text>

      <TextInput
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 6,
          marginBottom: 8,
        }}
      />

      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {["all", "customer", "vendor"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as UserType | "all")}
            style={{
              backgroundColor: filter === type ? "#333" : "#e0e0e0",
              padding: 8,
              borderRadius: 6,
              marginRight: 8,
            }}
          >
            <Text style={{ color: filter === type ? "#fff" : "#000" }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                item.userType === "customer"
                  ? `/customerdetails`
                  : `/vendor/${item.id}`
              )
            }
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#555" }}>{item.email}</Text>
            <Text style={{ fontStyle: "italic", marginTop: 4 }}>
              {item.userType === "vendor" ? "Vendor" : "Customer"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Users;
