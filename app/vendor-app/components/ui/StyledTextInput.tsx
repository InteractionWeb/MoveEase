import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface StyledTextInputProps extends TextInputProps {
  style?: any;
}

export default function StyledTextInput({ style, ...props }: StyledTextInputProps) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
});
