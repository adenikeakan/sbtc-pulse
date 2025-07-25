# sBTC Pulse Frontend

A modern React TypeScript application for tracking Bitcoin prices on the Stacks blockchain with Stacks.js wallet integration.

## ✨ Features

- **Landing Page**: Beautiful gradient design with feature showcase
- **Wallet Integration**: Full Stacks.js wallet connect/disconnect functionality  
- **Price Alerts**: Create and manage Bitcoin price alerts (mock data)
- **Responsive Design**: Works on desktop and mobile
- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS v4

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 🛠️ Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with wallet connect
│   └── WalletConnect.tsx # Wallet connection component
├── hooks/              # Custom React hooks
│   └── useStacksWallet.ts # Stacks wallet integration hook
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   └── PriceAlerts.tsx # Price alerts management
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Styling

- **Tailwind CSS v4**: Modern utility-first CSS with `@theme` directive
- **Custom Colors**: 
  - `--color-stacks: #5546FF` (Stacks purple)
  - `--color-bitcoin: #F7931A` (Bitcoin orange)
- **Dark Theme**: Gradient backgrounds with gray-900 base

## 🔗 Wallet Integration

- Uses `@stacks/connect` for wallet connections
- Supports testnet addresses
- Session persistence across page reloads
- Error handling for connection failures

## 🧪 Next Steps

1. Connect to real Clarity smart contracts
2. Integrate with Bitcoin price oracles
3. Add notification system for alerts
4. Implement alert history and analytics
5. Add more wallet providers (Leather, Xverse, etc.)

## 📦 Dependencies

### Production
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `@stacks/connect` - Stacks wallet integration
- `@stacks/network` & `@stacks/transactions` - Stacks blockchain utilities

### Development
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `tailwindcss` v4 - Styling
- `eslint` v9 - Code linting
- Various React and TypeScript plugins

## 🏗️ Build Output

Production build creates optimized static files in `dist/` directory ready for deployment to any static hosting service.