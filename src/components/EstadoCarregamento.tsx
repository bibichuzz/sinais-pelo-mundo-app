import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

type Props = {
  carregando: boolean;
  erro: string | null;
  onTentar: () => void;
};

export default function EstadoCarregamento({ carregando, erro, onTentar }: Props) {
  const { colors, fs } = useAppTheme();

  if (carregando) {
    return (
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, fontSize: fs(15.2), textAlign: 'center' }}>
          Carregando... Na primeira vez pode levar até 1 minuto.
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
        <Text style={{ color: colors.text, fontSize: fs(15.2), textAlign: 'center' }}>{erro}</Text>
        <Pressable onPress={onTentar}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16) }}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return null;
}