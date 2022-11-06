import axios from 'axios';
import type { EtherScanAPIResponse, Transaction } from '../types/etherscan';

const apiClient = axios.create({
  baseURL: 'https://api-goerli.etherscan.io', // goerli
});

export async function getTransactionList(apiKey, address: string) {
  const { data } = await apiClient.get<EtherScanAPIResponse<Transaction[]>>(
    '/api',
    {
      params: {
        apiKey: apiKey,
        module: 'account',
        action: 'txlist',
        startblock: 0,
        endblock: 'latest',
        page: 1,
        offset: 1000,
        sort: 'asc',
        address,
      },
    }
  );

  return data;
}

export async function getContractABI(apiKey: string, address: string) {
  const { data } = await apiClient.get<EtherScanAPIResponse<string>>('/api', {
    params: {
      apiKey: apiKey,
      module: 'contract',
      action: 'getabi',
      address,
    },
  });

  return data;
}
