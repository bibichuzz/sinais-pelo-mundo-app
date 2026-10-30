import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { proporcaoImagem } from '../utils/imagem';

export default function Footer() {
  const { colors, isDark, fs } = useAppTheme();

  const logo = isDark
    ? require('../../assets/img/Logo-darkmode.png')
    : require('../../assets/img/Logo.jpg');

  const logoAltura = 250 * proporcaoImagem(logo);

  const texto = { color: colors.footer, fontSize: fs(16), lineHeight: fs(16) * 1.6 };
  const titulo = { color: colors.primary, fontWeight: 'bold' as const, fontSize: fs(16), marginBottom: 16 };

  return (
    <View style={{ backgroundColor: colors.surfaceAlt, borderTopWidth: 1, borderTopColor: colors.border }}>
      <View style={s.conteudo}>
        <View>
          <Image source={logo} style={{ width: 250, height: logoAltura, borderRadius: 4 }} resizeMode="cover" />
          <Text style={[texto, { marginTop: 16 }]}>
            Turismo acessível e inclusivo para você viver o melhor do mundo com tranquilidade.
          </Text>
        </View>

        <View>
          <Text style={titulo}>Navegação</Text>
          <View style={{ gap: 13 }}>
            <Text style={texto}>Início</Text>
            <Text style={texto}>Pacotes</Text>
          </View>
        </View>

        <View>
          <Text style={titulo}>Contato</Text>
          <View style={{ gap: 13 }}>
            <Text style={texto}>contato@empresa.com</Text>
            <Text style={texto}>(11) 99999-9999</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderInput,
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: colors.footer, fontSize: fs(14.4), textAlign: 'center' }}>
          © 2026 Sinais Pelo Mundo - Viagens e Turismo. Todos os direitos reservados.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  conteudo: { width: '90%', alignSelf: 'center', paddingTop: 48, paddingBottom: 48, gap: 32 },
});
