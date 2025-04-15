import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationService';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) return;

    await AsyncStorage.setItem('user', username || 'default');

    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } else {
      console.warn('navigationRef is not ready');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="로그인" onPress={handleLogin} />
      <View style={styles.links}>
        <Text style={styles.linkText} onPress={() => navigationRef.navigate('SignUp')}>
          회원가입
        </Text>
        <Text style={styles.linkText} onPress={() => navigationRef.navigate('ForgotPassword')}>
          비밀번호 찾기
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  links: { marginTop: 20, alignItems: 'center' },
  linkText: {
    color: '#007AFF',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
