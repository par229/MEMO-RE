import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

const IdeaBoardScreen = () => {
  const route = useRoute();
  const boardId = route.params?.boardId;

  const [memos, setMemos] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [todayMemoExists, setTodayMemoExists] = useState(false);

  const getToday = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/memos/?board=${boardId}`)
      .then((res) => {
        const memoList = res.data;
        setMemos(memoList);
        const today = getToday();
        const exists = memoList.some(m => m.timestamp.startsWith(today));
        setTodayMemoExists(exists);
      })
      .catch(() => {
        Alert.alert('메모 불러오기 실패');
      });
  }, [boardId]);

  const scheduleMemoNotification = async (content: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💡 아이디어 리마인더',
        body: `"${content.slice(0, 20)}..." 를 이어서 생각해보세요!`,
      },
      trigger: {
        seconds: 60, // ✅ 테스트용: 1분 뒤 알림 (24시간 = 86400초)
      },
    });
  };

  const handleAddMemo = () => {
    if (todayMemoExists) {
      Alert.alert('오늘의 메모는 이미 작성되었습니다.');
      return;
    }
    if (!newContent.trim()) {
      Alert.alert('내용을 입력해주세요.');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/memos/', {
      board: boardId,
      content: newContent,
    }).then((res) => {
      setMemos([...memos, res.data]);
      setTodayMemoExists(true);
      setNewContent('');
      Alert.alert('생각이 이어졌습니다');
      scheduleMemoNotification(res.data.content); // ✅ 알림 예약
    }).catch(() => {
      Alert.alert('메모 저장 실패');
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.memoBox}>
      <Text style={styles.memoHeader}>#{item.number} | {item.timestamp.split('T')[0]}</Text>
      <Text style={styles.memoText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 메모 보드</Text>

      <FlatList
        data={memos}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View style={styles.inputBox}>
        <TextInput
          placeholder="오늘의 아이디어를 입력하세요..."
          style={styles.input}
          value={newContent}
          onChangeText={setNewContent}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddMemo}>
          <Text style={styles.buttonText}>+ 메모 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IdeaBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  memoBox: {
    backgroundColor: '#e9f5f2',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  memoHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  memoText: {
    fontSize: 16,
    color: '#222',
  },
  inputBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#89b0ae',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});
