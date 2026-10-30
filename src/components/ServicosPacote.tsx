import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';
import { PacoteDetalhe } from '../types/pacote';
import { formatarData, nomeTipoPassagem } from '../utils/formatar';

type Icone = ComponentProps<typeof MaterialIcons>['name'];

// <p> dentro de ".revisao-de-pacote" (margem de baixo de 25)
export function Paragrafo({ children }: { children: ReactNode }) {
  const { colors, fs } = useAppTheme();
  return <Text style={{ color: colors.text, fontSize: fs(16), marginBottom: 25 }}>{children}</Text>;
}

function LinhaIcone({ icone, children, endereco }: { icone: Icone; children: ReactNode; endereco?: boolean }) {
  const { colors, fs } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: endereco ? 0 : 25 }}>
      <MaterialIcons name={icone} size={20} color={colors.text} />
      <Text
        style={{
          flex: 1,
          color: colors.text,
          fontSize: fs(16),
          fontStyle: endereco ? 'italic' : 'normal',
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function ServicoItem({ icone, titulo, children }: { icone: Icone; titulo: string; children: ReactNode }) {
  const { colors, fs } = useAppTheme();
  return (
    <View style={[s.item, { borderBottomColor: colors.borderSoft }]}>
      <View style={[s.iconBox, { backgroundColor: colors.white }]}>
        <MaterialIcons name={icone} size={24} color={colors.black} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: fs(18.72), marginTop: 5, marginBottom: 25 }}>
          {titulo}
        </Text>
        {children}
      </View>
    </View>
  );
}

// Hotel, passagem e intérprete (usado em "Detalhes do pacote" e "Revisar compra")
export default function ServicosPacote({ pacote }: { pacote: PacoteDetalhe }) {
  const { hotel, passagem, interprete } = pacote;
  const aviao = passagem?.transporte === 'Aviao';

  return (
    <View>
      {hotel && (
        <ServicoItem icone="hotel" titulo="Hotel">
          <Paragrafo>{hotel.nomeHotel}</Paragrafo>
          <LinhaIcone icone="date-range">
            Check-in: {formatarData(hotel.dataCheckin)} · Check-out: {formatarData(hotel.dataCheckout)}
          </LinhaIcone>
          <LinhaIcone icone="location-on" endereco>{hotel.enderecoHotel}</LinhaIcone>
        </ServicoItem>
      )}

      {passagem && (
        <ServicoItem icone={aviao ? 'flight' : 'directions-bus'} titulo={aviao ? 'Passagem aérea' : 'Passagem de ônibus'}>
          <Paragrafo>{passagem.localPartida} ➔ {passagem.localChegada}</Paragrafo>
          <LinhaIcone icone="date-range">
            Saída: {formatarData(passagem.horarioPartida)} · Chegada: {formatarData(passagem.horarioChegada)}
          </LinhaIcone>
          <Paragrafo>{nomeTipoPassagem(passagem.tipoPassagem)}</Paragrafo>
        </ServicoItem>
      )}

      {interprete && (
        <ServicoItem icone="person" titulo="Intérprete">
          <Paragrafo>{interprete.nomeInterprete}</Paragrafo>
        </ServicoItem>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  item: { flexDirection: 'row', gap: 15, paddingVertical: 20, borderBottomWidth: 1 },
  iconBox: { padding: 10, borderRadius: 10, alignSelf: 'flex-start' },
});