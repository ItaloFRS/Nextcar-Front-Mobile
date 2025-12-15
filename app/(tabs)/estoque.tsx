import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';

// Importação dos seus componentes
import { Input } from '@/components/Input'; 
import { Texto, TextoDestaque } from '@/components/Texto';
// import { Colors } from '@/constants/theme'; // Descomente se for usar cores globais

// Definição da interface
interface CarroData {
  id: string;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  km: number;
  preco: number;
  fotoBase64: string[]; 
}

export default function EstoqueScreen() {
  const [carros, setCarros] = useState<CarroData[]>([]);
  const [carrosFiltrados, setCarrosFiltrados] = useState<CarroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // 1. Busca os dados
  useEffect(() => {
    fetchCarros();
  }, []);

  // Filtro local: Atualiza sempre que 'busca' OU 'carros' mudar
  useEffect(() => {
    if (busca.trim() === '') {
      setCarrosFiltrados(carros);
    } else {
      const termo = busca.toLowerCase();
      const filtrados = carros.filter(carro => 
        carro.marca.toLowerCase().includes(termo) ||
        carro.modelo.toLowerCase().includes(termo)
      );
      setCarrosFiltrados(filtrados);
    }
  }, [busca, carros]);

  const fetchCarros = async () => {
    try {
      // DICA: Se estiver no Emulador Android, use 'http://10.0.2.2:8080/carros'
      // Se estiver no dispositivo físico via Wi-Fi, mantenha o IP da sua máquina.
      const response = await fetch("http://192.168.0.2:8080/carros");
      
      if (response.ok) {
        const data = await response.json();
        setCarros(data);
        // Removemos o setCarrosFiltrados daqui pois o useEffect acima já fará isso automaticamente
      } else {
        Alert.alert("Erro", "Não foi possível carregar o estoque.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      Alert.alert("Erro", "Falha na conexão com o servidor.\nVerifique seu IP.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Funções de formatação

  // CORREÇÃO: Formatação manual para garantir compatibilidade com Android (Hermes)
  const formatarPreco = (valor: number) => {
    if (!valor) return "R$ 0,00";
    return "R$ " + valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const formatarKM = (valor: number) => {
    // Adiciona ponto de milhar manualmente também por segurança
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " KM";
  };

  // 3. Renderização de cada Item (Card)
  const renderItem = ({ item }: { item: CarroData }) => {
    
    // Lógica da imagem com verificação de segurança
    let imagemUri = null;
    if (item.fotoBase64 && item.fotoBase64.length > 0) {
      const foto = item.fotoBase64[0];
      // Verifica se já tem o prefixo data:image, se não tiver, adiciona
      imagemUri = foto.startsWith('data:image') 
        ? foto 
        : `data:image/jpeg;base64,${foto}`;
    }

    return (
      <View style={styles.card}>
        {/* Imagem */}
        <View style={styles.imageContainer}>
          {imagemUri ? (
            <Image 
              source={{ uri: imagemUri }} 
              style={styles.cardImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.placeholderImage]}>
              <Texto style={{ fontSize: 14, opacity: 0.7 }}>Sem Foto</Texto>
            </View>
          )}
        </View>

        {/* Informações */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Texto style={styles.cardTitle}>{item.marca} {item.modelo}</Texto>
            <Texto style={styles.cardVersao}>{item.versao}</Texto>
          </View>
          
          <View style={styles.cardDetails}>
            <View style={styles.badge}>
              <Texto style={styles.badgeText}>{item.ano}</Texto>
            </View>
            <Texto style={styles.kmText}>{formatarKM(item.km)}</Texto>
          </View>

          <TextoDestaque style={styles.priceText}>
            {formatarPreco(item.preco)}
          </TextoDestaque>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TextoDestaque style={styles.pageTitle}>Nosso estoque</TextoDestaque>
        
        <Input 
          placeholder="Buscar por marca ou modelo..." 
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#fff" />
          <Texto style={{ marginTop: 10 }}>Carregando estoque...</Texto>
        </View>
      ) : (
        <FlatList
          data={carrosFiltrados}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Texto style={styles.emptyText}>Nenhum veículo encontrado.</Texto>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1fff', 
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center', 
  },
  pageTitle: {
    fontSize: 32,
    marginBottom: 10,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    opacity: 0.6,
  },
  
  // --- Estilos do Card ---
  card: {
    backgroundColor: '#282828fa',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    // fontFamily: 'Poppins-Bold', // Dica: Se tiver fontes customizadas
  },
  cardVersao: {
    fontSize: 14,
    color: '#ccc',
    textTransform: 'uppercase',
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  kmText: {
    fontSize: 14,
    color: '#bbb',
  },
  priceText: {
    fontSize: 24, 
    marginBottom: 0, 
    textAlign: 'right', 
  },
});