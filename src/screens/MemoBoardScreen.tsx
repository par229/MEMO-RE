import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  PanResponder,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const PASTEL_COLORS = [
  '#FFEBEE', '#E1F5FE', '#E8F5E9', '#FFF3E0', '#F3E5F5',
];

const getContrastColor = (hex: string) => {
  const r = 255 - parseInt(hex.substring(1, 3), 16);
  const g = 255 - parseInt(hex.substring(3, 5), 16);
  const b = 255 - parseInt(hex.substring(5, 7), 16);
  return `rgb(${r},${g},${b})`;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let lastCreatedMemoId: string | null = null;

const MemoBoardScreen = () => {
  const { folderId } = useRoute().params as RouteParams;
  const [memos, setMemos] = useState<Memo[]>([]);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [highlightedMemoId, setHighlightedMemoId] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, TextInput>>({});
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formatDate = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const loadMemos = async () => {
    const data = await AsyncStorage.getItem(`memo-board:${folderId}`);
    if (data) {
      const parsed = JSON.parse(data);
      setMemos(parsed);
      if (parsed.length > 0) {
        const latest = parsed.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
        setHighlightedMemoId(latest.id);
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => setHighlightedMemoId(null));
      }
    }
  };

  const saveMemos = async (next: Memo[]) => {
    setMemos(next);
    await AsyncStorage.setItem(`memo-board:${folderId}`, JSON.stringify(next));
  };

  const addMemo = (x: number, y: number) => {
    const id = `memo-${Date.now()}`;
    lastCreatedMemoId = id;
    const timestamp = formatDate();
    const newMemo: Memo = {
      id,
      content: '',
      x,
      y,
      width: 160,
      height: 120,
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      pinned: false,
      favorite: false,
      timestamp,
    };
    saveMemos([...memos, newMemo]);
    setTimeout(() => {
      setActiveInputId(id);
      inputRefs.current[id]?.focus();
    }, 100);
  };

  const updateMemo = (id: string, changes: Partial<Memo>) => {
    const updated = memos.map((m) => (m.id === id ? { ...m, ...changes } : m));
    saveMemos(updated);
  };

  const deleteMemo = (id: string) => {
    saveMemos(memos.filter((m) => m.id !== id));
  };

  const handleComplete = (memoId: string) => {
  const memo = memos.find(m => m.id === memoId);
  if (!memo) return;

  const today = formatDate().slice(0, 10);
  const boardMemosToday = memos.filter(m => m.timestamp?.startsWith(today));
  const boardFirstToday = boardMemosToday.reduce((first, m) =>
    (!first || m.timestamp < first.timestamp) ? m : first, null as Memo | null);

  if (boardFirstToday?.id === memoId) {
    Alert.alert('오늘도 생각이 이어졌어요!');
  }
};

  useEffect(() => {
    loadMemos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="메모 검색..."
        value={search}
        onChangeText={setSearch}
      />

      {memos.map((memo) => {
        const isMatch = search.trim() !== '' && memo.content.includes(search.trim());
        const borderColor = isMatch ? getContrastColor(memo.color) : '#ccc';
        const isHighlighted = memo.id === highlightedMemoId;

        const panResponder = memo.pinned
          ? {}
          : PanResponder.create({
              onStartShouldSetPanResponder: () => true,
              onPanResponderMove: (_, gesture) => {
                updateMemo(memo.id, {
                  x: memo.x + gesture.dx,
                  y: memo.y + gesture.dy,
                });
              },
              onPanResponderRelease: () => {},
            });

        const resizeResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: (_, gesture) => {
            updateMemo(memo.id, {
              width: Math.max(100, memo.width + gesture.dx),
              height: Math.max(80, memo.height + gesture.dy),
            });
          },
          onPanResponderRelease: () => {},
        });

        const MemoWrapper = isHighlighted ? Animated.View : View;

        return (
          <MemoWrapper
            key={memo.id}
            {...panResponder.panHandlers}
            style={[
              styles.memo,
              {
                top: memo.y,
                left: memo.x,
                width: memo.width,
                height: memo.height,
                backgroundColor: memo.color,
                borderColor,
                transform: isHighlighted ? [{ scale: scaleAnim }] : [],
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.timestamp}>{memo.timestamp}</Text>
              <View style={styles.tools}>
                <TouchableOpacity onPress={() => updateMemo(memo.id, { favorite: !memo.favorite })}>
                  <Text>{memo.favorite ? '★' : '☆'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => updateMemo(memo.id, { pinned: !memo.pinned })}>
                  <Text>{memo.pinned ? '📍' : '📌'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMemo(memo.id)}>
                  <Text>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.colorPicker}>
              {PASTEL_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }]}
                  onPress={() => updateMemo(memo.id, { color: c })}
                />
              ))}
            </View>
            <TextInput
              ref={(ref) => ref && (inputRefs.current[memo.id] = ref)}
              style={styles.textInput}
              multiline
              value={memo.content}
              onChangeText={(text) => updateMemo(memo.id, { content: text })}
            />
            <TouchableOpacity style={styles.completeButton} onPress={() => handleComplete(memo.id)}>
              <Text style={{ color: 'white' }}>완료</Text>
            </TouchableOpacity>
            <View {...resizeResponder.panHandlers} style={styles.resizer} />
          </MemoWrapper>
        );
      })}

      <Pressable
        style={styles.addButton}
        onPress={() => addMemo(100, 100)}
      >
        <Text style={{ fontSize: 24, color: '#fff' }}>＋</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  memo: {
    position: 'absolute',
    borderRadius: 10,
    padding: 8,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 10,
    color: '#444',
  },
  tools: {
    flexDirection: 'row',
    gap: 6,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    margin: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    marginTop: 4,
    textAlignVertical: 'top',
  },
  resizer: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    borderBottomRightRadius: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderRadius: 6,
  },
});

export default MemoBoardScreen;
