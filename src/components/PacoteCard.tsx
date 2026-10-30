import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../theme/ThemeContext';
import { formatarData, formatarPreco } from '../utils/formatar';
import { PacoteResumo } from '../types/pacote';

export default function PacoteCard({ pacote }: { pacote: PacoteResumo }) {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/detalhes-pacote', params: { id: String(pacote.pacoteId) } } as any)
      }
      style={({ pressed }) => [
        s.card,
        { borderColor: colors.borderInput, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={{ height: 180, backgroundColor: colors.surfaceAlt }}>
        {pacote.urlImagem ? (
          <Image source={{ uri: pacote.urlImagem }} style={s.imagem} resizeMode="cover" />
        ) : null}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(17.6), marginBottom: 16 }}>
          {pacote.destino}
        </Text>
        {pacote.dataCheckin && pacote.dataCheckout ? (
          <Text style={{ color: colors.textSecondary, fontSize: fs(16), marginBottom: 8 }}>
            {formatarData(pacote.dataCheckin)} - {formatarData(pacote.dataCheckout)}
          </Text>
        ) : null}
        <Text style={{ color: colors.textSecondary, fontSize: fs(16), marginBottom: 8 }}>
          {formatarPreco(pacote.preco)}
        </Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  imagem: { width: '100%', height: '100%' },
});