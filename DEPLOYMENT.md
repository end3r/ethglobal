# Deployment Guide

This guide will help you deploy the Celo Coin Flip Game to production.

## Prerequisites

- Celo wallet with CELO tokens for gas fees
- Private key for contract deployment
- Vercel account (or similar) for frontend hosting

## Step 1: Deploy Smart Contract

### Using Hardhat

1. Create a `contracts` directory and initialize Hardhat:
```bash
mkdir contracts && cd contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. Copy `CoinFlipGame.sol` to `contracts/contracts/` directory

3. Create a deployment script in `contracts/scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const minimumBet = hre.ethers.parseEther("0.01"); // 0.01 CELO
  const houseEdge = 200; // 2% (in basis points)

  const CoinFlipGame = await hre.ethers.getContractFactory("CoinFlipGame");
  const game = await CoinFlipGame.deploy(minimumBet, houseEdge);

  await game.waitForDeployment();

  console.log("CoinFlipGame deployed to:", await game.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Configure Hardhat for Celo networks in `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42220,
    },
  },
};
```

5. Create `.env` file with your private key:
```
PRIVATE_KEY=your_private_key_here
```

6. Deploy to Alfajores testnet:
```bash
npx hardhat run scripts/deploy.js --network alfajores
```

7. Note the deployed contract address!

8. Fund the contract with some CELO so it can pay out winnings:
```bash
# Send CELO to the contract address
```

## Step 2: Update Frontend Configuration

1. Update `celo-game/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
NEXT_PUBLIC_APP_URL=<your-production-url>
```

2. Test locally:
```bash
cd celo-game
npm run dev
```

3. Verify the game works with the deployed contract

## Step 3: Deploy Frontend to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from `celo-game` directory:
```bash
cd celo-game
vercel
```

4. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_APP_URL`

5. Deploy to production:
```bash
vercel --prod
```

## Step 4: Test Farcaster Frame

1. Copy your production URL
2. Share in Farcaster
3. Verify the frame preview shows correctly
4. Test the "Play Coin Flip" button

## Step 5: Verify Contract (Optional)

Verify your contract on CeloScan for transparency:

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> "10000000000000000" 200
```

## Alternative: Deploy to Celo Mainnet

Follow the same steps but use `--network celo` instead of `--network alfajores`.

**Important**: Test thoroughly on Alfajores before deploying to mainnet!

## Troubleshooting

### Contract deployment fails
- Ensure you have enough CELO for gas fees
- Check your private key is correctly set
- Verify network connectivity

### Frontend can't connect to contract
- Double-check contract address in .env.local
- Ensure contract is deployed on the correct network
- Verify your wallet is connected to the same network

### Farcaster frame doesn't work
- Check og-image.svg is accessible
- Verify frame metadata in layout.tsx
- Test with Farcaster Frame Validator

## Security Considerations

1. **Never commit private keys** to git
2. **Test on testnet first** before mainnet
3. **Audit smart contract** for production use
4. **Use VRF for randomness** in production (e.g., Chainlink VRF)
5. **Set reasonable limits** on bet amounts
6. **Monitor contract balance** regularly

## Monitoring

- Monitor contract events for games played
- Track contract balance
- Set up alerts for unusual activity
- Keep some CELO in contract for payouts

## Support

For issues or questions:
- Open an issue on GitHub
- Check Celo documentation
- Join Celo Discord

---

Happy deploying! 🚀
