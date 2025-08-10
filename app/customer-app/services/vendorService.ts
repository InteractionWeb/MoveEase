import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

// Vendor interface
export interface Vendor {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  totalReviews: number;
  vehicleTypes: string[];
  priceRange: string; // e.g., "$", "$$", "$$$"
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  services: string[];
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review interface
export interface VendorReview {
  id?: string;
  vendorId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  orderId: string;
  createdAt: Date;
}

export class VendorService {
  
  // Get all available vendors
  static async getAvailableVendors(): Promise<Vendor[]> {
    const q = query(
      collection(db, 'vendors'),
      where('isAvailable', '==', true)
      // Removed orderBy to avoid index requirement for now
    );

    const querySnapshot = await getDocs(q);
    const vendors: Vendor[] = [];

    querySnapshot.forEach((doc) => {
      vendors.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as Vendor);
    });

    // Sort by rating in JavaScript instead of Firestore
    return vendors.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Get vendors by vehicle type
  static async getVendorsByVehicleType(vehicleType: string): Promise<Vendor[]> {
    const q = query(
      collection(db, 'vendors'),
      where('isAvailable', '==', true),
      where('vehicleTypes', 'array-contains', vehicleType),
      orderBy('rating', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const vendors: Vendor[] = [];

    querySnapshot.forEach((doc) => {
      vendors.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Vendor);
    });

    return vendors;
  }

  // Find nearest vendors based on user location
  static findNearestVendors(vendors: Vendor[], userLat: number, userLon: number, maxDistance: number = 50): Vendor[] {
    return vendors
      .map(vendor => ({
        ...vendor,
        distance: this.calculateDistance(userLat, userLon, vendor.latitude, vendor.longitude)
      }))
      .filter(vendor => vendor.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  // Calculate distance between two points (same as OrderService)
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 100) / 100;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Add a review for a vendor
  static async addVendorReview(review: Omit<VendorReview, 'id' | 'createdAt'>): Promise<void> {
    const reviewData = {
      ...review,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'vendor_reviews'), reviewData);
    
    // Update vendor's average rating
    await this.updateVendorRating(review.vendorId);
  }

  // Update vendor's average rating based on all reviews
  private static async updateVendorRating(vendorId: string): Promise<void> {
    const q = query(
      collection(db, 'vendor_reviews'),
      where('vendorId', '==', vendorId)
    );

    const querySnapshot = await getDocs(q);
    let totalRating = 0;
    let totalReviews = 0;

    querySnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
      totalReviews++;
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, {
      rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      totalReviews,
      updatedAt: new Date(),
    });
  }

  // Get vendor reviews
  static async getVendorReviews(vendorId: string): Promise<VendorReview[]> {
    const q = query(
      collection(db, 'vendor_reviews'),
      where('vendorId', '==', vendorId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const reviews: VendorReview[] = [];

    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as VendorReview);
    });

    return reviews;
  }
}
