import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoardListScreen = () => {
  const navigation = useNavigation();
  const [boards, setBoards] = useState<string[]>([]);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const data = await AsyncStorage.getItem('board-list');
    if (data) setBoards(JSON.parse(data));
  };

  const saveBoards = async (list: string[]) => {
    setBoards(list);
    await AsyncStorage.setItem('board-list', JSON.stringify(list));
  };

  const addBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;
    if (boards.includes(name)) {
      Alert.alert('중복된 보드 이름입니다.');
      return;
    }

    const next = [...boards, name];
    saveBoards(next);
    setNewBoardName('');
  };

  const deleteBoard = (boardId: string) => {
    Alert.alert('보드 삭제', `"${boardId}"를 삭제할까요?`, [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          const next = boards.filter((b) => b !== boardId);
          await AsyncStorage.removeItem(`memo-board:${boardId}`);
          saveBoards(next);
        },
      },
    ]);
  };

  const goToBoard = (boardId: string) => {
    navigation.navigate('MemoBoard', { folderId: boardId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 메모 보드 목록</Text>
      <FlatList
        data={boards}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.boardRow}>
            <TouchableOpacity onPress={() => goToBoard(item)} style={styles.boardButton}>
              <Text style={styles.boardText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteBoard(item)}>
              <Text style={styles.delete}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="새 보드 이름"
        value={newBoardName}
        onChangeText={setNewBoardName}
      />
      <Button title="보드 추가" onPress={addBoard} />
    </View>
  );
};

export default BoardListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  boardButton: {
    flex: 1,
  },
  boardText: {
    fontSize: 18,
  },
  delete: {
    fontSize: 16,
    color: 'red',
    paddingHorizontal: 12,
  },
});
