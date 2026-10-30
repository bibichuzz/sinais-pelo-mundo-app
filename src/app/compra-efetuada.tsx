import { ComponentProps, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import EstadoCarregamento from '../components/EstadoCarregamento';
import { useAppTheme } from '../theme/ThemeContext';
import { useExigirLogin } from '../auth/useExigirLogin';
import { useAuth } from '../auth/AuthContext';
import { buscarPedido } from '../services/pedidoService';
import { formatarDataHora } from '../utils/formatar';
import { Pedido } from '../types/pedido';

type Icone = ComponentProps<typeof MaterialIcons>['name'];

function InfoItem({ icone, titulo, valor }: { icone: Icone; titulo: string; valor: string }) {
  const { colors, fs } = useAppTheme();
  return (
    <View style={s.infoItem}>
      <View style={[s.iconBox, { backgroundColor: colors.white }]}>
        <MaterialIcons name={icone} size={24} color={colors.black} />
      </View>
      <View style={{ flexShrink: 1 }}>
        <Text style={{ color: colors.textDark, fontWeight: 'bold', fontSize: fs(13) }}>{titulo}</Text>
        <Text style={{ color: colors.text, fontSize: fs(14) }}>{valor}</Text>
      </View>
    </View>
  );
}

export default function CompraEfetuada() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { height } = useWindowDimensions();
  useExigirLogin();
  const { logado } = useAuth();
  const { pedidoId } = useLocalSearchParams<{ pedidoId: string }>();
  const id = Number(pedidoId);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = () => {
    if (!logado || !id) return;
    setCarregando(true);
    setErro(null);
    buscarPedido(id)
      .then(setPedido)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar();
  }, [logado, id]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Histórico de reservas', onPress: () => router.replace('/historico-reservas' as any) },
            ]}
          />

          <EstadoCarregamento carregando={carregando} erro={erro} onTentar={carregar} />

          {pedido && (
            <View
              style={{
                backgroundColor: colors.surfaceAlt,
                borderWidth: 1,
                borderColor: colors.borderSoft,
                borderRadius: 15,
                padding: 15,
                minHeight: height * 0.7,
              }}
            >
              {/* Confirmação */}
              <View
                style={{
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSoft,
                  paddingBottom: 30,
                  marginBottom: 30,
                }}
              >
                <View style={[s.circulo, { backgroundColor: colors.successLight }]}>
                  <MaterialIcons name="check" size={fs(30)} color={colors.successIcon} />
                </View>
                <Text
                  style={{
                    color: colors.text, fontWeight: 'bold', fontSize: fs(24),
                    textAlign: 'center', marginBottom: 25,
                  }}
                >
                  Compra concluída com sucesso!
                </Text>
                <Text style={{ color: colors.text, fontSize: fs(16), textAlign: 'center' }}>
                  Sua compra foi confirmada. Você pode gerar a nota fiscal pelo histórico.
                </Text>
              </View>

              {/* Informações da compra */}
              <View style={s.info}>
                <InfoItem
                  icone="date-range"
                  titulo="Data da compra"
                  valor={formatarDataHora(pedido.dataPagamento ?? pedido.dataEfetivacao)}
                />
                <InfoItem icone="badge" titulo="ID do pedido" valor={String(pedido.pedidoId)} />
              </View>

              <Botao
                titulo="IR PARA A PÁGINA INICIAL"
                variante="largo"
                onPress={() => router.replace('/')}
              />
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  circulo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  info: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 40 },
  infoItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 25 },
  iconBox: { padding: 10, borderRadius: 10 },
});