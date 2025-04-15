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
    if (!username || !password) return Alert.alert('입력 오류', '아이디와 비밀번호는 필수입니다.');
    const userData = { username, password, nickname, birth, email };
    await AsyncStorage.setItem(`user:${username}`, JSON.stringify(userData));
    Alert.alert('회원가입 완료', '로그인 해주세요');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      {['username', 'password', 'nickname', 'birth', 'email'].map(key => (
        <TextInput
          key={key}
          placeholder={key === 'username' ? '아이디' :
                      key === 'password' ? '비밀번호' :
                      key === 'nickname' ? '닉네임' :
                      key === 'birth' ? '생년월일' : '이메일'}
          secureTextEntry={key === 'password'}
          value={form[key as keyof typeof form]}
          onChangeText={val => handleChange(key, val)}
          style={styles.input}
        />
      ))}
      <Button title="가입하기" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
});

export default SignUpScreen;
