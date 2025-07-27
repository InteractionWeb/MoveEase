import React from 'react';
import { FlatList, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
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
  styles: {
    orderCard: StyleProp<ViewStyle>;
    orderDateIcon: StyleProp<ViewStyle>;
    orderDateText: StyleProp<TextStyle>;
    orderDetailsBox: StyleProp<ViewStyle>;
    orderDetailsDate: StyleProp<TextStyle>;
    orderDetailsAddress: StyleProp<TextStyle>;
    orderDetailsVendor: StyleProp<TextStyle>;
    viewDetailsButton: StyleProp<ViewStyle>;
    viewDetailsText: StyleProp<TextStyle>;
    listContainer?: StyleProp<ViewStyle>;
    emptyContainer?: StyleProp<ViewStyle>;
    emptyText?: StyleProp<TextStyle>;
  };
};

const OrderList: React.FC<OrderListProps> = ({ orders, colors, styles }) => {
  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>No orders found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Order }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
      <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}>
        <Text style={[styles.orderDateText, { color: colors.background }]}>{item.icon}</Text>
      </View>
      <View style={styles.orderDetailsBox}>
        <Text style={[styles.orderDetailsDate, { color: colors.text }]}>{item.date}</Text>
        <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>{item.address}</Text>
        <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>{item.vendor}</Text>
      </View>
      <PrimaryButton
        text="View Details"
        onPress={item.onPress}
        style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
        textStyle={[styles.viewDetailsText, { color: colors.text }]}
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

export default OrderList;
