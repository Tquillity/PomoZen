const CLICK_SRC = '/sounds/click.mp3';
const ALARM_SRC = '/sounds/alarm.mp3';

const clickAudio = new Audio(CLICK_SRC);
const alarmAudio = new Audio(ALARM_SRC);

export const playClick = () => {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
};

export const playAlarm = () => {
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(() => {});
};

export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

export const sendNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/vite.svg' });
  }
};

