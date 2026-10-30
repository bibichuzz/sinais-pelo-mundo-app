import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import EstadoCarregamento from '../components/EstadoCarregamento';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { useExigirLogin } from '../auth/useExigirLogin';
import { buscarPedido, pagarPedido, qrDoPedido, statusPagamento } from '../services/pedidoService';
import { formatarPreco, nomeFormaPagamento } from '../utils/formatar';
import { Pedido } from '../types/pedido';

export default function ConfirmacaoCompra() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  useExigirLogin();
  const { logado, sair } = useAuth();
  const { pedidoId } = useLocalSearchParams<{ pedidoId: string }>();
  const id = Number(pedidoId);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [urlQr, setUrlQr] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const concluido = useRef(false);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const sairDaConta = async () => {
    router.replace('/');
    await sair();
  };

  // Vai para "Compra efetuada" uma única vez
  const concluir = () => {
    if (concluido.current) return;
    concluido.current = true;
    router.replace({ pathname: '/compra-efetuada', params: { pedidoId: String(id) } } as any);
  };

  const carregar = () => {
    if (!logado || !id) return;
    setCarregando(true);
    setErro(null);
    buscarPedido(id)
      .then(async (p) => {
        setPedido(p);
        if (p.dataPagamento) return concluir();
        if (!p.cancelado) {
          const qr = await qrDoPedido(id);
          setUrlQr(qr.url);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar();
  }, [logado, id]);

  // Enquanto o pagamento está pendente, pergunta ao servidor a cada 3 segundos
  useEffect(() => {
    if (!pedido || pedido.cancelado || pedido.dataPagamento) return;
    const timer = setInterval(() => {
      statusPagamento(id)
        .then((s) => {
          if (s.pago) concluir();
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(timer);
  }, [pedido, id]);

  const confirmar = async () => {
    if (confirmando) return;
    setConfirmando(true);
    try {
      await pagarPedido(id);
      concluir();
    } catch (e: any) {
      Alert.alert('Erro', e.message ?? 'Não foi possível confirmar o pagamento.');
    } finally {
      setConfirmando(false);
    }
  };

  const centro = { color: colors.text, fontSize: fs(16), textAlign: 'center' as const, marginBottom: 25 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Histórico de reservas', onPress: () => router.push('/historico-reservas' as any) },
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Confirmação de compra
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Leia o QR Code abaixo ou confirme o pagamento no botão
          </Text>

          <EstadoCarregamento carregando={carregando} erro={erro} onTentar={carregar} />

          {pedido && (
            <View
              style={{
                backgroundColor: colors.surfaceAlt,
                borderWidth: 1,
                borderColor: colors.borderSoft,
                borderRadius: 15,
                padding: 15,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.text, fontWeight: 'bold', fontSize: fs(24),
                  textAlign: 'center', marginTop: 20, marginBottom: 10,
                }}
              >
                Pedido #{pedido.pedidoId} criado
              </Text>
              <Text style={{ color: colors.text, fontSize: fs(16), textAlign: 'center' }}>{pedido.destino}</Text>
              <Text style={{ color: colors.text, fontSize: fs(16), textAlign: 'center', marginBottom: 25 }}>
                {formatarPreco(pedido.preco)} · {nomeFormaPagamento(pedido.formaPagamento)}
                {pedido.formaPagamento === 'Credito' ? ` em ${pedido.parcelas}x` : ''}
              </Text>

              {pedido.cancelado ? (
                <Text style={[centro, { color: colors.dangerText, fontWeight: 'bold' }]}>
                  Este pedido foi cancelado.
                </Text>
              ) : (
                <>
                  <Text style={centro}>Leia este QR Code para confirmar a compra</Text>

                  {/* Fundo branco fixo: o QR precisa de contraste, inclusive no modo escuro */}
                  {urlQr && (
                    <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 25 }}>
                      <QRCode value={urlQr} size={220} backgroundColor="#ffffff" color="#000000" />
                    </View>
                  )}

                  <Text style={centro}>
                    Escaneie com a câmera de outro aparelho. A confirmação aparece aqui automaticamente.
                  </Text>

                  <Text style={[centro, { marginBottom: 5 }]}>Sem como escanear agora?</Text>
                  <Botao
                    titulo={confirmando ? 'Confirmando...' : 'Confirmar pagamento'}
                    variante="largo"
                    onPress={confirmar}
                  />
                </>
              )}
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}