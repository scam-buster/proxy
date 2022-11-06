import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import type { ServerMessage } from '../hooks/useTransaction';
import type { StoreStruct } from '../types/scam-buster';
import { Config } from '../components/Config';
import { Transaction } from '../components/Transaction';
import { ethers } from 'ethers';

const IndexPage = () => {
  const [serverMessage, setServerMessage] = useState<ServerMessage>();
  const [etherscanAPIKey, setEtherscanAPIKey] = useState('');
  const [histories, setHistories] = useState<StoreStruct[]>();
  const tx: ethers.Transaction | null = useMemo(() => {
    if (serverMessage?.txData == null) return;

    const tx = ethers.utils.parseTransaction(serverMessage.txData);
    return tx;
  }, [serverMessage?.txData]);

  const handleOccurTransaction = useCallback(
    (_, transaction: ServerMessage) => {
      setServerMessage(transaction);
    },
    []
  );

  useEffect(() => {
    global.ipcRenderer.on('occur_transaction', handleOccurTransaction);

    return () => {
      global.ipcRenderer.off('occur_transaction', handleOccurTransaction);
    };
  }, []);

  useEffect(() => {
    const func = async () => {
      const transactions = await global.ipcRenderer.invoke('get-transactions');
      setHistories(transactions);
    };
    const id = setInterval(func, 1000);

    global.ipcRenderer.invoke('get-env-key').then((keys) => {
      setEtherscanAPIKey(keys.etherscan);
    });

    return () => {
      clearInterval(id);
    };
  }, []);

  // 設定画面
  if (serverMessage == null || tx == null) {
    return (
      <Layout title="SCAM BUSTER Config">
        <Config
          histories={histories}
          etherscan={{
            apiKey: etherscanAPIKey,
            onSet: setEtherscanAPIKey,
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout title="SCAM BUSTER: NFT">
      <Transaction
        transaction={tx}
        serverMessage={serverMessage}
        setTransaction={setServerMessage}
        apiKey={etherscanAPIKey}
      />
    </Layout>
  );
};

export default IndexPage;
