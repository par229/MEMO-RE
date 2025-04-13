import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    const userData = await AsyncStorage.getItem(`user:${email}`);
    if (!userData) return Alert.alert('오류', '해당 이메일이 존재하지 않습니다.');
    const newPw = Math.random().toString(36).slice(2, 8);
    await AsyncStorage.setItem(`user:${email}`, JSON.stringify({ password: newPw }));
    Alert.alert('임시 비밀번호 발급', `새 비밀번호: ${newPw}`);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>
      <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} />
      <Button title="임시 비밀번호 받기" onPress={handleReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }
});

export default ForgotPasswordScreen;
