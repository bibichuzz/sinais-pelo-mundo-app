import { Text, TextInputProps, View } from 'react-native';
import CampoTexto from './CampoTexto';
import { useAppTheme } from '../theme/ThemeContext';

type Props = TextInputProps & { rotulo: string };

// ".campo-dados" do CSS: rótulo em negrito + campo (telas de dados pessoais e alteração)
export default function CampoDados({ rotulo, ...props }: Props) {
  const { colors, fs } = useAppTheme();

  return (
    <View style={{ marginTop: 10, gap: 8 }}>
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>{rotulo}</Text>
      <CampoTexto {...props} style={[{ color: colors.text }, props.style]} />
    </View>
  );
}
