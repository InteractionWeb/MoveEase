import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import PrimaryButton from './PrimaryButton';

type Order = {
  icon: string;
  date: string;
  address: string;
  vendor: string;
  onPress: () => void;
};

type OrderListProps = {
  orders: Order[];
  colors: {
    background: string;
    tint: string;
    text: string;
  };
};

const OrderList: React.FC<OrderListProps> = ({ orders, colors }) => {
  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No orders found.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Order }) => (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.tint,
        },
      ]}
    >
      <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}>
        <Text style={[styles.orderDateText, { color: colors.background }]}>
          {item.icon}
        </Text>
      </View>
      <View style={styles.orderDetailsBox}>
        <Text style={[styles.orderDetailsDate, { color: colors.text }]}>
          {item.date}
        </Text>
        <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>
          {item.address}
        </Text>
        <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>
          {item.vendor}
        </Text>
      </View>
      <PrimaryButton
        text="View Details"
        onPress={item.onPress}
        style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
        textStyle={[styles.viewDetailsText, { color: colors.background }]}
      />
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  } as ViewStyle,
  orderDateIcon: {
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  } as ViewStyle,
  orderDateText: {
    fontSize: 18,
  } as TextStyle,
  orderDetailsBox: {
    flex: 1,
  } as ViewStyle,
  orderDetailsDate: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  orderDetailsAddress: {
    fontSize: 15,
  } as TextStyle,
  orderDetailsVendor: {
    fontSize: 14,
  } as TextStyle,
  viewDetailsButton: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
  } as ViewStyle,
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
});

export default OrderList;
