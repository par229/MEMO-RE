import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationService';

const MemoListScreen = () => {
  const [memos, setMemos] = useState<{ id: string, content: string, timestamp: string }[]>([]);

  useEffect(() => {
    const loadMemos = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const memoKeys = keys.filter(k => k.startsWith('memo:'));
      const values = await AsyncStorage.multiGet(memoKeys);
      const items = values.map(([key, val]) => {
        const parsed = JSON.parse(val || '{}');
        return { id: key.replace('memo:', ''), ...parsed };
      });
      setMemos(items);
    };
    loadMemos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigationRef.navigate('MemoEditor', { memoId: item.id, memo: item.content })}
          >
            <View style={styles.item}>
              <Text numberOfLines={1}>{item.content}</Text>
              <Text style={styles.time}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="새 메모 작성" onPress={() => navigationRef.navigate('MemoEditor', {})} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1 },
  time: { fontSize: 10, color: 'gray' },
});

export default MemoListScreen;
