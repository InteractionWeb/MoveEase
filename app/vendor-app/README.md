# MoveEase Vendor App

A comprehensive mobile application for moving service providers built with React Native and Expo.

## Features

### 🔐 Authentication
- **Login/Signup**: Secure authentication for vendors
- **Profile Management**: Complete business profile setup
- **Verification**: Business license and document verification

### 📋 Order Management
- **Real-time Orders**: Receive instant notifications for new moving requests
- **Order Filtering**: View orders by status (pending, accepted, in-progress, completed)
- **Order Details**: Comprehensive view of customer requirements, items, locations
- **Accept/Decline**: Quick actions to accept or decline moving requests
- **Status Updates**: Update job progress in real-time

### 💰 Earnings & Analytics
- **Earnings Dashboard**: Track total earnings, monthly income, and pending payouts
- **Job Statistics**: View completed jobs, average job value, and performance metrics
- **Payment History**: Detailed transaction history with status tracking
- **Growth Analytics**: Month-over-month earnings comparison

### 📱 Professional Features
- **Availability Toggle**: Set online/offline status for receiving orders
- **Customer Communication**: Direct calling and messaging with customers
- **GPS Navigation**: Integrated navigation to pickup and delivery locations
- **Route Optimization**: Distance and duration calculations for efficient planning

### 🔔 Notifications
- **Push Notifications**: Instant alerts for new orders and updates
- **In-app Notifications**: Comprehensive notification center with filtering
- **Status Updates**: Automatic notifications for payment processing and job completions

### 👤 Profile & Settings
- **Business Profile**: Company information, contact details, service areas
- **Vehicle Management**: Fleet information and capacity details
- **Service Offerings**: Configurable service types and pricing
- **Ratings & Reviews**: Customer feedback and rating system

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **Real-time Updates**: Firebase Realtime Database
- **Push Notifications**: Firebase Cloud Messaging
- **Maps Integration**: Google Maps API (for navigation)
- **State Management**: React Hooks
- **UI Components**: Custom component library

## Project Structure

```
vendor-app/
├── app/                          # Screen components (Expo Router)
│   ├── (tabs)/                  # Tab-based navigation
│   ├── order/                   # Order-related screens
│   │   └── [id].tsx            # Dynamic order details
│   ├── _layout.tsx             # Root navigation layout
│   ├── index.tsx               # Landing/welcome screen
│   ├── login.tsx               # Authentication screen
│   ├── signup.tsx              # Vendor registration
│   ├── dashboard.tsx           # Main dashboard
│   ├── orders.tsx              # Orders list screen
│   ├── profile.tsx             # Profile management
│   ├── earnings.tsx            # Earnings and analytics
│   └── notifications.tsx       # Notification center
├── components/                  # Reusable UI components
│   └── ui/                     # UI component library
│       ├── PrimaryButton.tsx   # Custom button component
│       ├── StyledTextInput.tsx # Input field component
│       └── Freelocationsearch.tsx # Location search component
├── constants/                   # App configuration
│   ├── Colors.ts               # Color palette and themes
│   ├── Theme.ts                # Typography and spacing
│   └── Config.ts               # App configuration
├── services/                    # API and business logic
│   └── api.ts                  # Firebase integration and API calls
├── assets/                      # Static assets
│   └── images/                 # Image assets
├── package.json                # Dependencies and scripts
├── app.json                    # Expo configuration
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
└── firebaseConfig.js           # Firebase configuration
```

## Key Screens

### 🏠 Dashboard
- Quick stats (earnings, jobs, rating)
- Recent order notifications
- Quick action buttons
- Availability status toggle

### 📦 Orders Screen
- Filterable order list (all, pending, accepted, in-progress, completed)
- Search functionality
- Order status indicators
- Quick accept/decline actions

### 📋 Order Details
- Complete customer information with contact options
- Detailed pickup and delivery addresses with navigation
- Comprehensive items list with special handling notes
- Status update controls and completion actions

### 💳 Earnings
- Total and monthly earnings display
- Pending payouts tracking
- Transaction history with status
- Performance analytics and growth metrics

### 👤 Profile Management
- Business information editing
- Vehicle and service configuration
- Verification status and document management
- Settings and preferences

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd vendor-app
   npm install
   ```

2. **Configure Firebase**
   - Update `firebaseConfig.js` with your Firebase project credentials
   - Enable Firestore, Authentication, and Cloud Functions

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Emulator**
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   ```

## API Integration

The app integrates with Firebase for backend services:

- **Authentication**: User signup, login, and session management
- **Firestore**: Real-time data storage for orders, profiles, and notifications
- **Cloud Functions**: Server-side logic for order matching and notifications
- **Firebase Cloud Messaging**: Push notifications for real-time updates

## Color Scheme

The vendor app uses a professional orange-blue color palette:
- **Primary**: Orange (#FF6B35) - Action buttons and highlights
- **Secondary**: Deep Blue (#1E3A8A) - Professional trust elements
- **Accent**: Green (#10B981) - Success states and earnings
- **Background**: Clean whites and light grays for readability

## Future Enhancements

- **Advanced Analytics**: Detailed performance metrics and insights
- **Route Optimization**: AI-powered route planning for multiple stops
- **Inventory Management**: Moving supplies and equipment tracking
- **Team Management**: Multi-driver coordination for larger operations
- **Customer Reviews**: Enhanced feedback and rating system
- **Pricing Tools**: Dynamic pricing based on demand and distance

## Contributing

This is part of the larger MoveEase ecosystem including customer and admin applications. Follow the established patterns and maintain consistency across all three applications.

---

For technical questions or feature requests, please refer to the main MoveEase project documentation.
