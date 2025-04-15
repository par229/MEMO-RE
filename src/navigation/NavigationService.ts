// src/navigation/NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../../App'; // 타입 경로 맞춰줘야 함

export const navigationRef = createNavigationContainerRef<RootStackParamList>();