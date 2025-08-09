import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  priceUnit: string;
  isActive: boolean;
}

export default function ServicesScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Local Moving',
      description: 'Moving within the same city or area',
      basePrice: '85',
      priceUnit: 'per hour',
      isActive: true,
    },
    {
      id: '2',
      name: 'Long Distance Moving',
      description: 'Moving between cities or states',
      basePrice: '2.50',
      priceUnit: 'per mile',
      isActive: true,
    },
    {
      id: '3',
      name: 'Packing Services',
      description: 'Professional packing and unpacking',
      basePrice: '45',
      priceUnit: 'per hour',
      isActive: true,
    },
    {
      id: '4',
      name: 'Storage Services',
      description: 'Temporary storage solutions',
      basePrice: '120',
      priceUnit: 'per month',
      isActive: false,
    },
  ]);

  const handleToggleService = (serviceId: string, isActive: boolean) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, isActive } : service
      )
    );
  };

  const handleUpdatePrice = (serviceId: string, price: string) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, basePrice: price } : service
      )
    );
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // TODO: Save services data to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Services updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderServiceCard = (service: Service) => (
    <View key={service.id} style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>
        <Switch
          value={service.isActive}
          onValueChange={(value) => handleToggleService(service.id, value)}
          trackColor={{ false: Colors.border, true: Colors.primary + '30' }}
          thumbColor={service.isActive ? Colors.primary : Colors.textLight}
        />
      </View>
      
      {service.isActive && (
        <View style={styles.pricingSection}>
          <Text style={styles.pricingLabel}>Base Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <StyledTextInput
              value={service.basePrice}
              onChangeText={(text) => handleUpdatePrice(service.id, text)}
              keyboardType="numeric"
              style={styles.priceInput}
            />
            <Text style={styles.priceUnit}>{service.priceUnit}</Text>
          </View>
        </View>
      )}
    </View>
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
          <Text style={styles.title}>Services & Pricing</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={styles.infoText}>
              Configure your service offerings and pricing. Only active services will be visible to customers.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Available Services</Text>
          
          {services.map(service => renderServiceCard(service))}

          <View style={styles.additionalInfo}>
            <Text style={styles.noteTitle}>Pricing Notes:</Text>
            <Text style={styles.noteText}>• Prices are base rates and can be adjusted per job</Text>
            <Text style={styles.noteText}>• Additional fees may apply for special requests</Text>
            <Text style={styles.noteText}>• All prices exclude taxes and tips</Text>
          </View>
        </View>

        <PrimaryButton
          title={isLoading ? "Saving..." : "Save Changes"}
          onPress={handleSaveChanges}
          disabled={isLoading}
          style={styles.saveButton}
        />
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
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  pricingSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pricingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    marginRight: 12,
  },
  priceUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  additionalInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
