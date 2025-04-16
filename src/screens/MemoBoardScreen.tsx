import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  folderId: string;
};

type Memo = {
  id: string;
  content: string;
};

const MemoBoardScreen = () => {
  const route = useRoute();
  const { folderId } = route.params as RouteParams;

  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    const data = await AsyncStorage.getItem(`memo-board:${folderId}`);
    if (data) {
      setMemos(JSON.parse(data));
    }
  };

  const saveMemos = async (list: Memo[]) => {
    setMemos(list);
    await AsyncStorage.setItem(`memo-board:${folderId}`, JSON.stringify(list));
  };

  const addMemo = () => {
    if (!newMemo.trim()) return;

    const memo = {
      id: Date.now().toString(),
      content: newMemo.trim(),
    };
    const next = [...memos, memo];
    saveMemos(next);
    setNewMemo('');
  };

  const deleteMemo = (id: string) => {
    Alert.alert('삭제 확인', '이 메모를 삭제할까요?', [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const next = memos.filter((m) => m.id !== id);
          saveMemos(next);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 {folderId} 보드</Text>

      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memoBox}>
            <Text>{item.content}</Text>
            <Button title="삭제" onPress={() => deleteMemo(item.id)} />
          </View>
        )}
      />

      <TextInput
        value={newMemo}
        onChangeText={setNewMemo}
        style={styles.input}
        placeholder="새 메모 입력"
      />
      <Button title="메모 추가" onPress={addMemo} />
    </View>
  );
};

export default MemoBoardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  memoBox: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
});
