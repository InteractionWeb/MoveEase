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
import StyledTextInput from '../components/ui/StyledTextInput';

export default function EditProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: 'Swift Movers LLC',
    contactPerson: 'Mike Johnson',
    email: 'mike@swiftmovers.com',
    phone: '+1 (555) 987-6543',
    address: '123 Business Ave',
    city: 'City Name',
    state: 'ST',
    zipCode: '12345',
    description: 'Professional moving services with 5+ years of experience',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Save profile data to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <StyledTextInput
            placeholder="Company Name"
            value={formData.companyName}
            onChangeText={(text) => updateField('companyName', text)}
            style={styles.input}
          />

          <StyledTextInput
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChangeText={(text) => updateField('contactPerson', text)}
            style={styles.input}
          />

          <StyledTextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <StyledTextInput
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Address</Text>

          <StyledTextInput
            placeholder="Street Address"
            value={formData.address}
            onChangeText={(text) => updateField('address', text)}
            style={styles.input}
          />

          <View style={styles.row}>
            <StyledTextInput
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => updateField('city', text)}
              style={[styles.input, styles.halfWidth]}
            />
            <StyledTextInput
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => updateField('state', text)}
              style={[styles.input, styles.halfWidth]}
            />
          </View>

          <StyledTextInput
            placeholder="ZIP Code"
            value={formData.zipCode}
            onChangeText={(text) => updateField('zipCode', text)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Description</Text>
          
          <StyledTextInput
            placeholder="Business Description"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <PrimaryButton
          title={isLoading ? "Saving..." : "Save Changes"}
          onPress={handleSave}
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
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    marginTop: 20,
  },
  input: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
