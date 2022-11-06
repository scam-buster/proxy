// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import Store from 'electron-store';
import dayjs from 'dayjs';
import { server, setInfuraApiKey } from './server';
import { ethers } from 'ethers';

let mainWindow: BrowserWindow;
const store: Store = new Store();

interface StoreStruct {
  contractAddr?: string;
  transactionId: number;
  status: 'ok' | 'ng';
  occurredAt: number;
}

function showNotification(body: string) {
  new Notification({
    title: 'Crypto tx checker',
    body,
  }).show();
}

let notifyStatus: 'free' | 'waiting' | 'ok' | 'ng' = 'free';

let contractAddr: string | undefined = undefined;
export const setContractAddr = (addr: string): void => {
  contractAddr = addr;
};

export const onWaitTransactionCallback = async (
  id: number,
  txData: string
): Promise<string> => {
  const tx = ethers.utils.parseTransaction(txData);
  if (!contractAddr && !tx.to) {
    return 'ok';
  }

  notifyStatus = 'waiting';

  showNotification('Transactionが発生しました');
  mainWindow.webContents.send('occur_transaction', {
    address: contractAddr,
    txData,
    id: id,
  });

  return await new Promise((resolve) => {
    const tid = setInterval(() => {
      if (notifyStatus !== 'waiting') {
        const transactions = (store.get('transactions') ?? []) as StoreStruct[];

        if (notifyStatus === 'ng') {
          store.set(
            'transactions',
            [
              ...transactions.filter((t) => t.transactionId !== id),
              {
                transactionId: id,
                status: 'ng',
                contractAddr: contractAddr,
                occurredAt: dayjs().unix(),
              },
            ].sort((a, b) => b.occurredAt - a.occurredAt)
          );
          notifyStatus = 'free';
          clearTimeout(tid);
          contractAddr = undefined;
          resolve('ng');
        } else if (notifyStatus === 'ok') {
          store.set(
            'transactions',
            [
              ...transactions.filter((t) => t.transactionId !== id),
              {
                transactionId: id,
                status: 'ok',
                contractAddr: contractAddr,
                occurredAt: dayjs().unix(),
              },
            ].sort((a, b) => b.occurredAt - a.occurredAt)
          );
          notifyStatus = 'free';
          contractAddr = undefined;
          clearTimeout(tid);
          resolve('ok');
        }
      }
    }, 1000);
  });
};

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false, // TODO use context isolation
      preload: join(__dirname, 'preload.js'),
    },
  });

  const handleUrlOpen = (
    e: Electron.NewWindowWebContentsEvent,
    url: string
  ) => {
    if (url.match(/^http/)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  };

  mainWindow.webContents.on('will-navigate', handleUrlOpen);
  mainWindow.webContents.on('new-window', handleUrlOpen);

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  await mainWindow.loadURL(url);
  server.listen(9876, '0.0.0.0');
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

ipcMain.handle('transaction-allow', (_, message: 'ok' | 'ng') => {
  notifyStatus = message;
});

ipcMain.handle('set-infura-key', (_, message: string) => {
  setInfuraApiKey(message);
  store.set('infura-key', message);
});
ipcMain.handle('set-etherscan-key', (_, message: string) => {
  store.set('etherscan-key', message);
});

ipcMain.handle('get-env-key', () => {
  const infura = (store.get('infura-key') as string) ?? '';
  setInfuraApiKey(infura);

  return {
    etherscan: store.get('etherscan-key') ?? '',
    infura: store.get('infura-key') ?? '',
  };
});

ipcMain.handle('get-transactions', (_) => {
  return store.get('transactions');
});

ipcMain.handle('clear-transactions', (_) => {
  return store.set('transactions', []);
});
