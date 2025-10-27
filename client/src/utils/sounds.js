// utils/sounds.js - Sound notification utilities
let audioContext;
let notificationSound;

// Initialize audio context
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Create a simple notification beep using Web Audio API
const createNotificationBeep = () => {
  const context = initAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.3);
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    createNotificationBeep();
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

// Load audio file (optional, if you have an audio file)
export const loadNotificationSound = (url) => {
  notificationSound = new Audio(url);
  notificationSound.volume = 0.5;
};

// Play loaded audio file
export const playLoadedSound = () => {
  if (notificationSound) {
    notificationSound.currentTime = 0;
    notificationSound
      .play()
      .catch((err) => console.error("Error playing sound:", err));
  }
};
