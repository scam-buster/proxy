export interface EtherScanAPIResponse<T> {
  status: '0' | '1';
  message: string;
  result: T;
}

// ref: https://docs.etherscan.io/v/goerli-etherscan/api-endpoints/accounts#get-a-list-of-normal-transactions-by-address
export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
