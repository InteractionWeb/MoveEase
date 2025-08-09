import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PrimaryButton from '../components/ui/PrimaryButton';
import StyledTextInput from '../components/ui/StyledTextInput';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
}

export default function SupportScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I receive new orders?',
      answer: 'Orders are automatically sent to active vendors in your area. Make sure your availability status is "Online" and your profile is complete with all required documents.',
      isExpanded: false,
    },
    {
      id: '2',
      question: 'When do I get paid?',
      answer: 'Payments are processed weekly on Mondays for all completed jobs from the previous week. Funds are deposited directly to your registered bank account.',
      isExpanded: false,
    },
    {
      id: '3',
      question: 'What if a customer cancels an order?',
      answer: 'If a customer cancels within 24 hours of the scheduled time, you may be eligible for a cancellation fee. Contact support for assistance with cancellation policies.',
      isExpanded: false,
    },
    {
      id: '4',
      question: 'How can I improve my ratings?',
      answer: 'Focus on punctuality, clear communication, careful handling of items, and professional service. Respond to customer messages promptly and follow up after completion.',
      isExpanded: false,
    },
    {
      id: '5',
      question: 'What documents do I need to verify?',
      answer: 'Required documents include business license, commercial vehicle insurance, driver\'s license, and liability insurance. Some areas may require additional permits.',
      isExpanded: false,
    },
  ]);

  const toggleFAQ = (faqId: string) => {
    setFaqs(prev =>
      prev.map(faq =>
        faq.id === faqId
          ? { ...faq, isExpanded: !faq.isExpanded }
          : faq
      )
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message before sending.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Send message to support
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Message Sent',
        'Your message has been sent to our support team. We\'ll get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => setMessage('') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+1-800-MOVEEASE');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:vendor-support@moveease.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/18003663327');
  };

  const renderContactOption = (title: string, subtitle: string, icon: keyof typeof Ionicons.glyphMap, onPress: () => void) => (
    <TouchableOpacity style={styles.contactCard} onPress={onPress}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderFAQItem = (faq: FAQ) => (
    <TouchableOpacity
      key={faq.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(faq.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons
          name={faq.isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.textSecondary}
        />
      </View>
      {faq.isExpanded && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
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
          <Text style={styles.title}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Contact Options */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          {renderContactOption(
            'Call Support',
            'Available 24/7 for urgent issues',
            'call',
            handleCall
          )}
          
          {renderContactOption(
            'Email Support',
            'Get help via email support',
            'mail',
            handleEmail
          )}
          
          {renderContactOption(
            'WhatsApp Chat',
            'Quick chat support',
            'logo-whatsapp',
            handleWhatsApp
          )}

          {/* Send Message */}
          <View style={styles.messageSection}>
            <Text style={styles.sectionTitle}>Send us a Message</Text>
            <StyledTextInput
              placeholder="Describe your issue or question..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />
            <PrimaryButton
              title={isLoading ? "Sending..." : "Send Message"}
              onPress={handleSendMessage}
              disabled={isLoading}
              style={styles.sendButton}
            />
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqContainer}>
              {faqs.map(faq => renderFAQItem(faq))}
            </View>
          </View>

          {/* Additional Resources */}
          <View style={styles.resourcesSection}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Vendor Guidelines</Text>
              <Ionicons name="open-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="school" size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Training Materials</Text>
              <Ionicons name="open-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Safety Guidelines</Text>
              <Ionicons name="open-outline" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
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
  placeholder: {
    width: 34,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  messageSection: {
    marginTop: 20,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  sendButton: {
    alignSelf: 'stretch',
  },
  faqSection: {
    marginTop: 20,
  },
  faqContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },
  resourcesSection: {
    marginTop: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resourceText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 12,
  },
});
