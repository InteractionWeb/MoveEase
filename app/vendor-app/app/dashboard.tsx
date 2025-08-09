import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';

const { width } = Dimensions.get('window');

interface OrderData {
  id: string;
  customer: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  amount: number;
  scheduledDate: string;
  distance: string;
}

interface StatsData {
  totalEarnings: number;
  thisMonth: number;
  completedJobs: number;
  pendingOrders: number;
  rating: number;
}

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    totalEarnings: 12450,
    thisMonth: 3200,
    completedJobs: 128,
    pendingOrders: 3,
    rating: 4.8,
  });

  const [recentOrders, setRecentOrders] = useState<OrderData[]>([
    {
      id: '1',
      customer: 'John Smith',
      pickup: '123 Main St, Downtown',
      dropoff: '456 Oak Ave, Uptown',
      status: 'pending',
      amount: 350,
      scheduledDate: '2025-08-11',
      distance: '12.5 miles',
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      pickup: '789 Pine Rd, Westside',
      dropoff: '321 Elm St, Eastside',
      status: 'accepted',
      amount: 275,
      scheduledDate: '2025-08-10',
      distance: '8.2 miles',
    },
    {
      id: '3',
      customer: 'Mike Davis',
      pickup: '555 Cedar Ln, Northville',
      dropoff: '777 Birch Dr, Southport',
      status: 'in_progress',
      amount: 420,
      scheduledDate: '2025-08-10',
      distance: '15.1 miles',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'accepted': return Colors.primary;
      case 'in_progress': return Colors.accent;
      case 'completed': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'New Request';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>Ready to help customers move?</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.earningsCard]}>
              <View style={styles.statIcon}>
                <Ionicons name="wallet-outline" size={24} color={Colors.white} />
              </View>
              <Text style={styles.statValue}>${stats.totalEarnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconSecondary}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statValueSecondary}>${stats.thisMonth.toLocaleString()}</Text>
              <Text style={styles.statLabelSecondary}>This Month</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconSecondary}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statValueSecondary}>{stats.completedJobs}</Text>
              <Text style={styles.statLabelSecondary}>Completed Jobs</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconSecondary}>
                <Ionicons name="star-outline" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statValueSecondary}>{stats.rating}</Text>
              <Text style={styles.statLabelSecondary}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/orders')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="list-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionTitle}>View Orders</Text>
              <Text style={styles.actionSubtitle}>{stats.pendingOrders} pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/earnings')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="analytics-outline" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.actionTitle}>Earnings</Text>
              <Text style={styles.actionSubtitle}>View reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="person-outline" size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.actionTitle}>Profile</Text>
              <Text style={styles.actionSubtitle}>Update info</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ordersContainer}>
            {recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order.id)}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.customerName}>{order.customer}</Text>
                    <Text style={styles.orderDate}>{order.scheduledDate}</Text>
                  </View>
                  <View style={styles.orderAmount}>
                    <Text style={styles.amountText}>${order.amount}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {order.pickup}
                    </Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="flag-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {order.dropoff}
                    </Text>
                  </View>
                  <Text style={styles.distanceText}>{order.distance}</Text>
                </View>

                {order.status === 'pending' && (
                  <View style={styles.orderActions}>
                    <PrimaryButton
                      title="Accept"
                      onPress={() => {/* Handle accept */}}
                      style={styles.acceptButton}
                    />
                    <TouchableOpacity style={styles.rejectButton}>
                      <Text style={styles.rejectText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.card,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: (width - 52) / 2,
  },
  earningsCard: {
    backgroundColor: Colors.primary,
    width: '100%',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconSecondary: {
    width: 36,
    height: 36,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  statValueSecondary: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  statLabelSecondary: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
  },
  orderDetails: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 2,
    height: 40,
  },
  rejectButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rejectText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
