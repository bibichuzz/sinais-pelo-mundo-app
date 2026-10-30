import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import EstadoCarregamento from '../components/EstadoCarregamento';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { useExigirLogin } from '../auth/useExigirLogin';
import { usePedidos } from '../hooks/usePedidos';
import { cancelarPedido } from '../services/pedidoService';
import { formatarData, formatarPreco } from '../utils/formatar';
import { Pedido } from '../types/pedido';

const estiloAcao = { width: '100%' as const, maxWidth: 300, paddingVertical: 15, paddingHorizontal: 20 };

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  const { colors, fs } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
      <Text style={{ flex: 1, color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>{rotulo}</Text>
      <Text style={{ flex: 1, color: colors.text, fontSize: fs(16) }}>{valor}</Text>
    </View>
  );
}

function CardReserva({ pedido }: { pedido: Pedido }) {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const cancelada = pedido.cancelado;

  const periodo =
    pedido.dataCheckin && pedido.dataCheckout
      ? `${formatarData(pedido.dataCheckin)} a ${formatarData(pedido.dataCheckout)}`
      : '-';

  return (
    <View
      style={[
        s.card,
        { backgroundColor: colors.surfaceAlt },
        cancelada && { borderLeftWidth: 8, borderLeftColor: colors.dangerText, opacity: 0.8 },
      ]}
    >
      {cancelada && (
        <View style={[s.selo, { backgroundColor: colors.dangerText }]}>
          <Text style={{ color: colors.textOnPrimary, fontWeight: 'bold', fontSize: fs(12), letterSpacing: 1 }}>
            CANCELADO
          </Text>
        </View>
      )}

      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(24), marginBottom: 35 }}>
        {pedido.destino}
      </Text>

      <View style={{ gap: 20 }}>
        <Linha rotulo="Pedido" valor={`#${pedido.pedidoId}`} />
        <Linha rotulo="Data da viagem" valor={periodo} />
        <Linha rotulo="Valor" valor={formatarPreco(pedido.preco)} />
        <Linha rotulo="Hotel" valor={pedido.nomeHotel ?? '-'} />
        <Linha rotulo="Intérprete" valor={pedido.nomeInterprete ?? '-'} />
        <Linha rotulo="Pagamento" valor={pedido.dataPagamento ? 'Pago' : 'Pendente'} />
      </View>

      <Pressable
        style={{ marginTop: 30 }}
        onPress={() =>
          router.push({ pathname: '/detalhes-pacote', params: { id: String(pedido.pacoteId) } } as any)
        }
      >
        <Text style={{ color: colors.text, fontSize: fs(16), textAlign: 'center', textDecorationLine: 'underline' }}>
          Mostrar detalhes
        </Text>
      </Pressable>
    </View>
  );
}

export default function HistoricoReservas() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  useExigirLogin();
  const { logado, sair } = useAuth();
  const { pedidos, carregando, erro, recarregar } = usePedidos(logado);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const sairDaConta = async () => {
    router.replace('/');
    await sair();
  };

  const gerarNota = () =>
    Alert.alert('Nota fiscal', 'A nota fiscal estará disponível em breve.');

  const cancelar = (id: number) =>
    Alert.alert('Cancelar reserva', 'Tem certeza que deseja cancelar esta reserva?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar reserva',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelarPedido(id);
            recarregar();
          } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Não foi possível cancelar.');
          }
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Dados Pessoais', onPress: () => router.push('/dados-usuario' as any) },
              { titulo: 'Histórico de reservas', onPress: () => {}, atual: true },
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginTop: 5 }}>
            Histórico
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 30 }}>
            Veja seu histórico de viagens
          </Text>

          <EstadoCarregamento carregando={carregando} erro={erro} onTentar={recarregar} />

          {!carregando && !erro && pedidos.length === 0 && (
            <Text style={{ color: colors.textSecondary, fontSize: fs(16), textAlign: 'center' }}>
              Você ainda não fez nenhuma reserva.
            </Text>
          )}

          {!carregando && !erro && (
            <View style={{ gap: 40 }}>
              {pedidos.map((p) => (
                <View key={p.pedidoId}>
                  <CardReserva pedido={p} />

                  <View style={{ alignItems: 'center', gap: 10, marginTop: 15 }}>
                    {p.cancelado ? (
                      <Botao titulo="Reserva cancelada" variante="desativado" onPress={() => {}} style={estiloAcao} />
                    ) : (
                      <>
                        <Botao titulo="Gerar Nota Fiscal" variante="sucesso" onPress={gerarNota} style={estiloAcao} />
                        <Botao titulo="Cancelar" variante="perigo" onPress={() => cancelar(p.pedidoId)} style={estiloAcao} />
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 15, padding: 20 },
  selo: { position: 'absolute', top: 20, right: 20, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
});