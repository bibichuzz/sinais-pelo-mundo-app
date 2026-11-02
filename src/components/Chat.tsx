import { useRef, useState } from 'react';
import { apiPost } from '../services/api';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { useRouter } from 'expo-router';

type Msg = { id: number; de: 'user' | 'bot'; texto: string };

type MensagemHistorico = {
  role: 'user' | 'model';
  conteudo: string;
};

type RespostaChatbot = {
  resposta: string;
};

export default function Chat() {
  const { colors, fs } = useAppTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Msg[]>([
  {
    id: 1,
    de: 'bot',
    texto: 'Olá! Eu sou o Safe, seu assistente virtual para viagens 👋 Para onde você gostaria de viajar?',
  },
]);
  const [texto, setTexto] = useState('');
  const [historico, setHistorico] = useState<MensagemHistorico[]>([]);
  const [carregando, setCarregando] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);

  
const enviar = async () => {
  const t = texto.trim();

  if (!t || carregando) return;

  const mensagemUsuario: Msg = {
    id: Date.now(),
    de: 'user',
    texto: t,
  };

  // Exibe a mensagem imediatamente
  setMensagens((m) => [...m, mensagemUsuario]);
  setTexto('');
  setCarregando(true);

  try {
    // Envia a mensagem atual e o histórico anterior
    const dados = await apiPost<RespostaChatbot>(
      '/chatbot/mensagem',
      {
        mensagem: t,
        historico: historico,
      }
    );

    // Adiciona a resposta do Safe na tela
    const respostaSafe: Msg = {
      id: Date.now() + 1,
      de: 'bot',
      texto: dados.resposta,
    };

    setMensagens((m) => [...m, respostaSafe]);

    // Atualiza o histórico da conversa
    setHistorico((h) => [
      ...h,
      { role: 'user', conteudo: t },
      { role: 'model', conteudo: dados.resposta },
    ]);

  } catch (erro: any) {
    console.error('Erro no chatbot:', erro);

    setMensagens((m) => [
      ...m,
      {
        id: Date.now() + 1,
        de: 'bot',
        texto: erro.message || 'Não foi possível conectar ao Safe.',
      },
    ]);

  } finally {
    setCarregando(false);

    setTimeout(() => {
      scroll.current?.scrollToEnd({ animated: true });
    }, 100);
  }
};


  // Botão flutuante (some enquanto o chat está aberto)
  if (!aberto) {
    return (
      <Pressable style={s.botao} onPress={() => setAberto(true)}>
        <Image source={require('../../assets/img/chat-btn.png')} style={s.botaoImg} />
      </Pressable>
    );
  }

  return (
    <View
      style={[
        s.container,
        { width: Math.min(320, width - 40), backgroundColor: colors.surface },
      ]}
    >
      {/* Cabeçalho */}
      <View style={[s.header, { backgroundColor: colors.headerChatbot }]}>
        <Image source={require('../../assets/img/icone-chat.png')} style={s.headerImg} />
        <Text style={[s.headerTitulo, { color: colors.headerFont, fontSize: fs(14) }]}>
          TravelSafe ✈{'\n'}Assistente Virtual
        </Text>
        <View style={s.headerIcones}>
          <Pressable onPress={() => setAberto(false)} hitSlop={8}>
            <MaterialIcons name="minimize" size={22} color={colors.headerFont} />
          </Pressable>
          <Pressable onPress={() => setAberto(false)} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={colors.headerFont} />
          </Pressable>
        </View>
      </View>

      {/* Mensagens */}
<ScrollView
  ref={scroll}
  style={s.mensagensWrap}
  contentContainerStyle={{ padding: 15 }}
>
  <View style={{ marginVertical: 15, gap: 8 }}>
    {mensagens.map((m) => (
  <View
    key={m.id}
    style={[
      s.bolha,
      {
        backgroundColor: colors.border,
        alignSelf: m.de === 'user' ? 'flex-end' : 'flex-start',
      },
    ]}
  >
    <View>
      {m.texto.split(/(\/Pacote\/DetalhesPacote\/\d+)/g).map((parte, index) => {
        const ehLink = /^\/Pacote\/DetalhesPacote\/\d+$/.test(parte);

        if (ehLink) {
          const idPacote = parte.split('/').pop();

          return (
            <Text
              key={index}
              style={{
                color: colors.buttonChatbot,
                fontSize: fs(14),
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}
              onPress={() =>
                router.push({
                  pathname: '/detalhes-pacote',
                  params: { id: idPacote },
                } as any)
              }
            >
              Ver detalhes do pacote
            </Text>
          );
        }

        return (
          <Text
            key={index}
            style={{ color: colors.chatMessages, fontSize: fs(14) }}
          >
            {parte}
          </Text>
        );
      })}
    </View>
  </View>
))}

    {carregando && (
      <Text style={{ color: colors.chatMessages, fontSize: fs(13) }}>
        Safe está digitando...
      </Text>
    )}
  </View>
</ScrollView>

      {/* Campo de envio */}
      <View style={[s.envio, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            s.input,
            {
              backgroundColor: colors.chatInput,
              borderColor: colors.border,
              color: colors.text,
              fontSize: fs(14),
            },
          ]}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={colors.inputText}
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="send"
        />
        <Pressable onPress={enviar} style={[s.enviar, { backgroundColor: colors.buttonChatbot }]}>
          <MaterialIcons name="send" size={18} color={colors.chatSend} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  botao: { position: 'absolute', bottom: 12, right: 12, zIndex: 9998 },
  botaoImg: { width: 80, height: 80, borderRadius: 40 },
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 450,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
  },
  headerImg: { width: 60, height: 60, borderRadius: 30 },
  headerTitulo: { fontWeight: 'bold', marginTop: 7, flex: 1, marginLeft: 8 },
  headerIcones: { flexDirection: 'row', gap: 6, marginTop: 15 },
  mensagensWrap: { flex: 1 },
  bolha: { maxWidth: '85%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14 },
  envio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 999,
  },
  enviar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
