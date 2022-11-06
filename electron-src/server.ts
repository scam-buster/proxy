import express from 'express';
import axios from 'axios';
import { onWaitTransactionCallback, setContractAddr } from './index';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

let infraApiKey = '';
export function setInfuraApiKey(key: string) {
  infraApiKey = key;
}

// FIXME
server.use(
  (_: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  }
);

let denyTxs: number[] = [];
server.all('*', async (req: express.Request, res: express.Response) => {
  if (!infraApiKey) return res.status(403).send();

  if (req.body?.id && denyTxs.includes(req.body.id)) {
    return res.status(403).send();
  }

  if (req.body?.method === 'eth_estimateGas') {
    setContractAddr(req.body?.params[0]?.to);
  }

  if (req.body?.method === 'eth_sendRawTransaction') {
    const result = await onWaitTransactionCallback(
      req.body.id,
      req.body.params[0]
    );
    if (result === 'ok') {
      const _res = await axios.post(
        `https://goerli.infura.io/v3/${infraApiKey}`,
        req.body
      );
      denyTxs = [];
      return res.send(_res.data);
    } else {
      denyTxs.push(req.body.id);
      return res.status(403).send();
    }
  }

  if (req.method === 'POST') {
    const _res = await axios.post(
      `https://goerli.infura.io/v3/${infraApiKey}`,
      req.body
    );
    return res.send(_res.data);
  } else {
    return res.send({});
  }
});

export { server };
