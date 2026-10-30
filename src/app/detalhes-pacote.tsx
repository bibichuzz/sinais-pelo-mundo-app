import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import EstadoCarregamento from '../components/EstadoCarregamento';
import ServicosPacote, { Paragrafo } from '../components/ServicosPacote';
import ListaInclusos from '../components/ListaInclusos';
import { useAppTheme } from '../theme/ThemeContext';
import { usePacote } from '../hooks/usePacotes';
import { useAuth } from '../auth/AuthContext';
import { descricaoDoPacote, formatarPreco, inclusosDoPacote } from '../utils/formatar';

export default function DetalhesPacote() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { logado, sair } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados: pacote, carregando, erro, recarregar } = usePacote(Number(id));

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const sairDaConta = async () => {            // 2) cole a função aqui
    router.replace('/');
    await sair();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header />

      <ScrollView>
        <View style={{ padding: 15 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Detalhes do pacote', onPress: () => {}, atual: true },
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Detalhes do pacote
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Confira o que está incluído no seu pacote de viagem
          </Text>

          <EstadoCarregamento carregando={carregando} erro={erro} onTentar={recarregar} />

          {pacote && (
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
                    {pacote.destino}
                  </Text>
                  <Paragrafo>{descricaoDoPacote(pacote)}</Paragrafo>
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
                  {formatarPreco(pacote.preco)}
                </Text>

                <ListaInclusos itens={inclusosDoPacote(pacote)} />

                <Botao
                  titulo="COMPRAR PACOTE"
                  variante="largo"
                  onPress={() => {
                    const destino = `/revisao-compra?id=${pacote.pacoteId}`;
                    if (!logado) {
                      router.push({ pathname: '/login', params: { proximo: destino } } as any);
                    } else {
                      router.push(destino as any);
                    }
                  }}
                />
              </View>
            </View>
          )}
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