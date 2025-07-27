import OrderList from '@/components/ui/Orderlist';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import DateSelector from '../components/ui/DateSelector';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';
import { Colors } from '../constants/Colors';

const DashboardScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const vehicleOptions = [
    { label: 'Small Van', value: 'van' },
    { label: 'Medium Truck', value: 'truck' },
    { label: 'Large Truck', value: 'large_truck' },
  ];
  const orders = [
  {
    icon: '✔️',
    date: 'April 20',
    address: '123 Main St → 456 Elm St',
    vendor: 'Movers Co.',
    onPress: () => console.log('View Details: Movers Co.'),
  },
  {
    icon: '📦',
    date: 'May 5',
    address: '789 Oak St → 321 Pine St',
    vendor: 'Fast Movers',
    onPress: () => console.log('View Details: Fast Movers'),
  },
  {
    icon: '🚚',
    date: 'June 10',
    address: '555 Maple St → 777 Cedar St',
    vendor: 'Quick Move',
    onPress: () => console.log('View Details: Quick Move'),
  },
  {
    icon: '🚚',
    date: 'June 10',
    address: '555 Maple St → 777 Cedar St',
    vendor: 'Quick Move',
    onPress: () => console.log('View Details: Quick Move'),
  },
  {
    icon: '🚚',
    date: 'June 10',
    address: '555 Maple St → 777 Cedar St',
    vendor: 'Quick Move',
    onPress: () => console.log('View Details: Quick Move'),
  },
  {
    icon: '🚚',
    date: 'June 10',
    address: '555 Maple St → 777 Cedar St',
    vendor: 'Quick Move',
    onPress: () => console.log('View Details: Quick Move'),
  },
];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuIcon}>
            <Text style={[styles.menuText, { color: colors.tint }]}>≡</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Move
            <Text style={{color: colors.tint}}>Ease</Text>
          </Text>
          <TouchableOpacity style={[styles.profileIconBox, { backgroundColor: colors.background }]} onPress={() => { router.push('./profile'); }}>
            <View style={[styles.profileIcon, { backgroundColor: colors.background }]}>
              <Text style={[styles.profileIconText, { color: colors.text }]}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>
      <ScrollView style={{maxHeight:'100%'}}>
        {/* Title & Subtitle */}
        <Text style={[styles.pageTitle, { color: colors.text }]}>Book a Moving Service</Text>
        <Text style={[styles.pageSubtitle, { color: colors.tint }]}>Find and book trusted movers easily.</Text>

        {/* Booking Inputs */}
        <View style={styles.inputGroup}>
          <StyledTextInput name="Pickup location" style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]} />
          <StyledTextInput name="Drop-off location" style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]} />
          <View style={styles.row}>
            <DateSelector placeholder="Select date" style={[styles.inputBox, {flex:1, marginRight:8, backgroundColor: colors.background, borderColor: colors.tint}]} />
            <View style={{flex:1}}>
              <View>
                <TouchableOpacity
                  style={[styles.inputBox, styles.dropdownBox, { backgroundColor: colors.background, borderColor: colors.tint }]}
                  activeOpacity={0.8}
                  onPress={() => setDropdownVisible(true)}
                >
                  <Text style={{color: selectedVehicle ? colors.text : colors.tint, fontSize:16}}>
                    {selectedVehicle
                      ? vehicleOptions.find(opt => opt.value === selectedVehicle)?.label
                      : 'Choose vehicle'}
                  </Text>
                  <Text style={[styles.dropdownArrow, { color: colors.tint }]}>▼</Text>
                </TouchableOpacity>
                {dropdownVisible && (
                  <View style={[styles.dropdownMenuInline, { backgroundColor: colors.background, borderColor: colors.tint }]}>
                    {vehicleOptions.map(opt => (
                      <TouchableOpacity
                        key={opt.value}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedVehicle(opt.value);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, { color: colors.text }]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Find Movers Button */}
        <PrimaryButton
          text="Find Movers"
          onPress={() => {}}
          style={[styles.findMoversButton, { backgroundColor: colors.tint }]}
          textStyle={[styles.findMoversText, { color: colors.text}]}
        />

        {/* How it works */}
        <View style={styles.howItWorksBox}>
          <View style={styles.illustrationBox}>
            {/* Illustration placeholder */}
            <Image source={require('../assets/images/partial-react-logo.png')} style={styles.illustrationImg} />
          </View>
          <View style={styles.howItWorksSteps}>
            <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How it works</Text>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>📝</Text><Text style={[styles.howItWorksText, { color: colors.text }]}>Describe Your Move</Text></View>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>✅</Text><Text style={[styles.howItWorksText, { color: colors.text }]}>Compare Vendors</Text></View>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>🚚</Text><Text style={[styles.howItWorksText, { color: colors.text }]}>Select a Mover</Text></View>
          </View>
        </View>

        
          <View style={{ flex: 1, backgroundColor: colors.background }}>
              <OrderList orders={orders} colors={colors} styles={styles} />
          </View>
        {/* Upcoming Orders */}
        {/* <View style={styles.upcomingOrdersBox}>
          <Text style={[styles.upcomingOrdersTitle, { color: colors.text }]}>Upcoming Orders</Text>
          <ScrollView style={{ maxHeight: 400, overflow: 'hidden', }}>
            <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
              <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}><Text style={[styles.orderDateText, { color: colors.background }]}>✔️</Text></View>
              <View style={styles.orderDetailsBox}>
                <Text style={[styles.orderDetailsDate, { color: colors.text }]}>April 20</Text>
                <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>123 Main St → 456 Elm St</Text>
                <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>Movers Co.</Text>
              </View>
              <PrimaryButton
                text="View Details"
                onPress={() => {}}
                style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
                textStyle={[styles.viewDetailsText, { color: colors.background }]}
              />
            </View>
            <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
              <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}><Text style={[styles.orderDateText, { color: colors.background }]}>📦</Text></View>
              <View style={styles.orderDetailsBox}>
                <Text style={[styles.orderDetailsDate, { color: colors.text }]}>May 5</Text>
                <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>789 Oak St → 321 Pine St</Text>
                <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>Fast Movers</Text>
              </View>
              <PrimaryButton
                text="View Details"
                onPress={() => {}}
                style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
                textStyle={[styles.viewDetailsText, { color: colors.background }]}
              />
            </View>
            <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
              <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}><Text style={[styles.orderDateText, { color: colors.background }]}>📦</Text></View>
              <View style={styles.orderDetailsBox}>
                <Text style={[styles.orderDetailsDate, { color: colors.text }]}>May 5</Text>
                <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>789 Oak St → 321 Pine St</Text>
                <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>Fast Movers</Text>
              </View>
              <PrimaryButton
                text="View Details"
                onPress={() => {}}
                style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
                textStyle={[styles.viewDetailsText, { color: colors.background }]}
              />
            </View>
            <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
              <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}><Text style={[styles.orderDateText, { color: colors.background }]}>🚚</Text></View>
              <View style={styles.orderDetailsBox}>
                <Text style={[styles.orderDetailsDate, { color: colors.text }]}>June 10</Text>
                <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>555 Maple St → 777 Cedar St</Text>
                <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>Quick Move</Text>
              </View>
              <PrimaryButton
                text="View Details"
                onPress={() => {}}
                style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
                textStyle={[styles.viewDetailsText, { color: colors.background }]}
              />
            </View>
            <View style={[styles.orderCard, { backgroundColor: colors.background, borderColor: colors.tint }]}>
              <View style={[styles.orderDateIcon, { backgroundColor: colors.tint }]}><Text style={[styles.orderDateText, { color: colors.background }]}>🚚</Text></View>
              <View style={styles.orderDetailsBox}>
                <Text style={[styles.orderDetailsDate, { color: colors.text }]}>June 10</Text>
                <Text style={[styles.orderDetailsAddress, { color: colors.tint }]}>555 Maple St → 777 Cedar St</Text>
                <Text style={[styles.orderDetailsVendor, { color: colors.tint }]}>Quick Move</Text>
              </View>
              <PrimaryButton
                text="View Details"
                onPress={() => {}}
                style={[styles.viewDetailsButton, { backgroundColor: colors.tint }]}
                textStyle={[styles.viewDetailsText, { color: colors.background }]}
              />
            </View>
          </ScrollView>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownMenuInline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2bb6a3',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#2bb6a3',
    marginLeft: 8,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignSelf: 'center',
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1a232b',
  },
  container: { flex: 1, backgroundColor: '#f9fcfaff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuIcon: { padding: 8 },
  menuText: { fontSize: 28, color: '#2bb667ff', fontWeight: '700' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#1a232b', flex: 1, textAlign: 'center' },
  profileIconBox: { padding: 8 },
  profileIcon: { backgroundColor: '#e8f6eeff', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileIconText: { fontSize: 24 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: '#1a232b', marginLeft: 16, marginTop: 8 },
  pageSubtitle: { fontSize: 16, color: '#7a98b6', marginLeft: 16, marginBottom: 16 },
  inputGroup: { marginHorizontal: 16, marginBottom: 12 },
  inputBox: { backgroundColor: '#fff', borderRadius: 12, height: 48, fontSize: 16, paddingHorizontal: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2bb6a3' },
  row: { flexDirection: 'row' },
  findMoversButton: { backgroundColor: '#2bb6a3', borderRadius: 24, height: 52, justifyContent: 'center', alignItems: 'center', marginHorizontal: 16, marginVertical: 16 },
  findMoversText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  howItWorksBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 16 },
  illustrationBox: { marginRight: 12 },
  illustrationImg: { width: 90, height: 90, resizeMode: 'contain', borderRadius: 12 },
  howItWorksSteps: { flex: 1 },
  howItWorksTitle: { fontSize: 20, fontWeight: '700', color: '#1a232b', marginBottom: 8 },
  howItWorksRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  howItWorksIcon: { fontSize: 18, marginRight: 8 },
  howItWorksText: { fontSize: 16, color: '#1a232b' },
  upcomingOrdersBox: { marginHorizontal: 16, marginVertical: 16 },
  upcomingOrdersTitle: { fontSize: 20, fontWeight: '700', color: '#1a232b', marginBottom: 8 },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2bb6a3' },
  orderDateIcon: { backgroundColor: '#2bb6a3', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  orderDateText: { fontSize: 18 },
  orderDetailsBox: { flex: 1 },
  orderDetailsDate: { fontSize: 16, fontWeight: '600', color: '#1a232b' },
  orderDetailsAddress: { fontSize: 15, color: '#7a98b6' },
  orderDetailsVendor: { fontSize: 14, color: '#7a98b6' },
  viewDetailsButton: { backgroundColor: '#2bb6a3', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginLeft: 8 },
  viewDetailsText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

export default DashboardScreen;
