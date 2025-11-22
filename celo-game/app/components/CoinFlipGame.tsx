'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESS } from '../config/wagmi';

// Simplified ABI for the game
const GAME_ABI = [
  {
    inputs: [{ internalType: 'bool', name: 'choice', type: 'bool' }],
    name: 'play',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumBet',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'player', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'betAmount', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'playerWon', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'playerChoice', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'result', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'payout', type: 'uint256' },
    ],
    name: 'GamePlayed',
    type: 'event',
  },
] as const;

export function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState('0.01');
  const [selectedSide, setSelectedSide] = useState<boolean | null>(null);
  const [gameResult, setGameResult] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isContractConfigured = !!(CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000');

  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GAME_ABI,
    functionName: 'getBalance',
    query: {
      enabled: isContractConfigured,
    },
  });

  const { data: minimumBet } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GAME_ABI,
    functionName: 'minimumBet',
    query: {
      enabled: isContractConfigured,
    },
  });

  const handleFlip = async (choice: boolean) => {
    if (!isConnected) {
      setGameResult('Please connect your wallet first');
      return;
    }

    setSelectedSide(choice);
    setGameResult('');

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: GAME_ABI,
        functionName: 'play',
        args: [choice],
        value: parseEther(betAmount),
      });
    } catch (error) {
      console.error('Error:', error);
      setGameResult('Transaction failed');
    }
  };

  // Update game result when transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      setGameResult('Game played! Check transaction for results.');
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center">🪙 Celo Coin Flip Game</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          A simple coin flip game on Celo network. Pick heads or tails and win 2x your bet!
        </p>
      </div>

      {!isContractConfigured && (
        <div className="w-full p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-lg">
          ⚠️ Contract address not configured. Please deploy the contract and update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
        </div>
      )}

      <div className="flex flex-col gap-4">
        {isConnected ? (
          <div className="flex flex-col gap-2 items-center">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <button
              onClick={() => disconnect()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Connect with {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {isConnected && (
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Contract Balance:</span>
              <span className="font-semibold">
                {contractBalance ? formatEther(contractBalance) : '0'} CELO
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Minimum Bet:</span>
              <span className="font-semibold">
                {minimumBet ? formatEther(minimumBet) : '0'} CELO
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Bet Amount (CELO)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900"
              placeholder="0.01"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleFlip(true)}
              disabled={!isContractConfigured || isPending || isConfirming}
              className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold rounded-lg transition-colors"
            >
              {selectedSide === true && isPending ? '🔄 Flipping...' : '👑 Heads'}
            </button>
            <button
              onClick={() => handleFlip(false)}
              disabled={!isContractConfigured || isPending || isConfirming}
              className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 text-white font-semibold rounded-lg transition-colors"
            >
              {selectedSide === false && isPending ? '🔄 Flipping...' : '🦅 Tails'}
            </button>
          </div>

          {isConfirming && (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-lg text-center">
              ⏳ Confirming transaction...
            </div>
          )}

          {gameResult && (
            <div className="p-4 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-lg text-center">
              {gameResult}
            </div>
          )}

          <div className="text-sm text-center text-zinc-600 dark:text-zinc-400">
            Built for ETH Global Buenos Aires - Celo Challenge 🇦🇷
          </div>
        </div>
      )}
    </div>
  );
}
