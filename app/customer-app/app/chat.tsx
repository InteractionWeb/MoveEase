import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'vendor';
  timestamp: any;
  orderId: string;
  createdAt?: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { orderId, vendorId, vendorName } = useLocalSearchParams();
  const colorScheme = useColorScheme() || 'light';
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user details from Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userDoc = usersSnapshot.docs.find(doc => doc.data().email === user.email);
        if (userDoc) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: userDoc.data().name,
            userType: userDoc.data().userType || 'customer'
          });
        }
      } else {
        router.replace('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const messagesQuery = query(
      collection(db, 'chats'),
      where('orderId', '==', orderId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(messagesData);
      
      // Scroll to bottom when new messages arrive
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsubscribe;
  }, [orderId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'chats'), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.name,
        senderType: currentUser.userType,
        orderId: orderId,
        vendorId: vendorId,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;
    const messageTime = item.timestamp?.toDate?.() || new Date(item.createdAt || Date.now());

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isCurrentUser ? colors.tint : colors.background,
            borderColor: colors.text + '20'
          }
        ]}>
          {!isCurrentUser && (
            <Text style={[styles.senderName, { color: colors.tint }]}>
              {item.senderName}
            </Text>
          )}
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? '#FFFFFF' : colors.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isCurrentUser ? '#FFFFFF80' : colors.text + '60' }
          ]}>
            {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.text + '20' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Chat with {currentUser?.userType === 'customer' ? vendorName : 'Customer'}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text + '60' }]}>
            Order #{String(orderId).slice(-6)}
          </Text>
        </View>
        
        <View style={[styles.onlineIndicator, { backgroundColor: '#4CAF50' }]} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={() => (
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubbles-outline" size={60} color={colors.text + '40'} />
            <Text style={[styles.emptyChatText, { color: colors.text + '60' }]}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        )}
      />

      {/* Message Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.text + '20' }]}>
        <View style={[styles.textInputContainer, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.text + '60'}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, { backgroundColor: newMessage.trim() ? colors.tint : colors.text + '20' }]}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? '#FFFFFF' : colors.text + '60'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyChatText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
