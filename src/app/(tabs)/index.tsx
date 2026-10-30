import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import PacoteCard from '@/components/PacoteCard';
import { pacotes } from '@/data/pacotes';
import { useAppTheme } from '@/theme/ThemeContext';
import { proporcaoImagem } from '@/utils/imagem';

const beneficios = [
  { icone: 'person', titulo: 'Intérpretes Qualificados', desc: 'Profissionais experientes e certificados.' },
  { icone: 'luggage', titulo: 'Viagens Completas', desc: 'Hotel, passagem e intérprete em um só pacote.' },
  { icone: 'support-agent', titulo: 'Atendimento Especializado', desc: 'Suporte dedicado antes, durante e após a viagem.' },
  { icone: 'shield', titulo: 'Segurança e Conforto', desc: 'Sua tranquilidade em cada detalhe da viagem.' },
] as const;

export default function Home() {
  const { colors, isDark, fs } = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const banner = isDark
    ? require('@/assets/img/Logo-darkmode.png')
    : require('@/assets/img/Logo.jpg');

  // Tamanho em pixels: 90% da tela, mantendo a proporção original da imagem
  const bannerLargura = width * 0.9;
  const bannerAltura = bannerLargura * proporcaoImagem(banner);

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header />

      <ScrollView>
        {/* Hero */}
        <View style={{ backgroundColor: colors.surfaceAlt, paddingVertical: 48 }}>
          <View style={[s.container, { gap: 32 }]}>
            <View>
              <Text
                style={{
                  color: colors.text, fontWeight: 'bold', fontSize: fs(32),
                  lineHeight: fs(32) * 1.2, marginBottom: 16,
                }}
              >
                Descubra experiências incríveis com interpretação inclusiva
              </Text>
              <Text style={{ color: colors.text, fontSize: fs(16), lineHeight: fs(16) * 1.6 }}>
                Encontre pacotes completos de viagem com hotel, passagem e intérprete para sua
                tranquilidade e conforto.
              </Text>
            </View>
            <View style={{ borderRadius: 15, overflow: 'hidden', backgroundColor: colors.imagePlaceholder }}>
              <Image source={banner} style={{ width: bannerLargura, height: bannerAltura }} resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Benefícios */}
        <View style={{ paddingVertical: 48 }}>
          <View style={[s.container, { gap: 24 }]}>
            {beneficios.map((b) => (
              <View key={b.titulo} style={s.beneficio}>
                <View style={[s.iconeCirculo, { backgroundColor: colors.iconBackground }]}>
                  <MaterialIcons name={b.icone} size={24} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16), marginBottom: 8 }}>
                    {b.titulo}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: fs(15.2), lineHeight: fs(15.2) * 1.5 }}>
                    {b.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pacotes em destaque */}
        <View style={{ paddingVertical: 48 }}>
          <View style={s.container}>
            <View style={s.pacotesHeader}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(27.2) }}>
                Pacotes em destaque
              </Text>
              <Pressable onPress={() => router.push('/catalogo' as any)}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(15.2) }}>Ver todos</Text>
              </Pressable>
            </View>

            <View style={{ gap: 24 }}>
              {pacotes.map((p) => (
                <PacoteCard key={p.pacoteId} pacote={p} />
              ))}
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>

      <Chat />
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '90%', alignSelf: 'center' },
  beneficio: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  iconeCirculo: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  pacotesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
});
