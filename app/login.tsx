import { StyleSheet, Alert, Image, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Texto, TextoDestaque } from '@/components/Texto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

export default function Login() {

  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async () => {
    
    // Validação
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    setIsLoading(true); // Bloqueia múltiplos cliques

    try {
      // DICA: No Android Emulator use 'http://10.0.2.2:8080'.
      // No dispositivo físico, mantenha o IP da sua rede (ex: 192.168.0.5).
      const response = await fetch("http://192.168.0.2:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // O await é necessário pois a gravação é assíncrona no celular

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user_role", data.role);
        await AsyncStorage.setItem("user_login", email);

        console.log("Login com sucesso. Role:", data.role);
        
        // Redireciona
        router.replace('/(tabs)'); // Use replace para não deixar voltar ao login com o botão "voltar"

      } else {
        Alert.alert("Erro", "Login ou senha inválidos!");
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <View style={styles.conteiner}>

        <Image 
        source={require('@/assets/images/Logo-Dark-Mobile.png')} 
        style={styles.logo} 
        resizeMode="contain"
         />
        <Texto style={styles.subTitle}>Acesse sua conta</Texto>

        <View style={styles.form}>

          <TextoDestaque style={styles.label}>Email</TextoDestaque>
          <Input
            placeholder="exemplo@nextcar.com"
            autoCorrect={false}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email} // Boa prática: controlar o value
          />

          <TextoDestaque style={styles.label}>Senha</TextoDestaque>
          <Input
            placeholder="********"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />

          <Button
            title={isLoading ? "Carregando..." : "ENTRAR"} 
            onPress={sendRequest} // Passa a referência da função direto
          />

          <Texto style={styles.subLabel}>Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link></Texto>
        </View>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
    width: '100%',    
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#000000eb',
  },
  form:{
    paddingVertical: 20,
    borderRadius: 15,
    width: '90%',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#63636393',
  },

  label:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 25,
  },

  subLabel:{
    width: '70%',
    textAlign: 'center',
    fontSize: 15,
    color: Colors.secundaria,
  },


  subTitle: {
    color: Colors.destaque,
    marginBottom: 30,
    marginTop: -90,
    fontSize: 25,
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 300,
  },
});