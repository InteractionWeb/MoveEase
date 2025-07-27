import OrderList from '@/components/ui/Orderlist';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  FlatList,
  ListRenderItem,
} from 'react-native';
import DateSelector from '../components/ui/DateSelector';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const scale = (size: number) => PixelRatio.roundToNearestPixel((width / 375) * size);

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
    { icon: '✔️', date: 'April 20', address: '123 Main St → 456 Elm St', vendor: 'Movers Co.', onPress: () => {} },
    { icon: '📦', date: 'May 5', address: '789 Oak St → 321 Pine St', vendor: 'Fast Movers', onPress: () => {} },
    { icon: '🚚', date: 'June 10', address: '555 Maple St → 777 Cedar St', vendor: 'Quick Move', onPress: () => {} },
  ];

  const renderContent: ListRenderItem<string> = () => (
    <View>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Book a Moving Service</Text>
      <Text style={[styles.pageSubtitle, { color: colors.tint }]}>Find and book trusted movers easily.</Text>

      <View style={styles.inputGroup}>
        <StyledTextInput
          name="Pickup location"
          style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]}
        />
        <StyledTextInput
          name="Drop-off location"
          style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]}
        />
        <View style={styles.row}>
          <DateSelector
            placeholder="Select date"
            style={[
              styles.inputBox,
              {
                flex: 1,
                marginRight: 8,
                backgroundColor: colors.background,
                borderColor: colors.tint,
              },
            ]}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.inputBox, styles.dropdownBox, { backgroundColor: colors.background, borderColor: colors.tint }]}
              activeOpacity={0.8}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={{ color: selectedVehicle ? colors.text : colors.tint, fontSize: scale(16) }}>
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

      <PrimaryButton
        text="Find Movers"
        onPress={() => {}}
        style={[styles.findMoversButton, { backgroundColor: colors.tint }]}
        textStyle={[styles.findMoversText, { color: colors.text }]}
      />

      <View style={styles.howItWorksBox}>
        <Image source={require('../assets/images/partial-react-logo.png')} style={styles.illustrationImg} />
        <View style={styles.howItWorksSteps}>
          <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How it works</Text>
          <View style={styles.howItWorksRow}>
            <Text style={styles.howItWorksIcon}>📝</Text>
            <Text style={[styles.howItWorksText, { color: colors.text }]}>Describe Your Move</Text>
          </View>
          <View style={styles.howItWorksRow}>
            <Text style={styles.howItWorksIcon}>✅</Text>
            <Text style={[styles.howItWorksText, { color: colors.text }]}>Compare Vendors</Text>
          </View>
          <View style={styles.howItWorksRow}>
            <Text style={styles.howItWorksIcon}>🚚</Text>
            <Text style={[styles.howItWorksText, { color: colors.text }]}>Select a Mover</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <OrderList orders={orders} colors={colors} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.menuIcon}>
          <Text style={[styles.menuText, { color: colors.tint }]}>≡</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Move<Text style={{ color: colors.tint }}>Ease</Text></Text>
        <TouchableOpacity
          style={[styles.profileIconBox, { backgroundColor: colors.background }]}
          onPress={() => router.push('./profile')}
        >
          <View style={[styles.profileIcon, { backgroundColor: colors.background }]}>
            <Text style={[styles.profileIconText, { color: colors.text }]}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>
<<<<<<< HEAD

      <ScrollView style={{ maxHeight: '100%' }}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Book a Moving Service</Text>
        <Text style={[styles.pageSubtitle, { color: colors.tint }]}>Find and book trusted movers easily.</Text>

        <View style={styles.inputGroup}>
          <StyledTextInput
            name="Pickup location"
            style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]}
          />
          <StyledTextInput
            name="Drop-off location"
            style={[styles.inputBox, { backgroundColor: colors.background, color: colors.text, borderColor: colors.tint }]}
          />
          <View style={styles.row}>
            <DateSelector
              placeholder="Select date"
              style={[
                styles.inputBox,
                {
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: colors.background,
                  borderColor: colors.tint,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.inputBox, styles.dropdownBox, { backgroundColor: colors.background, borderColor: colors.tint }]}
                activeOpacity={0.8}
                onPress={() => setDropdownVisible(true)}
              >
                <Text style={{ color: selectedVehicle ? colors.text : colors.tint, fontSize: scale(16) }}>
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

        <PrimaryButton
          text="Find Movers"
          onPress={() => router.push('./booking')}
          style={[styles.findMoversButton, { backgroundColor: colors.tint }]}
          textStyle={[styles.findMoversText, { color: colors.text }]}
        />

        <View style={styles.howItWorksBox}>
          <Image source={require('../assets/images/partial-react-logo.png')} style={styles.illustrationImg} />
          <View style={styles.howItWorksSteps}>
            <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How it works</Text>
            <View style={styles.howItWorksRow}>
              <Text style={styles.howItWorksIcon}>📝</Text>
              <Text style={[styles.howItWorksText, { color: colors.text }]}>Describe Your Move</Text>
            </View>
            <View style={styles.howItWorksRow}>
              <Text style={styles.howItWorksIcon}>✅</Text>
              <Text style={[styles.howItWorksText, { color: colors.text }]}>Compare Vendors</Text>
            </View>
            <View style={styles.howItWorksRow}>
              <Text style={styles.howItWorksIcon}>🚚</Text>
              <Text style={[styles.howItWorksText, { color: colors.text }]}>Select a Mover</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <OrderList orders={orders} colors={colors}/>
        </View>
      </ScrollView>
=======
      <FlatList
        data={['mainContent']}
        renderItem={renderContent}
        keyExtractor={(item, index) => index.toString()}
      />
>>>>>>> e19b0daef76f380dce6ae9cb2b22d994ac99261a
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fcfaff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: scale(16) },
  menuIcon: { padding: scale(8) },
  menuText: { fontSize: scale(28), fontWeight: '700' },
  headerTitle: { fontSize: scale(28), fontWeight: '700', flex: 1, textAlign: 'center' },
  profileIconBox: { padding: scale(8) },
  profileIcon: { borderRadius: 20, width: scale(40), height: scale(40), alignItems: 'center', justifyContent: 'center' },
  profileIconText: { fontSize: scale(24) },
  pageTitle: { fontSize: scale(26), fontWeight: '700', marginLeft: scale(16), marginTop: scale(8) },
  pageSubtitle: { fontSize: scale(16), marginLeft: scale(16), marginBottom: scale(16) },
  inputGroup: { marginHorizontal: scale(16), marginBottom: scale(12) },
  inputBox: { borderRadius: 12, height: scale(48), fontSize: scale(16), paddingHorizontal: scale(16), marginBottom: scale(10), borderWidth: 1 },
  row: { flexDirection: 'row' },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownArrow: { fontSize: scale(16), marginLeft: 8, fontWeight: '700' },
  dropdownMenuInline: { position: 'absolute', top: scale(48), zIndex: 10, borderRadius: 12, paddingVertical: scale(8), minWidth: 180, elevation: 4 },
  dropdownItem: { paddingVertical: scale(10), paddingHorizontal: scale(18) },
  dropdownItemText: { fontSize: scale(16) },
  findMoversButton: { borderRadius: 24, height: scale(52), justifyContent: 'center', alignItems: 'center', marginHorizontal: scale(16), marginVertical: scale(16) },
  findMoversText: { fontSize: scale(20), fontWeight: '600' },
  howItWorksBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: scale(16), marginVertical: scale(16) },
  illustrationImg: { width: scale(90), height: scale(90), resizeMode: 'contain', borderRadius: scale(12) },
  howItWorksSteps: { flex: 1 },
  howItWorksTitle: { fontSize: scale(20), fontWeight: '700', marginBottom: scale(8) },
  howItWorksRow: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(6) },
  howItWorksIcon: { fontSize: scale(18), marginRight: scale(8) },
  howItWorksText: { fontSize: scale(16) },
});

export default DashboardScreen;
