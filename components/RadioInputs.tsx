import React, { useEffect, useRef } from 'react';
import { Text, Pressable, StyleSheet, Animated, Platform, View } from 'react-native';
import { Colors } from '@/constants/theme';

// Definição das cores baseadas no seu CSS
const COLORS = {
  primary: '#3b82f6',
  lightGrayStart: '#333333fa',
  textSecondary: '#6b7280',
  white: '#333333fa',
};

interface RadioOption {
  label: string;
  value: string;
}

interface RadioInputsProps {
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
}

const RadioInputs = ({ options, selected, onChange }: RadioInputsProps) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          active={selected === option.value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
};

// Subcomponente para animar cada botão individualmente
const RadioButton = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      // Simula a animação "@keyframes select" do CSS
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);

  return (
    <Pressable onPress={onPress} style={styles.radioWrapper}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
        {active ? (
          // Estado ATIVO (Input Checked)
          <View style={[styles.radioContent, styles.activeShadow, styles.activeBackground]}>
            <Text style={[styles.text, styles.textActive]}>{label}</Text>
          </View>
        ) : (
          // Estado INATIVO
          <View style={[styles.radioContent, styles.inactiveShadow, styles.inactiveBackground]}>
            <Text style={styles.text}>{label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: '5%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.secundaria,
    padding: 8,
    width: '90%',
    gap: 16,
    backgroundColor: COLORS.lightGrayStart, // Cor sólida adicionada
    // Sombra sutil do container
    ...Platform.select({
      ios: {
        shadowColor: '#ffffffff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  radioWrapper: {
    flex: 1,
    minWidth: '30%',
  },
  radioContent: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Estilos de fundo sólido para substituir o gradiente
  activeBackground: {
    backgroundColor: Colors.secundaria, // Cor principal quando ativo
  },
  inactiveBackground: {
    backgroundColor: COLORS.white, // Cor quando inativo
  },
  inactiveShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#ffffffff',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
    borderWidth: 0,
  },
  activeShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#d2d2d2ff',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
        shadowColor: '#d2d2d2ff',
      },
    }),
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  textActive: {
    color: Colors.fonte2,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default RadioInputs;