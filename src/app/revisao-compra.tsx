import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import Seletor from '../components/Seletor';
import ServicosPacote, { Paragrafo } from '../components/ServicosPacote';
import ListaInclusos from '../components/ListaInclusos';
import { useAppTheme } from '../theme/ThemeContext';
import { detalhesExemplo as pacote } from '../data/detalhes';

const FORMAS = ['Débito', 'Crédito', 'Pix'];
const PARCELAS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default function RevisaoCompra() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const [pagamento, setPagamento] = useState('Débito');
  const [parcelas, setParcelas] = useState('1');

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const irDetalhes = () => (router.canGoBack() ? router.back() : router.replace('/detalhes-pacote' as any));

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 15 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Detalhes do pacote', onPress: irDetalhes },
              { titulo: 'Revisar Compra', onPress: () => {}, atual: true },
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Revisar compra
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Confira os detalhes da sua compra antes de continuar.
          </Text>

          <View style={[s.checkout, { borderColor: colors.borderSoft, backgroundColor: colors.surfaceAlt }]}>
            {/* Imagem + título (aqui o título fica dentro do card) */}
            <View style={[s.cardPrincipal, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <View style={{ height: 180, backgroundColor: colors.mutedSurface }}>
                {pacote.urlImagem ? (
                  <Image source={{ uri: pacote.urlImagem }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : null}
              </View>
              <View style={{ padding: 10 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(24), marginTop: 10, marginBottom: 15 }}>
                  {pacote.titulo}
                </Text>
                <Paragrafo>{pacote.descricao}</Paragrafo>
              </View>
            </View>

            <ServicosPacote pacote={pacote} />

            {/* Resumo da compra */}
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(18.72), marginBottom: 25 }}>
                Resumo da compra
              </Text>
              <Paragrafo>Preço por pessoa</Paragrafo>
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

              <View style={[s.total, { borderTopColor: colors.borderLight }]}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>Total</Text>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>{pacote.preco}</Text>
              </View>

              <View style={{ gap: 15, marginTop: 15 }}>
                <Seletor rotulo="Forma de pagamento" opcoes={FORMAS} valor={pagamento} onChange={setPagamento} />
                <Seletor rotulo="Parcelas" opcoes={PARCELAS} valor={parcelas} onChange={setParcelas} />
              </View>

              <Botao
                titulo="IR PARA PAGAMENTO"
                variante="largo"
                onPress={() =>
                  router.push({ pathname: '/confirmacao-compra', params: { pagamento, parcelas } } as any)
                }
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
  cardPrincipal: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, borderTopWidth: 2, marginTop: 10 },
});
