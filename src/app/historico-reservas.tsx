import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import { useAppTheme } from '../theme/ThemeContext';
import { Reserva, reservasExemplo } from '../data/reservas';

// ".botao-tipo3": 300 de largura, padding 15/20
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

function CardReserva({ reserva, cancelada }: { reserva: Reserva; cancelada: boolean }) {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  return (
    <View
      style={[
        s.card,
        { backgroundColor: colors.surfaceAlt },
        // .card-cancelado: faixa vermelha à esquerda e card mais apagado
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
        {reserva.destino}
      </Text>

      <View style={{ gap: 20 }}>
        <Linha rotulo="Destino" valor={reserva.destino} />
        <Linha rotulo="Data da viagem" valor={reserva.data} />
        <Linha rotulo="Valor pago" valor={reserva.valor} />
        <Linha rotulo="Hotel" valor={reserva.hotel} />
        <Linha rotulo="Intérprete" valor={reserva.interprete} />
      </View>

      <Pressable style={{ marginTop: 30 }} onPress={() => router.push('/detalhes-pacote' as any)}>
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
  const [canceladas, setCanceladas] = useState<number[]>([]);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const gerarNota = () =>
    // TODO: gerar a nota fiscal (PDF) quando o backend estiver disponível
    Alert.alert('Nota fiscal', 'A geração da nota fiscal estará disponível quando o sistema estiver conectado.');

  const cancelar = (id: number) =>
    Alert.alert('Cancelar reserva', 'Tem certeza que deseja cancelar esta reserva?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar reserva',
        style: 'destructive',
        // TODO: chamar a API de cancelamento quando o backend estiver disponível
        onPress: () => setCanceladas((c) => [...c, id]),
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
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginTop: 5 }}>
            Histórico
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 30 }}>
            Veja seu histórico de viagens
          </Text>

          <View style={{ gap: 40 }}>
            {reservasExemplo.map((r) => {
              const cancelada = canceladas.includes(r.id);
              return (
                <View key={r.id}>
                  <CardReserva reserva={r} cancelada={cancelada} />

                  <View style={{ alignItems: 'center', gap: 10, marginTop: 15 }}>
                    {cancelada ? (
                      <Botao titulo="Reserva cancelada" variante="desativado" onPress={() => {}} style={estiloAcao} />
                    ) : (
                      <>
                        <Botao titulo="Gerar Nota Fiscal" variante="sucesso" onPress={gerarNota} style={estiloAcao} />
                        <Botao titulo="Cancelar" variante="perigo" onPress={() => cancelar(r.id)} style={estiloAcao} />
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
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
