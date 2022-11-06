import { ethers } from 'ethers';
import {
  Button,
  Stack,
  Text,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';
import type { ServerMessage } from '../../hooks/useTransaction';
import { useCallback } from 'react';
import Link from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';

interface Props {
  tx: ethers.Transaction;
  setTransaction: (transaction?: ServerMessage) => void;
}

export const Remittance: React.FC<Props> = ({ tx, setTransaction }) => {
  const toast = useToast();

  const handleAllow = useCallback(async () => {
    try {
      await global.ipcRenderer.invoke('transaction-allow', 'ok');
      toast({
        title: 'トランザクションを許可しました',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });
    } catch (e) {
      toast({
        title: 'トランザクションを許可できませんでした',
        description: (e as Error).message,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setTransaction(undefined);
    }
  }, []);

  const handleDeny = useCallback(async () => {
    try {
      await global.ipcRenderer.invoke('transaction-allow', 'ng');
      toast({
        title: 'トランザクションを拒否しました',
        status: 'success',
        isClosable: true,
        position: 'top-right',
      });
    } catch (e) {
      toast({
        title: 'トランザクションを拒否できませんでした',
        description: (e as Error).message,
        status: 'error',
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setTransaction(undefined);
    }
  }, []);

  return (
    <>
      <Text fontWeight="bold" textStyle="default-normal-40">
        送金
      </Text>

      <Text mt={5} textStyle="default-normal-24">
        <Link href={`https://goerli.etherscan.io/address/${tx.to}`} passHref>
          <ChakraLink isExternal>
            {tx.to} <ExternalLinkIcon mx="2px" />
          </ChakraLink>
        </Link>
        に
        <Text
          fontWeight="bold"
          fontSize="100px"
          display="block"
          my={10}
          align="center"
          color={
            Number(ethers.utils.formatEther(tx.value)) > 0.1
              ? 'red.500'
              : 'white'
          }
        >
          {ethers.utils.formatEther(tx.value)}Ether
        </Text>
        送金しますか？
      </Text>

      <Stack
        spacing={4}
        direction="row"
        align="center"
        justify="center"
        mt={10}
      >
        <Button colorScheme="blue" size="lg" onClick={handleAllow}>
          はい
        </Button>
        <Button colorScheme="red" size="lg" onClick={handleDeny}>
          いいえ
        </Button>
      </Stack>
    </>
  );
};
