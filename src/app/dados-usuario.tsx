import { Alert, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuLateral from '../components/MenuLateral';
import Botao from '../components/Botao';
import CampoDados from '../components/CampoDados';
import { useAppTheme } from '../theme/ThemeContext';
import { usuarioExemplo as usuario } from '../data/usuario';

export default function DadosUsuario() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();

  const voltar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const excluirConta = () =>
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        // TODO: chamar a API para excluir a conta quando o backend estiver disponível
        onPress: () => router.replace('/'),
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
              { titulo: 'Sair', onPress: () => router.replace('/') },
            ]}
          />

          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(28), marginBottom: 5 }}>
            Dados Pessoais
          </Text>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: fs(16), marginTop: 10, marginBottom: 30 }}>
            Verifique ou altere seus dados
          </Text>

          {/* Aqui os campos só mostram os dados; para editar, o botão leva a "Alterar dados" */}
          <View
            style={{
              backgroundColor: colors.surfaceAlt,
              padding: 15,
              borderRadius: 15,
              gap: 20,
            }}
          >
            <CampoDados rotulo="Nome" value={usuario.nome} editable={false} />
            <CampoDados rotulo="Email" value={usuario.email} editable={false} />
            <CampoDados rotulo="Senha" value={usuario.senha} editable={false} />
            <CampoDados rotulo="CPF" value={usuario.cpf} editable={false} />
            <CampoDados rotulo="Data de Nascimento" value={usuario.nascimento} editable={false} />
            <CampoDados rotulo="Telefone" value={usuario.telefone} editable={false} />
            <CampoDados rotulo="Endereço" value={usuario.endereco} editable={false} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Botao titulo="Excluir conta" variante="perigo" onPress={excluirConta} style={{ paddingHorizontal: 20 }} />
              <Botao
                titulo="Alterar dados"
                onPress={() => router.push('/alterar-dados' as any)}
                style={{ paddingHorizontal: 20 }}
              />
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}
