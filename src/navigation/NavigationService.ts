import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  MemoList: undefined;
  MemoFolderView: { folderId: string };  // ✅ 추가됨
  MemoEditor: {
    folderId: string;
    memoId?: string;
    memo?: string;
  };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
