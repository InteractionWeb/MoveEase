/**
 * Configuration constants for the vendor app
 */

export const Config = {
  // API Configuration
  LOCATIONIQ_API_KEY: 'pk.3c4b1d1c0bb2985a5e2f8e28b4c8d09e', // Same as customer app
  LOCATIONIQ_BASE_URL: 'https://us1.locationiq.com/v1',
  
  // Vendor specific settings
  VENDOR_RADIUS_KM: 50, // Default radius for order notifications
  MIN_EARNINGS_THRESHOLD: 500, // Minimum earnings to request payout
  ORDER_TIMEOUT_MINUTES: 30, // Time to respond to order request
  
  // App settings
  DEFAULT_CURRENCY: 'PKR',
  DEFAULT_LANGUAGE: 'en',
  
  // Order status constants
  ORDER_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  } as const,
  
  // Vehicle types that vendors can offer
  VEHICLE_TYPES: [
    { id: 'bike', name: 'Motorcycle', icon: '🏍️' },
    { id: 'car', name: 'Car', icon: '🚗' },
    { id: 'van', name: 'Van', icon: '🚐' },
    { id: 'truck_small', name: 'Small Truck', icon: '🚚' },
    { id: 'truck_large', name: 'Large Truck', icon: '🚛' },
  ],
  
  // Service areas (can be expanded)
  SERVICE_AREAS: [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
  ],
};
