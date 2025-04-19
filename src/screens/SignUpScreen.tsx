import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.45.48:8000/api/signup/', {
        username: email,
        password: password,
      });

      Alert.alert('회원가입 완료', '로그인 해주세요!');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

    } catch (error: any) {
      const msg = error.response?.data?.error || '회원가입 실패';
      Alert.alert('회원가입 오류', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디 (이메일 형식)"
        keyboardType="email-address"
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
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 분실 시 이메일"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="가입하기" onPress={handleSignup} />
      <View style={{ height: 16 }} />
      <Button title="뒤로가기" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default SignupScreen;
