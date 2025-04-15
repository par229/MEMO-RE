import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationService';

const BoardListScreen = () => {
  const [boards, setBoards] = useState<string[]>([]);
  const [newBoardName, setNewBoardName] = useState('');

  const loadBoards = async () => {
    const data = await AsyncStorage.getItem('board-list');
    if (data) {
      setBoards(JSON.parse(data));
    }
  };

  const saveBoards = async (list: string[]) => {
    setBoards(list);
    await AsyncStorage.setItem('board-list', JSON.stringify(list));
  };

  const addBoard = () => {
    if (!newBoardName.trim()) return;
    const name = newBoardName.trim();
    if (boards.includes(name)) {
      Alert.alert('중복된 보드', '이미 존재하는 보드입니다.');
      return;
    }
    const next = [...boards, name];
    saveBoards(next);
    setNewBoardName('');
  };

  const deleteBoard = (boardId: string) => {
    Alert.alert('보드 삭제', `"${boardId}" 보드를 삭제할까요?`, [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          const next = boards.filter((b) => b !== boardId);
          await AsyncStorage.removeItem(`memo-board:${boardId}`);
          await AsyncStorage.removeItem(`board-name:${boardId}`);
          saveBoards(next);
        },
      },
    ]);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂 아이디어 칠판 리스트</Text>
      <FlatList
        data={boards}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigationRef.navigate('MemoBoard', {
                  folderId: item,
                })
              }
            >
              <Text>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteBoard(item)}>
              <Text style={styles.delete}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        placeholder="새 보드 이름"
        value={newBoardName}
        onChangeText={setNewBoardName}
        style={styles.input}
      />
      <Button title="보드 추가하기" onPress={addBoard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    flex: 1,
    padding: 14,
  },
  delete: {
    fontSize: 18,
    color: 'red',
    paddingHorizontal: 12,
  },
});

export default BoardListScreen;
