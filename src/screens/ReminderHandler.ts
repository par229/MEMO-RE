import * as Notifications from 'expo-notifications';
import { navigationRef } from '../../App';

export const setupNotificationResponseListener = () => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const memoId = response.notification.request.content.data.memoId;
    if (memoId && navigationRef.isReady()) {
      navigationRef.navigate('MemoEditor', { memoId });
    }
  });
};
