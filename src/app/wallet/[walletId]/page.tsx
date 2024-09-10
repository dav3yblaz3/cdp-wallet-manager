'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";


export type Wallet = {
  name: string;
  network: string;
  addresses: string[];
  balances: Record<string, number>;
};

// Mock data for wallet balances (replace with actual data fetching logic later)
const wallets: Record<number, Wallet> = {
  1: {
    name: "Main Wallet",
    network: "Ethereum",
    addresses: ["0x1234...5678", "0xabcd...efgh", "0x9876...5432"],
    balances: { BTC: 0.5, ETH: 2.3, USDT: 1000 }
  },
  2: {
    name: "Savings Wallet",
    network: "Bitcoin",
    addresses: ["bc1qxy...zw3f0", "3J98t1...s4v8"],
    balances: { BTC: 0.1, ETH: 1.5, USDT: 500 }
  },
  3: {
    name: "Investment Wallet",
    network: "Polygon",
    addresses: ["0x2468...1357", "0xfedc...ba98", "0x1357...2468", "0xa1b2...c3d4", "0xe5f6...g7h8"],
    balances: { BTC: 1.2, ETH: 5.0, USDT: 2000 }
  },
};

export default function WalletPage({ params }: { params: { walletId: string } }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    const walletId = parseInt(params.walletId);
    // In a real app, you'd fetch the wallet data from an API here
    const fetchedWallet = wallets[walletId as keyof typeof wallets] || {
      name: `New Wallet ${walletId}`,
      network: "Unknown",
      addresses: 0,
      balances: {}
    };
    setWallet(fetchedWallet);
  }, [params.walletId]);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition duration-300 ease-in-out">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Wallets</span>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
            <Wallet size={32} className="mr-3 text-primary" />
            {wallet.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Wallet ID: {params.walletId}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Network:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{wallet.network}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Addresses:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{wallet.addresses}</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Balances</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Currency</th>
                <th className="p-3 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(wallet.balances).map(([currency, amount], index) => (
                <tr key={currency} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{currency}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{amount.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-700 dark:text-gray-200">Addresses</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Index</th>
                <th className="p-3 text-left font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {wallet.addresses.map((address, index) => (
                <tr key={index} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{index}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300 break-all">{address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}