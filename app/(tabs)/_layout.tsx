import React, { useState, useCallback } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter, useFocusEffect } from 'expo-router'; // Adicionado useFocusEffect
import { Pressable, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante para o token

import { Colors } from '@/constants/theme';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Função auxiliar para ícone
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Para evitar piscar de tela

  // ------------------------------------
  // LÓGICA DE AUTENTICAÇÃO
  // ------------------------------------
  
  // Verifica o status de autenticação no foco da tela (ex: após login ou retorno)
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        try {
          // Verifica se o token existe no AsyncStorage, o que significa que o usuário está logado
          const token = await AsyncStorage.getItem("token");
          setIsAuthenticated(!!token);
        } catch (error) {
          console.error("Erro ao verificar o token:", error);
          setIsAuthenticated(false);
        } finally {
          setAuthChecked(true);
        }
      };

      checkToken();
    }, [])
  );

  const handleLogout = async () => {
    try {
      // Remove o token para deslogar
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user_role");
      await AsyncStorage.removeItem("user_login");

      setIsAuthenticated(false);
      
      // Redireciona para o login (ou para a tela inicial pública)
      router.replace('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Falha ao sair da conta. Tente novamente.");
    }
  };

  // ------------------------------------
  // COMPONENTE CONDICIONAL DO CABEÇALHO
  // ------------------------------------
  const HeaderAuthButton = () => {
    if (!authChecked) return null;

    const handlePress = () => {
      if (isAuthenticated) {
        handleLogout();
      } else {
        router.push("/login");
      }
    };

    return (
      <Pressable onPress={handlePress} style={{ marginRight: 15 }}>
        {({ pressed }) => (
          <Text
            style={{
             
              color: Colors.destaque,
              opacity: pressed ? 0.5 : 1,
              fontWeight: 'bold',
              fontSize: 15,
              borderWidth: 2,
              borderColor: Colors.destaque,
              borderRadius: 10,
              padding: 10,
              paddingHorizontal: 30,
            }}
          >
            {isAuthenticated ? "SAIR" : "LOGIN"}
          </Text>
        )}
      </Pressable>
    );
  };
  // ------------------------------------
  // TABS PRINCIPAIS
  // ------------------------------------

  // Função para proteger a aba "Anuncie"

  const handleProtectedTabPress = async (e: any, routeName: string) => {
    e.preventDefault();

    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push('/anuncie');
      } else {
        Alert.alert("Acesso Restrito", "Faça login para anunciar seu veículo.");
        router.push('/login');
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    }
  };


  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: Colors.bg,
        },
        headerTitleStyle: {
          color: Colors.destaque,
        },
      }}>


      <Tabs.Screen
        name="index" 
        options={{
          title: 'NextCar',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,

          headerRight: () => <HeaderAuthButton />,
        }}
      />
        
      {/* 2. ANUNCIE - Rota protegida */}

       <Tabs.Screen
        name="anuncie"
        options={{
          title: 'Anuncie',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car-info" size={24} color={color} />,
        }}
        listeners={{
          // Protege contra navegação se não estiver logado
          tabPress: (e) => handleProtectedTabPress(e, '/(tabs)/anuncie'),
        }}
      />

      <Tabs.Screen
        name="estoque"
        options={{
          title: 'Estoque',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car" size={24} color={color} />,
        }}
      />

    </Tabs>

  )};