import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('로그인 실패', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    await AsyncStorage.setItem('user', JSON.stringify({ email }));
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="비밀번호" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8 },
});

export default LoginScreen;
