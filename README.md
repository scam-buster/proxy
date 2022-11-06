# Scam Buster

## Overview

Scam Buster はトランザクションの監視を行い、危険と判断されるトランザクションに対して通知を行う Proxy です。

危険と判断されたトランザクションは、実行前にその処理内容や、そのトランザクションに紐づくコントラクトの情報などを表示します。もしユーザーが安全だと判断した場合、許可をすることで、そのトランザクションを実行しますが、拒否した場合はトランザクションを破棄します。

## Tech Stack

### Common

- Node.js
- TypeScript

### App

- Electron
- Express.js

### UI

- Next.js
  - React
- Chakra UI

### others

- ethers

## Blockchain

- Goerli (Ethereum Testnet)

## Contracts

### Etherscan

- https://goerli.etherscan.io/address/0xf78e00868795a46ef4e5d38ff62051e098b23730
- https://goerli.etherscan.io/address/0xe6f63568b6b4eddf13874194a3bc2d15386a6cda

### OpenSea

- https://testnets.opensea.io/ja/collection/txchecknft
- https://testnets.opensea.io/ja/collection/txchecknft3

## How to use

1. Scam Buster をダウンロード
2. 起動する
3. [Etherscan API Key](https://etherscan.io/myapikey) を作成し、登録する
4. [Infura API Key](https://infura.io/) を作成し、登録する
5. 設定画面の通り、Metamask にカスタムネットワークの追加を行う
6. Blockchain の素晴らしい世界を体験する 🎉
