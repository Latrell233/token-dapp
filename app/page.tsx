import Providers from './providers';
import Link from 'next/link';
import Client from './ui/client';

export default function Page() {
  return (
    <Providers>
      <div className="container">
        <h1>Token DApp</h1>
        <p className="muted">连接钱包，发送或申请测试代币</p>
        <Client />
        <div className="card">
          <p className="muted">
            后端铸币 API：<code>/api/mint</code>
          </p>
        </div>
      </div>
    </Providers>
  );
}
