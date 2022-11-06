import Link from 'next/link';
import {
  Button,
  Stack,
  Text,
  Link as ChakraLink,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Divider,
  Box,
  Thead,
  Th,
  Input,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import type { StoreStruct } from '../types/scam-buster';

interface Props {
  histories: StoreStruct[];
  etherscan: {
    apiKey: string;
    onSet: (key: string) => void;
  };
}

export const Config: React.FC<Props> = ({ histories, etherscan }) => {
  const toast = useToast();
  const [infuraAPIKey, setInfuraAPIKey] = useState('');

  const handleSetEnv = useCallback(async () => {
    try {
      await global.ipcRenderer.invoke('set-infura-key', infuraAPIKey);
      await global.ipcRenderer.invoke('set-etherscan-key', etherscan.apiKey);

      toast({
        title: '設定を反映しました',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });
    } catch (e) {
      toast({
        title: '設定を反映できませんでした',
        description: (e as Error).message,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [infuraAPIKey]);

  const handleHistoryClear = useCallback(() => {
    global.ipcRenderer.invoke('clear-transactions');
  }, []);

  useEffect(() => {
    global.ipcRenderer.invoke('get-env-key').then((keys) => {
      setInfuraAPIKey(keys.infura);
    });
  }, []);

  return (
    <Box>
      <Text fontWeight="bold" textStyle="default-dense-24">
        設定
      </Text>

      <Text mt={4} textStyle="default-normal-12">
        Metamaskへの設定を行うことで、トランザクションを監視しあなたの資産を守ります。
        <br />
        ネットワーク情報を追加してください。
      </Text>

      <TableContainer mt={5}>
        <Table>
          <Thead>
            <Tr>
              <Th>項目</Th>
              <Th>設定値</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>ネットワーク名（推奨）</Td>
              <Td>Goerli Scam Buster</Td>
            </Tr>
            <Tr>
              <Td>RPC URL</Td>
              <Td>http://localhost:9876</Td>
            </Tr>
            <Tr>
              <Td>Chain ID</Td>
              <Td>5</Td>
            </Tr>
            <Tr>
              <Td>通貨</Td>
              <Td>GoerliETH</Td>
            </Tr>
            <Tr>
              <Td>GoerliEth Explorer</Td>
              <Td>https://goerli.etherscan.io</Td>
            </Tr>
            <Tr>
              <Td>Etherscan API Key</Td>
              <Td>
                <Input
                  type="text"
                  value={etherscan.apiKey}
                  onChange={(e) => etherscan.onSet(e.target.value)}
                />
              </Td>
            </Tr>
            <Tr>
              <Td>Infura API Key</Td>
              <Td>
                <Input
                  type="text"
                  value={infuraAPIKey}
                  onChange={(e) => setInfuraAPIKey(e.target.value)}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Button colorScheme="blue" mt={10} onClick={handleSetEnv}>
        設定を反映する
      </Button>

      <Divider my={5} />

      <Text fontWeight="bold" textStyle="default-normal-18">
        トランザクション履歴
      </Text>
      <Button mt={4} colorScheme="red" size="xs" onClick={handleHistoryClear}>
        履歴をクリア
      </Button>

      <Stack mt={5}>
        {histories?.map((h) => (
          <Stack
            key={h.transactionId}
            direction="row"
            border="1px solid gray"
            p={3}
          >
            <Box>
              {h.status === 'ok' ? <CheckCircleIcon /> : <WarningTwoIcon />}
            </Box>
            <Box>
              <Text>トランザクションID: {h.transactionId}</Text>
              <Link
                href={`https://goerli.etherscan.io/address/${h.contractAddr}`}
                passHref
              >
                <ChakraLink color="blue.500">{h.contractAddr}</ChakraLink>
              </Link>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
