import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // IMPORTANTE: Importar AsyncStorage

import { MediaType } from 'expo-image-picker';

// Importação dos seus componentes
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Texto, TextoDestaque } from '@/components/Texto';
import { Colors } from '@/constants/theme'; 

export default function AnuncieScreen() {

  // --- ESTADOS ---
  const [dados, setDados] = useState({
    marca: '',
    modelo: '',
    versao: '',
    ano: '',
    km: '',
    preco: '',
    nomeVendedor: '',
    telefoneProprietario: '',
    emailProprietario: '' 
  });

  const [fotosBase64, setFotosBase64] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- EFEITOS (Carregar Email) ---
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        // Recupera o email salvo no login (ajuste a chave 'user_login' se você salvou com outro nome)
        const emailSalvo = await AsyncStorage.getItem('user_login');
        
        if (emailSalvo) {
          setDados(prev => ({ ...prev, emailProprietario: emailSalvo }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    carregarDadosUsuario();
  }, []);

  // --- FORMATAÇÃO ---
  const formatarMoeda = (valor: string) => {
    if (!valor) return "";
    const apenasNumeros = valor.replace(/\D/g, "");
    const numero = Number(apenasNumeros) / 100;
    // Solução robusta para Android/iOS
    return "R$ " + numero.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const formatarKM = (valor: string) => {
    if (!valor) return "";
    const apenasNumeros = valor.replace(/\D/g, "");
    return Number(apenasNumeros).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // --- HANDLERS ---
  const handleChange = (name: string, value: string) => {
    let novoValor = value;

    if (name === 'preco') {
      novoValor = formatarMoeda(value);
    } else if (name === 'km') {
      novoValor = formatarKM(value);
    }

    setDados(prev => ({ ...prev, [name]: novoValor }));
  };

  const handlePickImage = async () => {
    if (fotosBase64.length >= 5) {
      Alert.alert("Limite atingido", "Você pode enviar no máximo 5 fotos.");
      return;
    }

    // Permissões e Seleção
    const result = await ImagePicker.launchImageLibraryAsync({
      // Volte para MediaTypeOptions se o MediaType não funcionar
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setFotosBase64(prev => [...prev, base64String]);
    }
  };

  const removerFoto = (index: number) => {
    setFotosBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!dados.marca || !dados.modelo || !dados.preco) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        setLoading(false);
        return;
        }

        const limparFormatacao = (val: string) => val.replace(/\D/g, "");

        const payload = {
        marca: dados.marca,
        modelo: dados.modelo,
        versao: dados.versao,
        ano: parseInt(dados.ano) || 0,
        km: parseInt(limparFormatacao(dados.km)) || 0,
        preco: parseFloat(limparFormatacao(dados.preco)) / 100 || 0,
        nomeVendedor: dados.nomeVendedor,
        telefoneContato: dados.telefoneProprietario,
        emailContato: dados.emailProprietario, // Envia o email carregado
        fotoBase64: fotosBase64 
        };

      const response = await fetch('http://192.168.0.2:8080/carros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Anúncio cadastrado com sucesso!");
        // Opcional: Limpar formulário ou navegar de volta
      } else {
        Alert.alert("Erro", "Erro ao salvar. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.header}>
        <TextoDestaque style={styles.title}>Anuncie seu veículo</TextoDestaque>
        <Texto style={styles.subTitle}>
          Preencha o formulário e realize seu anúncio! Nossa equipe 
          entrará em contato com você o mais rápido.
        </Texto>
      </View>

      {/* --- DADOS DO VEÍCULO --- */}
      <View style={styles.section}>
        <Texto style={styles.sectionTitle}>Dados do Veículo</Texto>
        
        <Input 
          placeholder="Marca" 
          value={dados.marca} 
          onChangeText={(t) => handleChange('marca', t)} 
        />
        <Input 
          placeholder="Modelo" 
          value={dados.modelo} 
          onChangeText={(t) => handleChange('modelo', t)} 
        />
        <Input 
          placeholder="Versão" 
          value={dados.versao} 
          onChangeText={(t) => handleChange('versao', t)} 
        />
        <Input 
          placeholder="Ano" 
          value={dados.ano} 
          keyboardType="numeric"
          onChangeText={(t) => handleChange('ano', t)} 
        />
        <Input 
          placeholder="KM" 
          value={dados.km} 
          keyboardType="numeric"
          onChangeText={(t) => handleChange('km', t)} 
        />
        <Input 
          placeholder="Valor (R$)" 
          value={dados.preco} 
          keyboardType="numeric"
          onChangeText={(t) => handleChange('preco', t)} 
        />
      </View>

      {/* --- DADOS DE CONTATO --- */}
      <View style={styles.section}>
        <Texto style={styles.sectionTitle}>Dados de Contato</Texto>
        
        <Input 
          placeholder="Nome" 
          value={dados.nomeVendedor} 
          onChangeText={(t) => handleChange('nomeVendedor', t)} 
        />
        <Input 
          placeholder="Telefone / WhatsApp" 
          value={dados.telefoneProprietario} 
          keyboardType="phone-pad"
          onChangeText={(t) => handleChange('telefoneProprietario', t)} 
        />
        
        {/* INPUT DE EMAIL - Preenchido e Desabilitado */}
        <Input 
          placeholder="Email" 
          value={dados.emailProprietario} 
          editable={false} // Impede edição
          // A opacidade 0.7 dá o feedback visual de desabilitado
          style={{ opacity: 0.7, backgroundColor: '#1a1a1a' }} 
        />
      </View>

      {/* --- FOTOS --- */}
      <View style={styles.section}>
        <Texto style={styles.sectionTitle}>Fotos ({fotosBase64.length}/5)</Texto>
        
        <TouchableOpacity 
          style={[styles.btnFoto, fotosBase64.length >= 5 && styles.btnFotoDisabled]} 
          onPress={handlePickImage}
          disabled={fotosBase64.length >= 5}
        >
          <Texto style={styles.btnFotoText}>+ Adicionar Foto</Texto>
        </TouchableOpacity>

        <ScrollView horizontal style={styles.fotosContainer}>
          {fotosBase64.map((foto, index) => (
            <View key={index} style={styles.fotoWrapper}>
              <Image source={{ uri: foto }} style={styles.thumb} />
              <TouchableOpacity 
                style={styles.btnRemove} 
                onPress={() => removerFoto(index)}
              >
                <Texto style={styles.btnRemoveText}>X</Texto>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Button 
            title="Enviar anúncio" 
            onPress={handleSubmit} 
          />
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1fff', 
  },
  contentContainer: {
    paddingBottom: 40,
    alignItems: 'center', 
  },
  header: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 30, 
  },
  subTitle: {
    color: Colors.destaque,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    width: '90%',
    textAlign: 'left',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', 
  },
  btnFoto: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  btnFotoDisabled: {
    opacity: 0.5,
  },
  btnFotoText: {
    fontSize: 16,
  },
  fotosContainer: {
    width: '90%',
    flexDirection: 'row',
  },
  fotoWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  thumb: {
    width: 100,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  btnRemove: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRemoveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  }
});