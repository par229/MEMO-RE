import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationService';
import { RouteProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

type MemoEditorRouteProp = RouteProp<RootStackParamList, 'MemoEditor'>;

const MemoEditorScreen = () => {
  const route = useRoute<MemoEditorRouteProp>();
  const [text, setText] = useState(route.params?.memo || '');

  useEffect(() => {
    if (route.params?.memo) {
      setText(route.params.memo);
    }
  }, [route.params]);

  const handleSave = async () => {
    const id = route.params?.memoId || Date.now().toString();
    const timestamp = new Date().toLocaleString();
    await AsyncStorage.setItem(`memo:${id}`, JSON.stringify({ content: text, timestamp }));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '아이디어를 더 구체화해볼까요?',
        body: '24시간 전에 저장한 메모가 있어요!',
      },
      trigger: { seconds: 86400 }, // 24시간 뒤
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        placeholder="아이디어를 자유롭게 적어보세요!"
        style={styles.input}
      />
      <Button title="저장하기" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
});

export default MemoEditorScreen;
