import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { Theme } from '../../constants/Theme';

interface StyledTextInputProps extends TextInputProps {
  name?: string;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  borderRadius?: number;
  label?: string;
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({ name, placeholder, style, borderRadius = Theme.borderRadius, label, ...rest }) => {
  return (
    <>
      {label && (
        <View style={styles.inputLabelBox}>
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
      )}
      <TextInput
        placeholder={placeholder || name}
        placeholderTextColor="#7a98b6"
        style={[styles.input, { borderRadius }, style]}
        importantForAutofill="yes"
        {...rest}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputLabelBox: {
    marginLeft: 8,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a232b',
  },
  input: {
    backgroundColor: '#e8f0f6',
    borderRadius: 18,
    height: 56,
    fontSize: 20,
    paddingHorizontal: 18,
    marginBottom: 18,
    color: '#1a232b',
    borderWidth: 1,
    borderColor: '#2bb67a', // green with similar brightness and transparency
  },
});

export default StyledTextInput;
