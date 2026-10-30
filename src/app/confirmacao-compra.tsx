import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import { useAppTheme } from '../theme/ThemeContext';

export default function ConfirmacaoCompra() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { height } = useWindowDimensions();
  // TODO: com o backend, ler "pagamento" e "parcelas" (useLocalSearchParams) e gerar o QR Code real

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const centro = { color: colors.text, fontSize: fs(16), textAlign: 'center' as const, marginBottom: 25 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header mostrarConta={false} />

      <ScrollView>
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Detalhes do pacote', onPress: () => router.push('/detalhes-pacote' as any) },
              { titulo: 'Revisar compra', onPress: () => router.push('/revisao-compra' as any) },
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Confirmação de compra
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 20, marginBottom: 25 }}>
            Leia o QR Code abaixo para confirmar a sua compra
          </Text>

          <View
            style={{
              backgroundColor: colors.surfaceAlt,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              borderRadius: 15,
              padding: 15,
              minHeight: height * 0.7,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.text, fontWeight: 'bold', fontSize: fs(24),
                textAlign: 'center', marginTop: 40, marginBottom: 20,
              }}
            >
              Compra realizada com sucesso
            </Text>
            <Text style={centro}>Leia este QR Code para confirmar a compra</Text>

            {/* No site é uma imagem vazia; aqui fica um quadrado reservado para o QR Code */}
            <View
              style={{
                width: '100%',
                maxWidth: 400,
                aspectRatio: 1,
                backgroundColor: colors.white,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 25,
              }}
            >
              <MaterialIcons name="qr-code-2" size={fs(120)} color={colors.black} />
              <Text style={{ color: colors.black, fontSize: fs(16) }}>QR Code</Text>
            </View>

            <Text style={centro}>Escaneie com o app do seu banco para concluir o pagamento</Text>
            
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
