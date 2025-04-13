import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memo } from '../types/memo';

const MEMO_KEY = 'memo_list';

export const saveMemoList = async (list: Memo[]) => {
  const jsonValue = JSON.stringify(list);
  await AsyncStorage.setItem(MEMO_KEY, jsonValue);
};

export const loadMemoList = async (): Promise<Memo[]> => {
  const jsonValue = await AsyncStorage.getItem(MEMO_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};
