import { useState } from 'react';
import {
  Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../components/Header';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import { useAppTheme } from '../theme/ThemeContext';
import { cadastrar } from '../services/authService';
import { proporcaoImagem } from '../utils/imagem';
import {
  cpfValido, dataParaIso, dataValida, emailValido,
  mascaraCep, mascaraCpf, mascaraData, mascaraTelefone,
} from '../utils/mascaras';

const logo = require('../../assets/img/Logo-tipo.jpg');

const apenasNumeros = (v: string) => v.replace(/\D/g, '');

export default function Cadastro() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { proximo } = useLocalSearchParams<{ proximo?: string }>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const logoAltura = 80 * proporcaoImagem(logo);

  const irParaLogin = () =>
    router.replace({ pathname: '/login', params: proximo ? { proximo } : {} } as any);

  const cadastrarConta = async () => {
    if (enviando) return;

    if (
      !nome.trim() || !email.trim() || !senha || !cpf || !nascimento || !telefone ||
      !cep || !numero.trim() || !bairro.trim() || !cidade.trim() || !uf.trim()
    ) {
      return setErro('Preencha todos os campos (o complemento é opcional).');
    }
    if (!emailValido(email)) return setErro('Digite um email válido.');
    if (!cpfValido(cpf)) return setErro('CPF inválido.');
    if (!dataValida(nascimento)) return setErro('Data de nascimento inválida (use dd/mm/aaaa).');
    if (apenasNumeros(telefone).length !== 11) return setErro('Telefone deve ter DDD + 9 dígitos.');
    if (apenasNumeros(cep).length !== 8) return setErro('CEP deve ter 8 números.');
    if (uf.trim().length !== 2) return setErro('UF deve ter 2 letras (ex.: SP).');

    setErro('');
    setEnviando(true);
    try {
      await cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: apenasNumeros(cpf),
        dtNascimento: dataParaIso(nascimento),
        telefone: apenasNumeros(telefone),
        cep: apenasNumeros(cep),
        numero: numero.trim(),
        complemento: complemento.trim() || null,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
      });

      Alert.alert('Cadastro realizado!', 'Agora é só entrar na sua conta.', [
        { text: 'OK', onPress: irParaLogin },
      ]);
    } catch (e: any) {
      setErro(e.message ?? 'Não foi possível cadastrar.');
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

            {/* Lado direito: formulário */}
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
                <CampoTexto
                  placeholder="CEP" value={cep} onChangeText={(v) => setCep(mascaraCep(v))}
                  keyboardType="number-pad" maxLength={9}
                />
                <CampoTexto placeholder="Número" value={numero} onChangeText={setNumero} maxLength={15} />
                <CampoTexto placeholder="Complemento (opcional)" value={complemento} onChangeText={setComplemento} maxLength={60} />
                <CampoTexto placeholder="Bairro" value={bairro} onChangeText={setBairro} maxLength={60} />
                <CampoTexto placeholder="Cidade" value={cidade} onChangeText={setCidade} maxLength={60} />
                <CampoTexto
                  placeholder="UF (ex.: SP)" value={uf}
                  onChangeText={(v) => setUf(v.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                  autoCapitalize="characters" maxLength={2}
                />

                {erro !== '' && (
                  <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center' }}>
                    {erro}
                  </Text>
                )}

                <Botao titulo={enviando ? 'Cadastrando...' : 'Cadastrar'} onPress={cadastrarConta} />
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