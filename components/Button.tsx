import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native'; // 1. Importações
import { Texto } from './Texto';

interface ButtonProps { // 3. Define as Props
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress, ...rest }: ButtonProps) { // 4. Componente Button
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...rest}>
      <Texto style={styles.buttonText}>{title}</Texto>
    </TouchableOpacity>
  );
  
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00000089',
    backdropFilter: 'blur(10px)',
    borderRadius: 8,
    borderStyle: 'solid' ,
    borderWidth: 2,
    borderColor: '#ffffff' ,
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    
  },
});