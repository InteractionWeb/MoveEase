import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StyledTextInput from '../components/ui/StyledTextInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    vehicleTypes: [] as string[],
    servicesOffered: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const vehicleTypeOptions = [
    'Small Van',
    'Large Van',
    'Small Truck',
    'Medium Truck',
    'Large Truck',
    'Moving Trailer',
  ];

  const serviceOptions = [
    'Local Moving',
    'Long Distance Moving',
    'Packing Services',
    'Storage Services',
    'Furniture Assembly',
    'Piano Moving',
    'Office Moving',
    'Specialty Items',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSelection = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (formData.vehicleTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one vehicle type');
      return;
    }

    if (formData.servicesOffered.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement Firebase signup logic
      console.log('Signup data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Registration submitted successfully! Your account will be reviewed and activated within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
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
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Join as a Mover</Text>
            <Text style={styles.subtitle}>
              Start your journey with MoveEase and grow your business
            </Text>
          </View>

          {/* Company Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            
            <StyledTextInput
              placeholder="Company Name *"
              value={formData.companyName}
              onChangeText={(value) => handleInputChange('companyName', value)}
              autoCapitalize="words"
            />

            <StyledTextInput
              placeholder="Contact Person *"
              value={formData.contactPerson}
              onChangeText={(value) => handleInputChange('contactPerson', value)}
              autoCapitalize="words"
            />

            <StyledTextInput
              placeholder="Email Address *"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <StyledTextInput
              placeholder="Phone Number *"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Address</Text>
            
            <StyledTextInput
              placeholder="Street Address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <StyledTextInput
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                autoCapitalize="words"
                style={styles.halfInput}
              />

              <StyledTextInput
                placeholder="State"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                autoCapitalize="characters"
                style={styles.halfInput}
              />
            </View>

            <StyledTextInput
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Vehicle Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Types *</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            
            <View style={styles.optionsContainer}>
              {vehicleTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionChip,
                    formData.vehicleTypes.includes(option) && styles.selectedChip,
                  ]}
                  onPress={() => toggleSelection(formData.vehicleTypes, option, 'vehicleTypes')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.vehicleTypes.includes(option) && styles.selectedText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Services Offered */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Offered *</Text>
            <Text style={styles.sectionSubtitle}>Select all that apply</Text>
            
            <View style={styles.optionsContainer}>
              {serviceOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionChip,
                    formData.servicesOffered.includes(option) && styles.selectedChip,
                  ]}
                  onPress={() => toggleSelection(formData.servicesOffered, option, 'servicesOffered')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.servicesOffered.includes(option) && styles.selectedText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Password */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <StyledTextInput
              placeholder="Password *"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
            />

            <StyledTextInput
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry
            />
          </View>

          {/* Terms and Submit */}
          <View style={styles.section}>
            <Text style={styles.termsText}>
              By registering, you agree to our Terms of Service and Privacy Policy.
              Your account will be reviewed and activated within 24 hours.
            </Text>

            <PrimaryButton
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleSignup}
              disabled={isLoading}
              style={styles.submitButton}
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedText: {
    color: Colors.white,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 20,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loginTextBold: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
