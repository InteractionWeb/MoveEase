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

interface Document {
  id: string;
  name: string;
  description: string;
  status: 'verified' | 'pending' | 'rejected' | 'not_uploaded';
  uploadDate?: string;
  expiryDate?: string;
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Business License',
      description: 'Valid business license or registration',
      status: 'verified',
      uploadDate: '2024-01-15',
      expiryDate: '2025-01-15',
    },
    {
      id: '2',
      name: 'Commercial Vehicle Insurance',
      description: 'Proof of commercial vehicle insurance',
      status: 'verified',
      uploadDate: '2024-02-01',
      expiryDate: '2025-02-01',
    },
    {
      id: '3',
      name: 'Driver\'s License',
      description: 'Valid driver\'s license for all drivers',
      status: 'pending',
      uploadDate: '2024-03-01',
    },
    {
      id: '4',
      name: 'DOT Number',
      description: 'Department of Transportation number (if required)',
      status: 'not_uploaded',
    },
    {
      id: '5',
      name: 'Liability Insurance',
      description: 'General liability insurance certificate',
      status: 'rejected',
      uploadDate: '2024-02-20',
    },
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          color: Colors.success,
          icon: 'checkmark-circle' as const,
          text: 'Verified',
        };
      case 'pending':
        return {
          color: Colors.warning,
          icon: 'time' as const,
          text: 'Pending Review',
        };
      case 'rejected':
        return {
          color: Colors.error,
          icon: 'close-circle' as const,
          text: 'Rejected',
        };
      case 'not_uploaded':
        return {
          color: Colors.textLight,
          icon: 'cloud-upload' as const,
          text: 'Not Uploaded',
        };
      default:
        return {
          color: Colors.textLight,
          icon: 'help-circle' as const,
          text: 'Unknown',
        };
    }
  };

  const handleDocumentAction = (document: Document) => {
    if (document.status === 'not_uploaded' || document.status === 'rejected') {
      Alert.alert('Upload Document', `Upload ${document.name} feature coming soon!`);
    } else {
      Alert.alert('View Document', `View ${document.name} feature coming soon!`);
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow;
  };

  const renderDocumentCard = (document: Document) => {
    const statusInfo = getStatusInfo(document.status);
    const expiring = isExpiringSoon(document.expiryDate);

    return (
      <TouchableOpacity
        key={document.id}
        style={styles.documentCard}
        onPress={() => handleDocumentAction(document)}
      >
        <View style={styles.documentHeader}>
          <View style={styles.documentIcon}>
            <Ionicons name="document-text" size={24} color={Colors.primary} />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{document.name}</Text>
            <Text style={styles.documentDescription}>{document.description}</Text>
            {document.uploadDate && (
              <Text style={styles.uploadDate}>
                Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
              </Text>
            )}
            {document.expiryDate && (
              <Text style={[
                styles.expiryDate, 
                expiring && { color: Colors.warning }
              ]}>
                Expires: {new Date(document.expiryDate).toLocaleDateString()}
                {expiring && ' (Expiring Soon!)'}
              </Text>
            )}
          </View>
          <View style={styles.statusContainer}>
            <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
          </View>
        </View>
        
        <View style={styles.documentFooter}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  const verificationProgress = documents.filter(doc => doc.status === 'verified').length;
  const totalDocuments = documents.length;

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
          <Text style={styles.title}>Documents</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Verification Progress</Text>
            <Text style={styles.progressCount}>{verificationProgress}/{totalDocuments}</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(verificationProgress / totalDocuments) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {verificationProgress === totalDocuments 
              ? 'All documents verified!' 
              : `${totalDocuments - verificationProgress} documents need attention`
            }
          </Text>
        </View>

        {/* Documents List */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          
          {documents.map(document => renderDocumentCard(document))}

          <View style={styles.helpCard}>
            <Ionicons name="help-circle" size={24} color={Colors.primary} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                Contact support if you have questions about document requirements or verification process.
              </Text>
              <PrimaryButton
                title="Contact Support"
                onPress={() => Alert.alert('Support', 'Support feature coming soon!')}
                style={styles.supportButton}
              />
            </View>
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
  progressCard: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  documentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  uploadDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  expiryDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusContainer: {
    marginLeft: 12,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  supportButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
