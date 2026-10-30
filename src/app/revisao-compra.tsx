import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import Seletor from '../components/Seletor';
import EstadoCarregamento from '../components/EstadoCarregamento';
import ServicosPacote, { Paragrafo } from '../components/ServicosPacote';
import ListaInclusos from '../components/ListaInclusos';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { usePacote } from '../hooks/usePacotes';
import { criarPedido, FormaApi } from '../services/pedidoService';
import { descricaoDoPacote, formatarPreco, inclusosDoPacote } from '../utils/formatar';

const FORMAS = ['Débito', 'Crédito', 'Pix'];
const PARCELAS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const FORMA_API: Record<string, FormaApi> = { 'Débito': 'Debito', 'Crédito': 'Credito', Pix: 'Pix' };

export default function RevisaoCompra() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { logado, iniciando, sair } = useAuth();
  const { dados: pacote, carregando, erro, recarregar } = usePacote(Number(id));
  const [pagamento, setPagamento] = useState('Débito');
  const [parcelas, setParcelas] = useState('1');
  const [enviando, setEnviando] = useState(false);
  const [erroPedido, setErroPedido] = useState('');

  // Barreira: quem não está logado vai para o login e volta para cá
  useEffect(() => {
    if (!iniciando && !logado) {
      router.replace({ pathname: '/login', params: { proximo: `/revisao-compra?id=${id}` } } as any);
    }
  }, [iniciando, logado]);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const irDetalhes = () =>
    router.canGoBack()
      ? router.back()
      : router.replace({ pathname: '/detalhes-pacote', params: { id: String(id) } } as any);

  const sairDaConta = async () => {
    router.replace('/');
    await sair();
  };

  const irParaPagamento = async () => {
    if (!pacote || enviando) return;
    setErroPedido('');
    setEnviando(true);
    try {
      const pedido = await criarPedido(
        pacote.pacoteId,
        FORMA_API[pagamento],
        pagamento === 'Crédito' ? Number(parcelas) : 1,
      );
      router.push({
        pathname: '/confirmacao-compra',
        params: { pedidoId: String(pedido.pedidoId) },
      } as any);
    } catch (e: any) {
      setErroPedido(e.message ?? 'Não foi possível criar o pedido.');
    } finally {
      setEnviando(false);
    }
  };

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
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Revisar compra
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Confira os detalhes da sua compra antes de continuar.
          </Text>

          <EstadoCarregamento carregando={carregando} erro={erro} onTentar={recarregar} />

          {logado && pacote && (
            <View style={[s.checkout, { borderColor: colors.borderSoft, backgroundColor: colors.surfaceAlt }]}>
              {/* Imagem + título */}
              <View style={[s.cardPrincipal, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <View style={{ height: 180, backgroundColor: colors.mutedSurface }}>
                  {pacote.urlImagem ? (
                    <Image source={{ uri: pacote.urlImagem }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : null}
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(24), marginTop: 10, marginBottom: 15 }}>
                    {pacote.destino}
                  </Text>
                  <Paragrafo>{descricaoDoPacote(pacote)}</Paragrafo>
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
                  {formatarPreco(pacote.preco)}
                </Text>

                <ListaInclusos itens={inclusosDoPacote(pacote)} />

                <View style={[s.total, { borderTopColor: colors.borderLight }]}>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>Total</Text>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>
                    {formatarPreco(pacote.preco)}
                  </Text>
                </View>

                <View style={{ gap: 15, marginTop: 15 }}>
                  <Seletor rotulo="Forma de pagamento" opcoes={FORMAS} valor={pagamento} onChange={setPagamento} />
                  {pagamento === 'Crédito' && (
                    <Seletor rotulo="Parcelas" opcoes={PARCELAS} valor={parcelas} onChange={setParcelas} />
                  )}
                </View>

                {erroPedido !== '' && (
                  <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center', marginTop: 15 }}>
                    {erroPedido}
                  </Text>
                )}

                <Botao
                  titulo={enviando ? 'CRIANDO PEDIDO...' : 'IR PARA PAGAMENTO'}
                  variante="largo"
                  onPress={irParaPagamento}
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
  cardPrincipal: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, borderTopWidth: 2, marginTop: 10 },
});