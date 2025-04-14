import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MemoListScreen = () => {
  const [memos, setMemos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadMemos = async () => {
      const raw = await AsyncStorage.getItem('memos');
      if (raw) {
        setMemos(JSON.parse(raw));
      }
    };
    const unsubscribe = navigation.addListener('focus', loadMemos);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 아이디어 메모</Text>
      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memoItem}
            onPress={() => navigation.navigate('MemoEditor', { memo: item })}
          >
            <Text>{item.content.slice(0, 30)}...</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="새 메모 작성" onPress={() => navigation.navigate('MemoEditor')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  memoItem: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 8,
  },
  timestamp: { fontSize: 12, color: '#666' },
});

export default MemoListScreen;
