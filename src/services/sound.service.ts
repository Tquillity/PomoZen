// Reliable short UI sounds
// FOR OFFLINE SUPPORT: Download to /public/sounds/ and use '/sounds/click.mp3'
const CLICK_SRC = 'https://www.gstatic.com/voice_delight/sounds/short/soft_chime.mp3'; // Gentle chime
const ALARM_SRC = 'https://www.gstatic.com/voice_delight/sounds/short/time_up.mp3';   // Official timer beep

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
