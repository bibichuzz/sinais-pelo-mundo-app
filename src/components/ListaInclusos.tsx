import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

// ".itens-inclusos" do CSS
export default function ListaInclusos({ itens }: { itens: string[] }) {
  const { colors, fs } = useAppTheme();

  return (
    <View>
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16), marginBottom: 6 }}>
        O que está incluído
      </Text>
      {itens.map((item) => (
        <View key={item} style={s.linha}>
          <MaterialIcons name="check-circle-outline" size={fs(18)} color={colors.textMuted} />
          <Text style={{ color: colors.text, fontSize: fs(14) }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
});
