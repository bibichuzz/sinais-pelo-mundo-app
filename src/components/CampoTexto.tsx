import { TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

// Equivalente ao ".campo-form input" do CSS
export default function CampoTexto(props: TextInputProps) {
  const { colors, fs } = useAppTheme();

  return (
    <TextInput
      placeholderTextColor={colors.inputText}
      {...props}
      style={[
        {
          width: '100%',
          padding: 12,
          borderWidth: 1,
          borderColor: colors.borderInput,
          borderRadius: 8,
          color: colors.textSecondary,
          backgroundColor: colors.input,
          fontSize: fs(14),
        },
        props.style,
      ]}
    />
  );
}
