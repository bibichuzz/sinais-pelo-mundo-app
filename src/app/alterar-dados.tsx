import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import CampoDados from '../components/CampoDados';
import EstadoCarregamento from '../components/EstadoCarregamento';
import { useAppTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { useExigirLogin } from '../auth/useExigirLogin';
import { atualizarMeusDados } from '../services/authService';
import { buscarCep } from '../services/cepService';
import { formatarData } from '../utils/formatar';
import {
  cpfValido, dataParaIso, dataValida, emailValido,
  mascaraCep, mascaraCpf, mascaraData, mascaraTelefone,
} from '../utils/mascaras';

const apenasNumeros = (v: string) => v.replace(/\D/g, '');

export default function AlterarDados() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  useExigirLogin();
  const { logado, cliente, sair, atualizarCliente, recarregarCliente } = useAuth();

  const [preenchido, setPreenchido] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [cepStatus, setCepStatus] = useState('');
  const [cepOk, setCepOk] = useState(true);
  const [erro, setErro] = useState('');
  const [erroCarga, setErroCarga] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Se os dados ainda não chegaram, busca
  const carregarCliente = () => {
    setErroCarga('');
    recarregarCliente().catch((e) => setErroCarga(e.message));
  };

  useEffect(() => {
    if (logado && !cliente) carregarCliente();
  }, [logado, cliente]);

  // Preenche o formulário uma vez, quando os dados chegam
  useEffect(() => {
    if (!cliente || preenchido) return;
    setNome(cliente.nome);
    setEmail(cliente.email);
    setCpf(mascaraCpf(cliente.cpf));
    setNascimento(formatarData(cliente.dtNascimento));
    setTelefone(mascaraTelefone(cliente.telefone));
    setCep(mascaraCep(cliente.cep));
    setNumero(cliente.numero);
    setComplemento(cliente.complemento ?? '');
    setBairro(cliente.bairro);
    setCidade(cliente.cidade);
    setUf(cliente.uf);
    setPreenchido(true);
  }, [cliente, preenchido]);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const irDados = () => (router.canGoBack() ? router.back() : router.replace('/dados-usuario' as any));

  const sairDaConta = async () => {
    router.replace('/');
    await sair();
  };

  const aoMudarCep = async (valor: string) => {
    const mascarado = mascaraCep(valor);
    setCep(mascarado);
    setCepOk(false);

    if (apenasNumeros(mascarado).length < 8) {
      setCepStatus('');
      return;
    }

    setCepStatus('Buscando CEP...');
    try {
      const endereco = await buscarCep(mascarado);
      if (!endereco) {
        setCepStatus('CEP não encontrado.');
        return;
      }
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setUf(endereco.uf);
      setCepOk(true);
      setCepStatus('');
    } catch {
      setCepStatus('Não foi possível consultar o CEP. Confira o endereço manualmente.');
      setCepOk(true);
    }
  };

  const salvar = async () => {
    if (enviando) return;

    if (!nome.trim() || !email.trim() || !cpf || !nascimento || !telefone || !cep || !numero.trim() ||
        !bairro.trim() || !cidade.trim() || !uf.trim()) {
      return setErro('Preencha todos os campos (o complemento e a senha são opcionais).');
    }
    if (!emailValido(email)) return setErro('Digite um email válido.');
    if (!cpfValido(cpf)) return setErro('CPF inválido.');
    if (!dataValida(nascimento)) return setErro('Data de nascimento inválida (use dd/mm/aaaa).');
    if (apenasNumeros(telefone).length !== 11) return setErro('Telefone deve ter DDD + 9 dígitos.');
    if (apenasNumeros(cep).length !== 8) return setErro('CEP deve ter 8 números.');
    if (!cepOk) return setErro('Informe um CEP válido.');
    if (uf.trim().length !== 2) return setErro('UF deve ter 2 letras (ex.: SP).');
    if (novaSenha) {
      if (!senhaAtual) return setErro('Informe a senha atual para trocar a senha.');
    }

    setErro('');
    setEnviando(true);
    try {
      const atualizado = await atualizarMeusDados({
        nome: nome.trim(),
        email: email.trim(),
        cpf: apenasNumeros(cpf),
        dtNascimento: dataParaIso(nascimento),
        telefone: apenasNumeros(telefone),
        cep: apenasNumeros(cep),
        numero: numero.trim(),
        complemento: complemento.trim() || null,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase(),
        novaSenha: novaSenha || null,
        senhaAtual: novaSenha ? senhaAtual : null,
      });

      atualizarCliente(atualizado);
      setNovaSenha('');
      setSenhaAtual('');
      Alert.alert('Dados atualizados!', 'Suas alterações foram salvas.', [{ text: 'OK', onPress: irDados }]);
    } catch (e: any) {
      setErro(e.message ?? 'Não foi possível salvar.');
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

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Dados Pessoais', onPress: irDados, atual: true },
              { titulo: 'Histórico de reservas', onPress: () => router.push('/historico-reservas' as any) },
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(28), marginBottom: 5 }}>
            Alteração de dados pessoais
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 10, marginBottom: 30 }}>
            Realize a alteração de seus dados
          </Text>

          <EstadoCarregamento
            carregando={logado && !cliente && !erroCarga}
            erro={erroCarga || null}
            onTentar={carregarCliente}
          />

          {cliente && preenchido && (
            <View style={{ backgroundColor: colors.surfaceAlt, padding: 15, borderRadius: 15, gap: 20 }}>
              <CampoDados rotulo="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" autoComplete="name" />
              <CampoDados
                rotulo="Email" value={email} onChangeText={setEmail}
                keyboardType="email-address" autoCapitalize="none" autoComplete="email"
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
              <CampoDados
                rotulo="CEP" value={cep} onChangeText={aoMudarCep}
                keyboardType="number-pad" maxLength={9}
              />
              {cepStatus !== '' && (
                <Text style={{ color: cepOk ? colors.textSecondary : colors.dangerText, fontSize: fs(13) }}>
                  {cepStatus}
                </Text>
              )}
              <CampoDados rotulo="Número" value={numero} onChangeText={setNumero} maxLength={15} />
              <CampoDados rotulo="Complemento" value={complemento} onChangeText={setComplemento} maxLength={60} />
              <CampoDados rotulo="Bairro" value={bairro} onChangeText={setBairro} maxLength={60} />
              <CampoDados rotulo="Cidade" value={cidade} onChangeText={setCidade} maxLength={60} />
              <CampoDados
                rotulo="UF" value={uf}
                onChangeText={(v) => setUf(v.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                autoCapitalize="characters" maxLength={2}
              />
              <CampoDados
                rotulo="Nova senha" value={novaSenha} onChangeText={setNovaSenha}
                placeholder="Deixe em branco para manter a atual"
                secureTextEntry autoCapitalize="none" autoComplete="new-password"
              />
              {novaSenha !== '' && (
                <CampoDados
                  rotulo="Senha atual" value={senhaAtual} onChangeText={setSenhaAtual}
                  secureTextEntry autoCapitalize="none" autoComplete="password"
                />
              )}

              {erro !== '' && (
                <Text style={{ color: colors.dangerText, fontSize: fs(14), textAlign: 'center' }}>{erro}</Text>
              )}

              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Botao
                  titulo={enviando ? 'Salvando...' : 'Salvar alterações'}
                  variante="sucesso"
                  onPress={salvar}
                  style={{ paddingHorizontal: 20 }}
                />
              </View>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}