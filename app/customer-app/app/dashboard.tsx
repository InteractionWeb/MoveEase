import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';
import DateSelector from '../components/ui/DateSelector';

const DashboardScreen = () => {
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const vehicleOptions = [
    { label: 'Small Van', value: 'van' },
    { label: 'Medium Truck', value: 'truck' },
    { label: 'Large Truck', value: 'large_truck' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuIcon}>
            <Text style={styles.menuText}>≡</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Move
            <Text style={{color:'#2bb6a3'}}>Ease</Text>
          </Text>
          <View style={styles.profileIconBox}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.pageTitle}>Book a Moving Service</Text>
        <Text style={styles.pageSubtitle}>Find and book trusted movers easily.</Text>

        {/* Booking Inputs */}
        <View style={styles.inputGroup}>
          <StyledTextInput name="Pickup location" style={styles.inputBox} />
          <StyledTextInput name="Drop-off location" style={styles.inputBox} />
          <View style={styles.row}>
            <DateSelector placeholder="Select date" style={[styles.inputBox, {flex:1, marginRight:8}]} />
            <View style={{flex:1}}>
              <View>
                <TouchableOpacity
                  style={[styles.inputBox, styles.dropdownBox]}
                  activeOpacity={0.8}
                  onPress={() => setDropdownVisible(true)}
                >
                  <Text style={{color: selectedVehicle ? '#1a232b' : '#7a98b6', fontSize:16}}>
                    {selectedVehicle
                      ? vehicleOptions.find(opt => opt.value === selectedVehicle)?.label
                      : 'Choose vehicle'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                {dropdownVisible && (
                  <View style={styles.dropdownMenuInline}>
                    {vehicleOptions.map(opt => (
                      <TouchableOpacity
                        key={opt.value}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedVehicle(opt.value);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{opt.label}</Text>
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
          style={styles.findMoversButton}
          textStyle={styles.findMoversText}
        />

        {/* How it works */}
        <View style={styles.howItWorksBox}>
          <View style={styles.illustrationBox}>
            {/* Illustration placeholder */}
            <Image source={require('../assets/images/partial-react-logo.png')} style={styles.illustrationImg} />
          </View>
          <View style={styles.howItWorksSteps}>
            <Text style={styles.howItWorksTitle}>How it works</Text>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>📝</Text><Text style={styles.howItWorksText}>Describe Your Move</Text></View>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>✅</Text><Text style={styles.howItWorksText}>Compare Vendors</Text></View>
            <View style={styles.howItWorksRow}><Text style={styles.howItWorksIcon}>🚚</Text><Text style={styles.howItWorksText}>Select a Mover</Text></View>
          </View>
        </View>

        {/* Upcoming Orders */}
        <View style={styles.upcomingOrdersBox}>
          <Text style={styles.upcomingOrdersTitle}>Upcoming Orders</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderDateIcon}><Text style={styles.orderDateText}>✔️</Text></View>
            <View style={styles.orderDetailsBox}>
              <Text style={styles.orderDetailsDate}>April 20</Text>
              <Text style={styles.orderDetailsAddress}>123 Main St → 456 Elm St</Text>
              <Text style={styles.orderDetailsVendor}>Movers Co.</Text>
            </View>
            <PrimaryButton
              text="View Details"
              onPress={() => {}}
              style={styles.viewDetailsButton}
              textStyle={styles.viewDetailsText}
            />
          </View>
        </View>
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
  container: { flex: 1, backgroundColor: '#f9fbfc' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuIcon: { padding: 8 },
  menuText: { fontSize: 28, color: '#2bb6a3', fontWeight: '700' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#1a232b', flex: 1, textAlign: 'center' },
  profileIconBox: { padding: 8 },
  profileIcon: { backgroundColor: '#e8f0f6', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
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