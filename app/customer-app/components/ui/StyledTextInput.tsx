import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';

interface StyledTextInputProps extends TextInputProps {
  name: string;
  style?: StyleProp<TextStyle>;
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({ name, style, ...rest }) => {
  return (
    <TextInput
      placeholder={name}
      placeholderTextColor="#7a98b6"
      style={[styles.inputBox, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2bb6a3',
  },
});

export default StyledTextInput;
