import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';

interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      type: 'Large Van',
      make: 'Ford',
      model: 'Transit 350',
      year: 2021,
      licensePlate: 'ABC-123',
      capacity: '3,500 lbs',
      status: 'active',
    },
    {
      id: '2',
      type: 'Medium Truck',
      make: 'Isuzu',
      model: 'NPR',
      year: 2020,
      licensePlate: 'XYZ-789',
      capacity: '14,500 lbs',
      status: 'active',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'maintenance': return Colors.warning;
      case 'inactive': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const handleAddVehicle = () => {
    Alert.alert('Add Vehicle', 'Vehicle addition feature coming soon!');
  };

  const handleEditVehicle = (vehicleId: string) => {
    Alert.alert('Edit Vehicle', `Edit vehicle ${vehicleId} feature coming soon!`);
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <TouchableOpacity
      key={vehicle.id}
      style={styles.vehicleCard}
      onPress={() => handleEditVehicle(vehicle.id)}
    >
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIcon}>
          <Ionicons name="car" size={24} color={Colors.primary} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleType}>{vehicle.type}</Text>
          <Text style={styles.vehicleDetails}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.vehiclePlate}>License: {vehicle.licensePlate}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(vehicle.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(vehicle.status) }]}>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.vehicleFooter}>
        <Text style={styles.capacityText}>Capacity: {vehicle.capacity}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Vehicles</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddVehicle}
          >
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Vehicle List */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your Fleet</Text>
          
          {vehicles.length > 0 ? (
            vehicles.map(vehicle => renderVehicleCard(vehicle))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={64} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Vehicles Added</Text>
              <Text style={styles.emptySubtitle}>
                Add your first vehicle to start accepting orders
              </Text>
              <PrimaryButton
                title="Add Vehicle"
                onPress={handleAddVehicle}
                style={styles.addVehicleButton}
              />
            </View>
          )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  vehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vehiclePlate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  capacityText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addVehicleButton: {
    paddingHorizontal: 32,
  },
});
