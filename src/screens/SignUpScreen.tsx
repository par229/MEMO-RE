import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [birth, setBirth] = useState('');
  const [email, setEmail] = useState('');

  const handleSignUp = async () => {
    if (!username || !password || !nickname || !birth || !email) {
      return Alert.alert('모든 항목을 입력해주세요.');
    }

    const existing = await AsyncStorage.getItem(`user:${username}`);
    if (existing) return Alert.alert('이미 존재하는 아이디입니다.');

    const newUser = { password, nickname, birth, email };
    await AsyncStorage.setItem(`user:${username}`, JSON.stringify(newUser));

    Alert.alert('회원가입 완료', '이제 로그인해주세요!');
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput style={styles.input} placeholder="아이디" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={setNickname} />
      <TextInput style={styles.input} placeholder="생년월일 (예: 1999-01-01)" value={birth} onChangeText={setBirth} />
      <TextInput style={styles.input} placeholder="이메일 (비밀번호 찾기용)" value={email} onChangeText={setEmail} />

      <Button title="가입하기" onPress={handleSignUp} />
      <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
        이미 계정이 있나요? 로그인
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  linkText: { color: '#007AFF', marginTop: 20, textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' }
});

export default SignUpScreen;
