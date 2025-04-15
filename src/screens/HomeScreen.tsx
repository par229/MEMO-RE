import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationService';

const HomeScreen = () => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const goToBoards = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('BoardList');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>아이디어 메모장 ✨</Text>
      <Button title="메모 보러가기" onPress={goToBoards} />
      <View style={{ height: 12 }} />
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 30 },
});

export default HomeScreen;
