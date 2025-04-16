import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const BoardListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const [boards, setBoards] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // ✅ userId가 없으면 안내 메시지
  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100 }}>
          유저 정보가 없습니다.
        </Text>
      </View>
    );
  }

  // ✅ 유저의 보드 불러오기
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/boards/?user=${userId}`)
      .then((res) => setBoards(res.data))
      .catch((err) => console.log('보드 불러오기 실패:', err));
  }, [userId]);

  // ✅ 보드 추가
  const addBoard = () => {
    if (!newTitle || !newCategory) {
      Alert.alert('입력 오류', '제목과 분야를 입력해주세요.');
      return;
    }
    axios.post('http://127.0.0.1:8000/api/boards/', {
      user: userId,
      title: newTitle,
      category: newCategory,
    }).then((res) => {
      setBoards([...boards, res.data]);
      setModalVisible(false);
      setNewTitle('');
      setNewCategory('');
    }).catch(() => {
      Alert.alert('보드 추가 실패', '네트워크 오류 또는 서버 오류');
    });
  };

  // ✅ 보드 삭제
  const deleteBoard = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/boards/${id}/`)
      .then(() => setBoards(boards.filter((b) => b.id !== id)))
      .catch(() => Alert.alert('삭제 실패', '서버 오류'));
  };

  const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    switch (option) {
      case 'info':
        Alert.alert('내 정보', `사용자 ID: ${userId}`);
        break;
      case 'logout':
        navigation.replace('LoginScreen');
        break;
      case 'about':
        Alert.alert('어플 정보', 'MEMO-RE v1.0.0\nby Minju Park');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 아이디어 보드</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => handleMenuSelect('info')}>
              <Text style={styles.menuItem}>내 정보</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuSelect('logout')}>
              <Text style={styles.menuItem}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuSelect('about')}>
              <Text style={styles.menuItem}>어플 정보</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={boards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.boardItem}
            onPress={() => navigation.navigate('IdeaBoardScreen', { boardId: item.id })}
          >
            <View>
              <Text style={styles.boardTitle}>{item.title}</Text>
              <Text style={styles.boardCategory}>📁 {item.category}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteBoard(item.id)}>
              <Text style={styles.deleteButton}>🗑</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ 보드 추가</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="보드 제목"
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              placeholder="분야"
              style={styles.input}
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addBoard}>
              <Text style={styles.modalButtonText}>추가</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BoardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
  },
  menu: {
    fontSize: 24,
    padding: 4,
  },
  menuBox: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  boardItem: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  boardCategory: {
    color: '#888',
  },
  deleteButton: {
    fontSize: 18,
    color: '#c44',
  },
  addButton: {
    backgroundColor: '#89b0ae',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingVertical: 8,
  },
  modalButton: {
    backgroundColor: '#89b0ae',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelButton: {
    textAlign: 'center',
    color: '#999',
  },
});
