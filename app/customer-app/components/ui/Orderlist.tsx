import React from 'react';
import {
  Dimensions,
  FlatList,
  PixelRatio,
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
    card: string;
  };
};

const { width } = Dimensions.get('window');
const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

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
          backgroundColor: colors.card,
          borderColor: colors.card,
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
        style={[styles.viewDetailsButton, { backgroundColor: colors.tint, width:scale(180)}]}
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
    paddingHorizontal: scale(40),
    paddingBottom: scale(32),
    alignSelf:'center',
  },
  emptyContainer: {
    padding: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: scale(18),
    fontWeight: '600',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(16),
    padding: scale(12),
    marginBottom: scale(10),
    borderWidth: 1,    
  } as ViewStyle,
  orderDateIcon: {
    borderRadius: scale(16),
    width: scale(32),
    height: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
  } as ViewStyle,
  orderDateText: {
    fontSize: scale(18),
  } as TextStyle,
  orderDetailsBox: {
    flex: 1,
  } as ViewStyle,
  orderDetailsDate: {
    fontSize: scale(16),
    fontWeight: '600',
  } as TextStyle,
  orderDetailsAddress: {
    fontSize: scale(15),
  } as TextStyle,
  orderDetailsVendor: {
    fontSize: scale(14),
  } as TextStyle,
  viewDetailsButton: {
    borderRadius: scale(12),
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    marginLeft: scale(8),
  } as ViewStyle,
  viewDetailsText: {
    fontSize: scale(14),
    fontWeight: '600',
  } as TextStyle,
});

export default OrderList;
