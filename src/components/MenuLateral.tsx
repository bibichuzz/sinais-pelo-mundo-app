import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';

type Link = { titulo: string; onPress: () => void; atual?: boolean };

// Equivalente ao ".sidebar-dados" do CSS (links "Voltar", tela atual, "Sair"...)
export default function MenuLateral({ links }: { links: Link[] }) {
  const { colors, fs } = useAppTheme();

  return (
    <View style={{ alignItems: 'flex-start', gap: 25, marginBottom: 40 }}>
      {links.map((l) => (
        <Pressable
          key={l.titulo}
          onPress={l.onPress}
          style={({ pressed }) => ({
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 8,
            backgroundColor: l.atual
              ? colors.primaryLight
              : pressed
                ? colors.primaryHoverLight
                : 'transparent',
          })}
        >
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(18) }}>{l.titulo}</Text>
        </Pressable>
      ))}
    </View>
  );
}
