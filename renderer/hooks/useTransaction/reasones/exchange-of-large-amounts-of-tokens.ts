import type { Transaction } from '../../../types/etherscan';
import { utils } from 'ethers';

export default (txlist: Transaction[]) => {
  txlist.sort((tx1, tx2) => Number(tx2.value) - Number(tx1.value));

  const top100txlist = txlist.slice(0, 100);
  const avg =
    top100txlist.reduce((pre, cur) => pre + BigInt(cur.value), BigInt('0')) /
    BigInt('100');

  return Number(utils.formatEther(avg));
};
