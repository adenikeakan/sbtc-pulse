# sBTC Pulse

## 🎯 Simple, Achievable MVP
Track and display sBTC price data over time using Stacks smart contracts and a clean web interface.

## Why This Qualifies for Code for Stacks
- **Core sBTC Focus**: Built specifically around sBTC token
- **Clarity Smart Contracts**: Uses Stacks blockchain for price storage
- **Cannot Work Without Stacks**: Relies on Stacks infrastructure and sBTC
- **Real Utility**: Provides sBTC price history and tracking for users

## 🚀 What It Actually Does
1. **Stores** sBTC price data in a Clarity smart contract
2. **Tracks** price history over time (daily snapshots)
3. **Displays** current price and price chart in web interface
4. **Shows** 7-day and 30-day price trends

## 🏗️ Super Simple Architecture
- **1 Smart Contract**: Stores price data and timestamps
- **1 Web Page**: Shows current price + simple chart
- **Manual Price Updates**: Admin function to add new price data
- **Read-Only Interface**: Users can view price history

## 📁 Minimal File Structure
```
sbtc-price-tracker/
├── README.md
├── Clarinet.toml
├── contracts/
│   └── sbtc-pulse.clar              # Single contract
├── tests/
│   └── sbtc-pulse_test.ts
├── web/
│   ├── index.html                  # Price display page
│   ├── app.js                      # Connect to contract
│   └── style.css                   # Simple styling
└── package.json
```

## 🛠️ Build Plan (2 Weeks)
**Week 1**: 
- Smart contract that stores price + timestamp
- Basic tests
- Deploy to testnet

**Week 2**: 
- Simple web interface
- Price history display
- Add some price data manually

## 🎯 MVP Features
- ✅ Store sBTC price data on-chain
- ✅ Track timestamps for each price update  
- ✅ Display current sBTC price
- ✅ Show last 10 price updates
- ✅ Simple line chart of price history
- ✅ Clean, responsive web interface

## 📋 Contract Functions
```clarity
;; Store new price data (admin only)
(define-public (add-price-data (price uint) (timestamp uint)))

;; Get current price
(define-read-only (get-current-price))

;; Get price history (last N entries)
(define-read-only (get-price-history (count uint)))

;; Get price at specific timestamp
(define-read-only (get-price-at-time (timestamp uint)))
```

## 🚀 Future Expansion Ideas
After MVP works:
- Automatic price updates from DEX
- Price alerts
- More detailed charts
- Compare with BTC price

## 📊 Success Criteria
- [x] Contract deployed and working on testnet
- [x] Can store and retrieve price data
- [x] Web interface shows current price
- [x] Price history chart displays correctly
- [x] Ready for Code for Stacks submission

**This is realistic, useful, and 100% achievable in 2 weeks!**