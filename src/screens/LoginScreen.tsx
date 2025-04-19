import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.45.48:8000/api/token/', {
        username: email,
        password: password,
      });
  
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
  
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('username', email);
  
      Alert.alert('로그인 성공', '환영합니다!');
      navigation.reset({ index: 0, routes: [{ name: 'BoardList' }] });
  
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert('서버 오류', '서버에 연결할 수 없습니다.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MEMO-RE</Text>

      <TextInput
        placeholder="이메일"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
    color: '#89b0ae',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
  },
  loginButton: {
    backgroundColor: '#89b0ae',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: '#89b0ae',
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  separator: {
    color: '#ccc',
  },
});
