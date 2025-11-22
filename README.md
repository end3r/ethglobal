# Celo Coin Flip Game 🪙

A decentralized coin flip game built on the Celo blockchain for ETH Global Buenos Aires - Celo Challenge.

## 🎮 About

This is a simple yet fun web game where players can:
- Connect their Celo wallet
- Bet CELO tokens on a coin flip (Heads or Tails)
- Win 2x their bet amount (minus a small house edge)
- Play directly on the Celo network

## 🏗️ Built With

- **Next.js 16** - React framework for the web application
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum/Celo interaction
- **Viem** - Low-level Ethereum utilities
- **Solidity** - Smart contract development
- **Celo** - Blockchain network

## 🚀 Features

- ✅ Web3 wallet connection (MetaMask, Valora, etc.)
- ✅ Play coin flip game on Celo mainnet or Alfajores testnet
- ✅ Real-time game results
- ✅ Farcaster Frame compatible
- ✅ Mobile-responsive design
- ✅ Dark mode support

## 📁 Project Structure

```
ethglobal/
├── celo-game/           # Next.js frontend application
│   ├── app/
│   │   ├── components/  # React components
│   │   ├── config/      # Wagmi configuration
│   │   ├── providers/   # Web3 providers
│   │   └── ...
│   ├── public/          # Static assets
│   └── package.json
└── CoinFlipGame.sol     # Smart contract
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Web3 wallet (MetaMask, Valora, etc.)
- CELO tokens (for mainnet) or test CELO (for Alfajores testnet)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/end3r/ethglobal.git
cd ethglobal/celo-game
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
NEXT_PUBLIC_APP_URL=<your-app-url>
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Smart Contract

### Contract Address

- **Celo Mainnet**: TBD
- **Alfajores Testnet**: TBD

### Contract Features

- Minimum bet configuration
- House edge (default 2%)
- Provably fair randomness (using block data)
- Event emission for game results
- Owner functions for contract management

### Deploying the Contract

1. Install Hardhat or Foundry for contract deployment
2. Configure your deployment script with your private key
3. Deploy to Celo Alfajores testnet:
```bash
# Example with Hardhat
npx hardhat run scripts/deploy.js --network alfajores
```

## 🎯 How to Play

1. **Connect Wallet**: Click "Connect with Injected" to connect your Web3 wallet
2. **Set Bet Amount**: Enter the amount of CELO you want to bet
3. **Choose Side**: Click "Heads" or "Tails"
4. **Confirm Transaction**: Approve the transaction in your wallet
5. **Wait for Result**: Your winnings (if any) will be automatically sent to your wallet

## 🖼️ Farcaster Frame Integration

This app is configured as a Farcaster Frame, allowing it to be shared and played directly within Farcaster clients. The frame metadata includes:

- OG image for preview
- Play button that links to the game
- Proper frame versioning (`vNext`)

## 🔗 Links

- **ETH Global Event**: https://ethglobal.com/events/buenosaires
- **Celo Challenge**: https://ethglobal.com/events/buenosaires/prizes/celo
- **Celo Documentation**: https://docs.celo.org
- **Farcaster Frames**: https://docs.farcaster.xyz/developers/frames

## 🏆 ETH Global Buenos Aires - Celo Challenge

This project is built for the Celo challenge at ETH Global Buenos Aires, demonstrating:
- Integration with Celo blockchain
- User-friendly Web3 gaming experience
- Farcaster Frame compatibility for social sharing
- Mobile-first design for accessibility

## 📜 License

MIT License - feel free to use this project as a starting point for your own games!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Contract needs to be deployed and address updated in `.env.local`
- Randomness in the contract uses block data (for production, consider Chainlink VRF)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for ETH Global Buenos Aires 🇦🇷
