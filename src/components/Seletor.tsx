import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

type Props = {
  rotulo: string;
  opcoes: string[];
  valor: string;
  onChange: (valor: string) => void;
};

// No app não existe <select>: as opções viram botões de escolha
export default function Seletor({ rotulo, opcoes, valor, onChange }: Props) {
  const { colors, fs } = useAppTheme();

  return (
    <View>
      <Text style={{ color: colors.text, fontSize: fs(16), marginBottom: 8 }}>{rotulo}</Text>
      <View style={s.opcoes}>
        {opcoes.map((o) => {
          const ativo = o === valor;
          return (
            <Pressable
              key={o}
              onPress={() => onChange(o)}
              style={[
                s.opcao,
                {
                  borderColor: ativo ? colors.primary : colors.borderInput,
                  backgroundColor: ativo ? colors.primaryAction : colors.input,
                },
              ]}
            >
              <Text style={{ color: ativo ? colors.textOnPrimary : colors.text, fontSize: fs(14) }}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, minWidth: 48, alignItems: 'center' },
});
