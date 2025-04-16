import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    username: '',
    password: '',
    nickname: '',
    birth: '',
    email: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    const { username, password, nickname, birth, email } = form;
    if (!username || !password) {
      Alert.alert('입력 오류', '아이디와 비밀번호는 필수입니다.');
      return;
    }

    const userData = { username, password, nickname, birth, email };
    await AsyncStorage.setItem(`user:${username}`, JSON.stringify(userData));
    Alert.alert('회원가입 완료', '이제 로그인해주세요!');
    navigation.goBack(); // 로그인으로 돌아가기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      {['username', 'password', 'nickname', 'birth', 'email'].map(key => (
        <TextInput
          key={key}
          placeholder={key}
          secureTextEntry={key === 'password'}
          value={form[key as keyof typeof form]}
          onChangeText={val => handleChange(key, val)}
          style={styles.input}
        />
      ))}
      <Button title="가입하기" onPress={handleSignUp} />
      <Text style={styles.linkText} onPress={() => navigation.goBack()}>
        ← 로그인으로 돌아가기
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
