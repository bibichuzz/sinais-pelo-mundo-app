import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import CampoDados from '../components/CampoDados';
import { useAppTheme } from '../theme/ThemeContext';
import { usuarioExemplo as usuario } from '../data/usuario';
import {
  cpfValido, dataValida, emailValido, mascaraCpf, mascaraData, mascaraTelefone,
} from '../utils/mascaras';

export default function AlterarDados() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState(usuario.cpf);
  const [nascimento, setNascimento] = useState(usuario.nascimento);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [endereco, setEndereco] = useState(usuario.endereco);
  const [erro, setErro] = useState('');

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const irDados = () => (router.canGoBack() ? router.back() : router.replace('/dados-usuario' as any));

  const salvar = () => {
    if (!nome.trim() || !email.trim() || !cpf || !nascimento || !telefone || !endereco.trim()) {
      return setErro('Preencha todos os campos (a senha pode ficar em branco).');
    }
    if (!emailValido(email)) return setErro('Digite um email válido.');
    if (!cpfValido(cpf)) return setErro('CPF inválido.');
    if (!dataValida(nascimento)) return setErro('Data de nascimento inválida (use dd/mm/aaaa).');
    if (telefone.replace(/\D/g, '').length < 10) return setErro('Telefone inválido.');

    setErro('');
    // TODO: enviar os dados para a API quando o backend estiver disponível
    Alert.alert('Dados atualizados!', 'Suas alterações foram salvas.', [{ text: 'OK', onPress: irDados }]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header mostrarConta={false} />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Dados Pessoais', onPress: irDados, atual: true },
              { titulo: 'Histórico de reservas', onPress: () => router.push('/historico-reservas' as any) },
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(28), marginBottom: 5 }}>
            Alteração de dados pessoais
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 10, marginBottom: 30 }}>
            Realize a alteração de seus dados
          </Text>

          <View style={{ backgroundColor: colors.surfaceAlt, padding: 15, borderRadius: 15, gap: 20 }}>
            <CampoDados rotulo="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" autoComplete="name" />
            <CampoDados
              rotulo="Email" value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" autoComplete="email"
            />
            <CampoDados
              rotulo="Senha" value={senha} onChangeText={setSenha}
              placeholder="Deixe em branco para manter a atual"
              secureTextEntry autoCapitalize="none" autoComplete="new-password"
            />
            <CampoDados
              rotulo="CPF" value={cpf} onChangeText={(v) => setCpf(mascaraCpf(v))}
              keyboardType="number-pad" maxLength={14}
            />
            <CampoDados
              rotulo="Data de Nascimento" value={nascimento}
              onChangeText={(v) => setNascimento(mascaraData(v))}
              placeholder="dd/mm/aaaa" keyboardType="number-pad" maxLength={10}
            />
            <CampoDados
              rotulo="Telefone" value={telefone}
              onChangeText={(v) => setTelefone(mascaraTelefone(v))}
              keyboardType="phone-pad" maxLength={15} autoComplete="tel"
            />
            <CampoDados rotulo="Endereço" value={endereco} onChangeText={setEndereco} autoComplete="street-address" />

            {erro !== '' && (
              <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center' }}>{erro}</Text>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Botao titulo="Salvar alterações" variante="sucesso" onPress={salvar} style={{ paddingHorizontal: 20 }} />
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
