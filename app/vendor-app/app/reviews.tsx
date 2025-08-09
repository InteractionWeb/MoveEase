import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  serviceType: string;
}

export default function ReviewsScreen() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service! The team was professional, punctual, and handled our belongings with great care. Highly recommended!',
      date: '2024-03-15',
      orderId: 'ORD-001',
      serviceType: 'Local Moving',
    },
    {
      id: '2',
      customerName: 'Michael Chen',
      rating: 4,
      comment: 'Good service overall. The movers were efficient and friendly. Only minor issue was they arrived 30 minutes late.',
      date: '2024-03-10',
      orderId: 'ORD-002',
      serviceType: 'Long Distance Moving',
    },
    {
      id: '3',
      customerName: 'Emily Davis',
      rating: 5,
      comment: 'Amazing experience! They went above and beyond to ensure everything was perfect. Will definitely use them again.',
      date: '2024-03-08',
      orderId: 'ORD-003',
      serviceType: 'Packing Services',
    },
    {
      id: '4',
      customerName: 'David Wilson',
      rating: 3,
      comment: 'Service was okay but there were some issues with communication. The final result was satisfactory though.',
      date: '2024-03-05',
      orderId: 'ORD-004',
      serviceType: 'Local Moving',
    },
    {
      id: '5',
      customerName: 'Lisa Thompson',
      rating: 5,
      comment: 'Perfect service from start to finish. Professional, careful, and completed ahead of schedule!',
      date: '2024-03-01',
      orderId: 'ORD-005',
      serviceType: 'Local Moving',
    },
  ]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={Colors.warning}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return Colors.success;
    if (rating >= 3) return Colors.warning;
    return Colors.error;
  };

  const renderReviewCard = (review: Review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{review.customerName.charAt(0)}</Text>
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{review.customerName}</Text>
            <Text style={styles.serviceType}>{review.serviceType}</Text>
            <Text style={styles.orderDate}>
              Order #{review.orderId} • {new Date(review.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingNumber, { color: getRatingColor(review.rating) }]}>
            {review.rating}
          </Text>
          <View style={styles.starsContainer}>
            {renderStars(review.rating)}
          </View>
        </View>
      </View>
      
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    return { rating, count, percentage: (count / reviews.length) * 100 };
  });

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
          <Text style={styles.title}>Reviews & Ratings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Rating Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.overallRating}>
            <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
            <View style={styles.summaryStars}>
              {renderStars(Math.round(averageRating))}
            </View>
            <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
          </View>
          
          <View style={styles.ratingBreakdown}>
            {ratingDistribution.map(item => (
              <View key={item.rating} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{item.rating}</Text>
                <Ionicons name="star" size={14} color={Colors.warning} />
                <View style={styles.ratingBar}>
                  <View 
                    style={[
                      styles.ratingBarFill, 
                      { width: `${item.percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.ratingCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          
          {reviews.length > 0 ? (
            reviews.map(review => renderReviewCard(review))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={64} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptySubtitle}>
                Complete your first order to start receiving customer reviews
              </Text>
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
  placeholder: {
    width: 34,
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
  },
  overallRating: {
    alignItems: 'center',
    marginRight: 30,
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryStars: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ratingBreakdown: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: Colors.text,
    minWidth: 12,
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.warning,
    borderRadius: 3,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    minWidth: 20,
    textAlign: 'right',
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
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  serviceType: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
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
  },
});
