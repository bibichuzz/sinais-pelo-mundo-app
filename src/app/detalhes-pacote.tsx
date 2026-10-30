import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import ServicosPacote, { Paragrafo } from '../components/ServicosPacote';
import ListaInclusos from '../components/ListaInclusos';
import { useAppTheme } from '../theme/ThemeContext';
import { detalhesExemplo as pacote } from '../data/detalhes';

export default function DetalhesPacote() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  // TODO: com o backend, ler o "id" (useLocalSearchParams) e buscar o pacote correspondente

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header />

      <ScrollView>
        <View style={{ padding: 15 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Detalhes do pacote', onPress: () => {}, atual: true },
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Detalhes do pacote
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Confira o que está incluído no seu pacote de viagem
          </Text>

          <View style={[s.checkout, { borderColor: colors.borderSoft, backgroundColor: colors.surfaceAlt }]}>
            {/* Imagem */}
            <View style={[s.cardImagem, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <View style={{ height: 180, backgroundColor: colors.mutedSurface }}>
                {pacote.urlImagem ? (
                  <Image source={{ uri: pacote.urlImagem }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : null}
              </View>
            </View>

            {/* Título e serviços */}
            <View>
              <View style={{ padding: 10 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(24), marginTop: 10, marginBottom: 15 }}>
                  {pacote.titulo}
                </Text>
                <Paragrafo>{pacote.descricao}</Paragrafo>
              </View>
              <ServicosPacote pacote={pacote} />
            </View>

            {/* Resumo */}
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16), marginBottom: 25 }}>
                Preço por pessoa
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: fs(24),
                  marginTop: 5,
                  paddingBottom: 25,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSoft,
                  marginBottom: 25,
                }}
              >
                {pacote.preco}
              </Text>

              <ListaInclusos itens={pacote.inclusos} />

              <Botao
                titulo="COMPRAR PACOTE"
                variante="largo"
                onPress={() => router.push('/revisao-compra' as any)}
              />
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  checkout: { padding: 10, borderWidth: 1, borderRadius: 10, gap: 20 },
  cardImagem: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
});
