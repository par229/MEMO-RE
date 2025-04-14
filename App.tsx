import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, View, Platform } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import MemoListScreen from './src/screens/MemoListScreen';
import MemoEditorScreen from './src/screens/MemoEditorScreen';
import { setupNotificationResponseListener } from './src/screens/ReminderHandler';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  MemoList: undefined;
  MemoEditor: { memo?: any; memoId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkLogin();

    // 알림 권한 요청
    Notifications.requestPermissionsAsync();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  useEffect(() => {
    const listener = setupNotificationResponseListener(navigationRef);
    return () => listener.remove();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MemoList" component={MemoListScreen} />
            <Stack.Screen name="MemoEditor" component={MemoEditorScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// 네비게이션 ref 정의
import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();

export default App;