import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { auth, db } from '../firebaseConfig';

// Responsive utility
const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const ProfileScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  const [userName, setUserName] = useState('Loading...');
  const [memberSince, setMemberSince] = useState('Loading...');
  const [profileImage, setProfileImage] = useState(require('../assets/images/siuu.jpg'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
          if (userDoc) {
            const userData = userDoc.data();
            setUserName(userData.name || 'Username');
            setProfileImage(
              userData.profileImage
                ? { uri: userData.profileImage }
                : require('../assets/images/siuu.jpg')
            );
          }
          if (user.metadata?.creationTime) {
            const creationDate = new Date(user.metadata.creationTime);
            setMemberSince(creationDate.getFullYear().toString());
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => auth.signOut().then(() => router.push('/login')),
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri });

      // Save the image URL to Firestore
      try {
        const user = auth.currentUser;
        if (user) {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
          if (userDoc) {
            const userRef = doc(db, 'users', userDoc.id); // Ensure correct document ID is used
            await updateDoc(userRef, { profileImage: result.assets[0].uri });
          }
        }
      } catch (error) {
        console.error('Error saving profile image to Firestore:', error);
      }
    }
  };

const menuItems = [
    {
      section: 'Account',
      items: [
        { label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
        { label: 'Address', onPress: () => router.push('/addresscheck') },
      ],
    },
    {
      section: 'Preferences',
      items: [
        { label: 'Notifications', onPress: () => alert('Notifications settings not implemented yet') },
        { label: 'Language', onPress: () => alert('Language settings not implemented yet') },
        { label: 'Logout', onPress: handleLogout },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={{ width: normalize(30) }} />
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
        <Text style={[styles.memberSince, { color: colors.tint }]}>Member since {memberSince}</Text>
      </View>

      {menuItems.map((section, idx) => (
        <View key={idx} style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.section}</Text>
          {section.items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderColor: colors.tint }]}
              onPress={item.onPress}
            >
              <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={normalize(20)} color={colors.tint} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    marginVertical: normalize(20),
    top: normalize(25),
    justifyContent: 'space-between',
  },
  backButton: {
    padding: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: normalize(24),
  },
  profileImage: {
    width: normalize(160),
    height: normalize(160),
    borderRadius: normalize(80),
    marginBottom: normalize(12),
  },
  userName: {
    fontSize: normalize(24),
    fontWeight: '700',
  },
  memberSince: {
    fontSize: normalize(16),
    color: '#6b7c93',
    marginTop: normalize(4),
  },
  menuSection: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(24),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    marginBottom: normalize(12),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(8),
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: normalize(16),
  },
});

export default ProfileScreen;
