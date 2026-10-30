import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
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
import { excluirMinhaConta } from '../services/authService';
import { formatarData } from '../utils/formatar';
import { mascaraCep, mascaraCpf, mascaraTelefone } from '../utils/mascaras';

export default function DadosUsuario() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  useExigirLogin();
  const { logado, cliente, sair, recarregarCliente } = useAuth();
  const [erro, setErro] = useState('');

  const carregarCliente = () => {
    setErro('');
    recarregarCliente().catch((e) => setErro(e.message));
  };

  useEffect(() => {
    if (logado && !cliente) carregarCliente();
  }, [logado, cliente]);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const sairDaConta = async () => {
    router.replace('/');
    await sair();
  };

  const excluirConta = () =>
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirMinhaConta();
            router.replace('/');
            await sair();
            Alert.alert('Conta excluída', 'Sua conta foi excluída.');
          } catch (e: any) {
            Alert.alert('Erro', e.message ?? 'Não foi possível excluir a conta.');
          }
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <Header mostrarConta={false} />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>
          <MenuLateral
            links={[
              { titulo: '< Voltar', onPress: voltar },
              { titulo: 'Página inicial', onPress: () => router.replace('/') },
              { titulo: 'Dados Pessoais', onPress: () => {}, atual: true },
              { titulo: 'Histórico de reservas', onPress: () => router.push('/historico-reservas' as any) },
              { titulo: 'Sair', onPress: sairDaConta },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(28), marginBottom: 5 }}>
            Dados Pessoais
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 10, marginBottom: 30 }}>
            Verifique ou altere seus dados
          </Text>

          <EstadoCarregamento
            carregando={logado && !cliente && !erro}
            erro={erro || null}
            onTentar={carregarCliente}
          />

          {cliente && (
            <View style={{ backgroundColor: colors.surfaceAlt, padding: 15, borderRadius: 15, gap: 20 }}>
              <CampoDados rotulo="Nome" value={cliente.nome} editable={false} />
              <CampoDados rotulo="Email" value={cliente.email} editable={false} />
              <CampoDados rotulo="Senha" value="********" editable={false} />
              <CampoDados rotulo="CPF" value={mascaraCpf(cliente.cpf)} editable={false} />
              <CampoDados rotulo="Data de Nascimento" value={formatarData(cliente.dtNascimento)} editable={false} />
              <CampoDados rotulo="Telefone" value={mascaraTelefone(cliente.telefone)} editable={false} />
              <CampoDados rotulo="CEP" value={mascaraCep(cliente.cep)} editable={false} />
              <CampoDados rotulo="Número" value={cliente.numero} editable={false} />
              <CampoDados rotulo="Complemento" value={cliente.complemento || '-'} editable={false} />
              <CampoDados rotulo="Bairro" value={cliente.bairro} editable={false} />
              <CampoDados rotulo="Cidade" value={cliente.cidade} editable={false} />
              <CampoDados rotulo="UF" value={cliente.uf} editable={false} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Botao titulo="Excluir conta" variante="perigo" onPress={excluirConta} style={{ paddingHorizontal: 20 }} />
                <Botao
                  titulo="Alterar dados"
                  onPress={() => router.push('/alterar-dados' as any)}
                  style={{ paddingHorizontal: 20 }}
                />
              </View>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}