import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  PanResponder,
  TouchableWithoutFeedback,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

type Memo = {
  id: string;
  content: string;
  x: number;
  y: number;
};

type RouteParams = {
  folderId: string;
};

const MemoBoardScreen = () => {
  const { folderId } = useRoute().params as RouteParams;
  const [memos, setMemos] = useState<Memo[]>([]);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, TextInput>>({});

  const loadMemos = async () => {
    const data = await AsyncStorage.getItem(`memo-board:${folderId}`);
    if (data) {
      const parsed = JSON.parse(data) as Memo[];
      setMemos(parsed);
    }
  };

  const saveMemos = async (next: Memo[]) => {
    setMemos(next);
    await AsyncStorage.setItem(`memo-board:${folderId}`, JSON.stringify(next));
  };

  const addMemo = (x: number, y: number) => {
    const id = `memo-${Date.now()}`;
    const newMemo: Memo = {
      id,
      content: '',
      x,
      y,
    };
    const next = [...memos, newMemo];
    saveMemos(next);
    setTimeout(() => {
      setActiveInputId(id);
      inputRefs.current[id]?.focus();
    }, 100);
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

  const updateContent = (id: string, content: string) => {
    const next = memos.map((memo) =>
      memo.id === id ? { ...memo, content } : memo
    );
    saveMemos(next);
  };

  const updatePosition = (id: string, x: number, y: number) => {
    const next = memos.map((memo) =>
      memo.id === id ? { ...memo, x, y } : memo
    );
    saveMemos(next);
  };

  useEffect(() => {
    loadMemos();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        const { locationX, locationY } = e.nativeEvent;
        addMemo(locationX, locationY);
      }}
    >
      <View style={styles.board}>
        {memos.map((memo) => {
          const pan = useRef({ x: memo.x, y: memo.y }).current;

          const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
              pan.x = memo.x + gesture.dx;
              pan.y = memo.y + gesture.dy;
            },
            onPanResponderRelease: () => {
              updatePosition(memo.id, pan.x, pan.y);
            },
          });

          return (
            <View
              key={memo.id}
              {...panResponder.panHandlers}
              style={[
                styles.memo,
                {
                  top: memo.y,
                  left: memo.x,
                  position: 'absolute',
                },
              ]}
            >
              <View style={styles.header}>
                <TouchableOpacity onPress={() => deleteMemo(memo.id)}>
                  <Text style={styles.delete}>🗑</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                ref={(ref) => {
                  if (ref) inputRefs.current[memo.id] = ref;
                }}
                value={memo.content}
                onChangeText={(text) => updateContent(memo.id, text)}
                multiline
                placeholder="메모 입력..."
                style={styles.text}
                autoFocus={memo.id === activeInputId}
              />
            </View>
          );
        })}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  board: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  memo: {
    width: 160,
    minHeight: 100,
    backgroundColor: '#fff8aa',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  delete: {
    fontSize: 16,
    color: 'red',
  },
  text: {
    fontSize: 14,
    textAlignVertical: 'top',
  },
});

export default MemoBoardScreen;
