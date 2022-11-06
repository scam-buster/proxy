import { useEffect, useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ServerMessage, useTransaction } from '../../hooks/useTransaction';
import { ethers } from 'ethers';
import { NFTTransaction } from './NFTTransaction';
import { Remittance } from './Remittance';

interface Props {
  apiKey: string;
  serverMessage: ServerMessage;
  transaction: ethers.Transaction;
  setTransaction: (transaction?: ServerMessage) => void;
}

export const Transaction: React.FC<Props> = ({
  apiKey,
  transaction,
  serverMessage,
  setTransaction,
}) => {
  const {
    contractInfo,
    tokenAvg,
    namesSimilarToBlueChipNFT,
    verified,
    description,
    load,
  } = useTransaction(apiKey, serverMessage);

  useEffect(() => {
    if (serverMessage.address == null) return;

    // opensea
    if (description?.name === 'fulfillBasicOrder') {
      load(description.args.parameters.offerToken);
      return;
    }

    load(serverMessage.address);
  }, [serverMessage, description?.name]);

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', handleMessage);

    return () => {
      global.ipcRenderer.removeListener('message', handleMessage);
    };
  }, []);

  // 送金のトランザクション & 0eth のやり取りではないもの
  if (
    serverMessage.address == null &&
    transaction != null &&
    transaction.value._hex !== '0x00'
  ) {
    return <Remittance tx={transaction} setTransaction={setTransaction} />;
  }

  if (contractInfo == null) {
    return (
      <Flex justify="center" align="center">
        <Text textStyle="default-dense-40">Waiting Transaction 🤞😎</Text>
      </Flex>
    );
  }

  return (
    <>
      <NFTTransaction
        contractInfo={contractInfo}
        description={description}
        tokenAvg={tokenAvg}
        namesSimilarToBlueChipNFT={namesSimilarToBlueChipNFT}
        verified={verified}
        setTransaction={setTransaction}
      />
    </>
  );
};
