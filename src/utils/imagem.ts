import { Image, ImageSourcePropType } from 'react-native';

// Proporção altura/largura de uma imagem local (com valor padrão se não conseguir ler)
export function proporcaoImagem(fonte: ImageSourcePropType, padrao = 1) {
  const origem = Image.resolveAssetSource(fonte);
  return origem && origem.width ? origem.height / origem.width : padrao;
}
