# sBTC Pulse Frontend MVP

A modern, responsive web interface for tracking sBTC price data using the latest Stacks.js tools and Tailwind CSS.

## Features

- 🔗 **Wallet Connection**: Connect with Stacks wallets using @stacks/connect
- 📊 **Price Dashboard**: Real-time sBTC price display with history
- 📈 **Interactive Charts**: Price history visualization with Chart.js
- 💰 **Price History Table**: Detailed price data with changes and timestamps
- 🎨 **Modern UI**: Clean design with Tailwind CSS v3.4.7
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Stacks.js v8/v7**: Latest wallet connection and transaction libraries
- **Tailwind CSS v3.4.7**: Modern utility-first CSS framework
- **Chart.js v4.4.6**: Interactive price charts
- **Vite v6.1.0**: Fast development and build tool

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build CSS**:
   ```bash
   npx tailwindcss -i ./src/input.css -o ./public/output.css
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**: Visit http://localhost:3000

## Project Structure

```
web/
├── src/
│   ├── main.js          # Main application logic
│   └── input.css        # Tailwind CSS input
├── public/
│   ├── output.css       # Compiled CSS
│   └── favicon.svg      # App icon
├── index.html           # Main HTML file
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Features Overview

### Wallet Integration
- Connect/disconnect Stacks wallets
- Support for testnet and mainnet
- User session management

### Price Tracking
- Current sBTC price display
- 7-day and 30-day price history
- Price change indicators
- Block height tracking

### UI Components
- Responsive dashboard layout
- Interactive price charts
- Data tables with sorting
- Loading states and error handling

## Mock Data
The application includes mock price data for testing when no smart contract is available. This ensures the UI works properly during development and demonstrates all features.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run build-css` - Build Tailwind CSS with watch mode

## Browser Support
Supports all modern browsers with ES2015+ support.