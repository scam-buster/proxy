import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Flex,
  Stack,
  Text,
  Link as ChakraLink,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  useToast,
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  CheckCircleIcon,
  WarningTwoIcon,
  MinusIcon,
} from '@chakra-ui/icons';
import { ethers } from 'ethers';
import type { ServerMessage } from '../../hooks/useTransaction';
import type { ContractInfo } from '../../types/opensea';
import dayjs from 'dayjs';
import { addressAllowList } from './constants';
import erc721 from '../../abi/erc721.json';

interface Props {
  contractInfo: ContractInfo;
  description: ethers.utils.TransactionDescription;
  tokenAvg: number;
  namesSimilarToBlueChipNFT: any[];
  verified: boolean;
  setTransaction: (transaction?: ServerMessage) => void;
}

export const NFTTransaction: React.FC<Props> = ({
  description,
  contractInfo,
  setTransaction,
  verified,
  tokenAvg,
  namesSimilarToBlueChipNFT,
}) => {
  const toast = useToast();
  const [totalSupply, setTotalSupply] = useState(0n);

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

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', handleMessage);

    return () => {
      global.ipcRenderer.removeListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    try {
      const address =
        description?.name === 'fulfillBasicOrder'
          ? description.args.parameters.offerToken
          : contractInfo.address;
      const abi = [...erc721];
      const provider = new ethers.providers.JsonRpcProvider(
        'http://localhost:9876'
      );

      const contract = new ethers.Contract(address, abi, provider);

      contract.totalSupply().then((supply) => {
        setTotalSupply(supply);
      });
    } catch (e) {
      console.error(e);
    }
  }, [description, contractInfo]);

  return (
    <>
      <Stack spacing={10} direction="column" align="center" mt={10}>
        <Image
          w="100px"
          h="100px"
          src={contractInfo.image_url}
          fallback={
            <Flex
              w="100px"
              h="100px"
              align="center"
              justify="center"
              bg="gray.900"
            >
              <Text>No Image</Text>
            </Flex>
          }
        />
        <Text fontWeight="bold" textStyle="default-dense-40">
          {contractInfo.name}({contractInfo.symbol})
        </Text>
        {description == null && (
          <Text
            fontWeight="bold"
            fontStyle="italic"
            textStyle="default-dense-24"
            color="red.500"
          >
            呼び出された処理を特定できませんでした
          </Text>
        )}

        {description != null && description.name === 'setApprovalForAll' ? (
          <>
            <Text
              fontWeight="bold"
              textStyle="default-dense-24"
              color="red.500"
            >
              危険な処理【{description.name}】が呼ばれました
            </Text>
            <Text>
              <Link
                href={`https://goerli.etherscan.io/address/${description.args.operator}`}
                passHref
              >
                <ChakraLink isExternal>
                  {description.args.operator}
                  <ExternalLinkIcon mx="2px" />
                </ChakraLink>
              </Link>
              に対して、NFTの移動を許可しますか？
            </Text>
            {!addressAllowList.has(description.args.operator) && (
              <Text textStyle="default-dense-116" color="red.500">
                上記のアドレスはSCAM
                BUSTERで許可されたアドレスではないため、危険性があります。
              </Text>
            )}
          </>
        ) : (
          <Text fontWeight="bold" textStyle="default-dense-24" color="red.500">
            【{description?.name}】 が呼ばれました
          </Text>
        )}

        <Link
          href={`https://goerli.etherscan.io/address/${contractInfo.address}`}
          passHref
        >
          <ChakraLink target="_blank" rel="noopener" isExternal>
            Etherscan <ExternalLinkIcon mx="2px" />
          </ChakraLink>
        </Link>

        <TableContainer w="100%">
          <Table>
            <Tbody>
              <Tr>
                <Td>コントラクトアドレス</Td>
                <Td textAlign="end">
                  <Link
                    href={`https://goerli.etherscan.io/address/${contractInfo.address}`}
                    passHref
                  >
                    <ChakraLink target="_blank" rel="noopener" isExternal>
                      {contractInfo.address} <ExternalLinkIcon mx="2px" />
                    </ChakraLink>
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td>コントラクトの認証</Td>
                <Td textAlign="end">
                  {verified ? (
                    <CheckCircleIcon color="green.500" />
                  ) : (
                    <WarningTwoIcon color="red.500" />
                  )}
                </Td>
              </Tr>

              <Tr>
                <Td>コントラクトの作成日</Td>
                <Td
                  textAlign="end"
                  color={
                    dayjs(contractInfo.created_date).diff(dayjs(), 'days') < 30
                      ? 'red.500'
                      : dayjs(contractInfo.created_date).diff(dayjs(), 'days') >
                        90
                      ? 'green.500'
                      : 'white'
                  }
                >
                  {dayjs(contractInfo.created_date).format('YYYY/MM/DD')}
                </Td>
              </Tr>

              <Tr>
                <Td>コントラクトの所有者</Td>
                <Td textAlign="end">
                  {contractInfo.owner != null && (
                    <Link
                      href={`https://goerli.etherscan.io/address/${contractInfo.address}`}
                      passHref
                    >
                      <ChakraLink isExternal>
                        {contractInfo.owner} <ExternalLinkIcon mx="2px" />
                      </ChakraLink>
                    </Link>
                  )}
                </Td>
              </Tr>

              <Tr>
                <Td>Total Supply</Td>
                <Td isNumeric>{totalSupply.toString()}</Td>
              </Tr>

              <Tr>
                <Td>EIP</Td>
                <Td textAlign="end">{contractInfo.schema_name}</Td>
              </Tr>

              <Tr>
                <Td>平均トランザクション価格</Td>
                <Td isNumeric>{tokenAvg}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>

      <Divider my={10} />

      <Text fontWeight="bold" textStyle="default-normal-24">
        Name similarity to famous NFTs
      </Text>

      <List mt={2}>
        {namesSimilarToBlueChipNFT.map((nft) => (
          <ListItem key={nft.blueChipNFT.name} textStyle="default-normal-18">
            <ListIcon
              as={
                Math.round(nft.similarity * 100) < 1
                  ? CheckCircleIcon
                  : Math.round(nft.similarity * 100) > 50
                  ? WarningTwoIcon
                  : MinusIcon
              }
              color={
                Math.round(nft.similarity * 100) < 1
                  ? 'green.500'
                  : Math.round(nft.similarity * 100) > 50
                  ? 'red.500'
                  : 'white'
              }
            />
            {Math.round(nft.similarity * 100)}%:{' '}
            <Link href={nft.blueChipNFT.url} passHref>
              <ChakraLink>{nft.blueChipNFT.name}</ChakraLink>
            </Link>
          </ListItem>
        ))}
      </List>

      <Stack
        spacing={4}
        direction="row"
        align="center"
        justify="center"
        mt={10}
      >
        <Button colorScheme="blue" size="lg" onClick={handleAllow}>
          処理を許可する
        </Button>
        <Button colorScheme="red" size="lg" onClick={handleDeny}>
          処理を拒否する
        </Button>
      </Stack>
    </>
  );
};
