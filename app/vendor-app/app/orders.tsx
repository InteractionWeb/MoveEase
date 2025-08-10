import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';

interface Order {
  id: string;
  customer: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  distance: string;
  items: string[];
  specialInstructions?: string;
}

export default function OrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [orders] = useState<Order[]>([
    {
      id: '1',
      customer: 'John Smith',
      pickup: '123 Main St, Downtown',
      dropoff: '456 Oak Ave, Uptown',
      status: 'pending',
      amount: 350,
      scheduledDate: '2025-08-11',
      scheduledTime: '10:00 AM',
      distance: '12.5 miles',
      items: ['Bedroom furniture', 'Living room set', '15 boxes'],
      specialInstructions: 'Third floor apartment, no elevator',
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      pickup: '789 Pine Rd, Westside',
      dropoff: '321 Elm St, Eastside',
      status: 'accepted',
      amount: 275,
      scheduledDate: '2025-08-10',
      scheduledTime: '2:00 PM',
      distance: '8.2 miles',
      items: ['Office furniture', 'Computer equipment', '8 boxes'],
    },
    {
      id: '3',
      customer: 'Mike Davis',
      pickup: '555 Cedar Ln, Northville',
      dropoff: '777 Birch Dr, Southport',
      status: 'in_progress',
      amount: 420,
      scheduledDate: '2025-08-10',
      scheduledTime: '9:00 AM',
      distance: '15.1 miles',
      items: ['Entire 2-bedroom apartment', 'Piano', '25 boxes'],
      specialInstructions: 'Piano requires special handling',
    },
    {
      id: '4',
      customer: 'Lisa Anderson',
      pickup: '222 Maple Ave, Central',
      dropoff: '888 Walnut St, Riverside',
      status: 'completed',
      amount: 180,
      scheduledDate: '2025-08-09',
      scheduledTime: '1:00 PM',
      distance: '6.3 miles',
      items: ['Studio apartment', '5 boxes'],
    },
    {
      id: '5',
      customer: 'Robert Wilson',
      pickup: '999 Birch Rd, Highland',
      dropoff: '111 Spruce Dr, Valley',
      status: 'cancelled',
      amount: 290,
      scheduledDate: '2025-08-08',
      scheduledTime: '11:00 AM',
      distance: '10.8 miles',
      items: ['1-bedroom apartment', '12 boxes'],
    },
  ]);

  const filters = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'New Requests', count: orders.filter(o => o.status === 'pending').length },
    { key: 'accepted', label: 'Accepted', count: orders.filter(o => o.status === 'accepted').length },
    { key: 'in_progress', label: 'In Progress', count: orders.filter(o => o.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.dropoff.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      case 'cancelled': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'New Request';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  const handleChatWithCustomer = (order: Order) => {
    // For now, navigate to a placeholder - this would need proper routing setup
    console.log('Chat with customer for order:', order.id);
    // router.push('/chat'); // Uncomment when chat route is properly configured
  };

  const handleAcceptOrder = (orderId: string) => {
    // TODO: Implement accept order logic
    console.log('Accept order:', orderId);
  };

  const handleDeclineOrder = (orderId: string) => {
    // TODO: Implement decline order logic
    console.log('Decline order:', orderId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                activeFilter === filter.key && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={[
                  styles.filterBadge,
                  activeFilter === filter.key && styles.activeFilterBadge,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    activeFilter === filter.key && styles.activeFilterBadgeText,
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.ordersList}
        contentContainerStyle={styles.ordersContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'New orders will appear here'}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order.id)}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.customerName}>{order.customer}</Text>
                  <Text style={styles.orderDateTime}>
                    {order.scheduledDate} • {order.scheduledTime}
                  </Text>
                </View>
                <View style={styles.orderMeta}>
                  <Text style={styles.amountText}>${order.amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.primary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {order.pickup}
                  </Text>
                </View>
                <View style={styles.locationConnector} />
                <View style={styles.locationRow}>
                  <Ionicons name="flag-outline" size={16} color={Colors.accent} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {order.dropoff}
                  </Text>
                </View>
              </View>

              <View style={styles.orderMeta}>
                <Text style={styles.distanceText}>{order.distance}</Text>
                <Text style={styles.itemsText}>
                  {order.items.slice(0, 2).join(', ')}
                  {order.items.length > 2 && ` +${order.items.length - 2} more`}
                </Text>
              </View>

              {order.specialInstructions && (
                <View style={styles.instructionsContainer}>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.warning} />
                  <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
                </View>
              )}

              {order.status === 'pending' && (
                <View style={styles.orderActions}>
                  <PrimaryButton
                    title="Accept"
                    onPress={() => handleAcceptOrder(order.id)}
                    style={styles.acceptButton}
                  />
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => handleDeclineOrder(order.id)}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(order.status === 'accepted' || order.status === 'in_progress') && (
                <View style={styles.orderActions}>
                  <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => handleChatWithCustomer(order)}
                  >
                    <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </TouchableOpacity>
                  
                  <PrimaryButton
                    title="Update Status"
                    onPress={() => handleOrderPress(order.id)}
                    style={styles.updateButton}
                    variant="outline"
                  />
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  filtersContainer: {
    paddingBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeFilterText: {
    color: Colors.white,
  },
  filterBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: Colors.white,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  activeFilterBadgeText: {
    color: Colors.primary,
  },
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  orderDateTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  orderDetails: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationConnector: {
    width: 2,
    height: 16,
    backgroundColor: Colors.border,
    marginLeft: 7,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warning + '20',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    gap: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.warning,
    flex: 1,
    lineHeight: 20,
  },
  orderActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  acceptButton: {
    flex: 2,
    height: 44,
  },
  declineButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.error + '10',
  },
  declineText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    gap: 6,
  },
  chatButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    height: 44,
  },
});
