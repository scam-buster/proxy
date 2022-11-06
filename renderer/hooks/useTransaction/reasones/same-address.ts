import type { Transaction } from '../../../types/etherscan';

export default (txlist: Transaction[]) => {
  const fromAddress = new Set<string>();
  const toAddress = new Set<string>();

  for (const tx of txlist) {
    if (tx.from !== '') fromAddress.add(tx.from);
    if (tx.to !== '') toAddress.add(tx.to);
  }

  const from = Array.from(fromAddress);
  const to = Array.from(toAddress);

  let sameAddress = 0;
  for (const t of to) {
    if (from.includes(t)) sameAddress += 1;
  }

  return sameAddress;
};
