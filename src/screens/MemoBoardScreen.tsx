import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const PASTEL_COLORS = ['#FFEBEE', '#E1F5FE', '#E8F5E9', '#FFF3E0', '#F3E5F5'];
const SCREEN_WIDTH = Dimensions.get('window').width;

const MemoBoardScreen = () => {
  const { folderId } = useRoute().params;
  const [memos, setMemos] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [favoritesVisible, setFavoritesVisible] = useState(false);
  const scrollViewRef = useRef();

  const formatDate = () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const saveMemos = async next => {
    setMemos(next);
    await AsyncStorage.setItem(`memo-board:${folderId}`, JSON.stringify(next));
  };

  const addMemo = () => {
    const id = `memo-${Date.now()}`;
    const timestamp = formatDate();
    const number = memos.length + 1;
    const newMemo = {
      id,
      content: '',
      number,
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      pinned: false,
      favorite: false,
      completed: false,
      timestamp,
    };
    saveMemos([...memos, newMemo]);
  };

  const updateMemo = (id, changes) => {
    const updated = memos.map(m => (m.id === id ? { ...m, ...changes } : m));
    saveMemos(updated);
  };

  const deleteMemo = id => {
    saveMemos(memos.filter(m => m.id !== id));
  };

  const handleComplete = id => {
    const updated = memos.map(m => (m.id === id ? { ...m, completed: true } : m));
    saveMemos(updated);

    const today = formatDate().slice(0, 10);
    const todayMemos = updated.filter(m => m.timestamp.slice(0, 10) === today);
    const firstToday = [...todayMemos].sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];

    if (firstToday.id === id) setMessage('오늘도 생각이 이어졌어요!');
  };

  const scrollToMemo = memoId => {
    const index = memos.findIndex(m => m.id === memoId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: index * 180, animated: true });
    }
  };

  useEffect(() => {
    setMessage(`'${folderId}'에 대해서 어떤 생각을 가지고 계신가요?`);
    AsyncStorage.getItem(`memo-board:${folderId}`).then(data => {
      if (!data) {
        setMessage(`'${folderId}'에 대해서 어떤 생각을 가지고 계신가요?`);
      }
      if (data) setMemos(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const sortedMemos = [...memos].sort((a, b) => (b.pinned - a.pinned || a.timestamp.localeCompare(b.timestamp)));

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="메모 검색"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.favoriteToggle} onPress={() => setFavoritesVisible(!favoritesVisible)}>
          <Text>{favoritesVisible ? '닫기 ✖' : '즐겨찾기 ⭐'}</Text>
        </TouchableOpacity>
      </View>

      {favoritesVisible && (
        <View style={styles.favoriteList}>
          {memos.filter(m => m.favorite).sort((a, b) => a.timestamp.localeCompare(b.timestamp)).map(m => (
            <TouchableOpacity key={m.id} onPress={() => scrollToMemo(m.id)} style={styles.favoriteItem}>
              <Text style={styles.favoriteItemText}>📌 #{m.number} | {m.timestamp}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        {sortedMemos.filter(m => m.content.includes(search)).map((memo) => (
          <View key={memo.id} style={[styles.memoCard, { backgroundColor: memo.color }, memo.completed && { opacity: 0.6 }]}>
            <View style={styles.memoHeader}>
              <Text style={styles.timestamp}>📄 #{memo.number} | {memo.timestamp}</Text>
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
            <TextInput
              style={styles.memoContent}
              multiline
              placeholder="내용을 입력하세요"
              value={memo.content}
              onChangeText={text => updateMemo(memo.id, { content: text })}
            />
            {!memo.completed && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleComplete(memo.id)}
              >
                <Text style={{ color: 'white' }}>완료</Text>
              </TouchableOpacity>
            )}
            {memo.completed && (
              <Text style={styles.completedText}>✓ 완료됨</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addMemo}>
        <Text style={{ fontSize: 24, color: '#fff' }}>＋</Text>
      </TouchableOpacity>

      {message && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backText: {
    fontSize: 18,
    color: '#333',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  favoriteToggle: {
    backgroundColor: '#FFE082',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  favoriteList: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  favoriteItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  favoriteItemText: {
    fontSize: 15,
    color: '#6D4C41',
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  memoCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 13,
    color: '#444',
  },
  tools: {
    flexDirection: 'row',
    gap: 6,
  },
  memoContent: {
    fontSize: 14,
    minHeight: 60,
    marginBottom: 10,
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  completedText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 80,
    left: '10%',
    right: '10%',
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastText: {
    color: '#4E3D53',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'serif',
  },
});

export default MemoBoardScreen;
