# Contract Deployment Script Template

This directory would contain your Hardhat or Foundry setup for deploying the CoinFlipGame contract.

## Quick Setup with Hardhat

1. Initialize a new Hardhat project:
```bash
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
npx hardhat init
```

2. Copy `../CoinFlipGame.sol` to `contracts/` directory

3. Create `scripts/deploy.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const minimumBet = hre.ethers.parseEther("0.01"); // 0.01 CELO
  const houseEdge = 200; // 2% (200 basis points)

  console.log("Deploying CoinFlipGame...");
  console.log("Minimum bet:", minimumBet.toString());
  console.log("House edge:", houseEdge);

  const CoinFlipGame = await hre.ethers.getContractFactory("CoinFlipGame");
  const game = await CoinFlipGame.deploy(minimumBet, houseEdge);

  await game.waitForDeployment();
  const address = await game.getAddress();

  console.log("✅ CoinFlipGame deployed to:", address);
  console.log("\nUpdate your .env.local with:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  
  console.log("\n⚠️  Don't forget to fund the contract with CELO for payouts!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Configure `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42220,
    },
  },
};
```

5. Create `.env`:
```
PRIVATE_KEY=your_private_key_without_0x_prefix
```

6. Deploy:
```bash
# To Alfajores testnet (recommended for testing)
npx hardhat run scripts/deploy.js --network alfajores

# To Celo mainnet (for production)
npx hardhat run scripts/deploy.js --network celo
```

7. Get test CELO from the faucet:
   - Alfajores: https://faucet.celo.org/alfajores

8. Fund your deployed contract:
```bash
# Send some CELO to the contract so it can pay out winnings
```

## Verify Contract

After deployment, verify your contract on CeloScan:

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS> "10000000000000000" 200
```

Replace `<CONTRACT_ADDRESS>` with your deployed contract address.
