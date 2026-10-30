import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

type Props = {
  titulo: string;
  onPress: () => void;
  // azul = .btn-azul | contorno = .botao-tipo1 | largo = .botao-tipo4
  // perigo = #botao-excluir | sucesso = #botao-alterar | desativado = .botao-cancelado
  variante?: 'azul' | 'contorno' | 'largo' | 'perigo' | 'sucesso' | 'desativado';
  style?: StyleProp<ViewStyle>;
};

export default function Botao({ titulo, onPress, variante = 'azul', style }: Props) {
  const { colors, fs } = useAppTheme();
  const largo = variante === 'largo';

  return (
    <Pressable
      onPress={onPress}
      disabled={variante === 'desativado'}
      style={({ pressed }) => {
        // "pressed" faz o papel do :hover do site
        let cor: ViewStyle;
        if (variante === 'contorno') {
          cor = { backgroundColor: pressed ? colors.textDark : 'transparent', borderColor: colors.borderBlack };
        } else if (variante === 'perigo') {
          cor = { backgroundColor: pressed ? colors.danger : colors.dangerDarkmode, borderColor: colors.danger };
        } else if (variante === 'desativado') {
          cor = { backgroundColor: colors.disabledBg, borderColor: colors.disabledBorder, opacity: 0.85 };
        } else if (variante === 'sucesso') {
          cor = { backgroundColor: pressed ? colors.successHover : colors.bgBtnAlterar, borderColor: colors.successHover };
        } else {
          cor = {
            backgroundColor: pressed ? colors.primary : colors.primaryAction,
            borderColor: pressed ? colors.primaryAccent : colors.primary,
          };
        }
        return [s.base, largo && s.largo, cor, style];
      }}
    >
      {({ pressed }) => {
        let cor: string;
        if (variante === 'contorno') cor = pressed ? colors.textOnPrimary : colors.text;
        else if (variante === 'perigo') cor = pressed ? colors.textOnPrimary : colors.txtBtnExcluir;
        else if (variante === 'sucesso') cor = pressed ? colors.textOnPrimary : colors.success;
        else if (variante === 'desativado') cor = colors.textSecondary;
        else cor = colors.textOnPrimary;

        return (
          <Text
            style={{
              fontSize: fs(largo ? 14 : 16),
              fontWeight: largo || variante === 'perigo' || variante === 'sucesso' || variante === 'desativado' ? 'bold' : 'normal',
              color: cor,
            }}
          >
            {titulo}
          </Text>
        );
      }}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  largo: {
    width: '100%',
    maxWidth: 400,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
});
