import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig.js';

// Order status types
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Order interface
export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  fromAddress: string;
  toAddress: string;
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  scheduledDate: Date;
  scheduledTime: string;
  vehicleType: string;
  totalCost: number;
  estimatedDuration: string;
  specialInstructions?: string;
  status: OrderStatus;
  vendorId?: string;
  vendorName?: string;
  vendorPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

// Order item interface
export interface OrderItem {
  name: string;
  category: string;
  quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

// Vehicle pricing (you can move this to a separate config or fetch from backend)
const VEHICLE_PRICING = {
  'van': { basePrice: 100, pricePerKm: 2 },
  'truck': { basePrice: 150, pricePerKm: 3 },
  'large_truck': { basePrice: 200, pricePerKm: 4 }
};

export class OrderService {
  
  // Create a new order
  static async createOrder(orderData: Omit<Order, 'id' | 'userId' | 'userEmail' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create the order object and filter out undefined values
    const baseOrder = {
      ...orderData,
      userId: user.uid,
      userEmail: user.email!,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Filter out undefined, null, and empty string values to avoid Firestore errors
    const cleanedOrder = Object.fromEntries(
      Object.entries(baseOrder).filter(([_, value]) => 
        value !== undefined && 
        value !== null && 
        !(typeof value === 'string' && value.trim() === '')
      )
    );

    const docRef = await addDoc(collection(db, 'orders'), cleanedOrder);
    return docRef.id;
  }

  // Get user's orders
  static async getUserOrders(): Promise<Order[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Query with proper ordering (requires composite index)
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Helper function to safely convert dates
      const safeToDate = (dateValue: any): Date => {
        if (!dateValue) return new Date();
        if (dateValue instanceof Date) return dateValue;
        if (dateValue.toDate && typeof dateValue.toDate === 'function') {
          return dateValue.toDate();
        }
        // Try to convert string or number to date
        try {
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? new Date() : date;
        } catch {
          return new Date();
        }
      };
      
      orders.push({
        id: doc.id,
        ...data,
        createdAt: safeToDate(data.createdAt),
        updatedAt: safeToDate(data.updatedAt),
        scheduledDate: safeToDate(data.scheduledDate),
      } as Order);
    });

    return orders;
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date(),
    });
  }

  // Cancel order
  static async cancelOrder(orderId: string): Promise<void> {
    await this.updateOrderStatus(orderId, 'cancelled');
  }

  // Calculate estimated cost based on distance and vehicle type
  static calculateCost(distance: number, vehicleType: string): number {
    const pricing = VEHICLE_PRICING[vehicleType as keyof typeof VEHICLE_PRICING];
    if (!pricing) {
      throw new Error('Invalid vehicle type');
    }
    
    return pricing.basePrice + (distance * pricing.pricePerKm);
  }

  // Calculate distance between two coordinates (Haversine formula)
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 100) / 100; // Round to 2 decimal places
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Estimate duration based on distance
  static estimateDuration(distance: number): string {
    const hoursEstimate = Math.ceil(distance / 30); // Assuming 30 km/hour average
    if (hoursEstimate < 1) {
      return '1 hour';
    } else if (hoursEstimate === 1) {
      return '1 hour';
    } else {
      return `${hoursEstimate} hours`;
    }
  }
}
