import type { ContractInfo } from '../../../types/opensea';
import { ngram } from '../../../utils/n-gram';

// ref: https://opensea.io/ja/rankings?chain=ethereum&category=collectibles&sortBy=total_volume
const bluechipnfts = [
  { name: 'CryptoPunks', url: 'https://opensea.io/ja/collection/cryptopunks' },
  {
    name: 'Bored Ape Yacht Club',
    url: 'https://opensea.io/ja/collection/boredapeyachtclub',
  },
  {
    name: 'Mutant Ape Yacht Club',
    url: 'https://opensea.io/ja/collection/mutant-ape-yacht-club',
  },
  { name: 'Azuki', url: 'https://opensea.io/ja/collection/azuki' },
  {
    name: 'CLONE X - X TAKASHI MURAKAMI',
    url: 'https://opensea.io/ja/collection/clonex',
  },
  {
    name: 'Moonbirds',
    url: 'https://opensea.io/ja/collection/proof-moonbirds',
  },
  { name: 'Meebits', url: 'https://opensea.io/ja/collection/meebits' },
  {
    name: 'Cool Cats NFT',
    url: 'https://opensea.io/ja/collection/cool-cats-nft',
  },
  {
    name: 'World of Women',
    url: 'https://opensea.io/ja/collection/world-of-women-nft',
  },
  {
    name: 'Parallel Alpha',
    url: 'https://opensea.io/ja/collection/parallelalpha',
  },
];

export default (contractInfo: ContractInfo | null) => {
  if (contractInfo == null) return;

  const blueChipNFTSimilarities = bluechipnfts.map((nft) => {
    return {
      blueChipNFT: nft,
      similarity: ngram(nft.name, contractInfo.name),
    };
  });

  blueChipNFTSimilarities.sort((a, b) => b.similarity - a.similarity);

  return blueChipNFTSimilarities;
};
