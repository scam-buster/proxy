import axios from 'axios';
import type { ContractInfo } from '../types/opensea';

const apiClient = axios.create({
  baseURL: 'https://testnets-api.opensea.io/api',
});

export async function getContractInfo(address: string) {
  const { data } = await apiClient.get<ContractInfo>(
    `/v1/asset_contract/${address}`
  );

  return data;
}
