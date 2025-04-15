import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleFindPassword = async () => {
    const data = await AsyncStorage.getItem(`user:${username}`);
    if (!data) {
      return Alert.alert('오류', '해당 아이디의 사용자를 찾을 수 없습니다.');
    }

    const parsed = JSON.parse(data);
    if (parsed.email !== email) {
      return Alert.alert('오류', '이메일이 일치하지 않습니다.');
    }

    Alert.alert('비밀번호 확인', `당신의 비밀번호는: ${parsed.password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>
      <TextInput
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="가입 시 입력한 이메일"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="비밀번호 찾기" onPress={handleFindPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
});

export default ForgotPasswordScreen;
