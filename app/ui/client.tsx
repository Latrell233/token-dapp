'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useChainId } from 'wagmi';
import { useState } from 'react';
import { parseUnits } from 'viem';

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;
const tokenAbi = [
  { "type": "function", "name": "decimals", "stateMutability": "view", "inputs": [], "outputs": [{"name":"","type":"uint8"}] },
  { "type": "function", "name": "balanceOf", "stateMutability": "view", "inputs": [{"name":"account","type":"address"}], "outputs": [{"name":"","type":"uint256"}] },
  { "type": "function", "name": "transfer", "stateMutability": "nonpayable", "inputs": [{"name":"to","type":"address"},{"name":"value","type":"uint256"}], "outputs": [{"name":"","type":"bool"}] },
];

export default function Client() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [mintAmount, setMintAmount] = useState("100");
  const [loading, setLoading] = useState(false);

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: 'decimals',
  });

  const { writeContractAsync } = useWriteContract();

  async function onSend() {
    if (!isConnected || !address || !decimals) return;
    setLoading(true);
    try {
      await writeContractAsync({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'transfer',
        args: [to as `0x${string}`, parseUnits(amount || '0', Number(decimals))],
      });
      alert('发送成功');
    } catch (e) {
      console.error(e);
      alert('发送失败');
    } finally {
      setLoading(false);
    }
  }

  async function onRequest() {
    if (!isConnected || !address || !decimals) return;
    setLoading(true);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: address, amount: mintAmount, chainId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Mint failed');
      alert('申请成功');
    } catch (e) {
      console.error(e);
      alert('申请失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <ConnectButton />
      </div>

      <div className="col" style={{ marginTop: 16 }}>
        <h3>发送代币</h3>
        <input className="input" placeholder="接收地址 (0x...)" value={to} onChange={(e) => setTo(e.target.value)} />
        <input className="input" placeholder="数量" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className="btn" onClick={onSend} disabled={loading || !isConnected}>发送</button>
      </div>

      <div className="col" style={{ marginTop: 16 }}>
        <h3>申请测试代币</h3>
        <input className="input" placeholder="数量" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
        <button className="btn secondary" onClick={onRequest} disabled={loading || !isConnected}>申请</button>
      </div>
    </div>
  );
}
