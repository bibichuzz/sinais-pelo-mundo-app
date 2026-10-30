import { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import { useAppTheme } from '../theme/ThemeContext';
import { proporcaoImagem } from '../utils/imagem';
import {
  cpfValido, dataValida, emailValido, mascaraCpf, mascaraData, mascaraTelefone,
} from '../utils/mascaras';

const logo = require('../../assets/img/Logo-tipo.jpg');

export default function Cadastro() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState('');

  const logoAltura = 80 * proporcaoImagem(logo);

  const irParaLogin = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  const cadastrar = () => {
    if (!nome.trim() || !email.trim() || !senha || !cpf || !nascimento || !telefone || !endereco.trim()) {
      return setErro('Preencha todos os campos.');
    }
    if (!emailValido(email)) return setErro('Digite um email válido.');
    if (!cpfValido(cpf)) return setErro('CPF inválido.');
    if (!dataValida(nascimento)) return setErro('Data de nascimento inválida (use dd/mm/aaaa).');
    if (telefone.replace(/\D/g, '').length < 10) return setErro('Telefone inválido.');

    setErro('');
    // TODO: enviar os dados para a API de cadastro quando o backend estiver disponível
    Alert.alert('Cadastro realizado!', 'Agora é só entrar na sua conta.', [
      { text: 'OK', onPress: irParaLogin },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header mostrarConta={false} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={[s.sombra, { backgroundColor: colors.surfaceAlt }]}>
          <View style={[s.card, { borderColor: colors.borderStrong }]}>
            {/* Lado esquerdo: voltar ao login */}
            <View style={[s.lado, { borderBottomWidth: 1.5, borderBottomColor: colors.borderBlack }]}>
              <Image source={logo} style={{ width: 80, height: logoAltura }} />
              <Text style={[s.titulo, { color: colors.text, fontSize: fs(28), marginBottom: 20 }]}>
                Bem vindo de volta
              </Text>
              <Text style={{ color: colors.text, fontSize: fs(14), marginBottom: 30 }}>
                Acesse sua conta agora mesmo
              </Text>
              <Botao titulo="Entrar" onPress={irParaLogin} />
            </View>

            {/* Lado direito: formulário (os rótulos são escondidos no site, só placeholder) */}
            <View style={s.lado}>
              <Text style={[s.titulo, { color: colors.text, fontSize: fs(24), marginBottom: 30 }]}>
                Crie sua conta
              </Text>

              <View style={s.form}>
                <CampoTexto placeholder="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" autoComplete="name" />
                <CampoTexto
                  placeholder="Email" value={email} onChangeText={setEmail}
                  keyboardType="email-address" autoCapitalize="none" autoComplete="email"
                />
                <CampoTexto
                  placeholder="Senha" value={senha} onChangeText={setSenha}
                  secureTextEntry autoCapitalize="none" autoComplete="new-password"
                />
                <CampoTexto
                  placeholder="CPF" value={cpf} onChangeText={(v) => setCpf(mascaraCpf(v))}
                  keyboardType="number-pad" maxLength={14}
                />
                <CampoTexto
                  placeholder="Data de Nascimento (dd/mm/aaaa)" value={nascimento}
                  onChangeText={(v) => setNascimento(mascaraData(v))}
                  keyboardType="number-pad" maxLength={10}
                />
                <CampoTexto
                  placeholder="Telefone" value={telefone}
                  onChangeText={(v) => setTelefone(mascaraTelefone(v))}
                  keyboardType="phone-pad" maxLength={15} autoComplete="tel"
                />
                <CampoTexto placeholder="Endereço" value={endereco} onChangeText={setEndereco} autoComplete="street-address" />

                {erro !== '' && (
                  <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center' }}>
                    {erro}
                  </Text>
                )}

                <Botao titulo="Cadastrar" onPress={cadastrar} />
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
