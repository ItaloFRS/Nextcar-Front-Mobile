import { Colors } from '@/constants/theme';
import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#c9c9c9ff" // Cor do placeholder
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {

    width: '90%',
    
    backgroundColor: '#282828fa',
    borderRadius: 15,
    padding: 10,
    fontSize: 25,
    borderWidth: 3,
    marginHorizontal: 15,
    marginBottom: 10,
    color: Colors.secundaria,  // Cor do texto digitado

  },
});