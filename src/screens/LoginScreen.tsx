import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const data = await AsyncStorage.getItem(`user:${username}`);
    if (!data) return Alert.alert('로그인 실패', '존재하지 않는 아이디입니다.');
    const parsed = JSON.parse(data);
    if (parsed.password !== password) return Alert.alert('로그인 실패', '비밀번호가 틀렸습니다.');

    await AsyncStorage.setItem('user', username); // 로그인 상태 저장
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
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
        <Text style={styles.linkText} onPress={() => navigation.navigate('SignUp')}>
          회원가입
        </Text>
        <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>
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
  linkText: { color: '#007AFF', marginTop: 8, fontSize: 14, textDecorationLine: 'underline' }
});

export default LoginScreen;
