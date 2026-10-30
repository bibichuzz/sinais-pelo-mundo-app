import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeContext';

export default function Header({ mostrarConta = true }: { mostrarConta?: boolean }) {
  const { colors, isDark, toggleTheme, increaseFont, decreaseFont, fs } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  const logo = isDark
    ? require('../../assets/img/logo-reduzida-darkmode.png')
    : require('../../assets/img/Logo-reduzida.jpeg');

  const ir = (rota: string) => {
    setMenuAberto(false);
    router.push(rota as any);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: insets.top,
        zIndex: 10,
      }}
    >
      <View style={s.barra}>
        {/* Menu hambúrguer */}
        <Pressable
          style={s.hamburguer}
          onPress={() => setMenuAberto(!menuAberto)}
          accessibilityLabel="Abrir menu"
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.linha, { backgroundColor: colors.menuIcon }]} />
          ))}
        </Pressable>

        {/* Logo centralizado */}
        <View style={s.logoWrap}>
          <Image source={logo} style={s.logo} resizeMode="contain" />
        </View>

        {/* Ações da direita */}
        <View style={s.acoes}>
          <Pressable onPress={increaseFont} hitSlop={8}>
            <Text style={[s.textoAcao, { color: colors.primary }]}>A+</Text>
          </Pressable>
          <Pressable onPress={decreaseFont} hitSlop={8}>
            <Text style={[s.textoAcao, { color: colors.primary }]}>A-</Text>
          </Pressable>
          <Pressable onPress={toggleTheme} hitSlop={8}>
            <MaterialIcons
              name={isDark ? 'light-mode' : 'dark-mode'}
              size={24}
              color={colors.themeModeIcon}
            />
          </Pressable>
          {mostrarConta && (
            <Pressable onPress={() => ir('/login')} hitSlop={8}>
              <MaterialIcons name="account-circle" size={24} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </View>

      {menuAberto && (
        <View style={[s.nav, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <Pressable onPress={() => ir('/')}>
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16) }}>Início</Text>
          </Pressable>
          <Pressable onPress={() => ir('/catalogo')}>
            <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16) }}>Catálogo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  barra: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  hamburguer: { width: 40, height: 40, justifyContent: 'center', gap: 5 },
  linha: { width: '100%', height: 3, borderRadius: 999 },
  logoWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  logo: { width: 110, height: 50 },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textoAcao: { fontSize: 18, fontWeight: 'bold' },
  nav: { borderTopWidth: 1, paddingVertical: 24, paddingHorizontal: '5%', gap: 16 },
});
