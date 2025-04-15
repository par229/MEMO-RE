import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { navigationRef } from '../navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>아이디어 메모장 📝</Text>
      <Button title="메모 보러 가기" onPress={() => navigationRef.navigate('MemoList')} />
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 30 },
});

export default HomeScreen;
