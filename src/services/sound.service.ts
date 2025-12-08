// Short beep for click
// const CLICK_SOUND = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; 

// (Real click sound placeholder - in real app, replace with actual asset)
// Since we are simulating, we will use a simple implementation that logs if sound fails, 
// but try to use a real tiny beep if possible. For this specific task, create a "Dummy" audio player 
// that effectively works but relies on standard HTML5 Audio.

// Let's use a real, very short "pop" sound for click and "ding" for alarm
const CLICK_SRC = 'https://actions.google.com/sounds/v1/cartoon/pop.ogg';
const ALARM_SRC = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const clickAudio = new Audio(CLICK_SRC);
const alarmAudio = new Audio(ALARM_SRC);

export const playClick = () => {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {}); // Ignore auto-play errors
};

export const playAlarm = () => {
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(console.error);
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

export const triggerVisualBell = () => {
  const flash = document.createElement('div');
  flash.className = 'animate-flash';
  document.body.appendChild(flash);
  setTimeout(() => {
    document.body.removeChild(flash);
  }, 1000);
};
