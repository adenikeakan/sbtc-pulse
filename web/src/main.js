import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import Chart from 'chart.js/auto';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { 
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  cvToValue
} from '@stacks/transactions';

class StacksApp {
  constructor() {
    this.appConfig = new AppConfig(['store_write', 'publish_data']);
    this.userSession = new UserSession({ appConfig: this.appConfig });
    this.network = new StacksTestnet();
    this.contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    this.contractName = 'sbtc-pulse';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
    this.loadMockDataInitially();
    
    if (this.userSession.isUserSignedIn()) {
      this.handleSignIn();
    }
  }

  setupEventListeners() {
    document.getElementById('connect-wallet').addEventListener('click', () => {
      this.connectWallet();
    });

    document.getElementById('refresh-data').addEventListener('click', () => {
      this.loadPriceData();
    });

    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.updateChartPeriod(e.target.dataset.period);
      });
    });
  }

  connectWallet() {
    showConnect({
      appDetails: {
        name: 'sBTC Pulse',
        icon: window.location.origin + '/favicon.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        console.log('Wallet connection finished');
        window.location.reload();
      },
      userSession: this.userSession,
    });
  }

  handleSignIn() {
    const userData = this.userSession.loadUserData();
    console.log('User signed in:', userData);
    
    this.updateWalletStatus(true, userData.profile.stxAddress.testnet);
    this.loadPriceData();
  }

  updateWalletStatus(connected, address = null) {
    const statusElement = document.getElementById('wallet-status');
    const connectButton = document.getElementById('connect-wallet');
    
    if (connected) {
      statusElement.innerHTML = `
        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">Connected: ${address ? address.slice(0, 8) + '...' : 'Unknown'}</span>
      `;
      connectButton.textContent = 'Disconnect';
      connectButton.onclick = () => this.disconnectWallet();
    } else {
      statusElement.innerHTML = `
        <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        <span class="text-sm text-gray-600">Wallet not connected</span>
      `;
      connectButton.textContent = 'Connect Wallet';
      connectButton.onclick = () => this.connectWallet();
    }
  }

  disconnectWallet() {
    this.userSession.signUserOut();
    this.updateWalletStatus(false);
    this.clearPriceData();
  }

  async loadPriceData() {
    if (!this.userSession.isUserSignedIn()) {
      console.log('User not signed in');
      return;
    }

    this.showLoading(true);

    try {
      const currentPrice = await this.getCurrentPrice();
      const priceHistory = await this.getPriceHistory(10);
      
      this.updatePriceDisplay(currentPrice);
      this.updatePriceTable(priceHistory);
      this.updateChart(priceHistory);
      
    } catch (error) {
      console.error('Error loading price data:', error);
      this.showError('Failed to load price data');
    } finally {
      this.showLoading(false);
    }
  }

  async getCurrentPrice() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-current-price',
        functionArgs: [],
        network: this.network,
        senderAddress: this.userSession.loadUserData().profile.stxAddress.testnet,
      });

      return cvToValue(result);
    } catch (error) {
      console.log('No current price available, using mock data');
      return this.getMockPrice();
    }
  }

  async getPriceHistory(count) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-price-history',
        functionArgs: [uintCV(count)],
        network: this.network,
        senderAddress: this.userSession.loadUserData().profile.stxAddress.testnet,
      });

      return cvToValue(result);
    } catch (error) {
      console.log('No price history available, using mock data');
      return this.getMockPriceHistory();
    }
  }

  getMockPrice() {
    return {
      price: 64250,
      timestamp: Date.now(),
      blockHeight: 123456
    };
  }

  getMockPriceHistory() {
    const now = Date.now();
    const prices = [];
    
    for (let i = 0; i < 7; i++) {
      const basePrice = 64000;
      const variation = (Math.random() - 0.5) * 2000;
      prices.push({
        price: Math.round(basePrice + variation),
        timestamp: now - (i * 24 * 60 * 60 * 1000),
        blockHeight: 123456 - i * 144
      });
    }
    
    return prices.reverse();
  }

  updatePriceDisplay(priceData) {
    const currentPriceEl = document.getElementById('current-price');
    const lastUpdatedEl = document.getElementById('last-updated');
    const blockHeightEl = document.getElementById('block-height');
    const totalRecordsEl = document.getElementById('total-records');

    if (priceData) {
      currentPriceEl.textContent = `$${priceData.price.toLocaleString()}`;
      lastUpdatedEl.textContent = new Date(priceData.timestamp).toLocaleString();
      blockHeightEl.textContent = priceData.blockHeight?.toString() || 'Unknown';
      totalRecordsEl.textContent = '7';
    }
  }

  updatePriceTable(priceHistory) {
    const tableBody = document.getElementById('price-history-table');
    
    if (!priceHistory || priceHistory.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-6 py-8 text-center text-gray-500">
            No price data available
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = priceHistory.map((record, index) => {
      const prevPrice = index > 0 ? priceHistory[index - 1].price : record.price;
      const change = ((record.price - prevPrice) / prevPrice * 100);
      const changeClass = change >= 0 ? 'text-green-600' : 'text-red-600';
      const changeSymbol = change >= 0 ? '+' : '';

      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${new Date(record.timestamp).toLocaleDateString()}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            $${record.price.toLocaleString()}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm ${changeClass}">
            ${changeSymbol}${change.toFixed(2)}%
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${record.blockHeight || 'Unknown'}
          </td>
        </tr>
      `;
    }).join('');
  }

  updateChart(priceHistory) {
    const chartCanvas = document.getElementById('price-chart');
    const chartPlaceholder = document.getElementById('chart-placeholder');
    
    if (!priceHistory || priceHistory.length === 0) {
      chartCanvas.style.display = 'none';
      chartPlaceholder.style.display = 'block';
      return;
    }

    chartCanvas.style.display = 'block';
    chartPlaceholder.style.display = 'none';

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: priceHistory.map(record => 
          new Date(record.timestamp).toLocaleDateString()
        ),
        datasets: [{
          label: 'sBTC Price',
          data: priceHistory.map(record => record.price),
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  updateChartPeriod(period) {
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.classList.remove('bg-stacks-100', 'text-stacks-700');
      btn.classList.add('text-gray-500', 'hover:bg-gray-100');
    });

    const activeBtn = document.querySelector(`[data-period="${period}"]`);
    activeBtn.classList.remove('text-gray-500', 'hover:bg-gray-100');
    activeBtn.classList.add('bg-stacks-100', 'text-stacks-700');

    this.loadPriceData();
  }

  showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
  }

  showError(message) {
    console.error(message);
  }

  clearPriceData() {
    document.getElementById('current-price').textContent = '$--,---';
    document.getElementById('last-updated').textContent = 'Never';
    document.getElementById('block-height').textContent = '---';
    document.getElementById('total-records').textContent = '0';
    
    const tableBody = document.getElementById('price-history-table');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-8 text-center text-gray-500">
          No price data available
        </td>
      </tr>
    `;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const chartCanvas = document.getElementById('price-chart');
    const chartPlaceholder = document.getElementById('chart-placeholder');
    chartCanvas.style.display = 'none';
    chartPlaceholder.style.display = 'block';
  }

  updateUI() {
    if (this.userSession.isUserSignedIn()) {
      const userData = this.userSession.loadUserData();
      this.updateWalletStatus(true, userData.profile.stxAddress.testnet);
    } else {
      this.updateWalletStatus(false);
    }
  }

  loadMockDataInitially() {
    const mockPrice = this.getMockPrice();
    const mockHistory = this.getMockPriceHistory();
    
    this.updatePriceDisplay(mockPrice);
    this.updatePriceTable(mockHistory);
    this.updateChart(mockHistory);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.stacksApp = new StacksApp();
});