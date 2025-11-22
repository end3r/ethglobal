import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "./providers/Web3Provider";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Celo Coin Flip - ETH Global Buenos Aires",
  description: "A simple coin flip game on Celo network. Built for ETH Global Buenos Aires Celo Challenge.",
  openGraph: {
    title: "Celo Coin Flip Game",
    description: "Play coin flip on Celo network and win 2x your bet!",
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': `${appUrl}/og-image.png`,
    'fc:frame:button:1': 'Play Coin Flip',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

