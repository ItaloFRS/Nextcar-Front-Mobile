import React from 'react';
import { Text as RNText, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Colors } from '../constants/theme'; // Importe seu tema criado anteriormente

export function Texto({ style, children, ...rest }: { style?: StyleProp<TextStyle>; children: React.ReactNode; rest?: any }) {
  return (

    <RNText 
      style={[styles.padrao, style]} // Combina o estilo padrão com o estilo passado via props
      {...rest} 
    >
      {children}
    </RNText>
  );
}

export function TextoDestaque({ style, children, ...rest }: { style?: StyleProp<TextStyle>; children: React.ReactNode; rest?: any }) {
  return (

    <RNText 
      style={[styles.destaque, style]} // Combina o estilo padrão com o estilo passado via props
      {...rest} 
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({

  padrao: {
    //fontFamily: fonts.padrao, // 'Poppins-Regular'
    color: Colors.secundaria,      // Cor branca definida no seu CSS
    fontSize: 20,
  },

  destaque: {
    //fontFamily: fonts.destaque,
    color: Colors.fonte,      
    fontSize: 55,
    fontWeight: 900,
    marginBottom: 10,
  }


});