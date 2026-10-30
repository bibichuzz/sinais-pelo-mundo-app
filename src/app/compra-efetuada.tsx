import { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import { useAppTheme } from '../theme/ThemeContext';

// TODO: dados de exemplo (iguais ao HTML); com o backend, vêm do pedido criado
const compra = { data: '12/09/2027 - 10:30', pedido: '003' };

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

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 20 }}>
          <MenuLateral links={[{ titulo: '< Voltar', onPress: voltar }]} />

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
                Sua compra foi confirmada e será processada em breve
              </Text>
            </View>

            {/* Informações da compra */}
            <View style={s.info}>
              <InfoItem icone="date-range" titulo="Data da compra" valor={compra.data} />
              <InfoItem icone="badge" titulo="ID do pedido" valor={compra.pedido} />
            </View>

            <Botao
              titulo="IR PARA A PÁGINA INICIAL"
              variante="largo"
              onPress={() => router.replace('/')}
            />
          </View>
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
