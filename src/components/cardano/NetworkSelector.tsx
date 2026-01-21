'use client';

import { useEffect, useState } from 'react';

export default function NetworkSelector() {
  const [network, setNetwork] = useState<'preprod' | 'preview' | 'mainnet'>('preprod');

  useEffect(() => {
    const savedNetwork = localStorage.getItem('cardano-network') as typeof network;
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  const handleNetworkChange = (newNetwork: typeof network) => {
    setNetwork(newNetwork);
    localStorage.setItem('cardano-network', newNetwork);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Network:</label>
      <select
        value={network}
        onChange={(e) => handleNetworkChange(e.target.value as typeof network)}
        className="px-3 py-1 rounded border"
      >
        <option value="preprod">Preprod</option>
        <option value="preview">Preview</option>
        <option value="mainnet">Mainnet</option>
      </select>
    </div>
  );
}
