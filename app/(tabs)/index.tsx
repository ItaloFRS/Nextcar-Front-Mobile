import { Alert, StyleSheet, TouchableOpacity, Image, View } from 'react-native';

import { Texto, TextoDestaque } from '@/components/Texto';


export default function TabTwoScreen() {
  return (
<>
    
    <View style={styles.container}>

      <View style={styles.conteinerDestaque}>
        <View style={styles.conteudoDestaque}>
          <TextoDestaque style={styles.title}>Qualidade,
                                    {"\n"}Segurança,
                                    {"\n"}Transparência.  
          </TextoDestaque>

          <TouchableOpacity
            style={styles.botaoContainer}
            onPress={() => Alert.alert('Indo para o estoque')}
            activeOpacity={0.7} // Controla a opacidade ao tocar (0.0 a 1.0)
          >
            <Texto style={styles.textoBotao}>Acessar estoque completo {' >'} </Texto>
          </TouchableOpacity>

        </View>

        <Image 
            source={require('@/assets/images/porsche-model5 1.png')} 
            style={styles.logo} 
          />
      </View>

    </View>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1fff',
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    fontWeight: 'bold',
  },
  conteinerDestaque: {
    backgroundColor:'trasparent',
    height: '50%',
    width: '100%',
  },

  conteudoDestaque:{
    marginTop: 30,
    marginLeft: '10%',
    backgroundColor:'trasparent',
    width: '70%'
  },

   botaoContainer: {
    backgroundColor: '#0d0d0d53',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  textoBotao: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logo: {
    transform: [{ translateX: 50 },{ translateY: -60 }],
    marginTop: 20,
  },


});