import { StyleSheet, Alert, Image, View } from 'react-native'; 
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Texto, TextoDestaque } from '@/components/Texto';

import RadioInputs from '@/components/RadioInputs';
import { Colors } from '@/constants/theme';

export default function Cadastro() {

  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [role, setRole] = useState("USER");// Estado de carregamento opcional

  // Removido o argumento 'e' (evento) pois não é usado da mesma forma na Web
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
      const response = await fetch("http://192.168.0.2:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: email,
          password: password,
          role: role
        }),
      });

      // 3. Verificação da resposta
      if (response.ok) {
        alert("Conta criada com sucesso!");
        router.replace('/login') // Redireciona para o login após cadastro
      } else {
        // Se der erro (ex: 400 Bad Request se o usuário já existe)
        alert("Erro ao criar conta. Verifique se o email já está em uso.");
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
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
        <Texto style={styles.subTitle}>Crie sua conta</Texto>

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

          <RadioInputs
            selected={role}
            onChange={(value) => setRole(value)}
            options={[
              { label: "Usuario", value: "USER" },
              { label: "Administrador", value: "ADMIN" }
            ]}
          />

          <Button
            title={isLoading ? "Carregando..." : "CADASTRAR"} 
            onPress={sendRequest} // Passa a referência da função direto
          />

          <Texto style={styles.subLabel}>Já tem uma conta? <Link href="/login">Login</Link></Texto>
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