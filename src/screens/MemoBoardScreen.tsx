import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
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
  createdAt: string;
};

const MemoBoardScreen = () => {
  const route = useRoute();
  const { folderId } = route.params as RouteParams;

  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState('');
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initialize = async () => {
      const data = await AsyncStorage.getItem(`memo-board:${folderId}`);
      const lock = await AsyncStorage.getItem(`memo-lock:${folderId}`);
      if (data) setMemos(JSON.parse(data));
      if (lock === 'true') setEditingEnabled(false);
    };
    initialize();
  }, []);

  const saveMemos = async (list: Memo[]) => {
    await AsyncStorage.setItem(`memo-board:${folderId}`, JSON.stringify(list));
    setMemos(list); // 상태 갱신 보장
  };

  const addMemo = async () => {
    if (!newMemo.trim()) return;

    const now = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const memo: Memo = {
      id: Date.now().toString(),
      content: newMemo.trim(),
      createdAt: now,
    };

    const next = [...memos, memo];
    await saveMemos(next);
    setNewMemo('');
  };

  const deleteMemo = async (id: string) => {
    const next = memos.filter((m) => m.id !== id);
    await saveMemos(next); // AsyncStorage → 상태 갱신
  };

  const endIdea = async () => {
    await AsyncStorage.setItem(`memo-lock:${folderId}`, 'true');
    setEditingEnabled(false); // 💡 이걸 반드시 await 다음에 둬야 함
    Alert.alert('종료됨', '이제 더 이상 메모를 작성할 수 없습니다.');
  };

  const filteredMemos = memos.filter((memo) =>
    memo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 {folderId} 보드</Text>

      <TextInput
        style={styles.search}
        placeholder="메모 내용 검색"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredMemos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.memoBox}>
            <View style={styles.memoHeader}>
              <Text style={styles.memoIndex}>#{index + 1}</Text>
              <Text style={styles.memoDate}>{item.createdAt}</Text>
              <TouchableOpacity onPress={() => deleteMemo(item.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.memoText}>{item.content}</Text>
          </View>
        )}
      />

      {editingEnabled && (
        <>
          <TextInput
            value={newMemo}
            onChangeText={setNewMemo}
            style={styles.input}
            placeholder="새 아이디어 메모를 작성하세요"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addMemo}>
            <Text style={styles.addBtnText}>메모 추가</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.endBtn} onPress={endIdea}>
        <Text style={styles.endBtnText}>아이디어 종료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MemoBoardScreen;

const pastelColor = '#fff4d6';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  memoBox: {
    backgroundColor: pastelColor,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  memoIndex: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  memoDate: {
    fontSize: 12,
    color: '#777',
  },
  deleteBtn: {
    fontSize: 16,
    color: '#ff5555',
    paddingHorizontal: 8,
  },
  memoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: '#c8e3d4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    fontWeight: 'bold',
    color: '#333',
  },
  endBtn: {
    marginTop: 20,
    backgroundColor: '#dc3d3d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
