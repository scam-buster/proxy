import { useCallback, useEffect, useState } from 'react';
import type { Transaction } from '../../types/etherscan';
import type { ContractInfo } from '../../types/opensea';
import {
  getContractABI as getContractABIAPI,
  getTransactionList as getTransactionListAPI,
} from '../../utils/EtherscanClient';
import exchangeOfLargeAmountsOfTokens from './reasones/exchange-of-large-amounts-of-tokens';
import sameAddress from './reasones/same-address';
import namesSimilarToBlueChipNFT from './reasones/names-similar-to-bluechipnft';
import { getContractInfo as getContractInfoAPI } from '../../utils/OpenSeaClient';
import { ethers } from 'ethers';
import erc721 from '../../abi/erc721.json';
import erc1155 from '../../abi/erc1155.json';

export interface ServerMessage {
  id: number;
  address?: string;
  txData: string;
}

export function useTransaction(apiKey: string, message: ServerMessage | null) {
  const [addr, setAddr] = useState(
    message.address != null ? message.address.toLocaleLowerCase() : null
  );
  const [txList, setTxList] = useState<Transaction[]>([]);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [verified, setVerified] = useState(false);
  const [description, setDescription] = useState<
    ethers.utils.TransactionDescription | undefined
  >();

  const load = useCallback((addr: string) => {
    setAddr(addr.toLocaleLowerCase());
  }, []);

  const getContractInfo = useCallback(async () => {
    try {
      const info = await getContractInfoAPI(addr);

      setContractInfo(info);
    } catch (e) {
      console.error(e);
    }
  }, [addr]);

  const getTransactionList = useCallback(async () => {
    try {
      const res = await getTransactionListAPI(apiKey, addr);
      setTxList(res.result);
    } catch (e) {
      console.error(e);
    }
  }, [apiKey, addr]);

  const getContractABI = useCallback(async () => {
    try {
      const res = await getContractABIAPI(apiKey, message.address);
      const abi =
        res.result === 'Contract source code not verified'
          ? [...erc721, ...erc1155]
          : JSON.parse(res.result);
      const tx = ethers.utils.parseTransaction(message.txData);

      try {
        const inter = new ethers.utils.Interface(abi);
        const decoded = inter.parseTransaction(tx);
        setDescription(decoded);
      } catch (e) {
        setDescription(undefined);
      }

      setVerified(res.message !== 'NOTOK');
    } catch (e) {
      console.error(e);
    }
  }, [apiKey, message.address]);

  useEffect(() => {
    if (addr == null) return;

    getContractInfo();
    getTransactionList();
    getContractABI();
  }, [addr]);

  return {
    contractInfo,
    tokenAvg: exchangeOfLargeAmountsOfTokens(txList),
    sameAddress: sameAddress(txList),
    namesSimilarToBlueChipNFT: namesSimilarToBlueChipNFT(contractInfo),
    verified,
    description,
    load,
    handleGetContractInfo: getContractInfo,
    handleGetTransaction: getTransactionList,
  };
}
