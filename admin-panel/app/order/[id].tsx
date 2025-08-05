import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const sampleOrder = {
  id: "123456",
  customerName: "John Doe",
  vendorName: "VendorMart",
  pickup: "123 Main Street",
  dropoff: "789 Sunset Blvd",
  date: "2025-07-30",
  time: "2:30 PM",
  status: "Delivered",
  price: "PKR 950",
  paymentMethod: "Cash on Delivery",
  items: [
    { name: "Item A", quantity: 2, price: "PKR 300" },
    { name: "Item B", quantity: 1, price: "PKR 350" },
  ],
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order #{id || sampleOrder.id}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>{sampleOrder.customerName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vendor</Text>
        <Text style={styles.value}>{sampleOrder.vendorName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Pickup</Text>
        <Text style={styles.value}>{sampleOrder.pickup}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Drop-off</Text>
        <Text style={styles.value}>{sampleOrder.dropoff}</Text>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{sampleOrder.date}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{sampleOrder.time}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, sampleOrder.status === "Delivered" ? styles.delivered : styles.pending]}>
          {sampleOrder.status}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.value}>{sampleOrder.paymentMethod}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Items</Text>
        {sampleOrder.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemText}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.itemText}>{item.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrice}>{sampleOrder.price}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  delivered: {
    color: "#10B981",
  },
  pending: {
    color: "#F59E0B",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
});
