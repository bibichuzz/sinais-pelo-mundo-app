import { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { proporcaoImagem } from '../utils/imagem';
import { emailValido } from '../utils/mascaras';

const logo = require('../../assets/img/Logo-tipo.jpg');

export default function Login() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { entrar: entrarNaConta } = useAuth();
  const { proximo } = useLocalSearchParams<{ proximo?: string }>();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const logoAltura = 80 * proporcaoImagem(logo);

  const entrar = async () => {
    if (enviando) return;
    if (!email.trim() || !senha) return setErro('Preencha email e senha.');
    if (!emailValido(email)) return setErro('Digite um email válido.');

    setErro('');
    setEnviando(true);
    try {
      await entrarNaConta(email.trim(), senha);
      router.replace((proximo || '/') as any);
    } catch (e: any) {
      setErro(e.message ?? 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header mostrarConta={false} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Sombra fica no wrapper de fora porque overflow:hidden corta a sombra */}
        <View style={[s.sombra, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[s.card, { borderColor: colors.borderStrong }]}>
            {/* Lado esquerdo: ir para o cadastro */}
            <View style={[s.lado, { borderBottomWidth: 1.5, borderBottomColor: colors.borderBlack }]}>
              <Image source={logo} style={{ width: 80, height: logoAltura }} />
              <Text style={[s.titulo, { color: colors.text, fontSize: fs(28), marginBottom: 20 }]}>
                Novo por aqui?
              </Text>
              <Text style={{ color: colors.text, fontSize: fs(14), marginBottom: 30 }}>
                Crie sua conta agora mesmo
              </Text>
              <Botao
                titulo="Cadastrar"
                onPress={() =>
                  router.push({ pathname: '/cadastro', params: proximo ? { proximo } : {} } as any)
                }
              />
            </View>

            {/* Lado direito: formulário */}
            <View style={s.lado}>
              <Text style={[s.titulo, { color: colors.text, fontSize: fs(24), marginBottom: 55 }]}>
                Acesse sua conta
              </Text>

              <View style={s.form}>
                <CampoTexto
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <CampoTexto
                  placeholder="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />

                <Pressable
                  style={{ alignSelf: 'flex-end', marginTop: -5, paddingBottom: 10 }}
                  onPress={() => Alert.alert('Em breve', 'Recuperação de senha ainda não disponível.')}
                >
                  <Text style={{ color: colors.text, fontSize: fs(15), textDecorationLine: 'underline' }}>
                    Esqueci a senha?
                  </Text>
                </Pressable>

                {erro !== '' && (
                  <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center' }}>
                    {erro}
                  </Text>
                )}

                <Botao
                  titulo={enviando ? 'Entrando...' : 'Entrar'}
                  onPress={entrar}
                  style={{ marginTop: 20 }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  sombra: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
  },
  card: { borderWidth: 1.5, borderRadius: 20, overflow: 'hidden' },
  lado: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontWeight: 'bold', textAlign: 'center' },
  form: { width: '100%', maxWidth: 320, gap: 15 },
});