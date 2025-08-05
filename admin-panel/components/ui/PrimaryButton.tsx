import React from 'react';
import { Dimensions, PixelRatio, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Theme } from '../../constants/Theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  text: string;
  style?: object;
  textStyle?: object;
  borderRadius?: number;
}

const { width } = Dimensions.get('window');
const scale = (size: number) =>
  PixelRatio.roundToNearestPixel((width / 375) * size);

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, style, textStyle, borderRadius = Theme.borderRadius, ...rest }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.button, { borderRadius }, style]} {...rest}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a9a9a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf:'center',
    width: scale(342),
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PrimaryButton;
