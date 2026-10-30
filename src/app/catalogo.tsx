import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat';
import { useAppTheme } from '../theme/ThemeContext';
import { PacoteCatalogo, catalogo, destinos, normalizar, precoSemCentavos } from '../data/catalogo';

function CardCatalogo({ pacote }: { pacote: PacoteCatalogo }) {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/detalhes-pacote', params: { id: String(pacote.id) } } as any)
      }
      style={({ pressed }) => [s.card, { borderColor: colors.borderInput, opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={{ height: 180, backgroundColor: colors.surfaceAlt }}>
        {pacote.urlImagem ? (
          <Image source={{ uri: pacote.urlImagem }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : null}
      </View>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(17.6), marginBottom: 16 }}>
          {pacote.destino}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: fs(16), marginBottom: 8 }}>
          {pacote.dias} dias / {pacote.dias - 1} noites
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: fs(16), marginBottom: 8 }}>
          A partir de {precoSemCentavos(pacote.preco)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Catalogo() {
  const { colors, fs } = useAppTheme();
  const [busca, setBusca] = useState('');
  const [destino, setDestino] = useState<string | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const lista = catalogo.filter(
    (p) =>
      (!destino || p.destino === destino) &&
      normalizar(p.destino).includes(normalizar(busca.trim())),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
      <Header />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 15 }}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(32), marginBottom: 15 }}>
            Todos os pacotes
          </Text>
          <Text style={{ color: colors.primary, fontSize: fs(16), marginBottom: 25 }}>
            Encontre o pacote ideal para a sua próxima viagem
          </Text>

          {/* Busca */}
          <View style={{ marginBottom: 15 }}>
            <MaterialIcons
              name="search" size={22} color={colors.text}
              style={{ position: 'absolute', left: 14, top: 12, zIndex: 1 }}
            />
            <TextInput
              style={{
                width: '100%',
                paddingVertical: 12,
                paddingLeft: 44,
                paddingRight: 12,
                borderWidth: 1,
                borderColor: colors.borderInput,
                borderRadius: 6,
                fontSize: fs(14.4),
                color: colors.text,
                backgroundColor: colors.input,
              }}
              placeholder="Buscar pacotes, destinos, hotéis..."
              placeholderTextColor={colors.inputText}
              value={busca}
              onChangeText={setBusca}
              returnKeyType="search"
            />
          </View>

          {/* Filtros (no site ficam na lateral; no app abrem ao tocar) */}
          <Pressable style={s.filtroBotao} onPress={() => setFiltrosAbertos(!filtrosAbertos)}>
            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(16) }}>Filtros</Text>
            <MaterialIcons name="filter-alt" size={22} color={colors.text} />
            <MaterialIcons
              name={filtrosAbertos ? 'expand-less' : 'expand-more'} size={22} color={colors.text}
            />
          </Pressable>

          {filtrosAbertos && (
            <View style={[s.filtroPainel, { borderColor: colors.borderInput, backgroundColor: colors.surfaceAlt }]}>
              <Text style={{ color: colors.text, fontSize: fs(14), marginBottom: 10 }}>Destino</Text>
              <View style={s.chips}>
                {[null, ...destinos].map((d) => {
                  const ativo = destino === d;
                  return (
                    <Pressable
                      key={d ?? 'todos'}
                      onPress={() => setDestino(d)}
                      style={[
                        s.chip,
                        {
                          borderColor: ativo ? colors.primary : colors.borderInput,
                          backgroundColor: ativo ? colors.primaryAction : 'transparent',
                        },
                      ]}
                    >
                      <Text style={{ color: ativo ? colors.textOnPrimary : colors.text, fontSize: fs(14) }}>
                        {d ?? 'Todos'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Lista */}
          <View style={{ gap: 24, marginTop: 10 }}>
            {lista.map((p) => (
              <CardCatalogo key={p.id} pacote={p} />
            ))}
            {lista.length === 0 && (
              <Text style={{ color: colors.textSecondary, fontSize: fs(16), textAlign: 'center' }}>
                Nenhum pacote encontrado.
              </Text>
            )}
          </View>
        </View>

        <Footer />
      </ScrollView>

      <Chat />
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  filtroBotao: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, alignSelf: 'flex-start' },
  filtroPainel: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
});
