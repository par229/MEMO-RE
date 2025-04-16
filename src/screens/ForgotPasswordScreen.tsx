import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>
      <TextInput placeholder="가입한 이메일을 입력하세요" style={styles.input} />
      <Button title="비밀번호 재설정 메일 보내기" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
  input: { borderBottomWidth: 1, marginBottom: 12 },
});

export default ForgotPasswordScreen;
