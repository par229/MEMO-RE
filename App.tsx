import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Platform, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

import { navigationRef, RootStackParamList } from './src/navigation/NavigationService';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import BoardListScreen from './src/screens/BoardListScreen';
import MemoBoardScreen from './src/screens/MemoBoardScreen';
import { setupNotificationResponseListener } from './src/utils/ReminderHandler';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const listener = setupNotificationResponseListener(navigationRef);
    return () => listener.remove();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>로딩 중...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BoardList"
              component={BoardListScreen}
              options={{ headerShown: true, title: '보드 목록' }}
            />
            <Stack.Screen
              name="MemoBoard"
              component={MemoBoardScreen}
              options={{ headerShown: true, title: '메모 보드' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: true, title: '회원가입' }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: true, title: '비밀번호 찾기' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
