import { CoinFlipGame } from "./components/CoinFlipGame";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black font-sans p-4">
      <CoinFlipGame />
    </div>
  );
}
