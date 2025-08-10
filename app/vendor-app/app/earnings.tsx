import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface EarningsData {
  totalEarnings: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayouts: number;
  completedJobs: number;
  averageJobValue: number;
  topCustomer: string;
}

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
  orderId: string;
}

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const [earningsData] = useState<EarningsData>({
    totalEarnings: 12450.75,
    thisWeek: 890.50,
    thisMonth: 3200.25,
    lastMonth: 2850.00,
    pendingPayouts: 650.00,
    completedJobs: 128,
    averageJobValue: 285.50,
    topCustomer: 'John Smith',
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2025-08-10',
      customer: 'John Smith',
      amount: 350.00,
      status: 'completed',
      orderId: 'ORD-001',
    },
    {
      id: '2',
      date: '2025-08-09',
      customer: 'Sarah Johnson',
      amount: 275.50,
      status: 'completed',
      orderId: 'ORD-002',
    },
    {
      id: '3',
      date: '2025-08-08',
      customer: 'Mike Davis',
      amount: 420.00,
      status: 'processing',
      orderId: 'ORD-003',
    },
    {
      id: '4',
      date: '2025-08-07',
      customer: 'Lisa Anderson',
      amount: 180.75,
      status: 'completed',
      orderId: 'ORD-004',
    },
    {
      id: '5',
      date: '2025-08-06',
      customer: 'Robert Wilson',
      amount: 320.25,
      status: 'pending',
      orderId: 'ORD-005',
    },
  ]);

  const periods = [
    { key: 'week', label: 'This Week', value: earningsData.thisWeek },
    { key: 'month', label: 'This Month', value: earningsData.thisMonth },
    { key: 'year', label: 'Total Earnings', value: earningsData.totalEarnings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'processing': return Colors.primary;
      case 'pending': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Paid';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateGrowth = () => {
    const growth = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100;
    return Math.round(growth);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Earnings</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => {/* Navigate to payout settings */}}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodContent}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodChip,
                  selectedPeriod === period.key && styles.activePeriodChip,
                ]}
                onPress={() => setSelectedPeriod(period.key as any)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period.key && styles.activePeriodText,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Earnings Card */}
        <View style={styles.mainEarningsCard}>
          <Text style={styles.earningsLabel}>
            {periods.find(p => p.key === selectedPeriod)?.label}
          </Text>
          <Text style={styles.earningsAmount}>
            {formatCurrency(periods.find(p => p.key === selectedPeriod)?.value || 0)}
          </Text>
          {selectedPeriod === 'month' && (
            <View style={styles.growthContainer}>
              <Ionicons 
                name={calculateGrowth() >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={calculateGrowth() >= 0 ? Colors.success : Colors.error} 
              />
              <Text style={[
                styles.growthText,
                { color: calculateGrowth() >= 0 ? Colors.success : Colors.error }
              ]}>
                {Math.abs(calculateGrowth())}% from last month
              </Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statValue}>{formatCurrency(earningsData.pendingPayouts)}</Text>
              <Text style={styles.statLabel}>Pending Payouts</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statValue}>{earningsData.completedJobs}</Text>
              <Text style={styles.statLabel}>Jobs Completed</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="trending-up-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{formatCurrency(earningsData.averageJobValue)}</Text>
              <Text style={styles.statLabel}>Avg Job Value</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="person-outline" size={20} color={Colors.accent} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>{earningsData.topCustomer}</Text>
              <Text style={styles.statLabel}>Top Customer</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Payout Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Tax Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => {/* Navigate to transaction details */}}
              >
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionHeader}>
                    <Text style={styles.customerName}>{transaction.customer}</Text>
                    <Text style={styles.transactionAmount}>
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                    <View style={styles.transactionMeta}>
                      <Text style={styles.orderId}>#{transaction.orderId}</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(transaction.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(transaction.status) }
                        ]}>
                          {getStatusText(transaction.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payout Schedule Info */}
        <View style={styles.payoutInfoCard}>
          <View style={styles.payoutHeader}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.payoutTitle}>Payout Information</Text>
          </View>
          <Text style={styles.payoutText}>
            Payments are processed weekly on Fridays. Completed jobs are typically paid within 2-3 business days after completion.
          </Text>
          <TouchableOpacity style={styles.payoutLearnMore}>
            <Text style={styles.learnMoreText}>Learn more about payouts</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  periodContainer: {
    paddingVertical: 16,
  },
  periodContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  periodChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activePeriodChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activePeriodText: {
    color: Colors.white,
  },
  mainEarningsCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: (width - 52) / 2,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  payoutInfoCard: {
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  payoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  payoutText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  payoutLearnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});
