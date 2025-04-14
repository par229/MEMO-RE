import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { v4 as uuidv4 } from 'uuid';

const MemoEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingMemo = route.params?.memo;
  const memoIdFromAlarm = route.params?.memoId;

  const [content, setContent] = useState('');
  const [memoId, setMemoId] = useState('');

  useEffect(() => {
    const loadMemo = async () => {
      if (editingMemo) {
        setContent(editingMemo.content);
        setMemoId(editingMemo.id);
      } else if (memoIdFromAlarm) {
        const raw = await AsyncStorage.getItem('memos');
        if (raw) {
          const memos = JSON.parse(raw);
          const target = memos.find((m) => m.id === memoIdFromAlarm);
          if (target) {
            setContent(target.content);
            setMemoId(target.id);
          }
        }
      }
    };
    loadMemo();
  }, []);

  const handleSave = async () => {
    const id = memoId || uuidv4();
    const now = new Date();
    const newMemo = {
      id,
      content,
      timestamp: now.toISOString(),
    };

    const raw = await AsyncStorage.getItem('memos');
    const memos = raw ? JSON.parse(raw) : [];
    const updated = [newMemo, ...memos.filter((m) => m.id !== id)];
    await AsyncStorage.setItem('memos', JSON.stringify(updated));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '아이디어를 이어서 작성해볼까요?',
        body: content.slice(0, 40),
        data: { memoId: id },
      },
      trigger: { seconds: 86400 }, // 24시간 후
    });

    Alert.alert('저장 완료', '24시간 뒤 알림이 예약되었습니다.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        placeholder="아이디어를 적어보세요"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Button title="저장 및 알림 설정" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
});

export default MemoEditorScreen;
