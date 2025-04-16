import * as Notifications from 'expo-notifications';

export async function scheduleMemoNotification(content: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💡 아이디어 리마인더',
      body: `"${content.slice(0, 20)}..." 를 이어서 생각해보세요!`,
    },
    trigger: {
      seconds: 60, // 테스트용: 1분 후 알림 (24 * 3600 = 86400 → 24시간)
    },
  });
}
