import React from "react";
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const VendorDetails = () => {
  const vendor = {
    name: "Ali Gym",
    email: "ali@gym.com",
    phone: "+92 312 3456789",
    totalOrders: 120,
    totalRevenue: "PKR 300,000",
    services: ["Personal Training", "Yoga", "Zumba", "Crossfit"],
    vendorRating: 4.5,
    customerRating: 4.3,
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <View style={styles.starsContainer}>
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <Ionicons key={index} name="star" size={20} color="#facc15" />
          ))}
        {halfStar && <Ionicons name="star-half" size={20} color="#facc15" />}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.info}>📧 {vendor.email}</Text>
      <Text style={styles.info}>📞 {vendor.phone}</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Orders</Text>
          <Text style={styles.cardValue}>{vendor.totalOrders}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Revenue</Text>
          <Text style={styles.cardValue}>{vendor.totalRevenue}</Text>
        </View>
      </View>

      <View style={styles.ratings}>
        <Text style={styles.ratingLabel}>Vendor Rating</Text>
        {renderStars(vendor.vendorRating)}
        <Text style={styles.ratingLabel}>Customer Rating</Text>
        {renderStars(vendor.customerRating)}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        {vendor.services.map((service, index) => (
          <Text key={index} style={styles.serviceItem}>• {service}</Text>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>🚫 Suspend Vendor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>📋 View Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>📞 Contact</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VendorDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  ratings: {
    marginBottom: 20,
  },
  ratingLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  serviceItem: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 2,
  },
  actions: {
    marginTop: 24,
  },
  actionBtn: {
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  actionText: {
    textAlign: "center",
    fontWeight: "500",
  },
});
