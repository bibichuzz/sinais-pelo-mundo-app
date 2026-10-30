import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CHAVE = 'authToken';

export async function salvarToken(token: string) {
  if (Platform.OS === 'web') await AsyncStorage.setItem(CHAVE, token);
  else await SecureStore.setItemAsync(CHAVE, token);
}

export async function obterToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return await AsyncStorage.getItem(CHAVE);
    return await SecureStore.getItemAsync(CHAVE);
  } catch {
    return null;
  }
}

export async function removerToken() {
  try {
    if (Platform.OS === 'web') await AsyncStorage.removeItem(CHAVE);
    else await SecureStore.deleteItemAsync(CHAVE);
  } catch {}
}