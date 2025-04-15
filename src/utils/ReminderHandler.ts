import * as Notifications from 'expo-notifications';

export const setupNotificationResponseListener = (navigationRef: any) => {
  return Notifications.addNotificationResponseReceivedListener(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('MemoList');
    }
  });
};
