// app/customerdetails.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerDetailsScreen() {
  const navigation = useNavigation();

  const customer = {
    name: 'Sana Ahmed',
    email: 'sana.ahmed@example.com',
    phone: '+92 301 1234567',
    address: 'Clifton, Karachi',
    image: 'https://i.pravatar.cc/150?img=11',
    rating: 4.8,
    pastOrders: [
      { id: 'ORD-001', date: '2025-07-24', amount: 'Rs. 700' },
      { id: 'ORD-008', date: '2025-07-29', amount: 'Rs. 1100' },
      { id: 'ORD-015', date: '2025-07-31', amount: 'Rs. 900' },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <Image source={{ uri: customer.image }} style={styles.avatar} />
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.text}>{customer.email}</Text>
        <Text style={styles.text}>{customer.phone}</Text>
        <Text style={styles.text}>{customer.address}</Text>
        <Text style={styles.rating}>⭐ {customer.rating.toFixed(1)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Past Orders</Text>
      <View style={styles.orderList}>
        {customer.pastOrders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <Text style={styles.orderText}>#{order.id}</Text>
            <Text style={styles.orderText}>{order.date}</Text>
            <Text style={styles.orderText}>{order.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { marginLeft: 8, fontSize: 16, color: '#333' },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 16, color: '#555' },
  rating: { fontSize: 16, marginTop: 8, color: '#ff9900' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  orderList: { gap: 12 },
  orderItem: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderText: { fontSize: 15, color: '#333' },
});
