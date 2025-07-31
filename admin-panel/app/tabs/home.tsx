// app/tabs/home.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const recentOrders = [
  {
    id: "1",
    customer: "Ali Khan",
    date: "2025-07-28",
    status: "Completed",
  },
  {
    id: "2",
    customer: "Zara Ahmed",
    date: "2025-07-27",
    status: "Pending",
  },
  {
    id: "3",
    customer: "Usman Raza",
    date: "2025-07-26",
    status: "Cancelled",
  },
];

type DrawerParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Orders: undefined;
  Users: undefined;
  Revenue: undefined;
  OrderDetails: undefined;
  CustomerDetails: undefined;
  VendorDetails: undefined;
};

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Dashboard</Text>
    </View>
  );

  const renderStatsRow = () => (
    <View style={styles.statsRow}>
      <TouchableOpacity style={[styles.statCard, { backgroundColor: "#4ade80" }]} onPress={() => router.push('/tabs/revenue')}>
        <Text style={styles.statLabel}>Revenue</Text>
        <Text style={styles.statValue}>Rs. 120K</Text>
      </TouchableOpacity>
      <View style={[styles.statCard, { backgroundColor: "#60a5fa" }]}>
        <Text style={styles.statLabel}>Orders</Text>
        <Text style={styles.statValue}>320</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: "#facc15" }]}>
        <Text style={styles.statLabel}>Users</Text>
        <Text style={styles.statValue}>87</Text>
      </View>
    </View>
  );

  const renderSectionTitle = () => (
    <Text style={styles.sectionTitle}>Recent Orders</Text>
  );

  const renderItem = ({ item }: { item: typeof recentOrders[0] }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push('/tabs/orders')}
    >
      <View>
        <Text style={styles.orderText}>Customer: {item.customer}</Text>
        <Text style={styles.orderText}>Date: {item.date}</Text>
      </View>
      <Text style={styles.orderStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  // Example customer and vendor cards with navigation
  const renderCustomerCard = () => (
    <TouchableOpacity style={styles.customerCard} onPress={() => router.push('/customerdetails')}>
      <Text style={styles.customerCardText}>Customer Information</Text>
    </TouchableOpacity>
  );

  const renderVendorCard = () => (
    <TouchableOpacity style={styles.vendorCard} onPress={() => router.push('/vendor/123')}>
      <Text style={styles.vendorCardText}>Vendor Information (ID: 123)</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {renderHeader()}
      {renderStatsRow()}
      {renderCustomerCard()}
      {renderVendorCard()}
      {renderSectionTitle()}
      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#1f2937",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderText: {
    fontSize: 14,
    color: "#374151",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  customerCard: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  customerCardText: {
    fontSize: 16,
    color: "#1e40af",
  },
  vendorCard: {
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  vendorCardText: {
    fontSize: 16,
    color: "#991b1b",
  },
});
