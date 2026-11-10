import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, disabled, variant = 'primary' }) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'disabled' || disabled ? styles.disabledBtn : styles.primaryBtn
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44, // Touch Target Size
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: { backgroundColor: '#E05A47' },
  disabledBtn: { backgroundColor: '#CCCCCC' },
  text: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});