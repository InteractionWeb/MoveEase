// admin-panel/screens/OrdersScreen.tsx
import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const orders = [
  { id: "12345", customer: "Ali", pickup: "Lahore", dropoff: "Karachi", status: "Completed" },
  { id: "12344", customer: "Sara", pickup: "Islamabad", dropoff: "Multan", status: "Pending" },
  { id: "12343", customer: "Ahmed", pickup: "Peshawar", dropoff: "Quetta", status: "Ongoing" },
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 24,
      backgroundColor: isDark ? "#000" : "#fff",
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: isDark ? "#fff" : "#111",
    },
    orderCard: {
      backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#fff" : "#111",
    },
    orderDetails: {
      fontSize: 14,
      color: isDark ? "#ccc" : "#555",
      marginTop: 4,
    },
    orderStatus: {
      fontSize: 13,
      color: isDark ? "#aaa" : "#666",
      marginTop: 6,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Orders Management</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/order/${item.id}`)}
            style={styles.orderCard}
          >
            <Text style={styles.orderTitle}>
              #{item.id} - {item.customer}
            </Text>
            <Text style={styles.orderDetails}>
              {item.pickup} → {item.dropoff}
            </Text>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
