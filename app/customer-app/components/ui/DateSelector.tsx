import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface DateSelectorProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<any>;
  placeholder?: string;
  onDateChange?: (date: Date) => void;
  value?: Date | null;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  style,
  textStyle,
  placeholder = 'Select date',
  onDateChange,
  value = null,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      if (onDateChange) {
        onDateChange(date);
      }
    }
  };

  const displayDate = selectedDate ? selectedDate.toLocaleDateString() : placeholder;

  return (
    <View>
      <TouchableOpacity
        style={[styles.inputBox, style]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, textStyle]}>{displayDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2bb6a3',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#7a98b6',
  },
});

export default DateSelector;
