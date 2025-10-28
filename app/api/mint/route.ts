import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const tokenAbi = [
  { "type": "function", "name": "decimals", "stateMutability": "view", "inputs": [], "outputs": [{"name":"","type":"uint8"}] },
  { "type": "function", "name": "mint", "stateMutability": "nonpayable", "inputs": [{"name":"to","type":"address"},{"name":"amount","type":"uint256"}], "outputs": [] },
];

export async function POST(req: NextRequest) {
  try {
    const { to, amount, chainId } = await req.json();
    if (!to || !amount) {
      return NextResponse.json({ message: 'Missing params' }, { status: 400 });
    }

    const rpc = Number(chainId) === 1
      ? process.env.MAINNET_RPC_URL
      : process.env.SEPOLIA_RPC_URL;

    const pk = process.env.SERVER_PRIVATE_KEY;
    const token = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

    if (!rpc || !pk || !token) {
      return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(pk, provider);
    const contract = new ethers.Contract(token, tokenAbi, wallet);

    const decimals: number = await contract.decimals();
    const value = ethers.parseUnits(String(amount), decimals);
    const tx = await contract.mint(to, value);
    const receipt = await tx.wait();

    return NextResponse.json({ txHash: receipt?.hash });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Mint failed' }, { status: 500 });
  }
}
