// Simple test to verify wallet connection works
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function testWalletConnection() {
  console.log('Testing wallet connection...');
  
  showConnect({
    appDetails: {
      name: 'sBTC Pulse Test',
      icon: window.location.origin + '/favicon.svg',
    },
    redirectTo: '/',
    onFinish: () => {
      console.log('Wallet connected successfully!');
      const userData = userSession.loadUserData();
      console.log('User data:', userData);
      alert('Wallet connected! Check console for details.');
    },
    userSession: userSession,
  });
}

// Add test button to page
document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Wallet Connection';
  testButton.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50';
  testButton.onclick = testWalletConnection;
  document.body.appendChild(testButton);
});

export { testWalletConnection };