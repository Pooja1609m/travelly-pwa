// Navigation button (example)
document.getElementById('getStartedBtn').addEventListener('click', () => {
  // Navigate to a dashboard or other page — placeholder:
  window.location.href = '/index.html';
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service worker registered.');
    } catch (err) {
      console.error('❌ SW registration failed:', err);
    }
  });
}

// Install prompt handling
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Save the event for later
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
  console.log('beforeinstallprompt fired -> saved event.');
});

function showInstallButton() {
  installBtn.hidden = false;
  installBtn.setAttribute('aria-hidden', 'false');
}

// When user clicks the install button
installBtn.addEventListener('click', async () => {
  // If the prompt event is available, show native prompt
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('User choice:', choice.outcome);
    // Clear it for future installs
    deferredPrompt = null;
    installBtn.hidden = true;
  } else {
    // If prompt not available, show instructions / instruct the user how to install manually:
    showManualInstallInstructions();
  }
});

// Force-show the button during development to test UI (but it can't force native prompt)
window.addEventListener('load', () => {
  // After 2 seconds show the button visually so you can test the click path & messages
  setTimeout(() => {
    // Only force show if user hasn't already installed (appinstalled fired)
    if (!navigator.standalone && !window.matchMedia('(display-mode: standalone)').matches && !deferredPrompt) {
      installBtn.hidden = false;
      installBtn.setAttribute('aria-hidden', 'false');
      console.log('Force-showing install button for testing (note: native prompt may still be unavailable).');
    }
  }, 2000);
});

// When the app is actually installed
window.addEventListener('appinstalled', (evt) => {
  console.log('🎉 App installed', evt);
  // hide the install button if shown
  installBtn.hidden = true;
  alert('🎉 Travelly installed successfully!');
});

// Helper: show manual instructions (fallback)
function showManualInstallInstructions() {
  // Different instructions for desktop and mobile:
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) {
    alert('To install: open Chrome menu (⋮) -> Add to Home screen.');
  } else if (/iphone|ipad/.test(ua)) {
    alert('To install on iOS: use Safari -> Share button -> Add to Home Screen (iOS Safari does not support automatic prompt).');
  } else {
    alert('If native prompt does not appear, you can install from Chrome menu -> Install app or Add to home screen.');
  }
}

// ===== Push Notification Setup =====
async function initPushNotifications() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }
  if (!('PushManager' in window)) {
    console.log('Push API not supported');
    return;
  }

  try {
    // Request Notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return;
    }

    // Register SW (already registered) and subscribe
    const registration = await navigator.serviceWorker.ready;

    // Use a public VAPID key (generated from your push service)
    const vapidPublicKey = '<YOUR_VAPID_PUBLIC_KEY>'; // replace with your key
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    console.log('✅ Push subscription:', subscription);

    // Send subscription to your server here (optional)
    // await fetch('/subscribe', {method: 'POST', body: JSON.stringify(subscription)});

  } catch (error) {
    console.error('❌ Push notification setup failed:', error);
  }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

// Call function to initialize
initPushNotifications();

document.getElementById('getStartedBtn').addEventListener('click', async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification('Hello from Travelly!', {
      body: 'This is a test notification.',
      icon: '/icons/icon-192x192.png'
    });
  }
});
