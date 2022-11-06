export interface StoreStruct {
  contractAddr: string;
  transactionId: number;
  status: 'ok' | 'ng';
  occurredAt: number;
}
