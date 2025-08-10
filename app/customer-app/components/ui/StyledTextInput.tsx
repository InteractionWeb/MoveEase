import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

interface StyledTextInputProps extends TextInputProps {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export default function StyledTextInput({
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: StyledTextInputProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}>
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={20}
          color={colors.text + '60'}
          style={styles.leftIcon}
        />
      )}
      
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            flex: 1,
            paddingLeft: leftIcon ? 8 : 16,
            paddingRight: rightIcon ? 8 : 16,
          },
          style,
        ]}
        placeholderTextColor={colors.text + '60'}
        {...props}
      />
      
      {rightIcon && (
        <Ionicons
          name={rightIcon}
          size={20}
          color={colors.text + '60'}
          style={styles.rightIcon}
          onPress={onRightIconPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 4,
  },
  input: {
    paddingVertical: 16,
    fontSize: 16,
  },
  leftIcon: {
    marginLeft: 16,
  },
  rightIcon: {
    marginRight: 16,
  },
});
