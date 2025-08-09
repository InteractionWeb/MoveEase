import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Types
export interface VendorData {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vehicleTypes: string[];
  servicesOffered: string[];
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  totalJobs: number;
  createdAt: string;
}

export interface OrderData {
  id: string;
  customerId: string;
  vendorId?: string;
  pickup: {
    address: string;
    coordinates: { lat: number; lng: number };
    accessNotes?: string;
  };
  dropoff: {
    address: string;
    coordinates: { lat: number; lng: number };
    accessNotes?: string;
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  items: Array<{
    name: string;
    quantity: number;
    weight?: string;
    dimensions?: string;
  }>;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Services
export const authService = {
  // Sign up vendor
  signUp: async (email: string, password: string, vendorData: Omit<VendorData, 'id' | 'createdAt' | 'rating' | 'totalJobs'>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create vendor profile
      const vendorProfile: VendorData = {
        ...vendorData,
        id: user.uid,
        rating: 0,
        totalJobs: 0,
        createdAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, 'vendors'), vendorProfile);
      return { user, vendorProfile };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in vendor
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Vendor Services
export const vendorService = {
  // Get vendor profile
  getVendorProfile: async (vendorId: string): Promise<VendorData | null> => {
    try {
      const q = query(collection(db, 'vendors'), where('id', '==', vendorId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as VendorData;
      }
      return null;
    } catch (error) {
      console.error('Get vendor profile error:', error);
      throw error;
    }
  },

  // Update vendor profile
  updateVendorProfile: async (vendorId: string, updates: Partial<VendorData>) => {
    try {
      const q = query(collection(db, 'vendors'), where('id', '==', vendorId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, updates);
      }
    } catch (error) {
      console.error('Update vendor profile error:', error);
      throw error;
    }
  },

  // Update availability status
  updateAvailability: async (vendorId: string, isAvailable: boolean) => {
    try {
      await vendorService.updateVendorProfile(vendorId, { isAvailable });
    } catch (error) {
      console.error('Update availability error:', error);
      throw error;
    }
  },
};

// Order Services
export const orderService = {
  // Get orders for vendor
  getVendorOrders: async (vendorId: string, status?: string): Promise<OrderData[]> => {
    try {
      let q;
      if (status) {
        q = query(
          collection(db, 'orders'),
          where('vendorId', '==', vendorId),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'orders'),
          where('vendorId', '==', vendorId),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as OrderData));
    } catch (error) {
      console.error('Get vendor orders error:', error);
      throw error;
    }
  },

  // Get pending orders (available for vendors to accept)
  getPendingOrders: async (vendorLocation?: { lat: number; lng: number }): Promise<OrderData[]> => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as OrderData));
    } catch (error) {
      console.error('Get pending orders error:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<OrderData | null> => {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as OrderData;
      }
      return null;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Accept order
  acceptOrder: async (orderId: string, vendorId: string) => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        vendorId,
        status: 'accepted',
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Accept order error:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderData['status']) => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Listen to order updates
  listenToOrderUpdates: (vendorId: string, callback: (orders: OrderData[]) => void) => {
    const q = query(
      collection(db, 'orders'),
      where('vendorId', '==', vendorId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as OrderData));
      callback(orders);
    });
  },
};

// Notification Services
export const notificationService = {
  // Send push notification (placeholder - integrate with Firebase Cloud Messaging)
  sendPushNotification: async (vendorId: string, title: string, body: string, data?: any) => {
    try {
      // TODO: Implement FCM push notification
      console.log('Sending push notification:', { vendorId, title, body, data });
    } catch (error) {
      console.error('Send push notification error:', error);
      throw error;
    }
  },

  // Create notification record
  createNotification: async (vendorId: string, notification: {
    type: string;
    title: string;
    message: string;
    orderId?: string;
    amount?: number;
  }) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        vendorId,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  },
};

// Analytics Services
export const analyticsService = {
  // Get vendor earnings data
  getVendorEarnings: async (vendorId: string) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('vendorId', '==', vendorId),
        where('status', '==', 'completed')
      );
      
      const querySnapshot = await getDocs(q);
      const completedOrders = querySnapshot.docs.map(doc => doc.data() as OrderData);
      
      const totalEarnings = completedOrders.reduce((sum, order) => sum + order.amount, 0);
      const thisMonth = completedOrders.filter(order => {
        const orderDate = new Date(order.updatedAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      }).reduce((sum, order) => sum + order.amount, 0);
      
      return {
        totalEarnings,
        thisMonth,
        completedJobs: completedOrders.length,
        averageJobValue: totalEarnings / (completedOrders.length || 1),
      };
    } catch (error) {
      console.error('Get vendor earnings error:', error);
      throw error;
    }
  },
};

// Export all services
export default {
  auth: authService,
  vendor: vendorService,
  order: orderService,
  notification: notificationService,
  analytics: analyticsService,
};
