import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const ThemedAlert: React.FC<ThemedAlertProps> = ({ visible, title, message, onClose }) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme as keyof typeof Colors] || Colors.light;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.tint }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: colors.tint }]}>
            <Text style={[styles.buttonText, { color: colors.background }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 280,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemedAlert;
