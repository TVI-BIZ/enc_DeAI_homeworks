"use client";

import Link from "next/link";
import { useState } from "react";
import { ethers } from "ethers";

// Contract details
const CONTRACT_ADDRESS = "0xB026C92412915005Cd563fC8d167e398609783c9";
const CONTRACT_ABI = [
  "function withdraw() external",
  "function getBalance() view returns (uint256)",
  "receive() external payable",
];

export default function Home() {
  const [donationAmount, setDonationAmount] = useState<string>("");

  // Function to handle donations
  const sendDonation = async (amountEth: string) => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: ethers.parseEther(amountEth),
    });

    await tx.wait();
    return tx.hash;
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const txHash = await sendDonation(donationAmount);
      alert(`Donation successful! Transaction Hash: ${txHash}`);
    } catch (err) {
      alert(
        `Donation failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to AI Joke Generator
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Get ready to laugh with our AI-powered joke generator! Create
          customized jokes on any topic, with different styles and tones. Our AI
          ensures the jokes are both funny and appropriate.
        </p>

        <div className="mt-8">
          <Link
            href="/generate"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Start Generating Jokes
          </Link>
        </div>

        {/* Donation Section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black">Make a Donation</h3>
          <form onSubmit={handleDonation} className="flex space-x-4">
            <input
              type="text"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="border rounded-lg p-2 text-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg p-2"
            >
              Donate
            </button>
          </form>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Powered by advanced AI technology to create unique and entertaining
          jokes just for you.
        </div>
      </div>
    </main>
  );
}
