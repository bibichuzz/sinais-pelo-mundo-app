// Variáveis do :root do style.css (tema claro)
export const lightColors = {
  page: '#ffffff', surface: '#ffffff', packagesGrid: '#ffffff', headerFont: '#ffffff',
  chatInput: '#ffffff', input: '#ffffff', bgBtnAlterar: '#ffffff', btnHistorico: '#ffffff',
  dangerDarkmode: '#ffffff', surfaceAlt: '#E8F1FD', chatSend: '#E8F1FD', mutedSurface: '#f0f0f0',
  imagePlaceholder: '#dddddd', inputText: '#928e8e',
  text: '#000000', textSecondary: '#666666', textMuted: '#555555', textDark: '#333333',
  textOnPrimary: '#ffffff',
  border: '#e5e5e5', borderLight: '#eeeeee', borderInput: '#cccccc', borderStrong: '#333333',
  borderSoft: '#b8b5b5d1', borderBlack: '#000000',
  primary: '#1B3B88', footer: '#1B3B88', chatMessages: '#1B3B88', buttonChatbot: '#063390',
  primaryAction: '#1B6ED6', headerChatbot: '#063390', primaryHover: '#102657',
  primaryLight: '#E6EDFD', primaryHoverLight: '#bfd7fb', primaryAccent: '#5985DC',
  iconBackground: '#eff5ff',
  success: '#2DC75C', successHover: '#2DC75C', successDark: '#209543', successText: '#0b8d34',
  successLight: '#e8f5e9', successIcon: '#4caf50', successAlt: '#4de068',
  danger: '#ff0000', txtBtnExcluir: '#ff0000', dangerDark: '#af0a0a', dangerText: '#bd0a0a',
  dangerAlt: '#cc0000',
  themeModeIcon: '#f9d10b', disabledBg: '#d9d9d9', disabledText: '#666666', disabledBorder: '#b5b5b5',
  black: '#000000', white: '#ffffff', linkHover: 'blue', detailsHover: '#14018fcf',
  neutralHover: '#a7a4a4', darkButton: '#111111', menuIcon: '#222222',
  filterBorder: '#9393939e', checkoutBorder: '#dcdcdc',
};

export type Colors = typeof lightColors;

// html[data-theme="dark"]: só sobrescreve o que muda
const darkOverrides: Partial<Colors> = {
  page: '#121212', surface: '#1e1e1e', mutedSurface: '#2a2a2a', input: '#2a2a2a',
  imagePlaceholder: '#333333', footer: '#ffffff', inputText: '#928e8e', menuIcon: '#ffffff',
  chatMessages: '#ffffff', borderBlack: '#ffffff', success: '#ffffff', bgBtnAlterar: '#2DC75C',
  text: '#f0f0f0', textSecondary: '#b3b3b3', textMuted: '#999999', textDark: '#e0e0e0',
  btnHistorico: '#272626', border: '#333333', borderLight: '#2a2a2a', borderInput: '#444444',
  borderStrong: '#555555', chatInput: '#353434', primary: '#6d93e0', primaryLight: '#22345c',
  primaryHoverLight: '#2c4372', iconBackground: '#22345c', txtBtnExcluir: '#ffffff',
  dangerDarkmode: '#ff0000', danger: '#af0a0a', successHover: '#1a7736',
  surfaceAlt: '#030E26', packagesGrid: '#030E26',
};

export const darkColors: Colors = { ...lightColors, ...darkOverrides };
