import { http, createConfig } from 'wagmi';
import { celo, celoAlfajores } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [
    injected(),
  ],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
  ssr: true,
});

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
